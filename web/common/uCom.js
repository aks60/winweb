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
dbset.sysprof.find = (nuni, typeId, us1, us2) => {
    //debugger;
    try {
        if (nuni === -3) {
            return virtualRec(typeId);
        }
        const arr = dbset.sysprof.list.find(
                rec => rec[SYSPROF.systree_id] === nuni
                    && rec[SYSPROF.use_type] === typeId
                    && rec[SYSPROF.use_side] != UseSideTo.MANUAL[0]
                    && (rec[SYSPROF.use_side] === us1
                            || rec[SYSPROF.use_side] == us2
                            || rec[SYSPROF.use_side] == UseSideTo.ANY[0])
        );
        if (arr !== undefined) {
            return arr;
        } else {
            return virtualRec(typeId);
        }

        virtualRec = (typeId) => {
            const virt = [...dbset.sysprof.vrec];
            virt[SYSPROF.id] = -3;
            virt[SYSPROF.use_type] = typeId;
            virt[SYSPROF.use_side] = -1;
            virt[SYSPROF.systree_id] = -3;
            virt[SYSPROF.artikl_id] = -3;
            return virt;
        };
    } catch (e) {
        errorLog('Error: UCom.dbset.sysprof.find5() ' + e.message);
    }
};
//------------------------------------------------------------------------------ 
dbset.artikl.find = (id, analog) => {
    try {
        if (id === -3) {
            return dbset.artikl.vrec;
        }
        let recordRec = dbset.artikl.list.find(rec => id === rec[ARTIKL.id]);
        if (recordRec === undefined) {
            recordRec = dbset.artikl.vrec;
        }
        if (analog === true && recordRec[ARTIKL.analog_id] !== null) {
            const _analog_id = recordRec[ARTIKL.analog_id];
            recordRec = dbset.artikl.find(rec => _analog_id === rec[ARTIKL.id]);
        }
        return recordRec;
    } catch (e) {
        errorLog('Error: UCom.dbset.artikl.find() ' + e.message);
    }
};
//------------------------------------------------------------------------------    


