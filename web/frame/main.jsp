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
        <script type="text/javascript" src="/winweb/enums/Fields.js"></script>
        <script type="module" src="./build/Wincalc.js"></script>
        <script type="module" src="./build/making/Draw.js"></script>

        <script type="text/javascript">
            //Глобальные объекты
            var win = {dh_frm: 64, dh_crss: 80, naxl: 12}, dbrec = {}, login = {que_requests: 2},
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
            //import {Test1, Test2} from './frame/main.js';
            //Test1();
            
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

                    dbset.sysprof.vrec = createVirtualRec(7, {1: -3, 2: 0, 3: 0, 4: -1, 5: -3, 6: -3});
                    dbset.artikl.vrec = createVirtualRec(37, {1: -3, 2: 'Авторасчёт', 5: 'Авторасчёт', 14: 80, 15: 4, 35: -3});
                    dbset.artdet.vrec = createVirtualRec(37, {1: -3, 14: -3, 15: -3});
                    dbset.color.vrec = createVirtualRec(15, {1: -3, 2: 'Авторасчёт', 4: -3, 5: '000000', 14: -3});
                    dbset.sysfurn.vrec = createVirtualRec(10, {1: -3, 4: -1, 6: -3, 7: -3, 8: -3, 9: -3});
                    dbset.params.vrec = createVirtualRec(11, {1: -3, 2: 'Виртуал', 3: -3, 4: -3, 5: -3, 6: -3, 7: -3, 10: -3});

                }).catch(e => {
                    dialogMes('Ошибка', 'Ошибка загрузки базы данных. ' + e.message);
                });
            });
        </script> 
    </body>
</html>
