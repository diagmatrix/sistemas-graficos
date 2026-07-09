import * as THREE from 'three';
import { Evaluator, Brush, SUBTRACTION, ADDITION } from 'three-bvh-csg';

class CoffeeMug extends THREE.Object3D {
    // GUI
    static GUI_TITLE = 'Coffee Mug';

    // Dimensiones (metros)
    static R_OUT = 0.04;
    static WALL = 0.006;
    static HEIGHT = 0.09;
    static BOTTOM = 0.008;
    static HANDLE_RADIUS = 0.028;
    static HANDLE_TUBE = 0.007;
    static RADIAL_SEGMENTS = 48;

    material;

    constructor(gui) {
        super();

        this.material = new THREE.MeshNormalMaterial();

        this.createModelGUI(gui);
        this.createModelGraph();
    }

    createModelGUI(gui) {
        this.guiControls = { wireframe: false };

        const folder = gui.addFolder(CoffeeMug.GUI_TITLE);

        folder.add(this.guiControls, 'wireframe')
            .name('Wireframe: ')
            .onChange((value) => this.setWireframe(value));
    }

    setWireframe(value) {
        this.material.wireframe = value;
    }

    createModelGraph() {
        const mug = this.buildMug();
        mug.material = this.material;
        this.add(mug);
    }

    buildMug() {
        const evaluator = new Evaluator();

        const rOut = CoffeeMug.R_OUT;
        const rIn = rOut - CoffeeMug.WALL;
        const h = CoffeeMug.HEIGHT;
        const bottom = CoffeeMug.BOTTOM;
        const seg = CoffeeMug.RADIAL_SEGMENTS;

        // 1. Exterior body: cilindro, base y = 0
        const outer = new Brush(new THREE.CylinderGeometry(rOut, rOut, h, seg));
        outer.position.y = h / 2;
        outer.updateMatrixWorld();

        // 2. Inner body: cilinder, base lifted a bit 
        const cavity = new Brush(new THREE.CylinderGeometry(rIn, rIn, h, seg));
        cavity.position.y = h / 2 + bottom;
        cavity.updateMatrixWorld();

        // 3. Glass: Exterior - Interior
        let mug = evaluator.evaluate(outer, cavity, SUBTRACTION);

        // 4. Handle base: Full torus, height to the middle of the cup
        const rt = CoffeeMug.HANDLE_RADIUS;
        const tube = CoffeeMug.HANDLE_TUBE;
        const handleFull = new Brush(new THREE.TorusGeometry(rt, tube, 24, seg));
        handleFull.position.set(rIn, h / 2, 0);
        handleFull.updateMatrixWorld();

        // 5. Handle inside cup: Box, height to the middle of the cup
        const handleInside = new Brush(new THREE.BoxGeometry(1, 1, 1));
        handleInside.position.set(rIn - 0.5, h / 2, 0);
        handleInside.updateMatrixWorld();

        // 6. Handle: Handle base - handle inside cup
        const handle = evaluator.evaluate(handleFull, handleInside, SUBTRACTION);
        
        // 7. Final mug
        mug = evaluator.evaluate(mug, handle, ADDITION);

        return mug;
    }

    update() {
        // No animations
    }
}

export { CoffeeMug }
