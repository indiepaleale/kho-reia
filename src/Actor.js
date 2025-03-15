import * as THREE from 'three';

export default class Actor extends THREE.Object3D {
    constructor(x, y, z, geometry, material) {
        super();
        this.add(new THREE.Mesh(geometry, material));

        this.position.set(x, y, z);
        this.target = this.position.clone();
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.paused = false;
    }

    _posUpdate() {
        this.position.copy(this.position.lerp(this.target, 0.01));
    }

    _velUpdate() {
    }

    _setUpdate(callback) {
        // create a new update function
        const prevUpdate = this.update;
        this.update = () => {
            prevUpdate();
            callback ? callback() : null;
        }
    }
    update() {
        if (this.paused) return;
        // update called by stage update loop
        // conditional overriten by _posUpdate or _velUpdate
    }

    init() {
        this.update = () => { };
        this.target = this.position.clone();
        return this;
    }

    step(index) {
        this.sequenced
    }


    stop() {
        this.paused = true;
        return this;
    }

    go(x, z) {
        if (x instanceof THREE.Object3D) {
            this.goTarget = x.position.clone();
        }
        else if (x instanceof THREE.Vector3) {
            this.goTarget = x.clone();
        }
        else {
            this.goTarget = new THREE.Vector3(x, 0, z);
        }
        this._setUpdate(() => {
            this.position.copy(this.position.lerp(this.goTarget, 0.01));
        });
        return this;
    }
    follow(x) {
        if (x instanceof THREE.Object3D) {
            this.followTarget = x.position;
        } else if (x instanceof THREE.Vector3) {
            this.followTarget = x;
        } 
        this._setUpdate(() => {
            this.position.copy(this.position.lerp(this.followTarget, 0.01));
        });
        return this;
    }

    orbit(x, z, speed = 0.01) {
        if (x instanceof THREE.Object3D) {
            this.target = x.position;
        } else if (x instanceof THREE.Vector3) {
            this.target = x;
        } else {
            this.target.set(x, 0, z);
        }
        const radius = this.position.distanceTo(this.target);
        this._setUpdate(() => {
            const center2pos = this.position.clone().sub(this.target);
            center2pos.normalize().multiplyScalar(radius);
            center2pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), speed);
            this.position.copy(this.target).add(center2pos);
            // console.log('c', center2pos);
        });
        return this;
    }
}