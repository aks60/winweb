
export let UCom = {};

UCom.findJson = (id, data) => {
    let obj = {};
    try {
        let recursive = (data) => {
            if (id === data.id) {
                obj = data;
            }
            if (typeof data === 'object' && data !== null) {
                // Если это массив
                if (Array.isArray(data)) {
                    data.forEach((item, index) => {
                        recursive(item); //рекурсивный вызов
                    });
                } else { // Если это объект
                    Object.keys(data).forEach(key => {
                        recursive(data[key]); //рекурсивный вызов
                    });
                }
            }
        };
        recursive(data);
    } catch (e) {
        errorLog('Error: UCom.findJson ' + e);
    }
    return obj;
};
UCom.getJson = (json1, json2) => {
    if (json1 === undefined) {
        return undefined;
    } else if (json1 !== undefined && json2 === undefined) {
        return json1;
    } else if (json1 !== undefined && json2 !== undefined) {
        return json1[json2];
    }
};
UCom.isFinite = (key1, key2) => {
    return (key1 === undefined) ? false : isFinite(key1[key2]);
};
UCom.scaleFont = (scale) => {
    if (scale > .44) {
        return 30;
    } else if (scale > .34) {
        return 40;
    } else if (scale > .18) {
        return 45;
    } else {
        return 50;
    }
}