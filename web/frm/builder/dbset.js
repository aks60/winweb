//------------------------------------------------------------------------------
dbset.find = (id, ds) => {
    
    let record = ds.find(rec => id == rec[0])
    return (record == undefined) ? ds.virtualRec : record;
}
//------------------------------------------------------------------------------
dbset.nullRecord = (ds) => {
    if (ds == undefined || ds[0] == undefined || ds[0] == null) {
        return undefined;
    }
    let arr = [];
    for (let dr of ds[0]) {
        arr.push(null);
    }
}
//------------------------  ENUMS  -------------------------------------------
export function enumList() {
    return  $.ajax({
        url: 'enum?action=enumList',
    });
}
//------------------------  SYSTREE  -------------------------------------------
export function systreeList() {
    return  $.ajax({
        url: 'dbset?action=systreeList',
    });
}
//------------------------  SYSPROD  -------------------------------------------
export function sysprodList() {
    return  $.ajax({
        url: 'dbset?action=sysprodList',
    });
}
//-------------------------  COLOR  --------------------------------------------
export function colorList() {
    return  $.ajax({
        url: 'dbset?action=colorList',
    });
}
//--------------------------  ARTIKL  ------------------------------------------
export function artiklList() {
    return  $.ajax({
        url: 'dbset?action=artiklList',
    });
}
//---------------------------  ARTDET  -----------------------------------------
export function artdetList() {
    return  $.ajax({
        url: 'dbset?action=artdetList',
    });
}
//---------------------------  FURNITURE  --------------------------------------
export function furnitureList() {
    return  $.ajax({
        url: 'dbset?action=furnitureList',
    });
}
//---------------------------  PROPROD  ----------------------------------------
export function proprodList() {
    return  $.ajax({
        url: 'dbset?action=proprodList',
    });
}
//----------------------------  SYSFURN  ---------------------------------------
export function sysprofList() {
    return  $.ajax({
        url: 'dbset?action=sysprofList',
    });
}
//----------------------------  SYSFURN  ---------------------------------------
export function sysfurnList() {
    return  $.ajax({
        url: 'dbset?action=sysfurnList',
    });
}
//----------------------------  SYSPAR1  ---------------------------------------
export function syspar1List() {
    return  $.ajax({
        url: 'dbset?action=syspar1List',
    });
}
//----------------------------  PARAMS  ---------------------------------------
export function paramsList() {
    return  $.ajax({
        url: 'dbset?action=paramsList',
    });
}
//----------------------------  GROUP  ---------------------------------------
export function groupList() {
    return  $.ajax({
        url: 'dbset?action=groupList',
    });
}
//------------------------------------------------------------------------------
