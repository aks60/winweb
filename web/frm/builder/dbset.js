//------------------------------------------------------------------------------
dbset.find_rec = function (id, ds) {
    for (i = 0; i < ds.length; i++) {
        if (id == ds[i][0]) {
            return ds[i];
        }
    }
}
//------------------------------------------------------------------------------
export function load_treeList() {
    $.ajax({
        url: 'dbset?action=treeList',
        success: function (data) {
            dbset.treeList = data.treeList;
        }
    });
}
//dbset.find_treeRec = function (id) {
//    for (i = 0; i < dbset.treeList.length; i++) {
//        if (id == dbset.treeList[i][0]) {
//            return dbset.treeList[i];
//        }
//    }
//}
//------------------------------------------------------------------------------
export function load_colorList() {
    $.ajax({
        url: 'dbset?action=colorList',
        success: function (data) {
            dbset.colorList = data.colorList;
        }
    });
}
//dbset.find_colorRec = function (id) {
//    for (i = 0; i < dbset.colorList.length; i++) {
//        if (id == dbset.colorList[i][0]) {
//            return dbset.colorList[i];
//        }
//    }
//}
dbset.find_colorList = function (colgrp_id) {
    let list = new Array();
    for (i = 0; i < dbset.colorList.length; i++) {
        if (colgrp_id == dbset.colorList[i][3]) {
            list.push(dbset.colorList[i]);
        }
    }
    return list;
}
//------------------------------------------------------------------------------
export function load_artiklList() {
    $.ajax({
        url: 'dbset?action=artiklList',
        success: function (data) {
            dbset.artiklList = data.artiklList;
        }
    });
}
//dbset.find_artiklRec = function (id) {
//    for (i = 0; i < dbset.artiklList.length; i++) {
//        if (id == dbset.artiklList[i][0]) {
//            return dbset.artiklList[i];
//        }
//    }
//}
//------------------------------------------------------------------------------
export function load_artdetList() {
    $.ajax({
        url: 'dbset?action=artdetlList',
        success: function (data) {
            dbset.artdetList = data.artdetList;
        }
    });
}
//dbset.find_artdetRec = function (id) {
//    for (i = 0; i < dbset.artdetList.length; i++) {
//        if (id == dbset.artdetList[i][0]) {
//            return dbset.artdetList[i];
//        }
//    }
//}
//------------------------------------------------------------------------------
export function load_productList() {
    $.ajax({
        url: 'dbset?action=prodList',
        success: function (data) {
            dbset.productList = data.prodList;
        }
    });
}
//------------------------------------------------------------------------------
