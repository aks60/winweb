//------------------------------ENUMS-------------------------------------------
export const SYS = {id:0, glas:1, parent_id:2}; //SYSTREE
export const CGR = {id:0, name:1}; //GROUPS
export const COL = {id:0, name:1, rgb:2, colgrp_id:3}; //COLOR
export const ART = {id:0, name:1, code:2, height:3}; //ARTIKL
export const ADET = {id:0, color_fk:1, artikl_id:2}; //ARTDET
export const PROD = {id:0, name:1, script:2, project_id:3, systree_id:4}; //PROPROD
export const SFUR = {id:0, side_open:1, systree_id:2}; //SYSFURN
//------------------------------------------------------------------------------
dbset.find_rec = function (id, ds) {
    for (i = 0; i < ds.length; i++) {
        if (id == ds[i][0]) {
            return ds[i];
        }
    }
}
dbset.find2_rec = function (key, val, ds) {
    for (i = 0; i < ds.length; i++) {
        if (val == ds[i][key]) {
            return ds[i];
        }
    }
}
dbset.find_list = function (id, ds, fk) {
    let list = new Array();
    for (i = 0; i < ds.length; i++) {
        if (id == ds[i][fk]) {
            list.push(ds[i]);
        }
    }
    return list;
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
export function load_sysfurnList() {
    $.ajax({
        url: 'dbset?action=sysfurnList',
        success: function (data) {
            dbset.sysfurnList = data.sysfurnList;
        }
    });
}
//------------------------------------------------------------------------------
