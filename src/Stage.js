import * as THREE from "three";
import { scene, camera, renderer } from "./three.js";
import Actor from "./Actor.js";

export default class Stage {
    constructor() {
        this.actors = new Map();
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.paused = false;
        this._init();
    }

    _createActor(name, x, z) {
        const geometry = new THREE.SphereGeometry(2, 10, 10, 4);
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const actor = new Actor(x, 0, z, geometry, material);

        this.scene.add(actor);
        this.actors.set(name, actor);

        return actor;
    }

    query(name, x, z) {
        if (this.actors.has(name)) {
            return this.actors.get(name);
        }
        return this._createActor(name, x, z);
    }


    remove(actor) {
        this.actors = this.actors.filter((a) => a !== actor);
        this.scene.remove(actor);
    }

    _animate() {
        requestAnimationFrame(() => this._animate());
        this.renderer.render(this.scene, this.camera);
        if (this.paused) return;

        this.actors.forEach((actor) => actor.update());
    }

    _init() {
        this._animate();
    }


    pause() {
        this.paused = !this.paused;
    }
}