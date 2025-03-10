import * as THREE from 'three';

import { basicSetup } from "codemirror"
import { EditorState, Prec } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { javascript } from "@codemirror/lang-javascript"

const state = EditorState.create({
  doc: `console.log("Hello World");`,
  extensions: [
    basicSetup,
    keymap.of(defaultKeymap),
    javascript(),
    Prec.highest(
      keymap.of([
        {
          key: "Ctrl-Enter",
          run: run,
        },
      ])
    )
  ]
})

const view = new EditorView({
  state: state,
  parent: document.getElementById('editor-container'),
})

// Three.js setup
const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

camera.position.z = 5;

// Default cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}
animate();

// Run code from editor
function run() {
  const code = view.state.doc.toString();
  try {
    new Function('THREE', 'scene', 'camera', 'renderer', code)(THREE, scene, camera, renderer);
  } catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
  }
  return true;
};