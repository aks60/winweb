
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
        console.error(e.message);
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
};

UCom.setJsonParam = (obj, keys, val) => {
    keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
            acc[key] = val;
        } else {
            acc[key] = acc[key] || {};
        }
        return acc[key];
    }, obj);
};

UCom.remJsonParam = (obj, keys) => {
    debugger;
    for (let index = keys.lengt - 1; index >= 0; index--) {
        if (index === keys.length - 1) {
            delete obj[keys[index]];
        }
        if (Object.keys(obj[keys[index]]).length === 0) {
            delete obj[keys[index]];
        }
    }
};

UCom.update_value_json = (obj, keys, id) => {
    if (id === -3) {
        UCom.remJsonParam(obj, keys);
    } else {
        UCom.setJsonParam(obj, keys, id);
    }
}