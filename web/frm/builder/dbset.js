/*
 Уведомление об устаревании: обратные вызовы jqXHR.success(), jqXHR.error(), и jqXHR.complete()удалены в jQuery 3.0. 
 Вместо них можно использовать jqXHR.done(), jqXHR.fail(), и jqXHR.always().
 var jqxhr = $.ajax( "example.php" )
 .done(function() {
 alert( "success" );
 })
 .fail(function() {
 alert( "error" );
 })
 .always(function() {
 alert( "complete" );
 });
 */
//------------------------  SYSTREE  -------------------------------------------
export function systreeList() {
    return  $.ajax({
        url: 'dbset?action=systreeList'
    }).done(function (data) {
        debugger;
        alert("success");
    });
}
//------------------------  SYSPROD  -------------------------------------------
export function sysprodList() {
    return  $.ajax({
        url: 'dbset?action=sysprodList'
    });
}
//-------------------------  COLOR  --------------------------------------------
export function colorList() {
    return  $.ajax({
        url: 'dbset?action=colorList'
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
//////------------------------  SYSTREE  -------------------------------------------
//export function systreeList() {
//    return  $.ajax({
//        url: 'dbset?action=systreeList'
//    }).fail(function () {
//        console.log("ERR systreeList");
//    });
//}
////------------------------  SYSPROD  -------------------------------------------
//export function sysprodList() {
//    return  $.ajax({
//        url: 'dbset?action=sysprodList'
//    }).fail(function () {
//        console.log("ERR sysprodList");
//    });
//}
////-------------------------  COLOR  --------------------------------------------
//export function colorList() {
//    return  $.ajax({
//        url: 'dbset?action=colorList'
//    }).fail(function () {
//        console.log("ERR colorList");
//    });
//}
////--------------------------  ARTIKL  ------------------------------------------
//export function artiklList() {
//    return  $.ajax({
//        url: 'dbset?action=artiklList'
//    }).fail(function () {
//        console.log("ERR artiklList");
//    });
//}
////---------------------------  ARTDET  -----------------------------------------
//export function artdetList() {
//    return  $.ajax({
//        url: 'dbset?action=artdetList'
//    }).fail(function () {
//        console.log("ERR artdetList");
//    });
//}
////---------------------------  ORDER  -----------------------------------------
//export function orderList() {
//    return  $.ajax({
//        url: 'dbset?action=orderList'
//    }).fail(function () {
//        console.log("ERR orderList");
//    });
//}
////---------------------------  FURNITURE  --------------------------------------
//export function furnitureList() {
//    return  $.ajax({
//        url: 'dbset?action=furnitureList'
//    }).fail(function () {
//        console.log("ERR furnitureList");
//    });
//}
////---------------------------  FURNDET  --------------------------------------
//export function furndetList() {
//    return  $.ajax({
//        url: 'dbset?action=furndetList'
//    }).fail(function () {
//        console.log("ERR furndetList");
//    });
//}
////---------------------------  PRJPROD  ----------------------------------------
//export function prjprodList() {
//    return  $.ajax({
//        url: 'dbset?action=prjprodList'
//    }).fail(function () {
//        console.log("ERR prjprodList");
//    });
//}
////----------------------------  SYSFURN  ---------------------------------------
//export function sysprofList() {
//    return  $.ajax({
//        url: 'dbset?action=sysprofList'
//    }).fail(function () {
//        console.log("ERR sysprofList");
//    });
//}
////----------------------------  SYSFURN  ---------------------------------------
//export function sysfurnList() {
//    return  $.ajax({
//        url: 'dbset?action=sysfurnList'
//    }).fail(function () {
//        console.log("ERR sysfurnList");
//    });
//}
////----------------------------  SYSPAR1  ---------------------------------------
//export function syspar1List() {
//    return  $.ajax({
//        url: 'dbset?action=syspar1List'
//    }).fail(function () {
//        console.log("ERR syspar1List");
//    });
//}
////----------------------------  PARAMS  ---------------------------------------
//export function paramsList() {
//    return  $.ajax({
//        url: 'dbset?action=paramsList'
//    }).fail(function () {
//        console.log("ERR paramsList");
//    });
//}
////----------------------------  GROUP  ---------------------------------------
//export function groupList() {
//    return  $.ajax({
//        url: 'dbset?action=groupList'
//    }).fail(function () {
//        console.log("ERR groupList");
//    });
//}
////----------------------------  DEALER  ---------------------------------------
//export function dealerList() {
//    return  $.ajax({
//        url: 'dbset?action=dealerList'
//    }).fail(function () {
//        console.log("ERR dealerList");
//    });
//}
////----------------------------  KITS  ---------------------------------------
//export function kitsList() {
//    return  $.ajax({
//        url: 'dbset?action=kitsList'
//    }).fail(function () {
//        console.log("ERR kitsList");
//    });
//}
////----------------------------  KITDET  ---------------------------------------
//export function kitdetList() {
//    return  $.ajax({
//        url: 'dbset?action=kitdetList'
//    }).fail(function () {
//        console.log("ERR kitdetList");
//    });
//}
////----------------------------  PRJKIT  ---------------------------------------
//export function prjkitList() {
//    return  $.ajax({
//        url: 'dbset?action=prjkitList'
//    }).fail(function () {
//        console.log("ERR prjkitList");
//    });
//}
////------------------------------------------------------------------------------
