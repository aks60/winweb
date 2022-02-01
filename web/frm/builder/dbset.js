//------------------------------------------------------------------------------
dbset.find_rec = function (id, ds) {
    for (let i = 0; i < ds.length; i++) {
        if (id == ds[i][0]) {
            return ds[i];
        }
    }
}
//dbset.find_rec = function (id, ds, def) {
//    let tokenList = ds.filter(rec => id == rec[0] || -3 == rec[0]);
//    let tokenRec = ds.find(rec => id == rec[0]);
//    return (tokenRec != undefined) ? tokenRec : def;
//}
//dbset.find2_rec = function (fname, val, ds) {
//    let record = ds.find(rec => val == rec[fname]);
//    if(record == undefined) {
//        record = ds.find(rec => -3 == rec[fname]);
//    }
//    return record;
//}
//
//dbset.find_list = function (id, ds, fk) {
//    let list = new Array();
//    for (let i = 0; i < ds.length; i++) {
//        if (id == ds[i][fk]) {
//            list.push(ds[i]);
//        }
//    }
//    return list;
//}
//------------------------  ENUMS  -------------------------------------------
export function load_enumList() {
    return  $.ajax({
        url: 'enum?action=enumList',
    });
}
//------------------------  SYSTREE  -------------------------------------------
export function load_systreeList() {
    return  $.ajax({
        url: 'dbset?action=systreeList',
    });
}
//------------------------  SYSPROD  -------------------------------------------
export function load_sysprodList() {
    return  $.ajax({
        url: 'dbset?action=sysprodList',
    });
}
//-------------------------  COLOR  --------------------------------------------
export function load_colorList() {
    return  $.ajax({
        url: 'dbset?action=colorList',
    });
}
//--------------------------  ARTIKL  ------------------------------------------
export function load_artiklList() {
    return  $.ajax({
        url: 'dbset?action=artiklList',
    });
}
//---------------------------  ARTDET  -----------------------------------------
export function load_artdetList() {
    return  $.ajax({
        url: 'dbset?action=artdetList',
    });
}
//---------------------------  FURNITURE  --------------------------------------
export function load_furnitureList() {
    return  $.ajax({
        url: 'dbset?action=furnitureList',
    });
}
//---------------------------  PROPROD  ----------------------------------------
export function load_proprodList() {
    return  $.ajax({
        url: 'dbset?action=proprodList',
    });
}
//----------------------------  SYSFURN  ---------------------------------------
export function load_sysprofList() {
    return  $.ajax({
        url: 'dbset?action=sysprofList',
    });
}
//----------------------------  SYSFURN  ---------------------------------------
export function load_sysfurnList() {
    return  $.ajax({
        url: 'dbset?action=sysfurnList',
    });
}
//------------------------------------------------------------------------------
