import { THREE, scene, camera, renderer } from './utils/three.js';
import { actor, random, shift, flock } from './utils/globalFunctions.js';

import Stage from './Stage.js';
import REPL from './Editor.js';

//expose for devloping
const stage = new Stage();

const repl = new REPL({
    root: document.getElementById('editor-container'),
    initalCode: `console.log('Hello REPL!');\n\nstepTime(500)\n\n$ray : actor(10,0).orbit([0,0])\n\nflock(5).cohesion(10,-10).cRad(10).align(1)`,
    stage: stage,
});

// testing area
window.stage = stage;
// const rand = random([0, 0], [10, 10], [-10, 0], [10, -10], [-10, -10]);
// console.log(rand);
// const randSpeed = random(0.01, 0.05, 0.1, 0.2);

// const test0 = actor(-10, 20, 'test0')
//     .go([0, 0], [20, 20])
//     .goSpeed(randSpeed)
