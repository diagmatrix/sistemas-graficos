import * as THREE from 'three';
import { MTLLoader } from 'mtlloader';
import { OBJLoader } from 'objloader';


class Car extends THREE.Object3D {
    // Car
    static MODEL_PATH = '../models/porsche911/';
    static MTL_FILE = '911.mtl';
    static OBJ_FILE = 'Porsche_911_GT2.obj';
    static CAR_TARGET_SIZE = 0.3;
    static CAR_STARTING_DIRECTION = Math.PI;
    car;
    carMaxPositions;

    // Speeds
    static MOVE_SPEED = 0.6;
    static TURN_SPEED = Math.PI / 4;
    clock = new THREE.Clock();

    // Driver camera.
    static DRIVER_CAM_POSITION = [0, 0.12, 0.05];
    static DRIVER_CAM_FOV = 60;
    static DRIVER_CAM_NEAR = 0.01;
    static DRIVER_CAM_FAR = 20;
    driverCamera;

    // Headlights
    static HEADLIGHT_COLOR = 0xFFF2CC;
    static HEADLIGHT_POWER = 20;
    static HEADLIGHT_ANGLE = Math.PI / 9;
    static HEADLIGHT_PENUMBRA = 0.5;
    static HEADLIGHT_DISTANCE = 3;
    static HEADLIGHT_OFFSETS = [[-0.06, 0.05, 0.15], [0.06, 0.05, 0.15]];
    static HEADLIGHT_TARGET_SPREAD = 0.18;
    static HEADLIGHT_TARGET_Y = -0.1;
    static HEADLIGHT_TARGET_Z = 2;
    headlights;
    guiControls;

    constructor(gui, carLimits) {
        super();

        // Movement limits
        const margin = Car.CAR_TARGET_SIZE / 2;
        this.maxX = carLimits[0] / 2 - margin;
        this.maxZ = carLimits[2] / 2 - margin;

        this.car = new THREE.Object3D();
        this.add(this.car);

        this.createDriverCamera();
        this.createHeadlights();
        this.createGUI(gui);
        this.loadCar();
    }

    createHeadlights() {
        this.headlights = [];

        for (const offset of Car.HEADLIGHT_OFFSETS) {
            const light = new THREE.SpotLight(Car.HEADLIGHT_COLOR);
            light.power = Car.HEADLIGHT_POWER;
            light.angle = Car.HEADLIGHT_ANGLE;
            light.penumbra = Car.HEADLIGHT_PENUMBRA;
            light.distance = Car.HEADLIGHT_DISTANCE;
            light.position.set(...offset);

            // Own aim point
            const side = Math.sign(offset[0]) || 1;
            const target = new THREE.Object3D();
            target.position.set(
                side * Car.HEADLIGHT_TARGET_SPREAD,
                Car.HEADLIGHT_TARGET_Y,
                Car.HEADLIGHT_TARGET_Z
            );
            this.car.add(target);
            light.target = target;

            this.car.add(light);
            this.headlights.push(light);
        }
    }

    createGUI(gui) {
        this.guiControls = {
            headlightsOn: true,
            headlightPower: Car.HEADLIGHT_POWER
        };

        const folder = gui.addFolder('Headlights');

        folder.add(this.guiControls, 'headlightsOn')
            .name('On: ')
            .onChange((value) => this.setHeadlightsOn(value));

        folder.add(this.guiControls, 'headlightPower', 0, 100, 1)
            .name('Power: ')
            .onChange((value) => this.setHeadlightPower(value));
    }

    setHeadlightsOn(on) {
        for (const light of this.headlights) {
            light.visible = on;
        }
    }

    setHeadlightPower(power) {
        for (const light of this.headlights) {
            light.power = power;
        }
    }

    createDriverCamera() {
        this.driverCamera = new THREE.PerspectiveCamera(
            Car.DRIVER_CAM_FOV, 1, Car.DRIVER_CAM_NEAR, Car.DRIVER_CAM_FAR
        );
        // Default cameras look down!!
        this.driverCamera.rotation.y = Math.PI;
        this.driverCamera.position.set(...Car.DRIVER_CAM_POSITION);

        this.car.add(this.driverCamera);
    }

    getDriverCamera() {
        return this.driverCamera;
    }

    loadCar() {
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath(Car.MODEL_PATH);

        mtlLoader.load(Car.MTL_FILE, (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(Car.MODEL_PATH);

            objLoader.load(
                Car.OBJ_FILE,
                (object) => this.onCarLoaded(object),
                undefined,
                (error) => console.error('Error loading OBJ:', error)
            );
        });
    }

    onCarLoaded(object) {
        console.log('Car loaded');

        object.traverse((child) => {
            if (child.isMesh && child.geometry && !child.geometry.attributes.normal) {
                child.geometry.computeVertexNormals();
            }
        });

        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = Car.CAR_TARGET_SIZE / maxDim;

        object.position.sub(center);
        object.scale.setScalar(scale);
        object.position.y = (size.y / 2) * scale;
        object.rotation.y = Car.CAR_STARTING_DIRECTION;

        this.car.add(object);
    }

    update(pressedKeys = new Set()) {
        const delta = this.clock.getDelta();

        // Turns
        if (pressedKeys.has('ArrowLeft')) {
            this.car.rotation.y += Car.TURN_SPEED * delta;
        }
        if (pressedKeys.has('ArrowRight')) {
            this.car.rotation.y -= Car.TURN_SPEED * delta;
        }

        // Foward and backwards
        let move = 0;
        if (pressedKeys.has('ArrowUp')) {
            move += 1;
        }
        if (pressedKeys.has('ArrowDown')) {
            move -= 1;
        }

        if (move !== 0) {
            const heading = this.car.rotation.y;
            const distance = move * Car.MOVE_SPEED * delta;
            
            const newX = this.car.position.x + Math.sin(heading) * distance;
            const newZ = this.car.position.z + Math.cos(heading) * distance;
            
            // Clamp to limits
            this.car.position.x = THREE.MathUtils.clamp(newX, -this.maxX, this.maxX);
            this.car.position.z = THREE.MathUtils.clamp(newZ, -this.maxZ, this.maxZ);
        }
    }
}

export { Car }
