import * as THREE from 'three';


class Lamppost extends THREE.Object3D {
    // Geometry
    static POSITION = [-0.3, 0, -0.3];
    static POLE_HEIGHT = 0.2;
    static POLE_RADIUS = 0.006;
    static ARM_LENGTH = 0.06;
    static LUMINAIRE_RADIUS = 0.02;

    // Colors
    static POLE_COLOR = 0x333333;
    static LUMINAIRE_COLOR = 0xFFF3C0;
    static LUMINAIRE_EMISSIVE = 1.5;

    // Light
    static LIGHT_COLOR = 0xFFF3C0;
    static LIGHT_POWER = 5;
    static LIGHT_POWER_MIN = 0;
    static LIGHT_POWER_MAX = 10;
    static LIGHT_DISTANCE = 1;
    light;
    luminaire;

    // GUI
    guiControls;

    constructor(gui) {
        super();

        this.position.set(...Lamppost.POSITION);

        this.createGraph();
        this.createGUI(gui);
    }

    createGraph() {
        const poleMaterial = new THREE.MeshStandardMaterial({ color: Lamppost.POLE_COLOR });

        // 1. Vertical post
        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(Lamppost.POLE_RADIUS, Lamppost.POLE_RADIUS, Lamppost.POLE_HEIGHT, 12),
            poleMaterial
        );
        pole.position.y = Lamppost.POLE_HEIGHT / 2;
        pole.castShadow = true;
        this.add(pole);

        // 2. Horizontal arm
        const arm = new THREE.Mesh(
            new THREE.CylinderGeometry(Lamppost.POLE_RADIUS, Lamppost.POLE_RADIUS, Lamppost.ARM_LENGTH, 12),
            poleMaterial
        );
        arm.rotation.z = Math.PI / 2;
        arm.position.set(Lamppost.ARM_LENGTH / 2, Lamppost.POLE_HEIGHT, 0);
        arm.castShadow = true;
        this.add(arm);

        // 3. Lamp
        this.luminaire = new THREE.Mesh(
            new THREE.SphereGeometry(Lamppost.LUMINAIRE_RADIUS, 16, 16),
            new THREE.MeshStandardMaterial({
                color: Lamppost.LUMINAIRE_COLOR,
                emissive: Lamppost.LUMINAIRE_COLOR,
                emissiveIntensity: Lamppost.LUMINAIRE_EMISSIVE
            })
        );
        this.luminaire.position.set(Lamppost.ARM_LENGTH, Lamppost.POLE_HEIGHT - 0.01, 0);
        this.luminaire.castShadow = false; // Light source, no shadows (otherwise light is trapped)
        this.add(this.luminaire);

        // 3. Lamp light
        this.light = new THREE.PointLight(
            Lamppost.LIGHT_COLOR,
            Lamppost.LIGHT_POWER,
            Lamppost.LIGHT_DISTANCE
        );
        this.light.position.copy(this.luminaire.position);
        this.light.castShadow = true;

        // Shadow config
        this.light.shadow.camera.near = 0.01;
        this.light.shadow.camera.far = Lamppost.LIGHT_DISTANCE;
        this.light.shadow.mapSize.set(1024, 1024);
        this.light.shadow.bias = -0.0005;
        this.add(this.light);
    }

    createGUI(gui) {
        this.guiControls = {
            lampPower: Lamppost.LIGHT_POWER
        };

        const folder = gui.addFolder('Lamppost');

        folder.add(this.guiControls, 'lampPower', Lamppost.LIGHT_POWER_MIN, Lamppost.LIGHT_POWER_MAX, 0.1)
            .name('Lamp: ')
            .onChange((value) => this.setLightPower(value));
    }

    setLightPower(power) {
        this.light.power = power;
    }

    update() {
    }
}

export { Lamppost }
