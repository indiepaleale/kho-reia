import { THREE, scene, camera, renderer } from './utils/three.js';
import { actor } from './utils/globalFunctions.js';

import Stage from './Stage.js';
import REPL from './Editor.js';

//expose for devloping
const stage = new Stage();

const repl = new REPL({
    root: document.getElementById('editor-container'),
    initalCode: `console.log('Hello REPL!');\n\n$ marc: actor(10,10).orbit(0,0)`,
    stage: stage,
});

const test0 = actor(0, 0, { stage: stage, name: 'test0' })
    .go([-10,-10], [-10, 10], [10, 10], [10, -10])
const test = actor(0, 0, { stage: stage, name: 'test' })
    .go(test0)
