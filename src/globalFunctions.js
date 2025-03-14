const actor = (x, z, { name, stage }) => {
    stage = stage || window.stage;
    const actor = stage.query(name, x, z);
    return actor;
}


export { actor };