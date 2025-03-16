import * as THREE from 'three';

export default class Actor extends THREE.Object3D {
    constructor(x, y, z, geometry, material) {
        super();
        this.add(new THREE.Mesh(geometry, material));
        this.position.set(x, y, z);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.paused = false;

        this.sequence = [];
    }

    _setUpdate(callback) {
        const originalUpdate = this.update; // Preserve the original method

        this.update = () => {
            originalUpdate(); // Call the original update function
            callback();       // Execute the additional callback
        };
    }

    update() {
        // method called from stage
        // dynamicly set by function chain
    }

    init() {
        this.update = () => {
            if (this.paused) return;
        };
        this.paused = false;
        return this;
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

    _makeObject3D(x, z) {
        return new THREE.Vector3(x, 0, z);
    }


    stop() {
        this.paused = true;
        return this;
    }

    go(...args) {
        // process args, keep Object3D to only sample position on each step
        args = args.map((arg) => {
            if (arg instanceof Array) {
                return this._makeObject3D(arg[0], arg[1]);
            }
            else if (arg instanceof THREE.Object3D) {
                return arg;
            }
            else if (arg instanceof THREE.Vector3) {
                return arg;
            }
            else {
                throw new Error('Invalid argument type');
            }
        });

        const target = args[0];
        if (target instanceof THREE.Object3D) {
            this.goTarget = target.position.clone();
        }
        else {
            this.goTarget = target;
        }
        this.goSpeed = 0.01;

        // add sequence hander
        this._seqHandler((newTarget) => {
            if (newTarget instanceof THREE.Object3D) {
                this.goTarget = newTarget.position.clone();
            }
            else if (newTarget instanceof THREE.Vector3) {
                this.goTarget = newTarget;
            }
            else { throw new Error('Invalid argument type in go sequence '); }
        }, args);

        // set update function
        this._setUpdate(() => {
            this.position.copy(this.position.lerp(this.goTarget, this.goSpeed));
        });
        return this;
    }

    follow(...args) {
        // process args, keep Object3D to only sample position on each step
        args = args.map((arg) => {
            if (arg instanceof Array) {
                return this._makeObject3D(arg[0], arg[1]);
            }
            else if (arg instanceof THREE.Object3D) {
                return arg.position;
            }
            else if (arg instanceof THREE.Vector3) {
                return arg;
            }
            else {
                throw new Error('Invalid argument type');
            }
        });

        this.followTarget = args[0];
        this.followSpeed = 0.01;

        // add sequence hander
        this._seqHandler((newTarget) => {
            if (newTarget instanceof THREE.Vector3) {
                this.followTarget = newTarget;
            }
            else { throw new Error('Invalid argument type in go sequence '); }
        }, args);

        // set update function
        this._setUpdate(() => {
            this.position.copy(this.position.lerp(this.followTarget, this.goSpeed));
        });
        return this;
    }

    orbit(...args) {
        // process args, return Vector3, keep reference if is Object3D
        args = args.map((arg) => {
            if (arg instanceof Array) {
                return this._makeObject3D(arg[0], arg[1]);
            }
            else if (arg instanceof THREE.Object3D) {
                return arg.position;
            }
            else if (arg instanceof THREE.Vector3) {
                return arg;
            }
            else {
                throw new Error('Invalid argument type');
            }
        });

        this.orbitTarget = args[0]; // create new object if not exist
        this.orbitRadius = this.position.distanceTo(this.orbitTarget);
        this.orbitSpeed = 0.01;

        this._seqHandler((newTarget) => {
            console.log(newTarget);
            if (newTarget instanceof THREE.Vector3) {
                this.orbitTarget = newTarget;
            }
            else { throw new Error('Invalid argument type in orbit sequence '); }
            this.orbitRadius = this.position.distanceTo(this.orbitTarget);
        }, args);

        this._setUpdate(() => {
            const center2pos = this.position.clone().sub(this.orbitTarget);
            center2pos.normalize().multiplyScalar(this.orbitRadius);
            center2pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.orbitSpeed);
            this.position.copy(this.orbitTarget).add(center2pos);
        });
        return this;
    }
}