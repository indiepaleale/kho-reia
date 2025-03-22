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

// const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 80, 100);
camera.lookAt(new THREE.Vector3(0, -10, 0));
// controls.update();

// Floor
const floorGeometry = new THREE.BoxGeometry(100, 200, 100);
const floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xc0c0c0,
    shininess: 100,
    specular: 0x111111,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0, -102, 0);
floor.receiveShadow = true;
scene.add(floor);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 20, 10);
scene.add(light);

function createSpotLight(x, z, scene) {
    const spotLight = new THREE.SpotLight(0xfffffe, 3000);
    spotLight.position.set(x, 20, z);
    spotLight.target.position.set(0, -10, 0);

    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.1;
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 8;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight.target, spotLight);
    return spotLight;
}
const spotLight = createSpotLight(60, 60, scene);
const spotLight2 = createSpotLight(-60, -60, scene);
const spotLight3 = createSpotLight(60, -60, scene);
const spotLight4 = createSpotLight(-60, 60, scene);

// Test Cube
const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
cube.position.set(40, 5, 40);
// scene.add(cube);



window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

function renderScene() {
    renderer.render(scene, camera);

}

export { THREE, scene, camera, renderer, renderScene };