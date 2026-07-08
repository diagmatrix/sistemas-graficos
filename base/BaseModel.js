import * as THREE from 'three';

class BaseModel extends THREE.Object3D {
    // GUI
    static GUI_TITLE = 'Base Model';

    constructor(gui) {
        super();

        this.createModelGUI(gui);
        this.createModelGraph();
    }

    createModelGUI(gui) {
        this.guiControls = {};

        const modelFolder = gui.addFolder(BaseModel.GUI_TITLE);
        
        // Add model GUI controls
        // ...
    }

    createModelGraph() {
        // Add nodes
        // ...
    }

    update() {
        // Add update logic
        // ...
    }
}

export { BaseModel }
