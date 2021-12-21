<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SA-OKNA</title>

        <link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui-1.13/redmond/jquery-ui.css">          
        <link rel="stylesheet" type="text/css" media="screen" href="css/jqgrid-4.6.3/ui.jqgrid.css">

        <script type="text/javascript" src="js/jquery-2.2.4/jquery-2.2.4.min.js"></script>             
        <script type="text/javascript" src="js/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="text/javascript" src="js/jquery-ui-1.13/jquery-ui.min.js"></script>        

        <script type="text/javascript"src="js/jqgrid-4.6.3/i18n/grid.locale-ru.js"></script>
        <script type="text/javascript"src="js/jqgrid-4.6.3/jquery.jqGrid.js"></script>         

        <style type="text/css">
            #context, #north, #west, #west2, #centr, #east, #east2, #east3, #south {  border: 2px solid #ccc; }
            /*#context {  border: 2px solid #0000ff; }*/
            #nav {
                background-repeat:repeat-x;
                background-image:url('img/tool/strip_bg.jpg');
                height: 30px;
                paddingt: 0 16px;
            }
            #nav button { 
                height: 24px; 
                width: 120px; 
                margin: 2px 8px; 
                font-size: 12px; 
                font-weight: bold;
                color: #000;
            }
            /*#midl { border: 0 !important; }*/ 
        </style>

        <script type="text/javascript">
            //глобальные данные
            var win = {};
            var utils = {}, login = {}, users = {}, order = {}, product = {}, dialog = {},
                    systree = {}, kits = {}, color = {}, sysprof = {};

            //глобальные настройки и параметры           
            $(document).ready(function () {
                jQuery.extend(jQuery.jgrid.defaults, {rowNum: 60});
                $.ajaxSetup({type: "POST", dataType: "json", async: true, cache: false});
                $('button').button();
            });
        </script> 
    </head>
    <body>
        <div id="nav" style="display: none;">
            <img src="img/tool/logotype3.png" height="20px" width="20px" style="margin: 4px; float: left">
            <button onClick="$('#outbody').load('jsp/order.jsp');">Заказы</button> 
            <button onClick="$('#outbody').load('jsp/product.jsp');">Изделия</button> 
            <button onClick="$('#outbody').load('jsp/kits.jsp');">Комплектация</button> 
            <button onClick="$('#dialog-dic').load('jsp/dialog/systree.jsp');">TEST1</button> 
            <button onClick="$('#dialog-dic').load('jsp/dialog/color.jsp');">TEST2</button> 
            <button onClick="$('#dialog-dic').load('jsp/dialog/sysprof.jsp');">TEST3</button> 
            <button onClick="" style="float:right">Отчёт</button>
        </div>
        <div id="outbody"></div>  
        <div id="dialog-dic"</div> 
        <div id="dialog-mes"></div> 

        <script type="text/javascript">
//            $("#outbody").load('jsp/dialog/sysprof.html');
            $("#outbody").load('jsp/login.jsp');
        </script> 
    </body>
</html>
