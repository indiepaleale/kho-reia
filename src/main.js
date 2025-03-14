import { THREE, scene, camera, renderer } from './three.js';

import Stage from './Stage.js';
import REPL from './Editor.js';

//expose for devloping
const stage = new Stage();

const repl = new REPL({
    root: document.getElementById('editor-container'),
    initalCode: `console.log('Hello REPL!');\n\n$ marc: actor(10,10)`,
    stage: stage,
});

const a1 = actor(0, -20, { name: 'a1', stage: stage }).
    orbit(0, 0, -0.01);

const a2 = actor(0, 0, { name: 'a2', stage: stage })
    .orbit(a1, 0, 0.02);

const a3 = actor(10, 0, { name: 'a3', stage: stage })
    .orbit(a2, 0, -0.01);

function actor(x, z, { name, stage }) {
    stage = stage || window.stage;
    const actor = stage.query(name);
    return actor;
}