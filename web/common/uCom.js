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
    return obj;
};
//------------------------------------------------------------------------------
dbset.sysprof.find5 = (nuni, typeId, us1, us2) => {
    if (nuni === -3) {
        return virtualRec(typeId);
    }
    return dbset.sysprof.list.filter(
            rec => rec[SYSPROF.systree_id] === nuni
                && rec[SYSPROF.use_type] === typeId
                && UseSideTo.MANUAL[0] != rec[SYSPROF.use_side]
                && (us1 == rec[SYSPROF.use_side]
                        || us2 == rec[SYSPROF.use_side]
                        || UseSideTo.ASNY[0] == rec[SYSPROF.use_side])
    )
            .findFirst().orElse(virtualRec(typeId));
    
    virtualRec = (typeId) => {
        const virt = [...dbset.sysprof.vrec];
        virt[SYSPROF.id] = -3;
        virt[SYSPROF.use_type] = typeId;
        virt[SYSPROF.use_side] = -1;
        virt[SYSPROF.systree_id] = -3;
        virt[SYSPROF.artikl_id] = -3;
        return virt;
    };
};
//------------------------------------------------------------------------------    


