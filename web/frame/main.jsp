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

        <script type="text/javascript" src="frame/uGui.js"></script>
        <script type="module" src="./build/Wincalc.js"></script>
        <script type="module" src="./build/making/Draw.js"></script>

        <script type="module" src="domain/ARTDET.js"></script>
        <script type="module" src="./domain/ARTIKL.js"></script>
        <script type="module" src="./domain/COLOR.js"></script>
        <script type="module" src="domain/DEALER.js"></script>
        <script type="module" src="domain/FURNDET.js"></script>
        <script type="module" src="domain/FURNITURE.js"></script>
        <script type="module" src="domain/GROUPS.js"></script>
        <script type="module" src="domain/KITDET.js"></script>
        <script type="module" src="domain/PARAMS.js"></script>
        <script type="module" src="domain/PARMAP.js"></script>
        <script type="module" src="domain/PRJKIT.js"></script>
        <script type="module" src="domain/PRJPROD.js"></script>
        <script type="module" src="domain/PROJECT.js"></script>
        <script type="module" src="domain/SYSFURN.js"></script>
        <script type="module" src="domain/SYSPAR1.js"></script>
        <script type="module" src="domain/SYSPROD.js"></script>
        <script type="module" src="domain/SYSPROF.js"></script>
        <script type="module" src="domain/SYSTREE.js"></script>
        <script type="module" src="domain/SYSUSER.js"></script>

        <script type="text/javascript">
            //Поля таблиц
            var ARTDET, ARTIKL, COLOR, DEALER, FURNDET, FURNITURE, GROUPS, 
                    KITDET, PARAMS,PARMAP, PRJKIT, PRJPROD, PROJECT, SYSFURN, 
                    SYSPAR1, SYSPROD, SYSPROF, SYSTREE, SYSUSER;
            //Глобальные объекты
            var win = {dh_frm: 64, dh_crss: 80, naxl: 12}, dbrec = {}, login = {que_requests: 2}, fio = {},
                    users = {}, order = {orderID: 16767, wincalcMap: new Map(), prjprodRec: null}, product = {}, kits = {};
            //Таблицы базы данных
            var dbset = {systree: {}, sysprod: {}, color: {}, artikl: {}, artdet: {}, furniture: {}, furndet: {}, prjprod: {}, sysfurn: {},
                sysprof: {}, syspar1: {}, params: {}, group: {}, project: {}, dealer: {}, kits: {}, kitdet: {}, prjkit: {}};

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
            import {localizeFactory, Test} from './frame/main.js';
            localizeFactory();
            //Test();
            //alert(PROJECT.id);

            $("#outbody").load('frame/login.jsp', function () {
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
                    login.user_connect();
                }).catch(e => {
                    dialogMes('Ошибка', 'Ошибка загрузки базы данных. ' + e.message);
                });
            });
        </script> 
    </body>
</html>
