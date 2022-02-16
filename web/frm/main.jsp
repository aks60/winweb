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
        <script type="text/javascript" src="jss/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="text/javascript" src="jss/jquery-ui-1.13/jquery-ui.js"></script>        

        <script type="text/javascript" src="jss/jqgrid-4.6.3/i18n/grid.locale-ru.js"></script>
        <script type="text/javascript" src="jss/jqgrid-4.6.3/jquery.jqGrid.js"></script> 
        <script type="text/javascript" src="jss/jstree-3.3.12/jstree.js"></script>
        <script type="text/javascript" src="frm/utils.js"></script>
        <script type="module" src="frm/builder/wincalc.js"></script>

        <script type="text/javascript">

            //Поля таблиц
            var SYSTREE = {id: 0, name: 1, glas: 2, depth: 3, col1: 4, col2: 5, col3: 6, cgrp: 7, types: 8, parent_id: 9},
                    GROUP = {id: 0, grp: 1, name: 2, val: 3},
                    COLOR = {id: 0, name: 1, rgb: 2, colgrp_id: 3},
                    ARTIKL = {id: 0, code: 1, level1: 2, level2: 3, name: 4, height: 5, depth: 6, analog_id: 7},
                    ARTDET = {id: 0, color_fk: 1, artikl_id: 2},
                    FURNITURE = {id: 0, name: 1},
                    SYSPROF = {id: 0, prio: 1, use_type: 2, use_side: 3, artikl_id: 4, systree_id: 5},
                    SYSFURN = {id: 0, side_open: 1, hand_pos: 2, systree_id: 3, furniture_id: 4, artikl_id1: 5, artikl_id2: 6},
                    SYSPROD = {id: 0, name: 1, script: 2, systree_id: 3},
                    PROPROD = {id: 0, name: 1, script: 2, project_id: 3, systree_id: 4},
                    SYSPAR1 = {id: 0, text: 1, params_id: 2, fixed: 3, systree_id: 4},
                    PARAMS = {id: 0, text: 1, params_id: 2};

            //Enum - перечисления
            var Type = {NONE: [0, 0, 'Не определено'], FRAME_SIDE: [1, 1, 'Сторона коробки'], STVORKA_SIDE: [2, 2, 'Сторона створки'],
                IMPOST: [3, 3, 'Импост'], STOIKA: [5, 5, 'Стойка'], ERKER: [7, 7, 'Эркер'], EDGE: [8, 8, 'Грань'], SHTULP: [9, 9, 'Штульп'],
                RECTANGL: [1001, 1, 'Окно четырёхугольно'], TRAPEZE: [1002, 1, 'Окно трапеция'], TRIANGL: [1003, 1, 'Треугольное окно'],
                ARCH: [1004, 1, 'Арочное окно'], STVORKA: [1005, 2, 'Створка'], FRAME: [1006, 3, 'Коробка'], DOOR: [1007, 3, 'Дверь']};
            var Layout = {ANY: [-1, 'Любая'], HORIZ: [-2, 'Горизонт.'], VERT: [-3, 'Вертикальн.'], BOTT: [1, 'Нижняя'],
                RIGHT: [2, 'Правая'], TOP: [3, 'Верхняя'], LEFT: [4, 'Левая'], FULL: [6, '']};
            var UseSide = {VERT: [-3, 'Вертикальная'], HORIZ: [-2, 'Горизонтальная'], ANY: [-1, 'Любая'], MANUAL: [0, 'Вручную'],
                BOT: [1, 'Нижняя'], RIGHT: [2, 'Правая'], TOP: [3, 'Верхняя'], LEFT: [4, 'Левая']};

            //Глобальные объекты
            var utils = {}, win = {dh_frm: 64, dh_crss: 80, naxl: 12}, dbset = {}, login = {que_requests: 2},
                    users = {}, order = {rowid_table1: 8, rec_table2: null, wincalcMap: new Map()}, artikl = {}, product = {},
                    dialog = {}, systree = {}, kits = {}, group = {}, color = {}, sysprof = {}, params = {};

            $(document).ready(function () {

                //Глобальные настройки и параметры 
                jQuery.extend(jQuery.jgrid.defaults, {rowNum: 60});
                $.ajaxSetup({type: 'POST', dataType: 'json', async: true, cache: false});
                $('button').button();
                $.jstree.defaults.core.themes.variant = "large";
            });
            window.onload = function () {
                if (product.resize != undefined) {
                    product.resize();
                }
            };

        </script>         
    </head>
    <body>
        <div id="mainmenu"></div>
        <div id="outbody"></div>  
        <div id="dialog-dic"</div> 
        <div id="dialog-mes"></div>
        <div id="dialog-list" style="display: none;"><table id="dtable" class="ui-jqgrid-btable"></table></div>

        <script type="module">
            import {
            systreeList, sysprodList, colorList,
            artiklList, artdetList, furnitureList, 
            proprodList, sysfurnList, sysprofList,
            syspar1List, paramsList, groupList
            } from './frm/builder/dbset.js';

            $("#outbody").load('frm/login.jsp', function () {                

            $.when(
            systreeList(), sysprodList(), colorList(), 
            artiklList(), artdetList(), furnitureList(), 
            proprodList(), sysfurnList(), sysprofList(),
            syspar1List(), paramsList(), groupList()

            ).done((p1, p2, p3, p4, p5, p6, p7, p8, p9, pA, pB, pC) => { //загрузка базы данных 
            dbset.systreeList = p1[0].systreeList;
            dbset.sysprodList = p2[0].sysprodList;
            dbset.colorList = p3[0].colorList;
            dbset.artiklList = p4[0].artiklList;            
            dbset.artdetList = p5[0].artdetList;
            dbset.furnitureList = p6[0].furnitureList;
            dbset.proprodList = p7[0].proprodList;
            dbset.sysfurnList = p8[0].sysfurnList;
            dbset.sysprofList = p9[0].sysprofList;
            dbset.syspar1List = pA[0].syspar1List;
            dbset.paramsList = pB[0].paramsList;
            dbset.groupList = pC[0].groupList;

            login.init_login('dat');

            //Виртуальные артикулы  
            dbset.sysprofList.virtualRec = [-3, 0, 0, -1, -3, -3];
            dbset.artiklList.virtualRec = [-3, "Virtual", 0, 0, "Virtual", 80, 4, -3];
            dbset.artdetList.virtualRec = [-3, -3, -3];
            dbset.colorList.virtualRec = [-3, "Virtual", -3, -3];

            }).catch(() => {
            alert('Ошибка загрузки бд');
            })
            });
        </script> 
    </body>
</html>
