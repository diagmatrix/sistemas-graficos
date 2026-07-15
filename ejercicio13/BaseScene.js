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

    // GUI
    gui;
    guiControls;
    static AMBIENT_INTENSITY = 0.4;
    static AMBIENT_INTENSITY_MIN = 0.0;
    static AMBIENT_INTENSITY_MAX = 1.0;
    static BASIC_GUI_FOLDER = 'Lights and Axes';

    // Lights
    ambientLight;

    // Cameras
    static CAMERA_NEAR = 0.01;
    static CAMERA_FAR = 20;
    // Perspective (top-left)
    static PERSPECTIVE_POSITION = [0.6, 0.5, 0.8];
    static PERSPECTIVE_LOOK_AT = [0, 0, 0];
    static CAMERA_ROTATION_SPEED = 5.0;
    static CAMERA_ZOOM_SPEED = -2.0;
    static CAMERA_PAN_SPEED = 0.5;
    perspectiveCamera;
    cameraControls;
    // Orthographic (right side)
    topCamera;
    isoCamera;
    static ORTHO_VIEW_SIZE = 4;
    static TOP_POSITION = [0, 8, 0];
    static ISO_POSITION = [5, 5, 5];

    // Viewports
    viewports;

    // Ground
    ground;
    static GROUND_GEOMETRY = [3.5, 0.02, 3.5];
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
        this.createCameras();
        this.createCameraControls();
        this.createGround();
        this.createAxes();

        this.createKeyIndicator();
        this.registerKeyEvents();

        // Create and add models
        console.log("Adding models...");
        this.model = new Car(this.gui, BaseScene.GROUND_GEOMETRY);
        this.add(this.model);

        // Viewports
        this.viewports = [
            { camera: this.perspectiveCamera,        rect: [0.0, 0.5, 0.5, 0.5] },  // top-left
            { camera: this.topCamera,                rect: [0.5, 0.5, 0.5, 0.5] },  // top-right (plan)
            { camera: this.model.getDriverCamera(),  rect: [0.0, 0.0, 0.5, 0.5] },  // bottom-left (driver)
            { camera: this.isoCamera,                rect: [0.5, 0.0, 0.5, 0.5] }   // bottom-right (iso)
        ];
    }

    createRenderer(myCanvas) {
        var renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(BaseScene.RENDERER_CLEAR_COLOR), BaseScene.RENDERER_CLEAR_ALPHA);
        renderer.setSize(window.innerWidth, window.innerHeight);

        $(myCanvas).append(renderer.domElement);

        return renderer;
    }

    createGUI() {
        var gui = new GUI();

        this.guiControls = {
            ambientIntensity: BaseScene.AMBIENT_INTENSITY,
            axisOnOff: true
        };

        var basicFolder = gui.addFolder(BaseScene.BASIC_GUI_FOLDER);

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
    }

    setAmbientIntensity(value) {
        this.ambientLight.intensity = value;
    }

    createCameras() {
        // Top-left
        console.log("Creating perspective camera...");
        this.perspectiveCamera = new THREE.PerspectiveCamera(45, 1, BaseScene.CAMERA_NEAR, BaseScene.CAMERA_FAR);
        this.perspectiveCamera.position.set(...BaseScene.PERSPECTIVE_POSITION);
        this.perspectiveCamera.lookAt(...BaseScene.PERSPECTIVE_LOOK_AT);

        // Top-right
        console.log("Creating top orthographic camera...");
        this.topCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, BaseScene.CAMERA_NEAR, BaseScene.CAMERA_FAR);
        this.topCamera.position.set(...BaseScene.TOP_POSITION);
        this.topCamera.up.set(0, 0, -1);
        this.topCamera.lookAt(0, 0, 0);

        // Bottom-right
        console.log("Creating isometric orthographic camera...");
        this.isoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, BaseScene.CAMERA_NEAR, BaseScene.CAMERA_FAR);
        this.isoCamera.position.set(...BaseScene.ISO_POSITION);
        this.isoCamera.up.set(0, 1, 0);
        this.isoCamera.lookAt(0, 0, 0);
    }

    createCameraControls() {
        console.log("Creating camera controls...");

        this.cameraControls = new TrackballControls(this.perspectiveCamera, this.renderer.domElement);

        this.cameraControls.rotateSpeed = BaseScene.CAMERA_ROTATION_SPEED;
        this.cameraControls.zoomSpeed = BaseScene.CAMERA_ZOOM_SPEED;
        this.cameraControls.panSpeed = BaseScene.CAMERA_PAN_SPEED;

        this.cameraControls.target = new THREE.Vector3(...BaseScene.PERSPECTIVE_LOOK_AT);
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

        this.keyElements = {};
        this.keyIndicator.find('.key').each((_, el) => {
            this.keyElements[$(el).data('key')] = $(el);
        });
    }

    setKeyActive(key, active) {
        const el = this.keyElements[key];
        if (!el) return;
        el.css({
            background: active ? '#2277CC' : 'rgba(255,255,255,0.85)',
            color: active ? '#fff' : '#555',
            'border-color': active ? '#2277CC' : '#999'
        });
    }

    updateCameraProjection(camera, viewportWidth, viewportHeight) {
        const aspect = viewportWidth / viewportHeight;

        if (camera.isPerspectiveCamera) {
            camera.aspect = aspect;
        } else {
            const half = BaseScene.ORTHO_VIEW_SIZE / 2;
            camera.left = -half * aspect;
            camera.right = half * aspect;
            camera.top = half;
            camera.bottom = -half;
        }
        camera.updateProjectionMatrix();
    }

    renderViewports() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        for (const vp of this.viewports) {
            const x = Math.floor(vp.rect[0] * w);
            const y = Math.floor(vp.rect[1] * h);
            const vw = Math.floor(vp.rect[2] * w);
            const vh = Math.floor(vp.rect[3] * h);

            this.renderer.setViewport(x, y, vw, vh);
            this.renderer.setScissor(x, y, vw, vh);
            this.renderer.setScissorTest(true);   // clear/draw only inside this rect

            this.updateCameraProjection(vp.camera, vw, vh);
            this.renderer.render(this, vp.camera);
        }
    }

    onWindowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update() {
        this.cameraControls.update();

        // Drive the car with the currently pressed keys
        this.model.update(this.pressedKeys);

        // Update the cameras
        this.renderViewports();

        requestAnimationFrame(() => this.update());
    }
}

// Main function to initialize the scene
$(function () {
    var myScene = new BaseScene("#WebGL-output");

    window.addEventListener("resize", () => myScene.onWindowResize());

    myScene.update();
});
