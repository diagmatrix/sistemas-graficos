import * as THREE from 'three';

class RevolutionFigures extends THREE.Object3D {
    // GUI
    static GOBLET_TITLE = 'Goblet';
    static VASE_TITLE = 'Vase';
    static PAWN_TITLE = 'Pawn';
    static BOWL_TITLE = 'Bowl';

    // Global
    material;
    clock;
    phiLength;
    static REVOLUTION_SPEED = 90;   // degrees per second
    static POSITIONS = [
        [-0.9, 0, 0],
        [-0.3, 0, 0],
        [0.3, 0, 0],
        [0.9, 0, 0]
    ];

    // Profiles
    static GOBLET_PROFILE = [
        [0.00, 0.00], [0.15, 0.00], [0.15, 0.02], [0.04, 0.04],
        [0.02, 0.05], [0.02, 0.20], [0.03, 0.22], [0.11, 0.26],
        [0.14, 0.40], [0.13, 0.40]
    ];
    static VASE_PROFILE = [
        [0.00, 0.00], [0.10, 0.00], [0.12, 0.05], [0.16, 0.15],
        [0.13, 0.25], [0.07, 0.32], [0.09, 0.36], [0.08, 0.37]
    ];
    static PAWN_PROFILE = [
        [0.00, 0.00], [0.10, 0.00], [0.10, 0.02], [0.04, 0.05],
        [0.03, 0.12], [0.06, 0.15], [0.04, 0.17], [0.03, 0.19],
        [0.05, 0.22], [0.05, 0.24], [0.03, 0.28], [0.00, 0.30]
    ];
    static BOWL_PROFILE = [
        [0.02, 0.00], [0.14, 0.01], [0.18, 0.06], [0.19, 0.12],
        [0.17, 0.12], [0.15, 0.07], [0.11, 0.03], [0.02, 0.02]
    ];

    goblet;
    vase;
    pawn;
    bowl;

    constructor(gui) {
        super();

        this.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });

        // Shared revolution sweep, animated in update()
        this.phiLength = 0;

        this.goblet = this.createFigure(gui, RevolutionFigures.GOBLET_TITLE, RevolutionFigures.GOBLET_PROFILE, 0);
        this.vase = this.createFigure(gui, RevolutionFigures.VASE_TITLE, RevolutionFigures.VASE_PROFILE, 1);
        this.pawn = this.createFigure(gui, RevolutionFigures.PAWN_TITLE, RevolutionFigures.PAWN_PROFILE, 2);
        this.bowl = this.createFigure(gui, RevolutionFigures.BOWL_TITLE, RevolutionFigures.BOWL_PROFILE, 3);

        this.clock = new THREE.Clock();
    }

    createFigure(gui, title, profile, position) {
        const figure = {
            profile: profile.map(([x, y]) => new THREE.Vector2(x, y)),
            controls: { segments: 24 },
            node: new THREE.Object3D(),
            mesh: null
        };

        figure.mesh = new THREE.Mesh(this.buildGeometry(figure), this.material);
        figure.node.add(figure.mesh);
        figure.node.position.set(...RevolutionFigures.POSITIONS[position]);
        this.add(figure.node);

        this.createFigureGUI(gui, title, figure);

        return figure;
    }

    buildGeometry(figure) {
        return new THREE.LatheGeometry(
            figure.profile,
            figure.controls.segments,
            0,
            THREE.MathUtils.degToRad(this.phiLength)
        );
    }

    rebuildFigure(figure) {
        figure.mesh.geometry.dispose();
        figure.mesh.geometry = this.buildGeometry(figure);
    }

    createFigureGUI(gui, title, figure) {
        const folder = gui.addFolder(title);

        folder.add(figure.controls, 'segments', 3, 64, 1)
            .name('Segments: ')
            .onChange(() => this.rebuildFigure(figure));
    }

    update() {
        this.phiLength = (this.phiLength + RevolutionFigures.REVOLUTION_SPEED * this.clock.getDelta()) % 360;

        this.rebuildFigure(this.goblet);
        this.rebuildFigure(this.vase);
        this.rebuildFigure(this.pawn);
        this.rebuildFigure(this.bowl);
    }
}

export { RevolutionFigures }
