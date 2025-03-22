import { basicSetup } from "codemirror"
import { EditorState, Prec } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { javascript } from "@codemirror/lang-javascript"

import * as globalFunctions from './utils/globalFunctions.js';

function initEditor({ root, initalCode = '', onEvaluate, onStop, onPause }) {
    console.log('Editor loaded');

    // Initialize editor
    const state = EditorState.create({
        doc: initalCode,
        extensions: [
            basicSetup,
            keymap.of(defaultKeymap),
            // javascript(),
            Prec.highest(
                keymap.of([
                    {
                        key: "Ctrl-Enter",
                        run: () => {
                            onEvaluate?.()
                            return true
                        },
                    },
                    {
                        key: "Ctrl-.",
                        run: () => onStop?.(),
                    },
                    {
                        key: "Ctrl-,",
                        run: () => onPause?.(),
                    }
                ])
            )
        ]
    })

    return new EditorView({
        state: state,
        parent: root,
    })
}

export default class REPL {
    constructor(options) {
        const {
            root,
            initalCode,
            stage,

        } = options;
        this.stage = stage;
        this.activeActors = [];
        this.editor = initEditor({
            root,
            initalCode,
            onEvaluate: () => this.evaluate(),
            onPause: () => this.stage.sequenceToggle(),
        });
        this.globalFunctions = globalFunctions;
    }

    evaluate() {
        const code = this.editor.state.doc.toString();

        try {
            const transpiledCode = this.transpile(code);
            
            // this.activeActors will be updated after transpile
            // cleanup inactive actors
            this.stage.cleanup(this.activeActors);
            
            const actorsArgs = this.stage.actors.keys();
            const actorsValues = this.stage.actors.values();

            const functionsArgs = ['stage', ...actorsArgs, ...Object.keys(this.globalFunctions)];
            const functionValues = [this.stage, ...actorsValues, ...Object.values(this.globalFunctions)];
            new Function(...functionsArgs, transpiledCode)(...functionValues);
        } catch (e) {
            console.error(e);
        }
    }

    transpile(code) {
        const currentActors = []
        const lines = code.split('\n');
        const transpiledLines = lines.map(line => {
            if (line.trim().startsWith('$')) {
                const [namePart, codePart] = line.split(':');
                const name = namePart.trim().substring(1).trim();
                const actorCode = codePart.trim();
                currentActors.push(name);
                if (actorCode.startsWith('actor(')) {
                    const codePart = actorCode.split('.');
                    codePart[0] = codePart[0].slice(0, -1) + `, {name: '${name}', stage: stage}` + codePart[0].slice(-1);
                    return codePart.join('.');
                } else {
                    throw new Error(`${name}: needs to be followed with actor()`);
                }
            }
            return line;
        });

        this.activeActors = currentActors;

        return transpiledLines.join('\n');
    }
}