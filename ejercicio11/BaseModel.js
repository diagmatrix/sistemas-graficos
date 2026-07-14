import * as THREE from 'three';

class BaseModel extends THREE.Object3D {
    // GUI
    static GUI_TITLE = 'Interaction';
    static DEFAULT_BOX_COLOR = 0x2277CC;

    // Box
    static BOX_SIZE = 0.04;
    static GHOST_OPACITY = 0.5;

    scene;        // owner scene, drives the interactive placement
    guiControls;
    helpPopup;
    boxes;        // array of box meshes currently in the scene
    boxesGroup;   // container node that holds all boxes

    constructor(gui, scene) {
        super();

        this.scene = scene;

        this.createModelGUI(gui);
        this.createHelpPopup();
        this.createModelGraph();
    }

    createModelGUI(gui) {
        this.guiControls = {
            boxColor: BaseModel.DEFAULT_BOX_COLOR,
            addBox: () => this.addBox(),
            clearBoxes: () => this.clearBoxes(),
            help: () => this.showHelp()
        };

        const modelFolder = gui.addFolder(BaseModel.GUI_TITLE);

        modelFolder.addColor(this.guiControls, 'boxColor')
            .name('Box color: ');

        modelFolder.add(this.guiControls, 'addBox')
            .name('Add box');

        modelFolder.add(this.guiControls, 'clearBoxes')
            .name('Clear scene');

        modelFolder.add(this.guiControls, 'help')
            .name('Help');
    }

    createModelGraph() {
        this.boxes = [];
        this.boxesGroup = new THREE.Object3D();
        this.add(this.boxesGroup);
    }

    createHelpPopup() {
        // On-screen pop-up, hidden until requested. Built once and reused.
        this.helpPopup = $(`
            <div class="help-popup">
                <div class="help-popup__box">
                    <h2>Help!</h2>
                    <ul>
                        <li><b>Add box</b>: click the button to drop a new box.</li>
                        <li><b>Select</b>: click a box to select it (it turns partially transparent).</li>
                        <li><b>Move</b>: drag a selected box across the ground.</li>
                        <li><b>Camera</b>: hold <b>Ctrl</b> and drag / wheel to orbit and zoom.</li>
                    </ul>
                    <button class="help-popup__close">Close</button>
                </div>
            </div>
        `);

        // CSS styling
        this.helpPopup.css({
            position: 'fixed', inset: '0', display: 'none',
            'align-items': 'center', 'justify-content': 'center',
            background: 'rgba(0, 0, 0, 0.45)', 'z-index': '1000',
            'font-family': 'sans-serif'
        });
        this.helpPopup.find('.help-popup__box').css({
            background: '#fff', color: '#222', padding: '20px 26px',
            'border-radius': '8px', 'max-width': '420px',
            'box-shadow': '0 10px 40px rgba(0,0,0,0.35)', 'line-height': '1.5'
        });
        this.helpPopup.find('.help-popup__close').css({
            'margin-top': '12px', padding: '6px 16px', cursor: 'pointer'
        });

        $('body').append(this.helpPopup);

        // Close on button and on backdrop click
        this.helpPopup.find('.help-popup__close').on('click', () => this.hideHelp());
        this.helpPopup.on('click', (event) => {
            if (event.target === this.helpPopup[0]) this.hideHelp();
        });
    }

    // --- GUI handlers --------------------------------------------------------

    addBox() {
        // Hand the interaction over to the scene: a ghost box follows the mouse
        // (wheel to rotate) and, on click, we spawn the real box where it landed.
        const ghost = this.makeBoxMesh(this.guiControls.boxColor, true);
        this.scene.beginBoxPlacement(ghost, (position, rotationY) => this.spawnBox(position, rotationY));
    }

    // Factory shared by the ghost preview and the real box
    makeBoxMesh(color, ghost = false) {
        const material = new THREE.MeshStandardMaterial({ color });
        if (ghost) {
            material.transparent = true;
            material.opacity = BaseModel.GHOST_OPACITY;
            material.depthWrite = false;
        }
        return new THREE.Mesh(
            new THREE.BoxGeometry(BaseModel.BOX_SIZE, BaseModel.BOX_SIZE, BaseModel.BOX_SIZE),
            material
        );
    }

    spawnBox(position, rotationY) {
        const box = this.makeBoxMesh(this.guiControls.boxColor);
        box.position.copy(position);
        box.rotation.y = rotationY;

        this.boxesGroup.add(box);
        this.boxes.push(box);
    }

    clearBoxes() {
        for (const box of this.boxes) {
            this.boxesGroup.remove(box);
            box.geometry.dispose();
            box.material.dispose();
        }
        this.boxes = [];
    }

    showHelp() {
        this.helpPopup.css('display', 'flex');
    }

    hideHelp() {
        this.helpPopup.css('display', 'none');
    }

    update() {
        // Add update logic
        // ...
    }
}

export { BaseModel }
