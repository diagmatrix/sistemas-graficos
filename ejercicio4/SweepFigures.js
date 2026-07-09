import * as THREE from 'three';

class SweepFigures extends THREE.Object3D {
    // GUI
    static GUI_TITLE = 'Sweep Figures';

    // Global
    material;
    clock;
    figures;
    static SPIN_SPEED = Math.PI / 4;   // radians per second
    static SCALE = 0.006;
    static POSITIONS = [
        [0.35, 0, 0],
        [0, 0, 0],
        [-0.35, 0, 0]
    ];

    constructor(gui) {
        super();

        this.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });

        // Guardamos los nodos para poder animarlos en update()
        this.figures = [];

        this.createModelGUI(gui);
        this.createModelGraph();

        this.clock = new THREE.Clock();
    }

    createModelGUI(gui) {
        this.guiControls = { bevelSegments: 5 };

        const folder = gui.addFolder(SweepFigures.GUI_TITLE);

        folder.add(this.guiControls, 'bevelSegments', 1, 20, 1)
            .name('Bevel segments: ')
            .onChange(() => this.rebuildBevelHeart());
    }

    createModelGraph() {
        this.createHeartExtrude(0);
        this.createHeartExtrudeBevel(1);
        this.createHeartSweep(2);
    }

    createHeartShape() {
        const shape = new THREE.Shape();

        shape.moveTo(5, 5);
        shape.bezierCurveTo(5, 5, 4, 0, 0, 0);
        shape.bezierCurveTo(-6, 0, -6, 7, -6, 7);
        shape.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
        shape.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
        shape.bezierCurveTo(16, 7, 16, 0, 10, 0);
        shape.bezierCurveTo(7, 0, 5, 5, 5, 5);

        return shape;
    }

    createHeartExtrude(position) {
        const shape = this.createHeartShape();

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 4,
            bevelEnabled: false
        });
        geometry.center();

        const mesh = new THREE.Mesh(geometry, this.material);

        const node = new THREE.Object3D();
        node.add(mesh);
        node.scale.set(SweepFigures.SCALE, SweepFigures.SCALE, SweepFigures.SCALE);
        node.rotation.z = Math.PI;   // Drawn inverse
        node.position.set(...SweepFigures.POSITIONS[position]);

        this.figures.push(node);
        this.add(node);
    }

    createHeartExtrudeBevel(position) {
        this.bevelHeartMesh = new THREE.Mesh(this.buildBevelGeometry(), this.material);

        const node = new THREE.Object3D();
        node.add(this.bevelHeartMesh);
        node.scale.set(SweepFigures.SCALE, SweepFigures.SCALE, SweepFigures.SCALE);
        node.rotation.z = Math.PI;
        node.position.set(...SweepFigures.POSITIONS[position]);

        this.figures.push(node);
        this.add(node);
    }

    buildBevelGeometry() {
        const shape = this.createHeartShape();

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 4,
            bevelEnabled: true,
            bevelThickness: 1.5,
            bevelSize: 1.5,
            bevelSegments: this.guiControls.bevelSegments
        });
        geometry.center();

        return geometry;
    }

    rebuildBevelHeart() {
        this.bevelHeartMesh.geometry.dispose();
        this.bevelHeartMesh.geometry = this.buildBevelGeometry();
    }

    createHeartSweep(position) {
        const shape = this.createHeartShape();

        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-25, 15, 4),
            new THREE.Vector3(0, 30, 4),
            new THREE.Vector3(0, 45, -15)
        ]);

        const geometry = new THREE.ExtrudeGeometry(shape, {
            steps: 80,
            bevelEnabled: false,
            extrudePath: path
        });
        geometry.center();

        const mesh = new THREE.Mesh(geometry, this.material);

        const node = new THREE.Object3D();
        node.add(mesh);
        node.scale.set(SweepFigures.SCALE, SweepFigures.SCALE, SweepFigures.SCALE);
        node.position.set(...SweepFigures.POSITIONS[position]);

        this.figures.push(node);
        this.add(node);
    }

    update() {
        // Rotación de cada figura alrededor de su eje Y
        const angle = SweepFigures.SPIN_SPEED * this.clock.getDelta();

        for (const figure of this.figures) {
            figure.rotation.y += angle;
        }
    }
}

export { SweepFigures }
