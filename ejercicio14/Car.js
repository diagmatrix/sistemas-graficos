import * as THREE from 'three';
import { MTLLoader } from 'mtlloader';
import { OBJLoader } from 'objloader';

class Car extends THREE.Object3D {
    // GUI
    static GUI_TITLE = 'Car';

    // Paths to model
    static MODEL_PATH = '../models/porsche911/';
    static MTL_FILE = '911.mtl';
    static OBJ_FILE = 'Porsche_911_GT2.obj';

    static TARGET_SIZE = 0.25;
    static SPIN_SPEED = Math.PI / 4;

    // Headlights
    static HEADLIGHT_COLOR = 0xFFF2CC;
    static HEADLIGHT_POWER = 8;
    static HEADLIGHT_POWER_MIN = 0;
    static HEADLIGHT_POWER_MAX = 30;
    static HEADLIGHT_ANGLE = Math.PI / 9;
    static HEADLIGHT_PENUMBRA = 0.4;
    static HEADLIGHT_DISTANCE = 2;
    static SIDES = [-1, 1];
    static HEADLIGHT_FRONT_FACTOR = 0.9;
    static HEADLIGHT_SIDE_FACTOR = 0.5;
    static HEADLIGHT_HEIGHT_FACTOR = 0.4;
    static HEADLIGHT_TARGET_SPREAD = 0.15;
    static HEADLIGHT_TARGET_Y = -0.05;
    static HEADLIGHT_TARGET_Z = -1.5;

    chassis;
    modelRoot;
    headlights;
    headlightTargets;
    clock;

    constructor(gui) {
        super();

        this.chassis = new THREE.Object3D();
        this.add(this.chassis);

        this.modelRoot = new THREE.Object3D();
        this.chassis.add(this.modelRoot);

        this.clock = new THREE.Clock();

        this.createHeadlights();
        this.createModelGUI(gui);
        this.loadModel();
    }

    createHeadlights() {
        this.headlights = [];
        this.headlightTargets = [];

        for (const side of Car.SIDES) {
            const light = new THREE.SpotLight(Car.HEADLIGHT_COLOR);
            light.power = Car.HEADLIGHT_POWER;
            light.angle = Car.HEADLIGHT_ANGLE;
            light.penumbra = Car.HEADLIGHT_PENUMBRA;
            light.distance = Car.HEADLIGHT_DISTANCE;
            light.castShadow = true;

            // Shadow config
            light.shadow.camera.near = 0.02;
            light.shadow.camera.far = Car.HEADLIGHT_DISTANCE;
            light.shadow.mapSize.set(1024, 1024);
            light.shadow.bias = -0.0005;

            const target = new THREE.Object3D();
            target.position.set(
                side * Car.HEADLIGHT_TARGET_SPREAD,
                Car.HEADLIGHT_TARGET_Y,
                Car.HEADLIGHT_TARGET_Z
            );
            this.chassis.add(target);
            light.target = target;

            this.chassis.add(light);
            this.headlights.push(light);
            this.headlightTargets.push(target);
        }
    }

    positionHeadlights(halfWidth, halfLength, height) {
        const x = halfWidth * Car.HEADLIGHT_SIDE_FACTOR;
        const y = height * Car.HEADLIGHT_HEIGHT_FACTOR;
        const z = halfLength * Car.HEADLIGHT_FRONT_FACTOR;

        Car.SIDES.forEach((side, i) => {
            this.headlights[i].position.set(side * x, y, -z);
        });
    }

    createModelGUI(gui) {
        this.guiControls = {
            rotate: true,
            headlightPower: Car.HEADLIGHT_POWER
        };

        const folder = gui.addFolder(Car.GUI_TITLE);

        folder.add(this.guiControls, 'rotate')
            .name('Rotate: ');

        folder.add(this.guiControls, 'headlightPower', Car.HEADLIGHT_POWER_MIN, Car.HEADLIGHT_POWER_MAX, 0.5)
            .name('Headlights: ')
            .onChange((value) => this.setHeadlightPower(value));
    }

    setHeadlightPower(power) {
        for (const light of this.headlights) {
            light.power = power;
        }
    }

    loadModel() {
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath(Car.MODEL_PATH);

        mtlLoader.load(Car.MTL_FILE, (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(Car.MODEL_PATH);

            objLoader.load(
                Car.OBJ_FILE,
                (object) => this.onModelLoaded(object),
                undefined,
                (error) => console.error('Error loading OBJ:', error)
            );
        });
    }

    onModelLoaded(object) {
        console.log('Model loaded');

        object.traverse((child) => {
            if (child.isMesh) {
                if (child.geometry && !child.geometry.attributes.normal) {
                    child.geometry.computeVertexNormals();
                }

                // Model object casts shadows
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = Car.TARGET_SIZE / maxDim;

        object.position.sub(center);
        this.modelRoot.add(object);

        this.modelRoot.scale.setScalar(scale);
        this.modelRoot.position.y = (size.y / 2) * scale;

        // Fit the headlights to the body
        this.positionHeadlights(
            (size.x * scale) / 2,
            (size.z * scale) / 2,
            size.y * scale
        );
    }

    update() {
        const delta = this.clock.getDelta();

        if (this.guiControls.rotate) {
            this.chassis.rotation.y += Car.SPIN_SPEED * delta;
        }
    }
}

export { Car }
