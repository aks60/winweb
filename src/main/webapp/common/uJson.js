
export let UJson = {};

UJson.traverseJson = (data) => {
    if (typeof data === 'object' && data !== null) {
        // Если это массив
        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                console.log(`Массив, индекс ${index}:`, item);
                traverseJson(item); // Рекурсивный вызов
            });
        } else { // Если это объект
            Object.keys(data).forEach(key => {
                console.log(`Ключ: ${key}, Значение: ${data[key]}`);
                traverseJson(data[key]); // Рекурсивный вызов
            });
        }
    } //else {
    // Это примитивное значение (строка, число, null, boolean)
    // console.log('Примитивное значение:', data);
    //}
};

UJson.findJson = (id, data) => {
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

UJson.isEmpty = (v) => {

    if (v === "" || v === undefined || v === null)
        return undefined;
    else {
        if (typeof v === 'object' && Object.keys(v).length === 0)
            return undefined;
        else
            return v;
    }
};

UJson.isFinite = (key1, key2) => {
    if(key1 === undefined) {
        return false;
    }
    if(key1[key2] === undefined) {
        return  false;
    }
    return true;
};

UJson.getJsonParam = (json1, json2) => {
    if (json1 === undefined) {
        return undefined;
    } else if (json1 !== undefined && json2 === undefined) {
        return json1;
    } else if (json1 !== undefined && json2 !== undefined) {
        return json1[json2];
    }
};

UJson.setJsonParam = (obj, keys, value) => {
    keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
            acc[key] = value;
        } else {
            acc[key] = acc[key] || {};
        }
        return acc[key];
    }, obj);
};

UJson.remJsonParam = (obj, keys) => {

    obj[keys[0]] = obj[keys[0]] || {};
    obj[keys[0]][keys[1]] = obj[keys[0]][keys[1]] || {};

    if (keys.length === 2) {
        if (Object.keys(obj[keys[0]][keys[1]]).length === 0)
            delete obj[keys[0]][keys[1]];
        if (Object.keys(obj[keys[0]]).length === 0)
            delete obj[keys[0]];

    } else if (keys.length === 3) {
        obj[keys[0]][keys[1]][keys[2]] = obj[keys[0]][keys[1]][keys[2]] || {};
        delete obj[keys[0]][keys[1]][keys[2]];
        if (Object.keys(obj[keys[0]][keys[1]]).length === 0)
            delete obj[keys[0]][keys[1]];
        if (Object.keys(obj[keys[0]]).length === 0)
            delete obj[keys[0]];
    }
};

UJson.updateJsonParam = (obj, keys, id) => {
    if (id === -3) {
        UJson.remJsonParam(obj, keys);
    } else {
        UJson.setJsonParam(obj, keys, id);
    }
};

 UJson.serialize = (gsonElem) => {
//        if (gsonElem == this && this.param != null && this.param.size() == 0) {
//            this.param = null;
//        }
//        if (this.childs != null) {
//            for (GsonElem el : this.childs) {
//                if (el.param != null && el.param.size() == 0) {
//                    el.param = null;
//                }
//                el.serialize(this); //рекурсия  
//            }
//        }
    };