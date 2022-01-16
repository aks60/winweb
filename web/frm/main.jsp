<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SA-OKNA</title>

        <link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui-1.13/redmond/jquery-ui.css">          
        <link rel="stylesheet" type="text/css" media="screen" href="css/jqgrid-4.6.3/ui.jqgrid.css">
        <link rel="stylesheet" type="text/css" media="screen" href="css/menu.css">
        <link rel="stylesheet" type="text/css" media="screen" href="css/html-ui.css">

        <script type="text/javascript" src="jss/jquery-3.6.0/jquery-3.6.0.min.js"></script>                       
        <script type="text/javascript" src="jss/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="text/javascript" src="jss/jquery-ui-1.13/jquery-ui.min.js"></script>        

        <script type="text/javascript" src="jss/jqgrid-4.6.3/i18n/grid.locale-ru.js"></script>
        <script type="text/javascript" src="jss/jqgrid-4.6.3/jquery.jqGrid.js"></script> 
        <script type="module" src="frm/builder/wincalc.js"></script>         

        <script type="text/javascript">

            //Поля таблиц
            var SYSTREE = {id: 0, glas: 1, parent_id: 2},
                    SYSPROD = {id: 0, name: 1, script: 2, systree_id: 3},
                    GROUPS = {id: 0, name: 1},
                    COLOR = {id: 0, name: 1, rgb: 2, colgrp_id: 3},
                    ARTIKL = {id: 0, name: 1, code: 2, height: 3},
                    ARTDET = {id: 0, color_fk: 1, artikl_id: 2},
                    PROPROD = {id: 0, name: 1, script: 2, project_id: 3, systree_id: 4},
                    SYSFUR = {id: 0, side_open: 1, systree_id: 2};
            
            //Глобальные объекты
            var utils = {}, winc = {dh_frm: 64, dh_crss: 80, naxl: 12}, dbset = {}, login = {},
                    users = {}, order = {}, product = {}, dialog = {}, systree = {}, kits = {}, color = {}, sysprof = {};

            $(document).ready(function () {

                //Глобальные настройки и параметры 
                jQuery.extend(jQuery.jgrid.defaults, {rowNum: 60});
                $.ajaxSetup({type: "POST", dataType: "json", async: true, cache: false});
                $('button').button();
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
                load_systreeList,
                load_sysprodList,
                load_colorList, 
                load_artiklList, 
                load_artdetList, 
                load_proprodList, 
                load_sysfurnList
            } from './frm/builder/dbset.js';

            $("#outbody").load('frm/login.jsp', function () {                
                ++login.que_requests;
                Promise.all([
                    load_systreeList(), 
                    load_sysprodList(),
                    load_colorList(), 
                    load_artiklList(), 
                    load_artdetList(), 
                    load_proprodList(),
                    load_sysfurnList()
                ]).then(() => { //загрузка базы данных 
                    
                  login.init_login();

               }).catch(() => {
                    alert('Ошибка загрузки бд');
               })
            });
        </script> 
    </body>
</html>
