import * as THREE from 'three';
import { GUI } from 'gui';
import { TrackballControls } from 'trackball';

// Import custom classes
import { Car } from './Car.js';
import { Lamppost } from './Lamppost.js';

class BaseScene extends THREE.Scene {
    // Renderer
    renderer;
    static RENDERER_CLEAR_COLOR = 0xEEEEEE;
    static RENDERER_CLEAR_ALPHA = 1.0;
    static RENDERER_WIDTH = window.innerWidth;
    static RENDERER_HEIGHT = window.innerHeight;

    // GUI
    gui;
    guiControls;
    static AMBIENT_INTENSITY = 0.1;
    static AMBIENT_INTENSITY_MIN = 0.0;
    static AMBIENT_INTENSITY_MAX = 1.0;
    static BASIC_GUI_FOLDER = 'Lights and Axes';

    // Lights
    ambientLight;
    sun;
    static SUN_INTENSITY = 1.5;
    static SUN_POSITION = [-0.5, 0.4, 0.5];
    static SUN_SHADOW_EXTENT = 0.4;

    // Camera
    camera;
    cameraControls;
    static CAMERA_ANGLE = 45;
    static CAMERA_ASPECT = window.innerWidth / window.innerHeight;
    static CAMERA_NEAR = 0.01;
    static CAMERA_FAR = 10;
    static CAMERA_POSITION = [0.8, 0.7, 0.8];
    static CAMERA_LOOK_AT = [0, 0.1, 0];
    static CAMERA_ROTATION_SPEED = 5.0;
    static CAMERA_ZOOM_SPEED = -2.0;
    static CAMERA_PAN_SPEED = 0.5;

    // Ground
    ground;
    static GROUND_GEOMETRY = [1, 0.02, 1];
    static GROUND_TEXTURE = '../imgs/wood.jpg';
    static GROUND_POSITION = [0, -0.01, 0];

    // Axes
    axis;
    static AXIS_SIZE = 0.1;

    // Models
    car;
    lamppost;

    constructor(myCanvas) {
        super();

        this.renderer = this.createRenderer(myCanvas);
        this.gui = this.createGUI();

        this.createLights();
        this.createCamera();
        this.createCameraControls();
        this.createGround();
        this.createAxes();

        // Create and add models
        console.log("Adding models...");
        this.car = new Car(this.gui);
        this.lamppost = new Lamppost(this.gui);
        this.add(this.car);
        this.add(this.lamppost);
    }

    createRenderer(myCanvas) {
        var renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(BaseScene.RENDERER_CLEAR_COLOR), BaseScene.RENDERER_CLEAR_ALPHA);
        renderer.setSize(BaseScene.RENDERER_WIDTH, BaseScene.RENDERER_HEIGHT);

        // Shadows
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        $(myCanvas).append(renderer.domElement);

        return renderer;
    }

    createGUI() {
        var gui = new GUI();

        this.guiControls = {
            sunIntensity: BaseScene.SUN_INTENSITY,
            ambientIntensity: BaseScene.AMBIENT_INTENSITY,
            axisOnOff: true
        };

        var basicFolder = gui.addFolder(BaseScene.BASIC_GUI_FOLDER);

        basicFolder.add(this.guiControls, 'sunIntensity', 0, 4, 0.05)
            .name('Sun: ')
            .onChange((value) => this.setSunIntensity(value));

        basicFolder.add(this.guiControls, 'ambientIntensity', BaseScene.AMBIENT_INTENSITY_MIN, BaseScene.AMBIENT_INTENSITY_MAX, 0.05)
            .name('Ambient Light: ')
            .onChange((value) => this.setAmbientIntensity(value));

        basicFolder.add(this.guiControls, 'axisOnOff')
            .name('Show Axes: ')
            .onChange((value) => this.setAxisVisible(value));

        return gui;
    }

    setSunIntensity(value) {
        this.sun.intensity = value;
    }

    createLights() {
        console.log("Creating lights...");

        // Ambient fill
        this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
        this.add(this.ambientLight);

        // Sun
        this.sun = new THREE.DirectionalLight('white', BaseScene.SUN_INTENSITY);
        this.sun.position.set(...BaseScene.SUN_POSITION);
        this.sun.castShadow = true;
        
        // Sun shadows config
        const extent = BaseScene.SUN_SHADOW_EXTENT;
        this.sun.shadow.camera.left = -extent;
        this.sun.shadow.camera.right = extent;
        this.sun.shadow.camera.top = extent;
        this.sun.shadow.camera.bottom = -extent;
        this.sun.shadow.camera.near = 0.01;
        this.sun.shadow.camera.far = 2;
        this.sun.shadow.mapSize.set(1024, 1024);
        this.sun.shadow.bias = -0.0005;

        this.add(this.sun);
    }

    setAmbientIntensity(value) {
        this.ambientLight.intensity = value;
    }

    createCamera() {
        console.log("Creating camera...");

        this.camera = new THREE.PerspectiveCamera(
            BaseScene.CAMERA_ANGLE,
            BaseScene.CAMERA_ASPECT,
            BaseScene.CAMERA_NEAR,
            BaseScene.CAMERA_FAR
        );
        this.camera.position.set(...BaseScene.CAMERA_POSITION);

        this.camera.lookAt(...BaseScene.CAMERA_LOOK_AT);

        this.add(this.camera);
    }

    getCamera() {
        return this.camera;
    }

    setCameraAspect(aspect) {
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
    }

    createCameraControls() {
        console.log("Creating camera controls...");

        this.cameraControls = new TrackballControls(this.camera, this.renderer.domElement);

        this.cameraControls.rotateSpeed = BaseScene.CAMERA_ROTATION_SPEED;
        this.cameraControls.zoomSpeed = BaseScene.CAMERA_ZOOM_SPEED;
        this.cameraControls.panSpeed = BaseScene.CAMERA_PAN_SPEED;

        this.cameraControls.target = new THREE.Vector3(...BaseScene.CAMERA_LOOK_AT);
    }

    createGround() {
        console.log("Creating ground...");

        const geometry = new THREE.BoxGeometry(...BaseScene.GROUND_GEOMETRY);
        const texture = new THREE.TextureLoader().load(BaseScene.GROUND_TEXTURE);
        const material = new THREE.MeshStandardMaterial({ map: texture });

        this.ground = new THREE.Mesh(geometry, material);
        this.ground.position.set(...BaseScene.GROUND_POSITION);
        this.ground.receiveShadow = true;
        this.add(this.ground);
    }

    createAxes() {
        console.log("Creating axes...");

        this.axis = new THREE.AxesHelper(BaseScene.AXIS_SIZE);
        this.add(this.axis);
    }

    setAxisVisible(value) {
        this.axis.visible = value;
    }

    onWindowResize() {
        this.setCameraAspect(BaseScene.CAMERA_ASPECT);
        this.renderer.setSize(BaseScene.RENDERER_WIDTH, BaseScene.RENDERER_HEIGHT);
    }

    update() {
        this.renderer.render(this, this.getCamera());

        this.cameraControls.update();

        // Call update on models
        this.car.update();
        this.lamppost.update();

        requestAnimationFrame(() => this.update());
    }
}

// Main function to initialize the scene
$(function () {
    var myScene = new BaseScene("#WebGL-output");

    window.addEventListener("resize", () => myScene.onWindowResize());

    myScene.update();
});
