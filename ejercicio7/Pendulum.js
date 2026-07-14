import * as THREE from 'three';
import { Evaluator, Brush, ADDITION } from 'three-bvh-csg';

class Pendulum extends THREE.Object3D {
    // GUI
    static GUI_TITLE_TOP = 'Top Pendulum';
    static GUI_TITLE_BOT = 'Bottom Pendulum';
    static SCALE = 0.01
    topPendulumControls;
    botPendulumControls;

    // All Pendulums
    static PENDULUM_WIDTH = 2;
    static PENDULUM_DEPTH = 2;
    static PENDULUM_WIDTH_SM = 1.5;
    static PENDULUM_DEPTH_SM = 1.5;
    static PENDULUM_ANGLES = Math.PI / 4;

    // Top Pendulum
    static TOP_PENDULUM_STATIC_LENGHT = 4;
    static TOP_PENDULUM_MIN_VAR_LENGTH = 5;
    static TOP_PENDULUM_MAX_VAR_LENGTH = 10;
    static TOP_PENDULUM_RADIUS = 0.15;
    static TOP_PENDULUM_STATIC_COLOR = 'green';
    static TOP_PENDULUM_VARIABLE_COLOR = 'red';
    static TOP_PENDULUM_AXIS_COLOR = 'yellow';
    topPendulum;
    topBody;
    rotatingTopPendulum;
    staticTopPendulum;
    topPendulumVariable;

    // Bottom Pendulum
    static BOT_PENDULUM_MIN_VAR_LENGTH = 10;
    static BOT_PENDULUM_MAX_VAR_LENGTH = 20;
    static BOT_PENDULUM_MIN_VAR_POSITION = 0.1;
    static BOT_PENDULUM_MAX_VAR_POSITION = 0.9;
    static BOT_PENDULUM_COLOR = 'blue';
    static BOT_PENDULUM_AXIS_COLOR = 'pink';
    botPendulum;
    botBody;

    constructor(gui) {
        super();

        this.createModelGUI(gui);
        this.createModelGraph();
    }

    scaleVars(value) {
        return value * Pendulum.SCALE;
    }

    createModelGUI(gui) {
        this.createTopPendulumGUI(gui);
        this.createBotPendulumGUI(gui);
    }

    createModelGraph() {
        this.createTopPendulumGraph();
        this.createBotPendulumGraph();

        // Add to moving part!
        this.topPendulumVariable.add(this.botPendulum);
        this.add(this.topPendulum);
    }

    // Top pendulum
    createTopPendulumGUI(gui) {
        this.topPendulumControls = {
            length: 5,
            rotation: 0
        };

        const topPendulumFolder = gui.addFolder(Pendulum.GUI_TITLE_TOP);

        topPendulumFolder.add(this.topPendulumControls, 'length', Pendulum.TOP_PENDULUM_MIN_VAR_LENGTH, Pendulum.TOP_PENDULUM_MAX_VAR_LENGTH)
            .name('Length: ')
            .onChange((value) => this.setTopPendulumLength(value));

        topPendulumFolder.add(this.topPendulumControls, 'rotation', - Pendulum.PENDULUM_ANGLES, Pendulum.PENDULUM_ANGLES)
            .name('Rotation: ')
            .onChange((value) => this.setTopPendulumRotation(value));
    }

    createTopPendulumGraph() {
        // Rotation pin
        const axisOffset = this.scaleVars(Pendulum.TOP_PENDULUM_STATIC_LENGHT * this.botPendulumControls.position / 2);

        // Pivot
        this.topPendulum = new THREE.Object3D();
        this.topPendulum.rotation.z = this.topPendulumControls.rotation;
        this.topPendulum.position.y = -axisOffset;

        // Body
        this.topBody = new THREE.Object3D();
        this.topBody.position.y = axisOffset;
        this.topPendulum.add(this.topBody);

        this.rotatingTopPendulum = this.createRotatingTopSegment();
        this.topBody.add(this.rotatingTopPendulum);

        this.createVariableLengthTopSegment()
        this.topBody.add(this.topPendulumVariable);

        this.staticTopPendulum = new THREE.Mesh(
            new THREE.BoxGeometry(
                this.scaleVars(Pendulum.PENDULUM_WIDTH),
                this.scaleVars(Pendulum.TOP_PENDULUM_STATIC_LENGHT),
                this.scaleVars(Pendulum.PENDULUM_DEPTH)
            ),
            new THREE.MeshStandardMaterial({ color: Pendulum.TOP_PENDULUM_STATIC_COLOR })
        );
        this.staticTopPendulum.position.y = -(this.scaleVars(Pendulum.TOP_PENDULUM_STATIC_LENGHT * 1.5) + this.scaleVars(this.topPendulumControls.length));
        this.topBody.add(this.staticTopPendulum);

        return this.topPendulum;
    }

    createRotatingTopSegment() {
        const staticMaterial = new THREE.MeshStandardMaterial({ color: Pendulum.TOP_PENDULUM_STATIC_COLOR });
        const axisMaterial = new THREE.MeshStandardMaterial({ color: Pendulum.TOP_PENDULUM_AXIS_COLOR });
        const evaluator = new Evaluator();

        const staticSegmentTop = new Brush(new THREE.BoxGeometry(
            this.scaleVars(Pendulum.PENDULUM_WIDTH),
            this.scaleVars(Pendulum.TOP_PENDULUM_STATIC_LENGHT),
            this.scaleVars(Pendulum.PENDULUM_DEPTH)
        ));
        staticSegmentTop.material = staticMaterial;
        staticSegmentTop.position.y = -this.scaleVars(Pendulum.TOP_PENDULUM_STATIC_LENGHT / 2);
        staticSegmentTop.updateMatrixWorld();

        const axisTop = new Brush(new THREE.CylinderGeometry(
            this.scaleVars(Pendulum.PENDULUM_WIDTH / 3),
            this.scaleVars(Pendulum.PENDULUM_WIDTH / 3),
            this.scaleVars(Pendulum.PENDULUM_DEPTH * 1.2),
            8
        ));
        axisTop.material = axisMaterial;
        axisTop.position.y = -this.scaleVars(Pendulum.TOP_PENDULUM_STATIC_LENGHT / 2);
        axisTop.rotation.x = Math.PI / 2;
        axisTop.updateMatrixWorld();

        return evaluator.evaluate(staticSegmentTop, axisTop, ADDITION);
    }

    createVariableLengthTopSegment() {
        this.topPendulumVariable = new THREE.Mesh(
            new THREE.BoxGeometry(
                this.scaleVars(Pendulum.PENDULUM_WIDTH),
                this.scaleVars(this.topPendulumControls.length),
                this.scaleVars(Pendulum.PENDULUM_DEPTH)
            ),
            new THREE.MeshStandardMaterial({ color: Pendulum.TOP_PENDULUM_VARIABLE_COLOR })
        );
        this.topPendulumVariable.position.y = -(this.scaleVars(Pendulum.TOP_PENDULUM_STATIC_LENGHT) + this.scaleVars(this.topPendulumControls.length / 2));
    }

    setTopPendulumLength(value) {
        const trueValue = this.scaleVars(value);
        this.topPendulumVariable.geometry.dispose();
        this.topPendulumVariable.geometry = new THREE.BoxGeometry(
            this.scaleVars(Pendulum.PENDULUM_WIDTH),
            trueValue,
            this.scaleVars(Pendulum.PENDULUM_DEPTH)
        )
        this.topPendulumVariable.position.y = -(this.scaleVars(Pendulum.TOP_PENDULUM_STATIC_LENGHT) + trueValue / 2);
        this.staticTopPendulum.position.y = -(this.scaleVars(Pendulum.TOP_PENDULUM_STATIC_LENGHT * 1.5) + trueValue);

        this.setBotPendulumPosition(this.botPendulumControls.position);
    }

    setTopPendulumRotation(value) {
        this.topPendulum.rotation.z = value;
    }

    // Bottom pendulum
    createBotPendulumGUI(gui) {
        this.botPendulumControls = {
            length: 15,
            position: 0.1,
            rotation: 0
        };

        const botPendulumFolder = gui.addFolder(Pendulum.GUI_TITLE_BOT);

        botPendulumFolder.add(this.botPendulumControls, 'length', Pendulum.BOT_PENDULUM_MIN_VAR_LENGTH, Pendulum.BOT_PENDULUM_MAX_VAR_LENGTH)
            .name('Length: ')
            .onChange((value) => this.setBotPendulumLength(value));

        botPendulumFolder.add(this.botPendulumControls, 'position', Pendulum.BOT_PENDULUM_MIN_VAR_POSITION, Pendulum.BOT_PENDULUM_MAX_VAR_POSITION)
            .name('Position: ')
            .onChange((value) => this.setBotPendulumPosition(value));

        botPendulumFolder.add(this.botPendulumControls, 'rotation', - Pendulum.PENDULUM_ANGLES, Pendulum.PENDULUM_ANGLES)
            .name('Rotation: ')
            .onChange((value) => this.setBotPendulumRotation(value));
    }

    createBotPendulumGraph() {
        this.botPendulum = new THREE.Object3D();

        const axisMaterial = new THREE.MeshStandardMaterial({ color: Pendulum.BOT_PENDULUM_AXIS_COLOR });

        const botAxis = new THREE.Mesh(
            new THREE.CylinderGeometry(
                this.scaleVars(Pendulum.PENDULUM_WIDTH_SM / 3),
                this.scaleVars(Pendulum.PENDULUM_DEPTH_SM / 3),
                this.scaleVars(Pendulum.PENDULUM_DEPTH * 0.2),
                8
            ),
            axisMaterial
        );
        botAxis.rotation.x = Math.PI / 2;
        botAxis.position.z = this.scaleVars(Pendulum.PENDULUM_DEPTH_SM) / 2;
        this.botPendulum.add(botAxis);

        const pendulumMaterial = new THREE.MeshStandardMaterial({ color: Pendulum.BOT_PENDULUM_COLOR });
        this.botBody = new THREE.Mesh(
            new THREE.BoxGeometry(
                this.scaleVars(Pendulum.PENDULUM_WIDTH_SM),
                this.scaleVars(this.botPendulumControls.length),
                this.scaleVars(Pendulum.PENDULUM_DEPTH_SM)
            ),
            pendulumMaterial
        );
        this.botBody.position.y = -this.scaleVars(this.botPendulumControls.length / 2 - 1);
        this.botPendulum.add(this.botBody);

        // Positioning
        this.botPendulum.position.z = this.scaleVars(Pendulum.PENDULUM_DEPTH_SM + Pendulum.PENDULUM_DEPTH) / 2;
        this.setBotPendulumPosition(this.botPendulumControls.position);
    }

    setBotPendulumPosition(value) {
        const topOfPendulumOffset = this.scaleVars(this.topPendulumControls.length / 2);
        // 0.1 -> almost +len/2
        // 0.5 -> 0
        // 0.9 -> almost -len/2
        this.botPendulum.position.y = topOfPendulumOffset - this.scaleVars(this.topPendulumControls.length  * value);
    }

    setBotPendulumLength(value) {
        const trueValue = this.scaleVars(value);
        
        this.botBody.geometry.dispose()
        this.botBody.geometry = new THREE.BoxGeometry(
            this.scaleVars(Pendulum.PENDULUM_WIDTH_SM),
            trueValue,
            this.scaleVars(Pendulum.PENDULUM_DEPTH_SM)
        );
        this.botBody.position.y = -(trueValue / 2 - Pendulum.SCALE);
    }

    setBotPendulumRotation(value) {
        this.botPendulum.rotation.z = value;
    }

    update() {
        // Add update logic
        // ...
    }
}

export { Pendulum }
