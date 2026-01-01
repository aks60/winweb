
export let UCom = {};

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
        errorLog('Error: UCom.findJson ' + e);
        return def;
    }
    return obj;
};

UCom.isFinite = (key1, key2) => {
    return (key1 === undefined) ? false : isFinite(key1[key2]);
};



