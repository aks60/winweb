//------------------------------------------------------------------------------
dbset.find = (id, ds) => {

    let record = ds.find(rec => id == rec[1])
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
    return arr;
}
//------------------------  ENUMS  -------------------------------------------
dbset.saveScript = (winc, proprodID) => {
    $.ajax({//запишем профиль в серверную базу данных
        url: 'dbset?action=saveScript',
        data: {param: JSON.stringify({id: proprodID, script: JSON.stringify(winc.obj, (k, v) => isEmpty(v))})},
        success: (data) => {
            if (data.result != 'ok')
                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере", 168);
        },
        error: () => {
            dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере", 168);
        }
    });
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
//---------------------------  FURNDET  --------------------------------------
export function furndetList() {
    return  $.ajax({
        url: 'dbset?action=furndetList',
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
