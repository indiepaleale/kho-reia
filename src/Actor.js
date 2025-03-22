import * as THREE from 'three';

export default class Actor extends THREE.Object3D {
    constructor(x, y, z, geometry, material) {
        super();
        this.mesh = new THREE.Mesh(geometry, material);
        this.add(this.mesh);
        this.mesh.castShadow = true;
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

    _makeVector3D(x, z) {
        return new THREE.Vector3(x, 0, z);
    }


    stop() {
        this.paused = true;
        return this;
    }

    go(...args) {
        args = processInput(args);
        // console.log(args);
        // process args, keep Object3D to only sample position on each step
        console.log(args);
        args = args.map((arg) => {
            if (arg instanceof Array) {
                return this._makeVector3D(arg[0], arg[1]);
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
            this._goTarget = target.position.clone();
        }
        else {
            this._goTarget = target;
        }
        this._goSpeed = 0.01;

        // add sequence hander
        this._seqHandler((newStep) => {
            if (newStep instanceof THREE.Object3D) {
                this._goTarget = newStep.position.clone();
            }
            else if (newStep instanceof THREE.Vector3) {
                this._goTarget = newStep;
            }
            else { throw new Error('Invalid argument type in go sequence '); }
        }, args);

        // set update function
        this._setUpdate(() => {
            this.position.copy(this.position.lerp(this._goTarget, this._goSpeed));
        });
        return this;
    }

    goSpeed(...args) {
        args = processInput(args);
        args = args.map((arg) => {
            if (typeof arg === 'number') {
                return arg;
            } else {
                throw new Error('Invalid argument type');
            }
        });

        this._seqHandler((newStep) => {
            if (typeof newStep === 'number') {
                this._goSpeed = newStep;
            }
            else { throw new Error('Invalid argument type in go sequence '); }
        }, args);

        return this;
    }

    follow(...args) {
        args = processInput(args);
        // process args, keep Object3D to only sample position on each step
        args = args.map((arg) => {
            if (arg instanceof Array) {
                return this._makeVector3D(arg[0], arg[1]);
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

        this._followTarget = args[0];
        this._followSpeed = 0.01;

        // add sequence hander
        this._seqHandler((newStep) => {
            if (newStep instanceof THREE.Vector3) {
                this._followTarget = newStep;
            }
            else { throw new Error('Invalid argument type in go speed sequence '); }
        }, args);

        // set update function
        this._setUpdate(() => {
            this.position.copy(this.position.lerp(this._followTarget, this._followSpeed));
        });
        return this;
    }

    followSpeed(...args) {
        args = processInput(args);
        args = args.map((arg) => {
            if (typeof arg === 'number') {
                return arg;
            } else {
                throw new Error('Invalid argument type');
            }
        });

        this._seqHandler((newStep) => {
            if (typeof newStep === 'number') {
                this._followSpeed = newStep;
            }
            else { throw new Error('Invalid argument type in follow speed sequence '); }
        }, args);

        return this;
    }

    orbit(...args) {
        args = processInput(args);
        // process args, return Vector3, keep reference if is Object3D
        args = args.map((arg) => {
            if (arg instanceof Array) {
                return this._makeVector3D(arg[0], arg[1]);
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

        this._orbitTarget = args[0]; // create new object if not exist
        this._orbitRadius = this.position.distanceTo(this._orbitTarget);
        this._orbitSpeed = 0.01;

        this._seqHandler((newStep) => {
            // console.log(newStep);
            if (newStep instanceof THREE.Vector3) {
                this._orbitTarget = newStep;
            }
            else { throw new Error('Invalid argument type in orbit sequence '); }
            this._orbitRadius = this.position.distanceTo(this._orbitTarget);
        }, args);

        this._setUpdate(() => {
            const center2pos = this.position.clone().sub(this._orbitTarget);
            center2pos.normalize().multiplyScalar(this._orbitRadius);
            center2pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), this._orbitSpeed);
            this.position.copy(this._orbitTarget).add(center2pos);
        });
        return this;
    }

    orbitSpeed(...args) {
        args = processInput(args);
        args = args.map((arg) => {
            if (typeof arg === 'number') {
                return arg;
            } else {
                throw new Error('Invalid argument type');
            }
        });

        this._seqHandler((newStep) => {
            if (typeof newStep === 'number') {
                this._orbitSpeed = newStep;
            }
            else { throw new Error('Invalid argument type in orbit speed sequence '); }
        }, args);

        return this;
    }
}

const argsType = Object.freeze({
    NUMBER: "NUMBER",
    POS: "POS",
});

// helper function to handle input
function processInput(args) {

    // If there's only one argument and it's an array or a Proxy-wrapped array
    if (args.length === 1 && args[0].isSequence) {
        args = args[0]; // Unwrap it to process normally
        console.log("Find sequence");
    }
    // Handle case where elements inside args might be arrays
    return args;
}

