import * as THREE from 'three';
import { GUI } from 'gui';
import { TrackballControls } from 'trackball';

// Import custom classes
import { Car } from './Car.js';

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
    static LIGHT_POWER = 60.0;
    static LIGHT_POWER_MIN = 0.0;
    static LIGHT_POWER_MAX = 1000.0;
    static AMBIENT_INTENSITY = 0.6;
    static AMBIENT_INTENSITY_MIN = 0.0;
    static AMBIENT_INTENSITY_MAX = 1.0;
    static BASIC_GUI_FOLDER = 'Lights and Axes';

    // Lights
    ambientLight;
    pointLight;
    static POINT_LIGHT_POSITION = [1, 2, 1];

    // Camera
    camera;
    cameraControls;
    static CAMERA_ANGLE = 45;
    static CAMERA_ASPECT = window.innerWidth / window.innerHeight;
    static CAMERA_NEAR = 0.01;
    static CAMERA_FAR = 20;
    static CAMERA_POSITION = [0.6, 0.5, 0.8];
    static CAMERA_LOOK_AT = [0, 0, 0];
    static CAMERA_ROTATION_SPEED = 5.0;
    static CAMERA_ZOOM_SPEED = -2.0;
    static CAMERA_PAN_SPEED = 0.5;

    // Ground
    ground;
    static GROUND_GEOMETRY = [3, 0.02, 3];
    static GROUND_TEXTURE = '../imgs/wood.jpg';
    static GROUND_POSITION = [0, -0.01, 0];

    // Axes
    axis;
    static AXIS_SIZE = 0.3;

    // Models
    model;

    // Keyboard
    static ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    pressedKeys;
    keyIndicator;
    keyElements;

    constructor(myCanvas) {
        super();

        this.renderer = this.createRenderer(myCanvas);
        this.gui = this.createGUI();

        this.createLights();
        this.createCamera();
        this.createCameraControls();
        this.createGround();
        this.createAxes();

        this.createKeyIndicator();
        this.registerKeyEvents();

        // Create and add models
        console.log("Adding models...");
        this.model = new Car(this.gui);
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
        this.pointLight.angle = Math.PI / 3;
        this.pointLight.penumbra = 0.7;
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

    registerKeyEvents() {
        this.pressedKeys = new Set();

        window.addEventListener('keydown', (event) => {
            if (BaseScene.ARROW_KEYS.includes(event.key)) {
                event.preventDefault();   // stop the arrows scrolling the page
                this.pressedKeys.add(event.key);
                this.setKeyActive(event.key, true);
            }
        });

        window.addEventListener('keyup', (event) => {
            if (BaseScene.ARROW_KEYS.includes(event.key)) {
                this.pressedKeys.delete(event.key);
                this.setKeyActive(event.key, false);
            }
        });
    }

    createKeyIndicator() {
        this.keyIndicator = $(`
            <div class="key-indicator">
                <div class="key-row">
                    <div class="key" data-key="ArrowUp">&#9650;</div>
                </div>
                <div class="key-row">
                    <div class="key" data-key="ArrowLeft">&#9664;</div>
                    <div class="key" data-key="ArrowDown">&#9660;</div>
                    <div class="key" data-key="ArrowRight">&#9654;</div>
                </div>
            </div>
        `);

        this.keyIndicator.css({
            position: 'fixed', bottom: '20px', left: '50%',
            transform: 'translateX(-50%)', 'text-align': 'center',
            'z-index': '1000', 'user-select': 'none'
        });
        this.keyIndicator.find('.key-row').css({
            display: 'flex', 'justify-content': 'center', gap: '6px', margin: '3px 0'
        });
        this.keyIndicator.find('.key').css({
            width: '38px', height: '38px', 'line-height': '38px',
            'font-size': '18px', color: '#555',
            background: 'rgba(255,255,255,0.85)', border: '2px solid #999',
            'border-radius': '6px', 'font-family': 'sans-serif'
        });

        $('body').append(this.keyIndicator);

        // Map key -> element to highlight
        this.keyElements = {};
        this.keyIndicator.find('.key').each((_, el) => {
            this.keyElements[$(el).data('key')] = $(el);
        });
    }

    setKeyActive(key, active) {
        const el = this.keyElements[key];
        if (!el) {
            return;
        }

        el.css({
            background: active ? '#2277CC' : 'rgba(255,255,255,0.85)',
            color: active ? '#fff' : '#555',
            'border-color': active ? '#2277CC' : '#999'
        });
    }

    onWindowResize() {
        this.setCameraAspect(BaseScene.CAMERA_ASPECT);
        this.renderer.setSize(BaseScene.RENDERER_WIDTH, BaseScene.RENDERER_HEIGHT);
    }

    update() {
        this.renderer.render(this, this.getCamera());

        this.cameraControls.update();

        // Call update on models if they have one
        this.model.update(this.pressedKeys);

        requestAnimationFrame(() => this.update());
    }
}

// Main function to initialize the scene
$(function () {
    var myScene = new BaseScene("#WebGL-output");

    window.addEventListener("resize", () => myScene.onWindowResize());

    myScene.update();
});
