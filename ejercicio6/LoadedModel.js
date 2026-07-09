import * as THREE from 'three';
import { MTLLoader } from 'mtlloader';
import { OBJLoader } from 'objloader';

class LoadedModel extends THREE.Object3D {
    // GUI
    static GUI_TITLE = 'Loaded Model';

    // Paths to model
    static MODEL_PATH = '../models/porsche911/';
    static MTL_FILE = '911.mtl';
    static OBJ_FILE = 'Porsche_911_GT2.obj';

    static TARGET_SIZE = 0.3;
    static SPIN_SPEED = Math.PI / 4;

    modelRoot;
    clock;

    constructor(gui) {
        super();

        this.modelRoot = new THREE.Object3D();
        this.add(this.modelRoot);

        this.clock = new THREE.Clock();

        this.createModelGUI(gui);
        this.loadModel();
    }

    createModelGUI(gui) {
        this.guiControls = { rotate: true };

        const folder = gui.addFolder(LoadedModel.GUI_TITLE);

        folder.add(this.guiControls, 'rotate')
            .name('Rotate: ');
    }

    loadModel() {
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath(LoadedModel.MODEL_PATH);

        mtlLoader.load(LoadedModel.MTL_FILE, (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(LoadedModel.MODEL_PATH);

            objLoader.load(
                LoadedModel.OBJ_FILE,
                (object) => this.onModelLoaded(object),
                undefined,
                (error) => console.error('Error loading OBJ:', error)
            );
        });
    }

    onModelLoaded(object) {
        console.log('Model loaded');

        object.traverse((child) => {
            if (child.isMesh && child.geometry && !child.geometry.attributes.normal) {
                child.geometry.computeVertexNormals();
            }
        });

        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = LoadedModel.TARGET_SIZE / maxDim;

        object.position.sub(center);
        this.modelRoot.add(object);

        this.modelRoot.scale.setScalar(scale);
        this.modelRoot.position.y = (size.y / 2) * scale;
    }

    update() {
        const delta = this.clock.getDelta();

        if (this.guiControls.rotate) {
            this.modelRoot.rotation.y += LoadedModel.SPIN_SPEED * delta;
        }
    }
}

export { LoadedModel }
