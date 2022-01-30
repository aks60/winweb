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
            var SYSTREE = {'id': 0, 'glas': 1, 'parent_id': 2},
                    GROUPS = {'id': 0, 'name': 1},
                    COLOR = {'id': 0, 'name': 1, 'rgb': 2, 'colgrp_id': 3},
                    ARTIKL = {'id': 0, 'name': 1, 'code': 2, 'height': 3, 'analog_id': 4},
                    ARTDET = {'id': 0, 'color_fk': 1, 'artikl_id': 2},
                    SYSPROF = {'id': 0, 'prio': 1, 'use_type': 2, 'use_side': 3, 'artikl_id': 4, 'systree_id': 5},
                    SYSFURN = {'id': 0, 'side_open': 1, 'hand_pos': 2, 'systree_id': 3},
                    SYSPROD = {'id': 0, 'name': 1, 'script': 2, 'systree_id': 3},
                    PROPROD = {'id': 0, 'name': 1, 'script': 2, 'project_id': 3, 'systree_id': 4};            

            //Глобальные объекты
            var utils = {}, enums = {}, win = {dh_frm: 64, dh_crss: 80, naxl: 12}, dbset = {}, login = {que_requests: 2},
                    users = {}, order = {rowid_table1: 8, wincalcMap: new Map()}, product = {}, dialog = {}, systree = {}, kits = {}, color = {}, sysprof = {};

            $(document).ready(function () {

                //Глобальные настройки и параметры 
                jQuery.extend(jQuery.jgrid.defaults, {rowNum: 60});
                $.ajaxSetup({type: "POST", dataType: "json", async: true, cache: false});
                $('button').button();
                //$.jstree.defaults.core.themes.variant = "large";
            });
            window.onload = function () { };
        </script>         
    </head>
    <body>
        <div id="mainmenu"></div>
        <div id="outbody"></div>  
        <div id="dialog-dic"</div> 
        <div id="dialog-mes"></div> 

        <script type="module">
            import {
            load_systreeList, load_sysprodList, load_colorList,
            load_artiklList, load_artdetList, load_proprodList, 
            load_sysfurnList, load_sysprofList
            } from './frm/builder/dbset.js';

            $("#outbody").load('frm/login.jsp', function () {                

            $.when(
            load_systreeList(), load_sysprodList(), load_colorList(), 
            load_artiklList(), load_artdetList(), load_proprodList(), 
            load_sysfurnList(), load_sysprofList()

            ).done((p1, p2, p3, p4, p5, p6, p7, p8) => { //загрузка базы данных 
            dbset.systreeList = p1[0].systreeList;
            dbset.sysprodList = p2[0].sysprodList;
            dbset.colorList = p3[0].colorList;
            dbset.artiklList = p4[0].artiklList;
            dbset.artdetList = p5[0].artdetList;
            dbset.proprodList = p6[0].proprodList;
            dbset.sysfurnList = p7[0].sysfurnList;
            dbset.sysprofList = p8[0].sysprofList;

            login.init_login('dat');

            }).catch(() => {
            alert('Ошибка загрузки бд');
            })
            });
        </script> 
    </body>
</html>
