//------------------------------------------------------------------------------
export function load_colorList() {
    $.ajax({
        url: 'dbset?action=colorList',
        success: function (data) {
            dbset.colorList = data.colorList;
        }
    });
}
dbset.find_colorRec = function (id) {
    for (i = 0; i < dbset.colorList.length; i++) {
        if (id == dbset.colorList[i][0]) {
            return dbset.colorList[i];
        }
    }
}
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
//------------------------------------------------------------------------------
export function load_artdetList() {
    $.ajax({
        url: 'dbset?action=artdetlList',
        success: function (data) {
            dbset.artdetList = data.artdetList;
        }
    });
}
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
