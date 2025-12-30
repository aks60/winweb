//------------------------------------------------------------------------------
import {UseSideTo} from '../enums/UseSideTo.js';
export let UCom = {};
//------------------------------------------------------------------------------
UCom.isValidJson = (jso, key, def) => {
    try {
        if (isValidNumber(jso[key])) {
            return jso[key];
        } else {
            return def;
        }
    } catch (e) {
        console.log('Error: UCom.isValidJson ' + e);
        return def;
    }
};
//------------------------------------------------------------------------------
UCom.isValidNumber = (val, def) => {
    if (typeof val === 'number' && Number.isFinite(val)) {
        return val;
    } else {
        def;
    }
};
//------------------------------------------------------------------------------
UCom.findJson = (id, data) => {
    let obj = {};
    try {
        let recursive = (data) => {
            if (id == data.id) {
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
        console.log('Error: UCom.findJson ' + e);
        return def;
    }
    return obj;
};
//------------------------------------------------------------------------------



