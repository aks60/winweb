<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SA-OKNA</title>

        <link rel="stylesheet" type="text/css" media="screen" href="lib-css/jquery-ui-1.13/redmond/jquery-ui.css">          
        <link rel="stylesheet" type="text/css" media="screen" href="lib-css/jqgrid-4.6.3/ui.jqgrid.css">
        <link rel="stylesheet" type="text/css" media="screen" href="lib-css/jstree-3.3.12/themes/default/style.min.css" />
        <link rel="stylesheet" type="text/css" media="screen" href="lib-css/menu.css">
        <link rel="stylesheet" type="text/css" media="screen" href="lib-css/html-ui.css">

        <script type="text/javascript" src="lib-js/jquery-3.6.0/jquery-3.6.0.js"></script>                               
        <script type="text/javascript" src="lib-js/jquery-ui-1.13/jquery-ui.js"></script> 
        <script type="text/javascript" src="lib-js/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>

        <script type="text/javascript" src="lib-js/jqgrid-4.6.3/i18n/grid.locale-ru.js"></script>
        <script type="text/javascript" src="lib-js/jqgrid-4.6.3/jquery.jqGrid.js"></script> 
        <script type="text/javascript" src="lib-js/jstree-3.3.12/jstree.js"></script>
        <script type="text/javascript" src="lib-js/jsts-2.12.1/jsts-min.js"></script>

        <script type="text/javascript" src="frame/uGui.js"></script>
        <script type="module" src="./build/Wincalc.js"></script>
        <script type="module" src="./build/making/Draw.js"></script>

        <script type="text/javascript">
            //Глобальные объекты
            var win = {dh_frm: 64, dh_crss: 80, naxl: 12}, dbrec = {}, login = {que_requests: 2},
                    users = {}, order = {orderID: 16767, wincalcMap: new Map(), prjprodRec: null}, product = {}, kits = {};
            //Таблицы базы данных
            var dbset = {systree: {}, sysprod: {}, color: {}, artikl: {}, artdet: {}, furniture: {}, furndet: {}, prjprod: {}, sysfurn: {},
                sysprof: {}, syspar1: {}, params: {}, group: {}, project: {}, dealer: {}, kits: {}, kitdet: {}, prjkit: {}};
            //Поля таблиц баз данных
            var SYSTREE = {id: 1, name: 2, glas: 3, depth: 4, col1: 5, col2: 6, col3: 7, cgrp: 8, types: 12, parent_id: 13},
                    GROUP = {id: 1, grup: 2, name: 4, val: 5}, 
                    COLOR = {id: 1, name: 3, rgb: 5, groups_id: 12},
                    ARTIKL = {id: 1, code: 2, level1: 3, level2: 4, name: 5, size_falz: 9, size_centr: 11, height: 14, depth: 15, analog_id: 35},
                    ARTDET = {id: 1, color_fk: 14, artikl_id: 15}, 
                    FURNITURE = {id: 1, name: 2},
                    FURNDET = {id: 1, color_fk: 3, artikl_id: 4, furniture_id1: 5, furniture_id2: 6, furndet_id: 7},
                    SYSPROF = {id: 1, prio: 2, use_type: 3, use_side: 4, artikl_id: 5, systree_id: 6},
                    SYSFURN = {id: 1, side_open: 4, hand_pos: 5, furniture_id: 6, artikl_id1: 7, artikl_id2: 8, systree_id: 9},
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
            //Глобальные настройки и параметры 
            jQuery.extend(jQuery.jgrid.defaults, {rowNum: 60});
            $.ajaxSetup({type: 'POST', dataType: 'json', async: true, cache: false});
            $.jstree.defaults.core.themes.variant = "large";

        </script>         
    </head>
    <body>
        <div id="mainmenu"></div>
        <div id="outbody"></div>  
        <div id="dialog-dic"></div> 
        <div id="dialog-mes" title="Сообщение"></div>
        <div id="dialog-list" style="display: none;"><table id="dtable" class="ui-jqgrid-btable"></table></div>

        <script type="module">
            import {Test1, Test2} from './frame/main.js';
            Test1();
            
            $("#outbody").load('frame/login.jsp', function () {
                login.user_connect();
                Promise.all([
                    $.post("dbset?action=systreeList"), $.post("dbset?action=sysprodList"), $.post("dbset?action=colorList"),
                    $.post("dbset?action=artiklList"), $.post("dbset?action=artdetList"), $.post("dbset?action=furnitureList"),
                    $.post("dbset?action=furndetList"), $.post("dbset?action=prjprodList"), $.post("dbset?action=sysfurnList"),
                    $.post("dbset?action=sysprofList"), $.post("dbset?action=syspar1List"), $.post("dbset?action=paramsList"),
                    $.post("dbset?action=groupList"), $.post("dbset?action=projectList"), $.post("dbset?action=dealerList"),
                    $.post("dbset?action=kitsList"), $.post("dbset?action=kitdetList"), $.post("dbset?action=prjkitList")
                ]).then(p => {
                    let keys = Object.keys(dbset);
                    for (var i = 0; i < keys.length; i++) {
                        dbset[keys[i]].list = p[i];
                    }
                    login.init_login();

                    dbset.sysprof.vrec = createVirtualRec(7, {1: -3, 2: 0, 3: 0, 4: -1, 5: -3, 6: -3});
                    dbset.artikl.vrec = createVirtualRec(37, {1: -3, 2: 'Авторасчёт', 5: 'Авторасчёт', 14: 80, 15: 4, 35: -3});
                    dbset.artdet.vrec = createVirtualRec(37, {1: -3, 14: -3, 15: -3});
                    dbset.color.vrec = createVirtualRec(15, {1: -3, 2: 'Авторасчёт', 4: -3, 14: -3});
                    dbset.sysfurn.vrec = createVirtualRec(10, {1: -3, 4: -1, 6: -3, 7: -3, 8: -3, 9: -3});
                    dbset.params.vrec = createVirtualRec(11, {1: -3, 2: 'Виртуал', 3: -3, 4: -3, 5: -3, 6: -3, 7: -3, 10: -3});

                }).catch(e => {
                    dialogMes('Ошибка', 'Ошибка загрузки базы данных. ' + e.message);
                });
            });
        </script> 
    </body>
</html>
