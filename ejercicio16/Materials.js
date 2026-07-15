import * as THREE from 'three';

class Materials extends THREE.Object3D {
    // Textures
    static IMG_PATH = '../imgs/';
    static DIFFUSE = 'ladrillo-difuso.png';
    static BUMP = 'ladrillo-bump.png';
    static CHESS = 'textura-ajedrezada.jpg';
    static MARBLE = 'marmol-blanco.jpg';
    static VIDEO = 'texturaVideo.mp4';
    static GOLD = 0xD4AF37;
    static BUMP_SCALE = 10;
    textures;

    // Geometry
    static BOX_SIZE = 0.3;
    static SPHERE_RADIUS = 0.16;
    static VIDEO_SIZE = [0.42, 0.3];
    static BOX_XS = [-0.9, -0.3, 0.3, 0.9];
    static SPHERE_XS = [-0.9, -0.45, 0.45, 0.9];
    static BOX_Y = -0.05;
    static SPHERE_Y = 0.55;
    boxes;
    spheres;

    // GUI
    guiControls;

    constructor(gui) {
        super();

        this.loadTextures();

        this.createBoxes();
        this.boxes.forEach((box) => this.add(box));

        this.createSpheres();
        this.spheres.forEach((sphere) => this.add(sphere));

        this.createVideoPlane();

        this.createGUI(gui);
    }

    loadTextures() {
        const loader = new THREE.TextureLoader();
        const load = (file) => loader.load(Materials.IMG_PATH + file);

        this.tex = {
            diffuse: load(Materials.DIFFUSE),
            bump: load(Materials.BUMP),
            chess: load(Materials.CHESS),
            marble: load(Materials.MARBLE)
        };

        // Color maps are sRGB
        if (THREE.SRGBColorSpace) {
            this.tex.diffuse.colorSpace = THREE.SRGBColorSpace;
            this.tex.marble.colorSpace = THREE.SRGBColorSpace;
        }
    }

    createBoxes() {
        const geometry = new THREE.BoxGeometry(Materials.BOX_SIZE, Materials.BOX_SIZE, Materials.BOX_SIZE);

        const materials = [
            // 1. Difusse
            new THREE.MeshStandardMaterial({ map: this.tex.diffuse }),

            // 2. Difusse + topography
            new THREE.MeshStandardMaterial({
                map: this.tex.diffuse,
                bumpMap: this.tex.bump,
                bumpScale: Materials.BUMP_SCALE
            }),

            // 3. Difusse + alpha channel substraction
            new THREE.MeshStandardMaterial({
                map: this.tex.diffuse,
                alphaMap: this.tex.chess,
                transparent: true,
                alphaTest: 0.5,
                side: THREE.DoubleSide
            }),

            // 4. Everyhing
            new THREE.MeshStandardMaterial({
                map: this.tex.diffuse,
                bumpMap: this.tex.bump,
                bumpScale: Materials.BUMP_SCALE,
                alphaMap: this.tex.chess,
                transparent: true,
                alphaTest: 0.5,
                side: THREE.DoubleSide
            })
        ];

        this.boxes = [];
        materials.forEach((material, i) => {
            const box = new THREE.Mesh(geometry, material);
            box.position.set(Materials.BOX_XS[i], Materials.BOX_Y, 0);
            this.boxes.push(box);
        });
    }

    createSpheres() {
        const geometry = new THREE.SphereGeometry(Materials.SPHERE_RADIUS, 32, 32);

        const materials = [
            // 1. Gold with brightness
            new THREE.MeshStandardMaterial({ color: Materials.GOLD, roughness: 0.1, metalness: 0.0 }),

            // 2. Gold mate
            new THREE.MeshStandardMaterial({ color: Materials.GOLD, roughness: 1.0, metalness: 0.0 }),

            // 3. Marble with brightness
            new THREE.MeshStandardMaterial({ map: this.tex.marble, roughness: 0.15 }),

            // 4. Marble combined with gold
            new THREE.MeshStandardMaterial({ map: this.tex.marble, color: Materials.GOLD, roughness: 0.15 })
        ];
        
        this.spheres = [];
        materials.forEach((material, i) => {
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(Materials.SPHERE_XS[i], Materials.SPHERE_Y, 0);
            this.spheres.push(sphere);
        });
    }

    createVideoPlane() {
        const video = document.createElement('video');
        video.src = Materials.IMG_PATH + Materials.VIDEO;
        video.loop = true;
        video.muted = true; // required for autoplay
        video.playsInline = true;
        video.play().catch((e) => console.warn('Video autoplay blocked:', e));

        const videoTexture = new THREE.VideoTexture(video);
        if (THREE.SRGBColorSpace) {
            videoTexture.colorSpace = THREE.SRGBColorSpace;
        }

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(...Materials.VIDEO_SIZE),
            new THREE.MeshBasicMaterial({ map: videoTexture }) // Unlit
        );
        plane.position.set(0, Materials.SPHERE_Y, 0);
        this.add(plane);
    }

    createGUI(gui) {
        this.guiControls = {
            rotateBoxes: true
        };

        const folder = gui.addFolder('Materials');
        folder.add(this.guiControls, 'rotateBoxes')
            .name('Rotate: ');
    }

    update() {
        if (this.guiControls.rotateBoxes) {
            for (const box of this.boxes) {
                box.rotation.y += 0.01;
            }
            for (const sphere of this.spheres) {
                sphere.rotation.y += 0.01;
            }
        }
    }
}

export { Materials }
