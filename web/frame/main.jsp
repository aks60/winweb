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

        <script type="text/javascript" src="lib-js/jquery-3.6.0/jquery-3.6.0.min.js"></script>                               
        <script type="text/javascript" src="lib-js/jquery-ui-1.13/jquery-ui.min.js"></script> 
        <script type="text/javascript" src="lib-js/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>

        <script type="text/javascript" src="lib-js/jqgrid-4.6.3/i18n/grid.locale-ru.js"></script>
        <script type="text/javascript" src="lib-js/jqgrid-4.6.3/jquery.jqGrid.min.js"></script> 
        <script type="text/javascript" src="lib-js/jstree-3.3.12/jstree.min.js"></script>
        <script type="text/javascript" src="lib-js/jsts-2.11.2/jsts-min.js"></script>

        <script type="text/javascript" src="frame/uGui.js"></script>
        <script type="module" src="./build/Wincalc.js"></script>
        <script type="module" src="./build/making/Draw.js"></script>

        <script type="module" src="./domain/eArtdet.js"></script>
        <script type="module" src="./domain/eArtikl.js"></script>
        <script type="module" src="./domain/eColor.js"></script>
        <script type="module" src="./domain/eDealer.js"></script>
        <script type="module" src="./domain/eElement.js"></script>
        <script type="module" src="./domain/eFurndet.js"></script>
        <script type="module" src="./domain/eFurniture.js"></script>
        <script type="module" src="./domain/eGroups.js"></script>
        <script type="module" src="./domain/eKitdet.js"></script>
        <script type="module" src="./domain/eKits.js"></script>
        <script type="module" src="./domain/eParams.js"></script>
        <script type="module" src="./domain/eParmap.js"></script>
        <script type="module" src="./domain/ePrjkit.js"></script>
        <script type="module" src="./domain/ePrjprod.js"></script>
        <script type="module" src="./domain/eProject.js"></script>
        <script type="module" src="./domain/eSysfurn.js"></script>
        <script type="module" src="./domain/eSyspar1.js"></script>
        <script type="module" src="./domain/eSysprod.js"></script>
        <script type="module" src="./domain/eSysprof.js"></script>
        <script type="module" src="./domain/eSyssize.js"></script>
        <script type="module" src="./domain/eSystree.js"></script>
        <script type="module" src="./domain/eSysuser.js"></script>        

        <script type="text/javascript">

            //Поля таблиц
            var eArtdet, eArtikl, eColor, eDealer, eKits, eFurndet, eFurniture, eGroups,
                    eKitdet, eParams, eParmap, ePrjkit, ePrjprod, eProject, eSysfurn,
                    eSyspar1, eSysprod, eSysprof, eSyssize, eSystree, eSysuser;
            var eElement;

            //Глобальные объекты
            var dbrec = {}, login = {que_requests: 2}, fio = {}, users = {},
                    order = {orderID: 16767, wincalcMap: new Map(), prjprodRec: null},
                    product = {}, kits = {};

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
            import {localizeFactory, Test1} from './frame/main.js';
            localizeFactory();
            Test1();

            $("#outbody").load('frame/login.jsp', function () {
                Promise.all([
                    $.post("dbset?action=systreeList"), $.post("dbset?action=sysprodList"), $.post("dbset?action=colorList"),
                    $.post("dbset?action=artiklList"), $.post("dbset?action=artdetList"), $.post("dbset?action=furnitureList"),
                    $.post("dbset?action=furndetList"), $.post("dbset?action=prjprodList"), $.post("dbset?action=sysfurnList"),
                    $.post("dbset?action=sysprofList"), $.post("dbset?action=syspar1List"), $.post("dbset?action=paramsList"),
                    $.post("dbset?action=groupList"), $.post("dbset?action=projectList"), $.post("dbset?action=dealerList"),
                    $.post("dbset?action=kitsList"), $.post("dbset?action=kitdetList"), $.post("dbset?action=prjkitList"),
                    $.post("dbset?action=syssizeList")
                ]).then(p => {
                    eSystree.list = p[0], eSysprod.list = p[1], eColor.list = p[2], eArtikl.list = p[3], eArtdet.list = p[4], eFurniture.list = p[5],
                            eFurndet.list = p[6], ePrjprod.list = p[7], eSysfurn.list = p[8], eSysprof.list = p[9], eSyspar1.list = p[10], eParams.list = p[11],
                            eGroups.list = p[12], eProject.list = p[13], eDealer.list = p[14], eKits.list = p[15], eKitdet.list = p[16], ePrjkit.list = p[17],
                            eSyssize.list = p[18];

                    login.init_login();
                    //login.user_connect();

                }).catch(e => {
                    dialogMes('Ошибка', 'Ошибка загрузки базы данных. ' + e.message);
                });
            });
        </script> 
    </body>
</html>
