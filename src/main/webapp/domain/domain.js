
export function virtualRec(size, virtualData) {
    const vrec = new Array(size);
    for (let m of vrec) {
        m = null;
    }
    if (virtualData !== undefined) {
        for (let k in virtualData) {
            vrec[k] = virtualData[k];
        }
    }
    vrec[0] = 'SEL';
    return vrec;
}
