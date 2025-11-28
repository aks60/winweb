//------------------------  SYSTREE  -------------------------------------------
export function systreeList() {
    return  $.ajax({
        url: 'dbset?action=systreeList',
        success: function (data) {
            alert("OK systreeList");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("ERR systreeList");
        },
        complete: function () {
            alert("ALL systreeList");
        }
    });
}
//------------------------  SYSPROD  -------------------------------------------
export function sysprodList() {
    return  $.ajax({
        url: 'dbset?action=sysprodList'
    }).done(function (data) {
        alert("OK sysprodList");
    }).fail(function () {
        alert("ERR sysprodList");
    }).always(function () {
        alert("ALL sysprodList");
    });
}
//-------------------------  COLOR  --------------------------------------------
export function colorList() {
    return  $.ajax({
        url: 'dbset?action=colorList'
    }).done(function (data) {
        alert("OK colorList");
    }).fail(function () {
        alert("ERR colorList");
    }).always(function () {
        alert("ALL colorList");
    });
}
//--------------------------  ARTIKL  ------------------------------------------
export function artiklList() {
    return  $.ajax({
        url: 'dbset?action=artiklList'
    });
}
//---------------------------  ARTDET  -----------------------------------------
export function artdetList() {
    return  $.ajax({
        url: 'dbset?action=artdetList'
    });
}
//---------------------------  ORDER  -----------------------------------------
export function orderList() {
    return  $.ajax({
        url: 'dbset?action=orderList'
    });
}
//---------------------------  FURNITURE  --------------------------------------
export function furnitureList() {
    return  $.ajax({
        url: 'dbset?action=furnitureList'
    });
}
//---------------------------  FURNDET  --------------------------------------
export function furndetList() {
    return  $.ajax({
        url: 'dbset?action=furndetList'
    });
}
//---------------------------  PRJPROD  ----------------------------------------
export function prjprodList() {
    return  $.ajax({
        url: 'dbset?action=prjprodList'
    });
}
//----------------------------  SYSFURN  ---------------------------------------
export function sysprofList() {
    return  $.ajax({
        url: 'dbset?action=sysprofList'
    });
}
//----------------------------  SYSFURN  ---------------------------------------
export function sysfurnList() {
    return  $.ajax({
        url: 'dbset?action=sysfurnList'
    });
}
//----------------------------  SYSPAR1  ---------------------------------------
export function syspar1List() {
    return  $.ajax({
        url: 'dbset?action=syspar1List'
    });
}
//----------------------------  PARAMS  ---------------------------------------
export function paramsList() {
    return  $.ajax({
        url: 'dbset?action=paramsList'
    });
}
//----------------------------  GROUP  ---------------------------------------
export function groupList() {
    return  $.ajax({
        url: 'dbset?action=groupList'
    });
}
//----------------------------  DEALER  ---------------------------------------
export function dealerList() {
    return  $.ajax({
        url: 'dbset?action=dealerList'
    });
}
//----------------------------  KITS  ---------------------------------------
export function kitsList() {
    return  $.ajax({
        url: 'dbset?action=kitsList'
    });
}
//----------------------------  KITDET  ---------------------------------------
export function kitdetList() {
    return  $.ajax({
        url: 'dbset?action=kitdetList'
    });
}
//----------------------------  PRJKIT  ---------------------------------------
export function prjkitList() {
    return  $.ajax({
        url: 'dbset?action=prjkitList'
    });
}
//------------------------------------------------------------------------------
