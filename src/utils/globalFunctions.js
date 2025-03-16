const actor = (x, z, { name, stage }) => {
    stage = stage || window.stage;
    const actor = stage.query(name, x, z);

    actor.init();
    return actor;
}

// shift pattern
const shift = (index, ...args) => {
    const count = args.length;
    index = ((index % count) + count) % count; // Ensure index is within bounds
    const shiftedArgs = args.slice(index).concat(args.slice(0, index));
    return shiftedArgs;
}
const random = (...elements) => {
    return new Proxy([...elements], {
        get(target, prop) {
            if (prop === 'length') return target.length;
            if (prop === Symbol.iterator) return function* () { yield* shuffle(target); };

            // If accessing an array method, bind it to a shuffled version and re-wrap the result
            if (typeof target[prop] === 'function') {
                return (...args) => {
                    const result = shuffle(target)[prop](...args);
                    return Array.isArray(result) ? random(...result) : result; // Wrap if array
                };
            }

            // If accessing an index, return a random shuffled value
            const index = Number(prop);
            if (!isNaN(index) && index >= 0 && index < target.length) {
                return shuffle(target)[index];
            }

            return target[prop];
        }
    });
}

// Shuffle helper function
function shuffle(arr) {
    return arr
        .map(v => ({ v, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ v }) => v);
}


export { actor, shift, random };