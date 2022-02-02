//------------------------------------------------------------------------------
dbset.find = function (id, ds) {
    for (let i = 0; i < ds.length; i++) {
        if (id == ds[i][0]) {
            return ds[i];
        }
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
//------------------------------------------------------------------------------
