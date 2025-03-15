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

actor(0,0,{stage:stage,name:'test'}).orbit(20,10)