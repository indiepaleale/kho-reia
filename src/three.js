import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });

// For debug, render canvas straight to body, make orbitcontrols work
// const renderer = new THREE.WebGLRenderer();
// document.body.appendChild(renderer.domElement);
const pixelRatio = window.devicePixelRatio;
renderer.setPixelRatio(pixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(0, 0, 10)

const floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotateX(-Math.PI / 2);

const light = new THREE.DirectionalLight(0xffffff, 10);
light.position.set(0, 1, 1).normalize();

scene.add(floor, light);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 100, 100);
controls.update();

// function animate() {
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);
//     controls.update();
//     actors.forEach(actor => actor.update());
// }
// 
// animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

export { THREE, scene, camera, renderer };