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