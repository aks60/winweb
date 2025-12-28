//Поля таблиц баз данных
const SYSTREE = {id: 1, name: 2, glas: 3, depth: 4, col1: 5, col2: 6, col3: 7, cgrp: 8, types: 12, parent_id: 13},
        GROUP = {id: 1, grup: 2, name: 4, val: 5},
        COLOR = {id: 1, name: 3, rgb: 5, groups_id: 12},
        ARTIKL = {id: 1, code: 2, level1: 3, level2: 4, name: 5, size_falz: 9, size_centr: 11, height: 14, depth: 15, analog_id: 35, vrec: virtualRec(35)},
        ARTDET = {id: 1, color_fk: 14, artikl_id: 15},
        FURNITURE = {id: 1, name: 2},
        FURNDET = {id: 1, color_fk: 3, artikl_id: 4, furniture_id1: 5, furniture_id2: 6, furndet_id: 7},
        SYSPROF = {id: 1, prio: 2, use_type: 3, use_side: 4, artikl_id: 5, systree_id: 6},
        SYSFURN = {id: 1, side_open: 4, hand_pos: 5, furniture_id: 6, artikl_id1: 7, artikl_id2: 8, systree_id: 9, vrec: virtualRec(10)},
        SYSPROD = {id: 1, name: 2, script: 3, systree_id: 4},
        PRJPROD = {id: 1, name: 3, script: 4, project_id: 5, systree_id: 6},
        PRJKIT = {id: 1, numb: 2, width: 3, height: 4, color1_id: 5, color2_id: 6, color3_id: 7, flag: 10, artikl_id: 11, prjprod_id: 12},
        SYSPAR1 = {id: 1, text: 2, params_id: 3, systree_id: 4, fixed: 5},
        PARAMS = {id: 1, text: 2, groups_id: 10},
        PARMAP = {id: 1, groups_id: 8, color_id1: 9, color_id2: 10},
        PROJECT = {id: 1, num_ord: 2, num_acc: 3, manager: 4, date4: 19, date5: 20, date6: 21, owner: 22, prjpart_id: 25},
        USER = {id: 1, role: 2, login: 3, fio: 4, desc: 7}, KITS = {id: 1, name: 2, types: 3, categ: 4},
        KITDET = {id: 1, flag: 2, color1_id: 3, color2_id: 4, color3_id: 5, artikl_id: 6, kits_id: 7},
        DEALER = {id: 1, partner: 3, login: 4};
//
function virtualRec(size, virtualData) {
    const vrec = new Array(size);
    for (let m of vrec) {
        m = null;
    }
    if (virtualData !== undefined) {
        for (let k in virtualData) {
            vrec[k] = virtualData[k];
        }
    }
    vrec[0] = 'SEL';
    return vrec;
}
