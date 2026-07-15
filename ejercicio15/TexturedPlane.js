import * as THREE from 'three';

class TexturedPlane extends THREE.Object3D {
    static PLANE_SIZE = 0.4;

    static TEXTURES = {
        Bee: '../imgs/abeja.jpg',
        Chess: '../imgs/textura-ajedrezada.jpg'
    };

    static WRAP_MODES = {
        ClampToEdge: THREE.ClampToEdgeWrapping,
        Repeat: THREE.RepeatWrapping,
        MirroredRepeat: THREE.MirroredRepeatWrapping
    };

    // GUI slider ranges [min, max, step]
    static REPEAT_MIN = 1;
    static REPEAT_MAX = 8;
    static REPEAT_STEP = 1;

    static CENTER_MIN = 0;
    static CENTER_MAX = 1;
    static CENTER_STEP = 0.25;

    static OFFSET_MIN = -1;
    static OFFSET_MAX = 1;
    static OFFSET_STEP = 0.25;

    static ROTATION_MIN = 0;
    static ROTATION_MAX = 2 * Math.PI;
    static ROTATION_STEP = 0.01;

    textures;
    material;
    plane;
    guiControls;

    constructor(gui) {
        super();

        this.guiControls = {
            texture: 'Bee',
            repeatS: 1, 
            repeatT: 1,
            wrapS: 'ClampToEdge', 
            wrapT: 'ClampToEdge',
            centerX: 0, 
            centerY: 0,
            offsetX: 0, 
            offsetY: 0,
            rotation: 0
        };

        this.loadTextures();
        this.createPlane();
        this.createGUI(gui);
        this.applyParams();
    }

    loadTextures() {
        const loader = new THREE.TextureLoader();
        this.textures = {};

        for (const [name, path] of Object.entries(TexturedPlane.TEXTURES)) {
            const texture = loader.load(path);
            this.textures[name] = texture;
        }
    }

    createPlane() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures[this.guiControls.texture],
            side: THREE.DoubleSide
        });

        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(TexturedPlane.PLANE_SIZE, TexturedPlane.PLANE_SIZE),
            this.material
        );

        this.plane.position.y = TexturedPlane.PLANE_SIZE / 2;
        this.add(this.plane);
    }

    createGUI(gui) {
        const folder = gui.addFolder('Texture');

        folder.add(this.guiControls, 'texture', Object.keys(TexturedPlane.TEXTURES))
            .name('Texture: ')
            .onChange((value) => this.setTexture(value));

        folder.add(this.guiControls, 'repeatS', TexturedPlane.REPEAT_MIN, TexturedPlane.REPEAT_MAX, TexturedPlane.REPEAT_STEP)
            .name('repeatS: ')
            .onChange(() => this.applyParams());

        folder.add(this.guiControls, 'repeatT', TexturedPlane.REPEAT_MIN, TexturedPlane.REPEAT_MAX, TexturedPlane.REPEAT_STEP)
            .name('repeatT: ')
            .onChange(() => this.applyParams());

        folder.add(this.guiControls, 'wrapS', Object.keys(TexturedPlane.WRAP_MODES))
            .name('wrapS: ')
            .onChange(() => this.applyParams());

        folder.add(this.guiControls, 'wrapT', Object.keys(TexturedPlane.WRAP_MODES))
            .name('wrapT: ')
            .onChange(() => this.applyParams());

        folder.add(this.guiControls, 'centerX', TexturedPlane.CENTER_MIN, TexturedPlane.CENTER_MAX, TexturedPlane.CENTER_STEP)
            .name('center.x: ')
            .onChange(() => this.applyParams());

        folder.add(this.guiControls, 'centerY', TexturedPlane.CENTER_MIN, TexturedPlane.CENTER_MAX, TexturedPlane.CENTER_STEP)
            .name('center.y: ')
            .onChange(() => this.applyParams());

        folder.add(this.guiControls, 'offsetX', TexturedPlane.OFFSET_MIN, TexturedPlane.OFFSET_MAX, TexturedPlane.OFFSET_STEP)
            .name('offset.x: ')
            .onChange(() => this.applyParams());

        folder.add(this.guiControls, 'offsetY', TexturedPlane.OFFSET_MIN, TexturedPlane.OFFSET_MAX, TexturedPlane.OFFSET_STEP)
            .name('offset.y: ')
            .onChange(() => this.applyParams());

        folder.add(this.guiControls, 'rotation', TexturedPlane.ROTATION_MIN, TexturedPlane.ROTATION_MAX, TexturedPlane.ROTATION_STEP)
            .name('rotation: ')
            .onChange(() => this.applyParams());
    }

    setTexture(name) {
        this.material.map = this.textures[name];
        this.material.needsUpdate = true;
        this.applyParams();
    }

    applyParams() {
        const controls = this.guiControls;
        const texture = this.material.map;
        if (!texture) return;

        texture.repeat.set(controls.repeatS, controls.repeatT);
        texture.wrapS = TexturedPlane.WRAP_MODES[controls.wrapS];
        texture.wrapT = TexturedPlane.WRAP_MODES[controls.wrapT];
        texture.center.set(controls.centerX, controls.centerY);
        texture.offset.set(controls.offsetX, controls.offsetY);
        texture.rotation = controls.rotation;

        // wrap changes need this
        texture.needsUpdate = true;
    }

    update() {
    }
}

export { TexturedPlane }
