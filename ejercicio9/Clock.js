import * as THREE from 'three';

class Clock extends THREE.Object3D {
    // GUI
    static GUI_TITLE = 'Clock';
    guiControls;

    // Clock
    static N_MARKS = 12;
    static RING_RADIUS = 0.25;
    static MARK_RADIUS = 0.02;
    static QUARTER_MARK_RADIUS = 0.028;
    static MOVER_RADIUS = 0.015;
    static MARK_COLOR = 'red';
    static QUARTER_MARK_COLOR = 'green';
    static MOVER_COLOR = 'yellow';
    moverPivot;

    // Animation
    angle = 0;
    clock = new THREE.Clock();

    constructor(gui) {
        super();

        this.createModelGUI(gui);
        this.createModelGraph();
    }

    static anglePerMark() {
        return (2 * Math.PI) / Clock.N_MARKS;
    }

    createModelGUI(gui) {
        this.guiControls = {
            speed: 2.0   // marcas por segundo
        };

        const folder = gui.addFolder(Clock.GUI_TITLE);

        folder.add(this.guiControls, 'speed', -Clock.N_MARKS, Clock.N_MARKS, 0.1)
            .name('Speed (marks/s): ')
            .listen(); // Updates value, no function attached
    }

    createModelGraph() {
        this.createMarks();
        this.createMover();
    }

    createMarks() {
        const angPerMark = Clock.anglePerMark();

        for (let i = 0; i < Clock.N_MARKS; i++) {
            const theta = i * angPerMark;
            const isQuarter = (i % 3) === 0;

            const radius = isQuarter ? Clock.QUARTER_MARK_RADIUS : Clock.MARK_RADIUS;
            const color = isQuarter ? Clock.QUARTER_MARK_COLOR : Clock.MARK_COLOR;

            const mark = new THREE.Mesh(
                new THREE.SphereGeometry(radius, 24, 24),
                new THREE.MeshStandardMaterial({ color })
            );

            mark.position.set(
                Clock.RING_RADIUS * Math.sin(theta),
                radius,
                Clock.RING_RADIUS * Math.cos(theta)
            );

            this.add(mark);
        }
    }

    createMover() {
        this.moverPivot = new THREE.Object3D();
        this.add(this.moverPivot);

        const mover = new THREE.Mesh(
            new THREE.SphereGeometry(Clock.MOVER_RADIUS, 24, 24),
            new THREE.MeshStandardMaterial({ color: Clock.MOVER_COLOR })
        );
        mover.position.set(0, Clock.MOVER_RADIUS, Clock.RING_RADIUS * 0.8);
        this.moverPivot.add(mover);
    }

    update() {
        const delta = this.clock.getDelta();
        const angularVelocity = this.guiControls.speed * Clock.anglePerMark();
        this.angle += angularVelocity * delta;

        // Clockwise rotation
        this.moverPivot.rotation.y = -this.angle;
    }
}

export { Clock }
