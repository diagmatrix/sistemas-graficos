import * as THREE from 'three';

class All3DFigures extends THREE.Object3D {
    // GUI
    static BOX_TITLE = 'Box';
    static SPHERE_TITLE = 'Sphere';
    static CYLINDER_TITLE = 'Cilinder';
    static CONE_TITLE = 'Cone';
    static TORUS_TITLE = 'Torus';
    static TETRAHEDRON_TITLE = 'Tetrahedron';
    static OCTAHEDRON_TITLE = 'Octahedron';
    static DODECAHEDRON_TITLE = 'Dodecahedron';
    static ICOSAHEDRON_TITLE = 'Icosahedron';
    boxGUIControls;
    sphereGUIControls;
    cilinderGUIControls;
    coneGUIControls;
    torusGUIControls;
    tetrahedronGUIControls;
    octahedronGUIControls;
    dodecahedronGUIControls;
    icosahedronGUIControls;

    // Global
    material;
    clock;
    static SPIN_SPEED = Math.PI / 4;   // radians per second
    static POSITIONS = [
        [0, 0, 0],
        [1, 0, 0],
        [2, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
        [2, 1, 0],
        [0, 2, 0],
        [1, 2, 0],
        [2, 2, 0]
    ];

    // Models
    box;
    boxObject;
    sphere;
    sphereObject;
    cilinder;
    cilinderObject;
    cone;
    coneObject;
    torus;
    torusObject;
    tetrahedron;
    tetrahedronObject;
    octahedron;
    octahedronObject;
    dodecahedron;
    dodecahedronObject;
    icosahedron;
    icosahedronObject;

    constructor(gui) {
        super();

        this.createModelGUI(gui);

        this.material = new THREE.MeshNormalMaterial()

        this.createModelGraph();

        this.clock = new THREE.Clock();
    }

    createModelGUI(gui) {
        // Add model GUI controls
        this.createBoxGUI(gui)
        this.createSphereGUI(gui)
        this.createCilinderGUI(gui)
        this.createConeGUI(gui)
        this.createTorusGUI(gui)
        this.createTetrahedronGUI(gui)
        this.createOctahedronGUI(gui)
        this.createDodecahedronGUI(gui)
        this.createIcosahedronGUI(gui)
    }

    createModelGraph() {
        // Add nodes
        this.createBox(0)
        this.createSphere(1)
        this.createCilinder(2)
        this.createCone(3)
        this.createTorus(4)
        this.createTetrahedron(5)
        this.createOctahedron(6)
        this.createDodecahedron(7)
        this.createIcosahedron(8)
    }

    // Box
    createBoxGUI(gui) {
        this.boxGUIControls = {
            width: 0.2,
            height: 0.2,
            depth: 0.2
        }

        const boxFolder = gui.addFolder(All3DFigures.BOX_TITLE);

        boxFolder.add(this.boxGUIControls, 'width', 0.1, 0.5)
            .name('Width: ')
            .onChange((value) => this.setBoxWidth(value));
        boxFolder.add(this.boxGUIControls, 'height', 0.1, 0.5)
            .name('Height: ')
            .onChange((value) => this.setBoxHeight(value));
        boxFolder.add(this.boxGUIControls, 'depth', 0.1, 0.5)
            .name('Depth: ')
            .onChange((value) => this.setBoxDepth(value));
    }

    createBox(position) {
        console.log("Creating box...");

        this.boxObject = new THREE.Mesh(
            new THREE.BoxGeometry(
                this.boxGUIControls.width,
                this.boxGUIControls.height,
                this.boxGUIControls.depth
            ),
            this.material
        )
        this.box = new THREE.Object3D()
        this.box.add(this.boxObject)
        
        this.box.position.set(...All3DFigures.POSITIONS[position])

        this.add(this.box)
    }

    setBoxWidth(value) {
        this.boxObject.geometry.dispose()
        this.boxObject.geometry = new THREE.BoxGeometry(
            value,
            this.boxGUIControls.height,
            this.boxGUIControls.depth
        );
    }

    setBoxHeight(value) {
        this.boxObject.geometry.dispose()
        this.boxObject.geometry = new THREE.BoxGeometry(
            this.boxGUIControls.width,
            value,
            this.boxGUIControls.depth
        );
    }

    setBoxDepth(value) {
        this.boxObject.geometry.dispose()
        this.boxObject.geometry = new THREE.BoxGeometry(
            this.boxGUIControls.width,
            this.boxGUIControls.height,
            value
        );
    }

    // Sphere
    createSphereGUI(gui) {
        this.sphereGUIControls = {
            radius: 0.125,
            widthSegments: 12,
            heightSegments: 8
        }

        const sphereFolder = gui.addFolder(All3DFigures.SPHERE_TITLE);

        sphereFolder.add(this.sphereGUIControls, 'radius', 0.1, 0.25)
            .name('Radius: ')
            .onChange((value) => this.setSphereRadius(value));
        sphereFolder.add(this.sphereGUIControls, 'widthSegments', 3, 64, 1)
            .name('Width segments: ')
            .onChange((value) => this.setSphereWidthSegments(value));
        sphereFolder.add(this.sphereGUIControls, 'heightSegments', 2, 32, 1)
            .name('Height segments: ')
            .onChange((value) => this.setSphereHeightSegments(value));
    }

    createSphere(position) {
        console.log("Creating sphere...");

        this.sphereObject = new THREE.Mesh(
            new THREE.SphereGeometry(
                this.sphereGUIControls.radius,
                this.sphereGUIControls.widthSegments,
                this.sphereGUIControls.heightSegments
            ),
            this.material
        )
        this.sphere = new THREE.Object3D()
        this.sphere.add(this.sphereObject)

        this.sphere.position.set(...All3DFigures.POSITIONS[position])

        this.add(this.sphere)
    }

    setSphereRadius(value) {
        this.sphereObject.geometry.dispose()
        this.sphereObject.geometry = new THREE.SphereGeometry(
            value,
            this.sphereGUIControls.widthSegments,
            this.sphereGUIControls.heightSegments
        );
    }

    setSphereWidthSegments(value) {
        this.sphereObject.geometry.dispose()
        this.sphereObject.geometry = new THREE.SphereGeometry(
            this.sphereGUIControls.radius,
            value,
            this.sphereGUIControls.heightSegments
        );
    }

    setSphereHeightSegments(value) {
        this.sphereObject.geometry.dispose()
        this.sphereObject.geometry = new THREE.SphereGeometry(
            this.sphereGUIControls.radius,
            this.sphereGUIControls.widthSegments,
            value
        );
    }

    // Cilinder
    createCilinderGUI(gui) {
        this.cilinderGUIControls = {
            radiusTop: 0.125,
            radiusBottom: 0.125,
            height: 0.2,
            radialSegments: 12
        }

        const cilinderFolder = gui.addFolder(All3DFigures.CYLINDER_TITLE);

        cilinderFolder.add(this.cilinderGUIControls, 'radiusTop', 0.1, 0.25)
            .name('Top radius: ')
            .onChange((value) => this.setCilinderRadiusTop(value));
        cilinderFolder.add(this.cilinderGUIControls, 'radiusBottom', 0.1, 0.25)
            .name('Bottom radius: ')
            .onChange((value) => this.setCilinderRadiusBottom(value));
        cilinderFolder.add(this.cilinderGUIControls, 'height', 0.1, 0.5)
            .name('Height: ')
            .onChange((value) => this.setCilinderHeight(value));
        cilinderFolder.add(this.cilinderGUIControls, 'radialSegments', 3, 64, 1)
            .name('Radial segments: ')
            .onChange((value) => this.setCilinderRadialSegments(value));
    }

    createCilinder(position) {
        console.log("Creating cilinder...");

        this.cilinderObject = new THREE.Mesh(
            new THREE.CylinderGeometry(
                this.cilinderGUIControls.radiusTop,
                this.cilinderGUIControls.radiusBottom,
                this.cilinderGUIControls.height,
                this.cilinderGUIControls.radialSegments
            ),
            this.material
        )
        this.cilinder = new THREE.Object3D()
        this.cilinder.add(this.cilinderObject)

        this.cilinder.position.set(...All3DFigures.POSITIONS[position])
        this.cilinder.rotation.x = Math.PI / 8;

        this.add(this.cilinder)
    }

    setCilinderRadiusTop(value) {
        this.cilinderObject.geometry.dispose()
        this.cilinderObject.geometry = new THREE.CylinderGeometry(
            value,
            this.cilinderGUIControls.radiusBottom,
            this.cilinderGUIControls.height,
            this.cilinderGUIControls.radialSegments
        );
    }

    setCilinderRadiusBottom(value) {
        this.cilinderObject.geometry.dispose()
        this.cilinderObject.geometry = new THREE.CylinderGeometry(
            this.cilinderGUIControls.radiusTop,
            value,
            this.cilinderGUIControls.height,
            this.cilinderGUIControls.radialSegments
        );
    }

    setCilinderHeight(value) {
        this.cilinderObject.geometry.dispose()
        this.cilinderObject.geometry = new THREE.CylinderGeometry(
            this.cilinderGUIControls.radiusTop,
            this.cilinderGUIControls.radiusBottom,
            value,
            this.cilinderGUIControls.radialSegments
        );
    }

    setCilinderRadialSegments(value) {
        this.cilinderObject.geometry.dispose()
        this.cilinderObject.geometry = new THREE.CylinderGeometry(
            this.cilinderGUIControls.radiusTop,
            this.cilinderGUIControls.radiusBottom,
            this.cilinderGUIControls.height,
            value
        );
    }

    // Cone
    createConeGUI(gui) {
        this.coneGUIControls = {
            radius: 0.125,
            height: 0.3,
            radialSegments: 12
        }

        const coneFolder = gui.addFolder(All3DFigures.CONE_TITLE);

        coneFolder.add(this.coneGUIControls, 'radius', 0.1, 0.25)
            .name('Radius: ')
            .onChange((value) => this.setConeRadius(value));
        coneFolder.add(this.coneGUIControls, 'height', 0.1, 0.5)
            .name('Height: ')
            .onChange((value) => this.setConeHeight(value));
        coneFolder.add(this.coneGUIControls, 'radialSegments', 3, 64, 1)
            .name('Radial segments: ')
            .onChange((value) => this.setConeRadialSegments(value));
    }

    createCone(position) {
        console.log("Creating cone...");

        this.coneObject = new THREE.Mesh(
            new THREE.ConeGeometry(
                this.coneGUIControls.radius,
                this.coneGUIControls.height,
                this.coneGUIControls.radialSegments
            ),
            this.material
        )
        this.cone = new THREE.Object3D()
        this.cone.add(this.coneObject)

        this.cone.position.set(...All3DFigures.POSITIONS[position])
        this.cone.rotation.x = Math.PI / 8;

        this.add(this.cone)
    }

    setConeRadius(value) {
        this.coneObject.geometry.dispose()
        this.coneObject.geometry = new THREE.ConeGeometry(
            value,
            this.coneGUIControls.height,
            this.coneGUIControls.radialSegments
        );
    }

    setConeHeight(value) {
        this.coneObject.geometry.dispose()
        this.coneObject.geometry = new THREE.ConeGeometry(
            this.coneGUIControls.radius,
            value,
            this.coneGUIControls.radialSegments
        );
    }

    setConeRadialSegments(value) {
        this.coneObject.geometry.dispose()
        this.coneObject.geometry = new THREE.ConeGeometry(
            this.coneGUIControls.radius,
            this.coneGUIControls.height,
            value
        );
    }

    // Torus
    createTorusGUI(gui) {
        this.torusGUIControls = {
            radius: 0.125,
            tube: 0.05,
            radialSegments: 12,
            tubularSegments: 48
        }

        const torusFolder = gui.addFolder(All3DFigures.TORUS_TITLE);

        torusFolder.add(this.torusGUIControls, 'radius', 0.1, 0.25)
            .name('Radius: ')
            .onChange((value) => this.setTorusRadius(value));
        torusFolder.add(this.torusGUIControls, 'tube', 0.02, 0.2)
            .name('Tube: ')
            .onChange((value) => this.setTorusTube(value));
        torusFolder.add(this.torusGUIControls, 'radialSegments', 3, 64, 1)
            .name('Radial segments: ')
            .onChange((value) => this.setTorusRadialSegments(value));
        torusFolder.add(this.torusGUIControls, 'tubularSegments', 3, 128, 1)
            .name('Tubular segments: ')
            .onChange((value) => this.setTorusTubularSegments(value));
    }

    createTorus(position) {
        console.log("Creating torus...");

        this.torusObject = new THREE.Mesh(
            new THREE.TorusGeometry(
                this.torusGUIControls.radius,
                this.torusGUIControls.tube,
                this.torusGUIControls.radialSegments,
                this.torusGUIControls.tubularSegments
            ),
            this.material
        )
        this.torus = new THREE.Object3D()
        this.torus.add(this.torusObject)

        this.torus.position.set(...All3DFigures.POSITIONS[position])

        this.add(this.torus)
    }

    setTorusRadius(value) {
        this.torusObject.geometry.dispose()
        this.torusObject.geometry = new THREE.TorusGeometry(
            value,
            this.torusGUIControls.tube,
            this.torusGUIControls.radialSegments,
            this.torusGUIControls.tubularSegments
        );
    }

    setTorusTube(value) {
        this.torusObject.geometry.dispose()
        this.torusObject.geometry = new THREE.TorusGeometry(
            this.torusGUIControls.radius,
            value,
            this.torusGUIControls.radialSegments,
            this.torusGUIControls.tubularSegments
        );
    }

    setTorusRadialSegments(value) {
        this.torusObject.geometry.dispose()
        this.torusObject.geometry = new THREE.TorusGeometry(
            this.torusGUIControls.radius,
            this.torusGUIControls.tube,
            value,
            this.torusGUIControls.tubularSegments
        );
    }

    setTorusTubularSegments(value) {
        this.torusObject.geometry.dispose()
        this.torusObject.geometry = new THREE.TorusGeometry(
            this.torusGUIControls.radius,
            this.torusGUIControls.tube,
            this.torusGUIControls.radialSegments,
            value
        );
    }

    // Tetrahedron
    createTetrahedronGUI(gui) {
        this.tetrahedronGUIControls = {
            radius: 0.125,
            detail: 0
        }

        const tetrahedronFolder = gui.addFolder(All3DFigures.TETRAHEDRON_TITLE);

        tetrahedronFolder.add(this.tetrahedronGUIControls, 'radius', 0.1, 0.25)
            .name('Radius: ')
            .onChange((value) => this.setTetrahedronRadius(value));
        tetrahedronFolder.add(this.tetrahedronGUIControls, 'detail', 0, 5, 1)
            .name('Detail: ')
            .onChange((value) => this.setTetrahedronDetail(value));
    }

    createTetrahedron(position) {
        console.log("Creating tetrahedron...");

        this.tetrahedronObject = new THREE.Mesh(
            new THREE.TetrahedronGeometry(
                this.tetrahedronGUIControls.radius,
                this.tetrahedronGUIControls.detail
            ),
            this.material
        )
        this.tetrahedron = new THREE.Object3D()
        this.tetrahedron.add(this.tetrahedronObject)

        this.tetrahedron.position.set(...All3DFigures.POSITIONS[position])

        this.add(this.tetrahedron)
    }

    setTetrahedronRadius(value) {
        this.tetrahedronObject.geometry.dispose()
        this.tetrahedronObject.geometry = new THREE.TetrahedronGeometry(
            value,
            this.tetrahedronGUIControls.detail
        );
    }

    setTetrahedronDetail(value) {
        this.tetrahedronObject.geometry.dispose()
        this.tetrahedronObject.geometry = new THREE.TetrahedronGeometry(
            this.tetrahedronGUIControls.radius,
            value
        );
    }

    // Octahedron
    createOctahedronGUI(gui) {
        this.octahedronGUIControls = {
            radius: 0.125,
            detail: 0
        }

        const octahedronFolder = gui.addFolder(All3DFigures.OCTAHEDRON_TITLE);

        octahedronFolder.add(this.octahedronGUIControls, 'radius', 0.1, 0.25)
            .name('Radius: ')
            .onChange((value) => this.setOctahedronRadius(value));
        octahedronFolder.add(this.octahedronGUIControls, 'detail', 0, 5, 1)
            .name('Detail: ')
            .onChange((value) => this.setOctahedronDetail(value));
    }

    createOctahedron(position) {
        console.log("Creating octahedron...");

        this.octahedronObject = new THREE.Mesh(
            new THREE.OctahedronGeometry(
                this.octahedronGUIControls.radius,
                this.octahedronGUIControls.detail
            ),
            this.material
        )
        this.octahedron = new THREE.Object3D()
        this.octahedron.add(this.octahedronObject)

        this.octahedron.position.set(...All3DFigures.POSITIONS[position])

        this.add(this.octahedron)
    }

    setOctahedronRadius(value) {
        this.octahedronObject.geometry.dispose()
        this.octahedronObject.geometry = new THREE.OctahedronGeometry(
            value,
            this.octahedronGUIControls.detail
        );
    }

    setOctahedronDetail(value) {
        this.octahedronObject.geometry.dispose()
        this.octahedronObject.geometry = new THREE.OctahedronGeometry(
            this.octahedronGUIControls.radius,
            value
        );
    }

    // Dodecahedron
    createDodecahedronGUI(gui) {
        this.dodecahedronGUIControls = {
            radius: 0.125,
            detail: 0
        }

        const dodecahedronFolder = gui.addFolder(All3DFigures.DODECAHEDRON_TITLE);

        dodecahedronFolder.add(this.dodecahedronGUIControls, 'radius', 0.1, 0.25)
            .name('Radius: ')
            .onChange((value) => this.setDodecahedronRadius(value));
        dodecahedronFolder.add(this.dodecahedronGUIControls, 'detail', 0, 5, 1)
            .name('Detail: ')
            .onChange((value) => this.setDodecahedronDetail(value));
    }

    createDodecahedron(position) {
        console.log("Creating dodecahedron...");

        this.dodecahedronObject = new THREE.Mesh(
            new THREE.DodecahedronGeometry(
                this.dodecahedronGUIControls.radius,
                this.dodecahedronGUIControls.detail
            ),
            this.material
        )
        this.dodecahedron = new THREE.Object3D()
        this.dodecahedron.add(this.dodecahedronObject)

        this.dodecahedron.position.set(...All3DFigures.POSITIONS[position])

        this.add(this.dodecahedron)
    }

    setDodecahedronRadius(value) {
        this.dodecahedronObject.geometry.dispose()
        this.dodecahedronObject.geometry = new THREE.DodecahedronGeometry(
            value,
            this.dodecahedronGUIControls.detail
        );
    }

    setDodecahedronDetail(value) {
        this.dodecahedronObject.geometry.dispose()
        this.dodecahedronObject.geometry = new THREE.DodecahedronGeometry(
            this.dodecahedronGUIControls.radius,
            value
        );
    }

    // Icosahedron
    createIcosahedronGUI(gui) {
        this.icosahedronGUIControls = {
            radius: 0.125,
            detail: 0
        }

        const icosahedronFolder = gui.addFolder(All3DFigures.ICOSAHEDRON_TITLE);

        icosahedronFolder.add(this.icosahedronGUIControls, 'radius', 0.1, 0.25)
            .name('Radius: ')
            .onChange((value) => this.setIcosahedronRadius(value));
        icosahedronFolder.add(this.icosahedronGUIControls, 'detail', 0, 5, 1)
            .name('Detail: ')
            .onChange((value) => this.setIcosahedronDetail(value));
    }

    createIcosahedron(position) {
        console.log("Creating icosahedron...");

        this.icosahedronObject = new THREE.Mesh(
            new THREE.IcosahedronGeometry(
                this.icosahedronGUIControls.radius,
                this.icosahedronGUIControls.detail
            ),
            this.material
        )
        this.icosahedron = new THREE.Object3D()
        this.icosahedron.add(this.icosahedronObject)

        this.icosahedron.position.set(...All3DFigures.POSITIONS[position])

        this.add(this.icosahedron)
    }

    setIcosahedronRadius(value) {
        this.icosahedronObject.geometry.dispose()
        this.icosahedronObject.geometry = new THREE.IcosahedronGeometry(
            value,
            this.icosahedronGUIControls.detail
        );
    }

    setIcosahedronDetail(value) {
        this.icosahedronObject.geometry.dispose()
        this.icosahedronObject.geometry = new THREE.IcosahedronGeometry(
            this.icosahedronGUIControls.radius,
            value
        );
    }

    update() {
        const delta = this.clock.getDelta();
        const angle = All3DFigures.SPIN_SPEED * delta;

        this.box.rotation.y += angle;
        this.sphere.rotation.y += angle;
        this.cilinder.rotation.y += angle;
        this.cone.rotation.y += angle;
        this.torus.rotation.y += angle;
        this.tetrahedron.rotation.y += angle;
        this.octahedron.rotation.y += angle;
        this.dodecahedron.rotation.y += angle;
        this.icosahedron.rotation.y += angle;
    }
}

export { All3DFigures }
