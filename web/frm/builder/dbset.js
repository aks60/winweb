
//------------------------------------------------------------------------------
//function loadData(data) {
//    for(let i = 0; i < data) {
//        
//    }
//}
//------------------------  SYSTREE  -------------------------------------------
export function systreeList() {
    return  $.ajax({
        url: 'dbset?action=systreeList'
    }).fail(function () {
        alert("ERR systreeList");
    });
}
//------------------------  SYSPROD  -------------------------------------------
export function sysprodList() {
    return  $.ajax({
        url: 'dbset?action=sysprodList'
    }).fail(function () {
        alert("ERR sysprodList");
    });
}
//-------------------------  COLOR  --------------------------------------------
export function colorList() {
    return  $.ajax({
        url: 'dbset?action=colorList'
    }).fail(function () {
        alert("ERR colorList");
    });
}
//--------------------------  ARTIKL  ------------------------------------------
export function artiklList() {
    return  $.ajax({
        url: 'dbset?action=artiklList'
    }).fail(function () {
        alert("ERR artiklList");
    });
}
//---------------------------  ARTDET  -----------------------------------------
export function artdetList() {
    return  $.ajax({
        url: 'dbset?action=artdetList'
    }).fail(function () {
        alert("ERR artdetList");
    });
}
//---------------------------  ORDER  -----------------------------------------
export function orderList() {
    return  $.ajax({
        url: 'dbset?action=orderList'
    }).fail(function () {
        alert("ERR orderList");
    });
}
//---------------------------  FURNITURE  --------------------------------------
export function furnitureList() {
    return  $.ajax({
        url: 'dbset?action=furnitureList'
    }).fail(function () {
        alert("ERR furnitureList");
    });
}
//---------------------------  FURNDET  --------------------------------------
export function furndetList() {
    return  $.ajax({
        url: 'dbset?action=furndetList'
    }).fail(function () {
        alert("ERR furndetList");
    });
}
//---------------------------  PRJPROD  ----------------------------------------
export function prjprodList() {
    return  $.ajax({
        url: 'dbset?action=prjprodList'
    }).fail(function () {
        alert("ERR prjprodList");
    });
}
//----------------------------  SYSFURN  ---------------------------------------
export function sysprofList() {
    return  $.ajax({
        url: 'dbset?action=sysprofList'
    }).fail(function () {
        alert("ERR sysprofList");
    });
}
//----------------------------  SYSFURN  ---------------------------------------
export function sysfurnList() {
    return  $.ajax({
        url: 'dbset?action=sysfurnList'
    }).fail(function () {
        alert("ERR sysfurnList");
    });
}
//----------------------------  SYSPAR1  ---------------------------------------
export function syspar1List() {
    return  $.ajax({
        url: 'dbset?action=syspar1List'
    }).fail(function () {
        alert("ERR syspar1List");
    });
}
//----------------------------  PARAMS  ---------------------------------------
export function paramsList() {
    return  $.ajax({
        url: 'dbset?action=paramsList'
    }).fail(function () {
        alert("ERR paramsList");
    });
}
//----------------------------  GROUP  ---------------------------------------
export function groupList() {
    return  $.ajax({
        url: 'dbset?action=groupList'
    }).fail(function () {
        alert("ERR groupList");
    });
}
//----------------------------  DEALER  ---------------------------------------
export function dealerList() {
    return  $.ajax({
        url: 'dbset?action=dealerList'
    }).fail(function () {
        alert("ERR dealerList");
    });
}
//----------------------------  KITS  ---------------------------------------
export function kitsList() {
    return  $.ajax({
        url: 'dbset?action=kitsList'
    }).fail(function () {
        alert("ERR kitsList");
    });
}
//----------------------------  KITDET  ---------------------------------------
export function kitdetList() {
    return  $.ajax({
        url: 'dbset?action=kitdetList'
    }).fail(function () {
        alert("ERR kitdetList");
    });
}
//----------------------------  PRJKIT  ---------------------------------------
export function prjkitList() {
    return  $.ajax({
        url: 'dbset?action=prjkitList'
    }).fail(function () {
        alert("ERR prjkitList");
    });
}
//------------------------------------------------------------------------------
