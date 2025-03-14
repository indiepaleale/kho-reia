import { THREE, scene, camera, renderer } from './three.js';

export default class Actor extends THREE.Object3D {
    constructor(x, y, z, geometry, material) {
        super();
        this.add(new THREE.Mesh(geometry, material));

        this.position.set(x, y, z);
        this.target = this.position.clone();
        this.velocity = new THREE.Vector3(0, 0, 0);
    }

    posUpdate() {
        this.position.copy(this.position.lerp(this.target, 0.01));
    }

    velUpdate() {

    }

    update() {
    }

    go(x, z) {
        this.update = () => this.posUpdate();
        this.target.set(x, 0, z);
        return this;
    }
    follow(x) {
        if (x instanceof THREE.Object3D) {
            this.target = x.position;
        } else if (x instanceof THREE.Vector3) {
            this.target = x;

        } else if (Array.isArray(x) && x.length > 0 && Array.isArray(x[0])) {
            const [x1, y1, z1] = x[0];
            this.target.set(x1, y1, z1);
        }
        this.update = () => this.posUpdate();
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
        const update = () => {
            const center2pos = this.position.clone().sub(this.target);
            center2pos.normalize().multiplyScalar(radius);
            center2pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), speed);
            this.position.copy(this.target).add(center2pos);
            // console.log('c', center2pos);
        };
        this.update = () => update();
        return this;
    }
}