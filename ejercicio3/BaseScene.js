import * as THREE from 'three';
import { GUI } from 'gui';
import { TrackballControls } from 'trackball';

// Import custom classes
import { RevolutionFigures } from './RevolutionFigures.js';

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
    static LIGHT_POWER = 50.0;
    static LIGHT_POWER_MIN = 0.0;
    static LIGHT_POWER_MAX = 1000.0;
    static AMBIENT_INTENSITY = 0.5;
    static AMBIENT_INTENSITY_MIN = 0.0;
    static AMBIENT_INTENSITY_MAX = 1.0;
    static BASIC_GUI_FOLDER = 'Lights and Axes';

    // Lights
    ambientLight;
    pointLight;
    static POINT_LIGHT_POSITION = [2, 3, 1];

    // Camera
    camera;
    cameraControls;
    static CAMERA_ANGLE = 45;
    static CAMERA_ASPECT = window.innerWidth / window.innerHeight;
    static CAMERA_NEAR = 0.01;
    static CAMERA_FAR = 10;
    static CAMERA_POSITION = [0, 0.4, 1.4];
    static CAMERA_LOOK_AT = [0, 0.2, 0];
    static CAMERA_ROTATION_SPEED = 5.0;
    static CAMERA_ZOOM_SPEED = -2.0;
    static CAMERA_PAN_SPEED = 0.5;

    // Ground
    ground;
    static GROUND_GEOMETRY = [0.5, 0.02, 0.5];
    static GROUND_TEXTURE = '../imgs/wood.jpg';
    static GROUND_POSITION = [0, -0.01, 0];

    // Axes
    axis;
    static AXIS_SIZE = 1;

    // Models
    model;

    constructor(myCanvas) {
        super();

        this.renderer = this.createRenderer(myCanvas);
        this.gui = this.createGUI();

        this.createLights();
        this.createCamera();
        this.createCameraControls();
        // this.createGround();
        this.createAxes();

        // Create and add models
        console.log("Adding models...");
        this.model = new RevolutionFigures(this.gui);
        this.add(this.model);
    }

    createRenderer(myCanvas) {
        var renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(BaseScene.RENDERER_CLEAR_COLOR), BaseScene.RENDERER_CLEAR_ALPHA);
        renderer.setSize(BaseScene.RENDERER_WIDTH, BaseScene.RENDERER_HEIGHT);

        $(myCanvas).append(renderer.domElement);

        return renderer;
    }

    createGUI() {
        var gui = new GUI();

        this.guiControls = {
            ambientIntensity: BaseScene.AMBIENT_INTENSITY,
            lightPower: BaseScene.LIGHT_POWER,
            axisOnOff: true
        };

        var basicFolder = gui.addFolder(BaseScene.BASIC_GUI_FOLDER);

        basicFolder.add(this.guiControls, 'lightPower', BaseScene.LIGHT_POWER_MIN, BaseScene.LIGHT_POWER_MAX, 20)
            .name('Point Light: ')
            .onChange((value) => this.setLightPower(value));

        basicFolder.add(this.guiControls, 'ambientIntensity', BaseScene.AMBIENT_INTENSITY_MIN, BaseScene.AMBIENT_INTENSITY_MAX, 0.05)
            .name('Ambient Light: ')
            .onChange((value) => this.setAmbientIntensity(value));

        basicFolder.add(this.guiControls, 'axisOnOff')
            .name('Show Axes: ')
            .onChange((value) => this.setAxisVisible(value));

        return gui;
    }

    createLights() {
        console.log("Creating lights...");

        this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
        this.add(this.ambientLight);

        this.pointLight = new THREE.SpotLight('white');
        this.pointLight.power = this.guiControls.lightPower;
        this.pointLight.position.set(...BaseScene.POINT_LIGHT_POSITION);
        this.add(this.pointLight);
    }

    setLightPower(value) {
        this.pointLight.power = value;
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

        // Change this if you want to change the camera's target point (pass as parameter?)
        this.camera.lookAt(...BaseScene.CAMERA_LOOK_AT);

        this.add(this.camera);
    }

    getCamera() {
        // If more than one camera is used, this method should be overridden
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

        // Change this if you want to change the camera's target point (pass as parameter?)
        this.cameraControls.target = new THREE.Vector3(...BaseScene.CAMERA_LOOK_AT);
    }

    createGround() {
        console.log("Creating ground...");

        const geometry = new THREE.BoxGeometry(...BaseScene.GROUND_GEOMETRY);
        const texture = new THREE.TextureLoader().load(BaseScene.GROUND_TEXTURE);
        const material = new THREE.MeshStandardMaterial({ map: texture });

        this.ground = new THREE.Mesh(geometry, material);
        this.ground.position.set(...BaseScene.GROUND_POSITION);
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

        // Call update on models if they have one
        this.model.update();

        requestAnimationFrame(() => this.update());
    }
}

// Main function to initialize the scene
$(function () {
    var myScene = new BaseScene("#WebGL-output");

    window.addEventListener("resize", () => myScene.onWindowResize());

    myScene.update();
});
