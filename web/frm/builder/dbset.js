//------------------------------ENUM--------------------------------------------
export const SYS = {id:0, glas:1, parent_id:2};
export const CGR = {id:0, name:1};
export const COL = {id:0, name:1, rgb:2, colgrp_id:3};
export const ART = {id:0, name:1, code:2, height:3};
export const ADET = {id:0, color_fk:1, artikl_id:2};
export const PROD = {id:0, name:1, script:2, project_id:3, systree_id:4};
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
//------------------------------------------------------------------------------
export function load_colorList() {
    $.ajax({
        url: 'dbset?action=colorList',
        success: function (data) {
            dbset.colorList = data.colorList;
        }
    });
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
        url: 'dbset?action=artdetList',
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
