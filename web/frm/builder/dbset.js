//------------------------------------------------------------------------------
dbset.find = function (id, ds) {
    if (id == -3) {
        return ds.virtualRec;
    }
    for (let dr of ds) {
        if (id == dr[0]) {
            return dr;
        }
    }
    return undefined;
}
//------------------------------------------------------------------------------
dbset.newRecord = function (ds) {
    if (ds == undefined || ds[0] == undefined || ds[0] == null) {
        return undefined;
    }
    let arr = [];
    for (let dr of ds[0]) {
        arr.push(null);
    }
}
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
//----------------------------  SYSPAR1  ---------------------------------------
export function load_syspar1List() {
    return  $.ajax({
        url: 'dbset?action=syspar1List',
    });
}
//----------------------------  PARAMS  ---------------------------------------
export function load_paramsList() {
    return  $.ajax({
        url: 'dbset?action=paramsList',
    });
}
//------------------------------------------------------------------------------
