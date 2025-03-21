import { THREE, scene, camera, renderer } from './utils/three.js';
import { actor, random, shift } from './utils/globalFunctions.js';

import Stage from './Stage.js';
import REPL from './Editor.js';

//expose for devloping
const stage = new Stage();

const repl = new REPL({
    root: document.getElementById('editor-container'),
    initalCode: `console.log('Hello REPL!');\n\n$ marc: actor(10,10).orbit([0,0])`,
    stage: stage,
});

// testing area
const rand = random([0, 0], [10, 10], [-10, 0], [10, -10], [-10, -10]);
console.log(rand);
const randSpeed = random(0.01, 0.05, 0.1, 0.2);

const test0 = actor(0, 0, { stage: stage, name: 'test0' })
    .go([0,0])
    .goSpeed(randSpeed)