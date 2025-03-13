import { scene, camera, renderer } from "./three.js";
import actor from "./Actor.js";


export default class Stage {
    constructor() {
        this.actors = [];
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.paused = false;
        this.init();
    }

    add(actor) {
        this.actors.push(actor);
        this.scene.add(actor);
    }

    remove(actor) {
        this.actors = this.actors.filter((a) => a !== actor);
        this.scene.remove(actor);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
        if (this.paused) return;

        this.actors.forEach((actor) => actor.update());
    }

    init() {
        this.animate();
    }
}

/// expriment area
const stage = new Stage();



const a1 = actor(0, -20, stage).
    orbit(0, 0, -0.01);

const a2 = actor(0, 0, stage)
    .orbit(a1, 0, 0.02);

const a3 = actor(10, 0, stage)
    .orbit(a2, 0, -0.01);



window.addEventListener("keydown", (e) => {
    if (e.key === "r") {
        stage.paused = !stage.paused;
    }
});