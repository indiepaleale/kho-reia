import * as THREE from "three";
import { scene } from "./three";

// const oscPort = new osc.WebSocketPort({
//     url: "ws://localhost:8080", // URL to your Web Socket server.
//     metadata: true
// });

const oscData = new Map();
const index = { 'milena': 0, 'amber': 1, 'zach': 2, 'finn': 3, 'bojana': 4 };

for (const [name, idx] of Object.entries(index)) {
    const geometry = new THREE.SphereGeometry(2, 10, 10, 4);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const actor = new THREE.Mesh(geometry, material);
    scene.add(actor);
    oscData.set(name, { index: idx, actor });
    console.log(`Name: ${name}, Index: ${idx}`);
}
console.log(oscData);

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
    console.log("Connected to the OSC server");
};

let timestamp = Date.now();
socket.onmessage = (event) => {
    const now = Date.now();
    console.log('interval', now - timestamp);
    timestamp = now;
    const frame = JSON.parse(event.data);
    oscData.forEach(({ index, actor }) => {
        const values = frame[index];
        actor.position.set(values[0] * 50, 0, values[2] * 50);
        actor.quaternion.set(values[3], values[4], values[5], values[6]);
    });
};

socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
};

socket.onclose = () => {
    console.log("WebSocket connection closed");
};

// let timestamp = Date.now();
// const actorMap = new Map();

// oscPort.open();
// oscPort.on("message", function (oscMessage) {
//     console.log(oscMessage);
//     if (actorAddress.includes(oscMessage.address)) {
//         const actor = actorMap.get(oscMessage.address)
//         const values = oscMessage.args.map((arg) => arg.value);
//         // console.log(oscMessage.address, values);
//         oscData.set(oscMessage.address, { actor, values });
//     }
// });


// const osc = new OSC();
// let timestamp = Date.now();
// let messageCount = 0;

// setInterval(() => {
//     console.log(`Messages received in the past second: ${messageCount}`);
//     messageCount = 0;
// }, 1000);
// osc.on("seconds", (message) => {

// messageCount++;
// });




// osc.open({ port: 8888 });

export { oscData };