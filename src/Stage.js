import * as THREE from "three";
import { scene, camera, renderer } from "./utils/three.js";
import Actor from "./Actor.js";
import Flock from "./Flock.js";
// import { oscData } from "./utils/osc.js";

export default class Stage {
    constructor() {
        this.actors = new Map();
        this.flock = undefined;
        this.includesFlock = false;
        this.flockgroup = [];

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.paused = false;
        this.sequenceIntervalId = null; // Store the interval ID
        this.stepIndex = 0;
        this._init();
    }

    _createActor(name, x, z) {
        const geometry = new THREE.SphereGeometry(2, 10, 10, 4);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xc0c0c0, opacity: 0.1 });

        const actor = new Actor(x, 0, z, geometry, material);

        this.scene.add(actor);
        this.actors.set(name, actor);
        console.log("Actor created");
        return actor;
    }

    _createFlock(numBoids = 10) {
        const flock = new Flock(numBoids);
        this.scene.add(flock);
        this.flock = flock;
        this.flockgroup = flock.boids.slice(); // I'm not sure about
        console.log("Flock created");
        return flock;
    }


    queryActor(name, x, z) {
        if (this.actors.has(name)) {
            return this.actors.get(name);
        }
        return this._createActor(name, x, z);
    }

    queryFlock(numBoids) {
        this.includesFlock = true;
        if (this.flock instanceof Flock) {
            console.log("Flock already exists")
            return this.flock;
        }
        return this._createFlock(numBoids);
    }

    preEval(activeActors) {
        // TODO : unify cleanup logic pre or post eval for actors and flock
        this.actors.forEach((actor, name) => {
            if (!activeActors.includes(name)) {
                this.actors.delete(name);
                this.scene.remove(actor);
            }
        });
        this.includesFlock = false;
    }

    postEval() {
        this.flockgroup = this.flock.boids.slice();
        this.actors.forEach((actor) => this.flockgroup.push(actor));
        console.log("PostEval", this.flockgroup);

        if (!this.includesFlock) {
            this.scene.remove(this.flock);
            this.flock = undefined;
        }
    }


    _animate() {
        requestAnimationFrame(() => this._animate());
        this.renderer.render(this.scene, this.camera);
        if (this.paused) return;
        if (this.flock) this.flock.update(this.flockgroup);
        this.actors.forEach((actor) => actor.update());
    }

    _startSequence(time = 2000) {
        this.sequenceIntervalId = setInterval(() => {
            this.actors.forEach((actor) => actor.step(this.stepIndex));
            if (this.flock) this.flock.step(this.stepIndex);
            this.stepIndex++;
        }, time);
    }

    _stopSequence() {
        if (this.sequenceIntervalId) {
            clearInterval(this.sequenceIntervalId);
            this.sequenceIntervalId = null;
        }
    }

    setInterval(time) {
        this._stopSequence();
        this._startSequence(time);
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