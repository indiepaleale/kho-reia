import { basicSetup } from "codemirror"
import { EditorState, Prec } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { javascript } from "@codemirror/lang-javascript"

import actor from "./Actor"

function initEditor({ root, initalCode = '', onEvaluate, onStop }) {
    console.log('Editor loaded');

    // Initialize editor
    const state = EditorState.create({
        doc: initalCode,
        extensions: [
            basicSetup,
            keymap.of(defaultKeymap),
            javascript(),
            Prec.highest(
                keymap.of([
                    {
                        key: "Ctrl-Enter",
                        run: () => onEvaluate?.(),
                    },
                    {
                        key: "Ctrl-.",
                        run: () => onStop?.(),
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
        this.editor = initEditor({
            root,
            initalCode,
            onEvaluate: () => this.evaluate(),
        });
    }

    evaluate() {
        const code = this.editor.state.doc.toString();

        try {
            const transpiledCode = this.transpile(code);
            new Function("actor", transpiledCode)(actor);
        } catch (e) {
            console.error(e);
        }
    }

    transpile(code) {
        const lines = code.split('\n');
        const transpiledLines = lines.map(line => {
            if (line.trim().startsWith('$')) {
                const [namePart, actorPart] = line.split(':');
                const name = namePart.trim().substring(1).trim();
                const actorCode = actorPart.trim();

                if (actorCode.startsWith('actor(')) {
                    return `${actorCode.slice(0, -1)}, {name: '${name}', stage: stage})`;
                } else {
                    throw new Error(`Invalid actor definition for ${name}`);
                }
            }
            return line;
        });

        return transpiledLines.join('\n');
    }
}