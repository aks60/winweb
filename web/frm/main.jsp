<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SA-OKNA</title>

        <link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui-1.13/redmond/jquery-ui.css">          
        <link rel="stylesheet" type="text/css" media="screen" href="css/jqgrid-4.6.3/ui.jqgrid.css">
        <link rel="stylesheet" type="text/css" media="screen" href="css/jstree-3.3.12/themes/default/style.min.css" />
        <link rel="stylesheet" type="text/css" media="screen" href="css/menu.css">
        <link rel="stylesheet" type="text/css" media="screen" href="css/html-ui.css">

        <script type="text/javascript" src="jss/jquery-3.6.0/jquery-3.6.0.js"></script>                               
        <script type="text/javascript" src="jss/jquery-ui-1.13/jquery-ui.js"></script> 
        <script type="text/javascript" src="jss/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>

        <script type="text/javascript" src="jss/jqgrid-4.6.3/i18n/grid.locale-ru.js"></script>
        <script type="text/javascript" src="jss/jqgrid-4.6.3/jquery.jqGrid.js"></script> 
        <script type="text/javascript" src="jss/jstree-3.3.12/jstree.js"></script>
        <script type="text/javascript" src="frm/utils.js"></script>
        <script type="module" src="frm/builder/wincalc.js"></script>

        <script type="text/javascript">
            //Поля таблиц
            var SYSTREE = {id: 1, name: 2, glas: 3, depth: 4, col1: 5, col2: 6, col3: 7, cgrp: 8, types: 12, parent_id: 13},
                    GROUP = {id: 1, grp: 2, name: 4, val: 5},
                    COLOR = {id: 1, name: 2, rgb: 4, colgrp_id: 14},
                    ARTIKL = {id: 1, code: 2, level1: 3, level2: 4, name: 5, height: 14, depth: 15, analog_id: 35},
                    ARTDET = {id: 1, color_fk: 14, artikl_id: 15},
                    FURNITURE = {id: 1, name: 2},
                    FURNDET = {id: 1, color_fk: 3, artikl_id: 4, furniture_id1: 5, furniture_id2: 6, furndet_id: 7},
                    SYSPROF = {id: 1, prio: 2, use_type: 3, use_side: 4, artikl_id: 5, systree_id: 6},
                    SYSFURN = {id: 1, side_open: 4, hand_pos: 5, furniture_id: 6, artikl_id1: 7, artikl_id2: 8, systree_id: 9},
                    SYSPROD = {id: 1, name: 2, script: 3, systree_id: 4},
                    PRJPROD = {id: 1, name: 3, script: 4, project_id: 5, systree_id: 6},
                    PRJKIT = {id: 1, numb: 2, width: 3, height: 4, color1_id: 5, color2_id: 6, color3_id: 7, flag: 10, artikl_id: 11, prjprod_id: 12},                    
                    SYSPAR1 = {id: 1, text: 2, params_id: 3, systree_id: 4, fixed: 5},
                    PARAMS = {id: 1, text: 2, params_id: 12},
                    ORDER = {id: 1, num_ord: 2, num_acc: 3, manager: 4, date4: 22, date5: 23, date6: 24, owner: 25, propart_id: 27},
                    USER = {id: 1, fio: 2, desc: 3, role: 4, login: 5},
                    KITS = {id: 1, name: 2, types: 3, categ: 4},
                    KITDET = {id: 1, flag: 2, color1_id: 3, color2_id: 4, color3_id: 5, artikl_id: 6, kits_id: 7};
                    DEALER = {id: 1, partner: 2, manager: 3};

            //Enum - перечисления
            var Type = {NONE: [0, 0, 'Не определено'], FRAME_SIDE: [1, 1, 'Сторона коробки'], STVORKA_SIDE: [2, 2, 'Сторона створки'],
                IMPOST: [3, 3, 'Импост'], STOIKA: [5, 5, 'Стойка'], ERKER: [7, 7, 'Эркер'], EDGE: [8, 8, 'Грань'], SHTULP: [9, 9, 'Штульп'],
                RECTANGL: [1001, 1, 'Окно четырёхугольно'], TRAPEZE: [1002, 1, 'Окно трапеция'], TRIANGL: [1003, 1, 'Треугольное окно'],
                ARCH: [1004, 1, 'Арочное окно'], STVORKA: [1005, 2, 'Створка'], FRAME: [1006, 3, 'Коробка'], DOOR: [1007, 3, 'Дверь']};
            var Layout = {ANY: [-1, 'Любая'], HORIZ: [-2, 'Горизонт.'], VERT: [-3, 'Вертикальн.'], BOTT: [1, 'Нижняя'],
                RIGHT: [2, 'Правая'], TOP: [3, 'Верхняя'], LEFT: [4, 'Левая'], FULL: [6, '']};
            var UseSide = {VERT: [-3, 'Вертикальная'], HORIZ: [-2, 'Горизонтальная'], ANY: [-1, 'Любая'], MANUAL: [0, 'Вручную'],
                BOT: [1, 'Нижняя'], RIGHT: [2, 'Правая'], TOP: [3, 'Верхняя'], LEFT: [4, 'Левая']};
            var TypeOpen = {FIXED: [0, "Глухая створка (не открывается)"], LEFT: [1, "Левая поворотная (открывается справа-налево, ручка справа)"],
                RIGHT: [2, "Правая поворотная (открывается слева-направо, ручка слева)"], LEFTUP: [3, "Левая поворотно-откидная"],
                RIGHTUP: [4, "Правая поворотно-откидная"], UPPER: [5, "Откидная (открывается сверху)"], LEFTMOV: [11, "Раздвижная влево (открывается справа-налево, защелка справа"],
                RIGHTMOV: [12, "Раздвижная вправо (открывается слева-направо, защелка слева"], INVALID: [16, "Не определено"]};

            //Глобальные объекты
            var win = {dh_frm: 64, dh_crss: 80, naxl: 12}, dbset = {}, dbrec = {wincalcMap: new Map(), orderRow: null, prjprodRec: null, dealerRow: null} 
                    login = {que_requests: 2}, users = {}, order = {rowid_table1: 1},  product = {}, kits = {};proprodRec:

            $(document).ready(function () {
                //Глобальные настройки и параметры 
                jQuery.extend(jQuery.jgrid.defaults, {rowNum: 60});
                $.ajaxSetup({type: 'POST', dataType: 'json', async: true, cache: false});
                $.jstree.defaults.core.themes.variant = "large";                
            });

            window.onload = function () {
                if (product.resize != undefined) {
                    product.resize();
                }
            };
            
            function loadBody(url) {
                $('#outbody').load(url, function () {
                    //upBody();
                });
            }
        </script>         
    </head>
    <body>
        <div id="mainmenu"></div>
        <div id="outbody"></div>  
        <div id="dialog-dic"></div> 
        <div id="dialog-mes" title="Сообщение"></div>
        <div id="dialog-list" style="display: none;"><table id="dtable" class="ui-jqgrid-btable"></table></div>

        <script type="module">
            import {
            systreeList, sysprodList, colorList,
                    artiklList, artdetList, furnitureList, furndetList, prjprodList, sysfurnList,
                    sysprofList, syspar1List, paramsList, groupList, orderList, dealerList, 
                    kitsList, kitdetList, prjkitList
            } from './frm/builder/dbset.js';

            $("#outbody").load('frm/login.jsp', function () {
                $.when(
                        systreeList(), sysprodList(), colorList(), artiklList(), artdetList(), furnitureList(),
                        furndetList(), prjprodList(), sysfurnList(), sysprofList(), syspar1List(), paramsList(),
                        groupList(), orderList(), dealerList(), kitsList(), kitdetList(), prjkitList()

                        ).done((p1, p2, p3, p4, p5, p6, p7, p8, p9, pA, pB, pC, pD, pE, pF, pG, pH, pI) => { //загрузка базы данных 
                    dbset.systreeList = p1[0].systreeList;
                    dbset.sysprodList = p2[0].sysprodList;
                    dbset.colorList = p3[0].colorList;
                    dbset.artiklList = p4[0].artiklList;
                    dbset.artdetList = p5[0].artdetList;
                    dbset.furnitureList = p6[0].furnitureList;
                    dbset.furndetList = p7[0].furndetList;
                    dbset.prjprodList = p8[0].prjprodList;
                    dbset.sysfurnList = p9[0].sysfurnList;
                    dbset.sysprofList = pA[0].sysprofList;
                    dbset.syspar1List = pB[0].syspar1List;
                    dbset.paramsList = pC[0].paramsList;
                    dbset.groupList = pD[0].groupList;
                    dbset.orderList = pE[0].orderList;
                    dbset.dealerList = pF[0].dealerList;
                    dbset.kitsList = pG[0].kitsList;
                    dbset.kitdetList = pH[0].kitdetList;
                    dbset.prjkitList = pI[0].prjkitList;

                    login.init_login();

                    //Виртуальные артикулы  
                    dbset.sysprofList.virtualRec = createVirtueRec(7, {1: -3, 2: 0, 3: 0, 4: -1, 5: -3, 6: -3});
                    dbset.artiklList.virtualRec = createVirtueRec(37, {1: -3, 2: 'Авторасчёт', 5: 'Авторасчёт', 14: 80, 15: 4, 35: -3});
                    dbset.artdetList.virtualRec = createVirtueRec(37, {1: -3, 14: -3, 15: -3});
                    dbset.colorList.virtualRec = createVirtueRec(15, {1: -3, 2: 'Авторасчёт', 4: -3, 14: -3});
                    dbset.sysfurnList.virtualRec = createVirtueRec(10, {1: -3, 4: -1, 6: -3, 7: -3, 8: -3, 9: -3});

                }).catch(() => {
                    dialogMes('Ошибка', 'Ошибка загрузки базы данных');
                })
            });
        </script> 
    </body>
</html>
