import * as THREE from 'three';
import { scene, camera, renderer } from './utils/three.js';

export default class Flock extends THREE.Object3D {
    constructor(numBoids) {
        super();
        this.boids = [];
        this._create(numBoids);

        this.sequence = [];

        window.addEventListener('keydown', (e) => {
            if (e.key === 'o') {
                console.log(this.boids[0].position);
            }
        });
    }

    _create(numBoids) {
        this.boids = [];
        this.children = [];
        for (let i = 0; i < numBoids; i++) {
            const boid = new Boid();
            this.add(boid);
            this.boids.push(boid);
        }
    }

    init() {
        // clear all settings
        this.sequence = [];
        this.boids.forEach(boid => boid.init());
    }

    update(actors) {
        for (let boid of this.boids) {
            boid.update(actors);
        }
    }

    step(index) {
        this.sequence.forEach((seq) => {
            seq(index);
        });
    }

    _seqHandler(targetSetter, args) {
        this.sequence.push((index) => {
            targetSetter(args[index % args.length]);
        });
    }

    // callables
    // TODO: add funtion to set radius

    align(...args) {
        // args : weight, shound be scaled around 0 to 1

        // default values
        this.boids.forEach((boid) => {
            boid._alignRadius = 10;
            boid.alignWeight = 1;
        });

        if (args.length === 0) return this;

        args = processInput(args);

        this._seqHandler((newStep) => {
            if (typeof newStep === 'number') {
                this.boids.forEach((boid) => {
                    boid.alignWeight = newStep;
                });
            }
            else { throw new Error('Invalid argument type in align sequence '); }
        }, args);

        return this;
    }

    aRad(...args) {
        // args : radius, shound be scaled around 0 to 1
        if (args.length === 0) return this;

        args = processInput(args);

        this._seqHandler((newStep) => {
            if (typeof newStep === 'number') {
                this.boids.forEach((boid) => {
                    boid._alignRadius = newStep;
                });
            }
            else { throw new Error('Invalid argument type in aRad sequence '); }
        }, args);

        return this;
    }


    cohesion(...args) {
        // args : weight, shound be scaled around 0 to 1
        args = processInput(args);

        // default values
        this.boids.forEach((boid) => {
            // boid._cohesionRadius = 30;
            boid.cohesionWeight = args[0] || 1;
        });

        if (args.length === 0) return this;


        this._seqHandler((newStep) => {
            if (typeof newStep === 'number') {
                this.boids.forEach((boid) => {
                    boid.cohesionWeight = newStep;
                });
            }
            else { throw new Error('Invalid argument type in cohesion sequence '); }
        }, args);

        return this;
    }

    cRad(...args) {
        // args : perception radius
        args = processInput(args);
        if (args.length === 0) return this;

        this.boids.forEach((boid) => {
            boid._cohesionRadius = args[0];
        });

        this._seqHandler((newStep) => {
            if (typeof newStep === 'number') {
                this.boids.forEach((boid) => {
                    boid._cohesionRadius = newStep;
                });
            }
            else { throw new Error('Invalid argument type in aRad sequence '); }
        }, args);

        return this;
    }

    separate(...args) {
        // args : weight, shound be scaled around 0 to 1

        // default values
        this.boids.forEach((boid) => {
            boid._separateRadius = 10;
            boid.separateWeight = 1;
        });

        if (args.length === 0) return this;

        args = processInput(args);

        this._seqHandler((newStep) => {
            if (typeof newStep === 'number') {
                this.boids.forEach((boid) => {
                    boid.separateWeight = newStep;

                });
            }
            else { throw new Error('Invalid argument type in separate sequence'); }
        }, args);

        return this;
    }

    sRad(...args) {
        // args : perception radius
        args = processInput(args);
        if (args.length === 0) return this;

        this.boids.forEach((boid) => {
            boid._cohesionRadius = args[0];
        });

        this._seqHandler((newStep) => {
            if (typeof newStep === 'number') {
                this.boids.forEach((boid) => {
                    boid._separateRadius = newStep;
                });
            }
            else { throw new Error('Invalid argument type in sRad sequence '); }
        }, args);

        return this;
    }

}

class Boid extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.SphereGeometry(2, 10, 10, 4);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff, opacity: 0.1 });
        super(geometry, material);
        this.castShadow = true;

        this._vel = new THREE.Vector3();

        this._maxPos = 45;
        this._maxVel = 0.15;

        this._alignRadius = 30;
        this._cohesionRadius = 30;
        this._separateRadius = 20;

        this.alignWeight = 1; // 1
        this.cohesionWeight = 1; // 0.0001
        this.separateWeight = 1; // 0.001

        this._create();
    }

    _create() {

        this._vel.set(
            getRnd(-1, 1),
            0,
            getRnd(-1, 1));
        this._vel.setLength(Math.random() * this._maxVel);

        this.position.set(
            getRnd(-this._maxPos, this._maxPos),
            0,
            getRnd(-this._maxPos, this._maxPos));
    }

    init() {
        this._alignRadius = 0;
        this._cohesionRadius = 0;
        this._separateRadius = 0;

        this.alignWeight = 0;
        this.cohesionWeight = 0;
        this.separateWeight = 0;

    }


    update(boids) {
        const align = new THREE.Vector3();
        const separate = new THREE.Vector3();
        const cohesion = new THREE.Vector3();

        let total = 0;

        for (let boid of boids) {
            if (boid === this) continue;
            const distance = this.position.distanceTo(boid.position);
            if (distance < this._alignRadius) {
                const vel = boid._vel.clone();
                if(boid.isActor) vel.multiplyScalar(10);
                align.add(vel);
            }
            if (distance < this._cohesionRadius) {
                cohesion.add(boid.position);
                cohesion.sub(this.position);
            }
            if (distance < this._separateRadius) {
                const diff = new THREE.Vector3().subVectors(this.position, boid.position);
                diff.normalize();
                diff.multiplyScalar((this._separateRadius - distance) / distance);
                separate.add(diff);
            }
            total++;
        }


        if (total > 0) {
            // diff to average velocity multiplied by weight
            align.divideScalar(total);
            // align.sub(this._vel);
            align.multiplyScalar(this.alignWeight * 0.05);

            // average position
            cohesion.divideScalar(total);
            cohesion.multiplyScalar(this.cohesionWeight * 0.001);

            // velocity diff separated by distance
            separate.divideScalar(total);
            separate.multiplyScalar(this.separateWeight * 0.001);
        }


        this._vel.add(align);
        this._vel.clampLength(0, this._maxVel);
        this._vel.add(cohesion);
        this._vel.add(separate);

        this.position.add(this._vel);

        // Keep boids within bounds
        if (this.position.length() > this._maxPos) {
            const inwardForce = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), this.position);
            inwardForce.setLength(1); // Gently push inward
            this._vel.add(inwardForce);
        }
    }
}

function getRnd(min, max) {
    return Math.random() * (max - min) + min;
}

function processInput(args) {
    if (args.length === 1 && args[0].isSequence) {
        args = args[0]; // Unwrap it to process normally
    }
    // Handle case where elements inside args might be arrays
    return args;
}