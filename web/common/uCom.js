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
    try {
        if (nuni === -3) {
            return virtualRec(typeId);
        }
        const arr = dbset.sysprof.list.find(
                rec => rec[eSysprof.systree_id] === nuni
                    && rec[eSysprof.use_type] === typeId
                    && rec[eSysprof.use_side] != UseSideTo.MANUAL[0]
                    && (rec[eSysprof.use_side] === us1
                            || rec[eSysprof.use_side] == us2
                            || rec[eSysprof.use_side] == UseSideTo.ANY[0])
        );
        if (arr !== undefined) {
            return arr;
        } else {
            return virtualRec(typeId);
        }

        virtualRec = (typeId) => {
            const virt = [...eSysprof.vrec];
            virt[eSysprof.id] = -3;
            virt[eSysprof.use_type] = typeId;
            virt[eSysprof.use_side] = -1;
            virt[eSysprof.systree_id] = -3;
            virt[eSysprof.artikl_id] = -3;
            return virt;
        };
    } catch (e) {
        errorLog('Error: UCom.dbset.sysprof.find5() ' + e.message);
    }
};
//------------------------------------------------------------------------------
dbset.sysprof.find3 = (_id) => {
    let sysprof = dbset.sysprof.list.find(rec => rec.id === _id);
    if (sysprof === undefined) {
        sysprof = eSysprof.vrec;
    }
    return sysprof;
};
//------------------------------------------------------------------------------ 
dbset.artikl.find = (id, analog) => {
    try {
        if (id === -3) {
            return eArtikl.vrec;
        }
        let recordRec = dbset.artikl.list.find(rec => id === rec[eArtikl.id]);
        if (recordRec === undefined) {
            recordRec = eArtikl.vrec;
        }
        if (analog === true && recordRec[eArtikl.analog_id] !== null) {
            const _analog_id = recordRec[eArtikl.analog_id];
            recordRec = dbset.artikl.find(rec => _analog_id === rec[eArtikl.id]);
        }
        return recordRec;
    } catch (e) {
        errorLog('Error: UCom.dbset.artikl.find() ' + e.message);
    }
};
//------------------------------------------------------------------------------
dbset.params.find = _id => {
    let elem = dbset.params.list.find(rec => _id === rec.id);
    if (elem === undefined) {
        elem = eParams.vrec;
    }
    return elem;
};
//------------------------------------------------------------------------------



