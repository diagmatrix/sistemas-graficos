import * as THREE from 'three';
import * as TWEEN from 'tween';
import { MTLLoader } from 'mtlloader';
import { OBJLoader } from 'objloader';

class Ship extends THREE.Object3D {
    // "Ship" model
    static MODEL_PATH = '../models/porsche911/';
    static MTL_FILE = '911.mtl';
    static OBJ_FILE = 'Porsche_911_GT2.obj';
    static CAR_TARGET_SIZE = 0.1;

    // 8 Shape
    static PATH_SIZE = 0.4;
    static PATH_SAMPLES = 200;
    static PATH_COLOR = 0x3366AA;

    // Car
    carPivot;
    static CAR_ORIENTATION_OFFSET = -Math.PI;
    
    // Path
    curve;
    pathLine;
    guiControls;
    
    // Animation
    pathState;
    static LEFT_LOOP_TIME = 8000;
    static RIGHT_LOOP_TIME = 4000;

    constructor(gui) {
        super();

        this.carPivot = new THREE.Object3D();
        this.add(this.carPivot);

        this.createPath();
        this.createModelGUI(gui);
        this.createAnimation();

        this.loadCar();
    }

    createPath() {
        const a = Ship.PATH_SIZE;
        const points = [];

        // 8 shape (t = PI/2): x = a*cos(t),  z = (a/2)*sin(2t)
        for (let i = 0; i < Ship.PATH_SAMPLES; i++) {
            const s = i / Ship.PATH_SAMPLES;
            const t = Math.PI / 2 + 2 * Math.PI * s;
            points.push(new THREE.Vector3(
                a * Math.cos(t),
                0,
                (a / 2) * Math.sin(2 * t)
            ));
        }

        this.curve = new THREE.CatmullRomCurve3(points, true);

        const linePoints = this.curve.getPoints(Ship.PATH_SAMPLES * 2);
        const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
        this.pathLine = new THREE.LineLoop(
            geometry,
            new THREE.LineBasicMaterial({ color: Ship.PATH_COLOR })
        );
        this.add(this.pathLine);
    }

    createModelGUI(gui) {
        this.guiControls = {
            showPath: true,
            pathColor: Ship.PATH_COLOR
        };

        const folder = gui.addFolder('Recorrido');

        folder.add(this.guiControls, 'showPath')
            .name('Ver camino: ')
            .onChange((value) => { this.pathLine.visible = value; });

        folder.addColor(this.guiControls, 'pathColor')
            .name('Color: ')
            .onChange((value) => { this.pathLine.material.color.set(value); });
    }

    loadCar() {
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath(Ship.MODEL_PATH);

        mtlLoader.load(Ship.MTL_FILE, (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(Ship.MODEL_PATH);

            objLoader.load(
                Ship.OBJ_FILE,
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
        const scale = Ship.CAR_TARGET_SIZE / maxDim;

        object.position.sub(center);
        object.rotation.y = Ship.CAR_ORIENTATION_OFFSET;
        object.scale.setScalar(scale);
        object.position.y = (size.y / 2) * scale;

        this.carPivot.add(object);
    }

    createAnimation() {
        this.pathState = { u: 0 };

        // Left loop: 0 -> 0.5 in 8 seconds
        this.tweenLeft = new TWEEN.Tween(this.pathState)
            .to({ u: 0.5 }, Ship.LEFT_LOOP_TIME)
            .easing(TWEEN.Easing.Quadratic.InOut);
        
        // Right loop: 0.5 -> 1 in 4 seconds
        this.tweenRight = new TWEEN.Tween(this.pathState)
            .to({ u: 1 }, Ship.LEFT_LOOP_TIME)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                this.pathState.u = 0;
            });

        // Chaining animation
        this.tweenLeft.chain(this.tweenRight);
        this.tweenRight.chain(this.tweenLeft);
        
        this.tweenLeft.start();
    }

    update() {
        TWEEN.update();

        if (!this.curve) return;

        // Car position on the path
        const u = this.pathState.u % 1;
        const point = this.curve.getPointAt(u);
        this.carPivot.position.copy(point);

        // Car orientation on the path
        const tangent = this.curve.getTangentAt(u);
        this.carPivot.rotation.y = Math.atan2(tangent.x, tangent.z);
    }
}

export { Ship }
