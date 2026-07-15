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

    // Speeds
    static MOVE_SPEED = 0.6;
    static TURN_SPEED = Math.PI / 4;
    clock = new THREE.Clock();


    constructor(gui) {
        super();

        this.car = new THREE.Object3D();
        this.add(this.car);

        this.loadCar();
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
            this.car.position.x += Math.sin(heading) * distance;
            this.car.position.z += Math.cos(heading) * distance;
        }
    }
}

export { Car }
