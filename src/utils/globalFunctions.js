const actor = (x, z, { name, stage }) => {
    stage = stage || window.stage;
    const actor = stage.query(name, x, z);

    actor.init();
    return actor;
}


export { actor };