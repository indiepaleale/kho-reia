import * as THREE from "three";
import { scene, camera, renderer } from "./utils/three.js";
import Actor from "./Actor.js";
// import { oscData } from "./utils/osc.js";

export default class Stage {
    constructor() {
        this.actors = new Map();
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.paused = false;
        this.sequenceIntervalId = null; // Store the interval ID
        this._init();
    }

    _createActor(name, x, z) {
        const geometry = new THREE.SphereGeometry(2, 10, 10, 4);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xc0c0c0, opacity: 0.1 });

        const actor = new Actor(x, 0, z, geometry, material);

        this.scene.add(actor);
        this.actors.set(name, actor);
        console.log("Actor created", name, actor);

        return actor;
    }

    query(name, x, z) {
        if (this.actors.has(name)) {
            return this.actors.get(name);
        }
        return this._createActor(name, x, z);
    }

    cleanup(activeActors) {
        this.actors.forEach((actor, name) => {
            if (!activeActors.includes(name)) {
                this.actors.delete(name);
                this.scene.remove(actor);
            }
        });
    }

    _animate() {
        requestAnimationFrame(() => this._animate());
        this.renderer.render(this.scene, this.camera);
        if (this.paused) return;

        this.actors.forEach((actor) => actor.update());
    }

    _startSequence() {
        let index = 0;
        this.sequenceIntervalId = setInterval(() => {
            this.actors.forEach((actor) => actor.step(index));
            index++;
        }, 1000);
    }

    _stopSequence() {
        if (this.sequenceIntervalId) {
            clearInterval(this.sequenceIntervalId);
            this.sequenceIntervalId = null;
        }
    }

    _init() {
        this._animate();
        this._startSequence();
    }

    sequenceToggle() {
        if (this.sequenceIntervalId) {
            this._stopSequence();
        } else {
            this._startSequence();
        }
    }
}