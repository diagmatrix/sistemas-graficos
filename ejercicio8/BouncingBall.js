import * as THREE from 'three';
import * as TWEEN from 'tween';

class BouncingBall extends THREE.Object3D {
    // GUI
    static GUI_TITLE = 'Pelota botando';
    guiControls;

    // BALL
    static BALL_RADIUS = 0.05;
    static BALL_SEGMENTS = 32;
    static BALL_MATERIAL = new THREE.MeshStandardMaterial({ color: 'green' });
    ballPivot;
    ballMesh;
    
    // Squash and stretch, same volume always (sx = sz = 1/sqrt(sy))
    static SQUASH_SY = 0.55;
    static STRETCH_SY = 1.20;
    static TOP_CENTER_Y = 0.45; // Max bounce height

    // Scene durations
    static T_FALL = 750;
    static T_SQUASH = 90;
    static T_STRETCH = 90;
    static T_RISE = 750;

    // Animation
    state;
    animTime = 0;
    lastTime = null;

    constructor(gui) {
        super();

        this.createModelGUI(gui);
        this.createModelGraph();
        this.createAnimation();
    }

    static squashSx(sy) {
        // Approx conservation of volume
        return 1 / Math.sqrt(sy);
    }

    createModelGUI(gui) {
        this.guiControls = {
            animate: true,
            speed: 1.0
        };

        const folder = gui.addFolder(BouncingBall.GUI_TITLE);

        folder.add(this.guiControls, 'animate')
            .name('Animate: ');

        folder.add(this.guiControls, 'speed', 0.1, 3.0, 0.1)
            .name('Speed: ');
    }

    getInitialState() {
        // Initial state: Ball up, no deformation
        return {
            y: BouncingBall.TOP_CENTER_Y,
            sy: 1,
            sx: 1
        };
    }

    createModelGraph() {
        this.state = this.getInitialState()
        this.ballPivot = new THREE.Object3D();

        this.ballMesh = new THREE.Mesh(
            new THREE.SphereGeometry(BouncingBall.BALL_RADIUS, BouncingBall.BALL_SEGMENTS, BouncingBall.BALL_SEGMENTS),
            BouncingBall.BALL_MATERIAL
        );

        this.ballPivot.add(this.ballMesh);
        this.add(this.ballPivot);

        this.ballPivot.position.y = this.state.y;
        this.applyState();
    }

    createAnimation() {
        const squashSx = BouncingBall.squashSx(BouncingBall.SQUASH_SY);
        const stretchSx = BouncingBall.squashSx(BouncingBall.STRETCH_SY);

        // 1. Fall accelerated by gravity
        this.tweenFall = new TWEEN.Tween(this.state)
            .to({ y: BouncingBall.BALL_RADIUS, sy: 1, sx: 1 }, BouncingBall.T_FALL)
            .easing(TWEEN.Easing.Quadratic.In);

        // 2. Squashing
        this.tweenSquash = new TWEEN.Tween(this.state)
            .to({ y: BouncingBall.BALL_RADIUS * BouncingBall.SQUASH_SY, sy: BouncingBall.SQUASH_SY, sx: squashSx }, BouncingBall.T_SQUASH)
            .easing(TWEEN.Easing.Quadratic.Out);

        // 3. Stretching
        this.tweenStretch = new TWEEN.Tween(this.state)
            .to({ y: BouncingBall.BALL_RADIUS * BouncingBall.STRETCH_SY, sy: BouncingBall.STRETCH_SY, sx: stretchSx }, BouncingBall.T_STRETCH)
            .easing(TWEEN.Easing.Quadratic.Out);

        // 4. Going up, decelerated by gravity
        this.tweenRise = new TWEEN.Tween(this.state)
            .to({ y: BouncingBall.TOP_CENTER_Y, sy: 1, sx: 1 }, BouncingBall.T_RISE)
            .easing(TWEEN.Easing.Quadratic.Out);

        // Animation chaining
        this.tweenFall.chain(this.tweenSquash);
        this.tweenSquash.chain(this.tweenStretch);
        this.tweenStretch.chain(this.tweenRise);
        this.tweenRise.chain(this.tweenFall);

        this.tweenFall.start(this.animTime);
    }

    reset() {
        this.tweenFall.stop();
        this.tweenSquash.stop();
        this.tweenStretch.stop();
        this.tweenRise.stop();

        this.state = this.getInitialState();
        this.applyState();

        this.tweenFall.start(this.animTime);
    }

    applyState() {
        this.ballPivot.position.y = this.state.y;
        this.ballMesh.scale.set(this.state.sx, this.state.sy, this.state.sx);
    }

    update() {
        const now = performance.now();
        if (this.lastTime === null) {
            this.lastTime = now;
        }

        const delta = now - this.lastTime;
        this.lastTime = now;

        if (this.guiControls.animate) {
            this.animTime += delta * this.guiControls.speed;
            TWEEN.update(this.animTime);
        }

        this.applyState();
    }
}

export { BouncingBall }
