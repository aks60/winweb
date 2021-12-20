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
            html, #outbody { height:100%; }
            #north, #west, #west2, #centr, #east, #east2, #east3, #south {  border: 2px solid #ccc; }
            #midl { border: 0 !important; } 
        </style>

        <script type="text/javascript">
            //глобальные данные
            var utils = {}, login = {}, users = {}, order = {}, product = {}, dialog = {},
                    systree = {}, kits = {}, color = {}, sysprof = {};

            //глобальные настройки и параметры           
            $(document).ready(function () {
                jQuery.extend(jQuery.jgrid.defaults, {rowNum: 60});
                $.ajaxSetup({type: "POST", dataType: "json", async: true, cache: false});
                $('#tabs').tabs();
                $('button').button();
            });
        </script> 
    </head>
    <body  style="height: calc(100% - 8px);">
        <div id="tabs" style="display: none; height: 64px;">
            <ul>
                <li><a href="#tab1" style="padding: 4px 32px" onclick="$('#outbody').load('jsp/order.jsp');">Заказы</a>
                <li><a href="#tab2" style="padding: 4px 32px" onclick="$('#outbody').load('jsp/product.jsp');">Изделия</a>
                <li><a href="#tab3" style="padding: 4px 24px" onclick="$('#outbody').load('jsp/kits.jsp');">Комплектация</a>            
            </ul>
            <div id="tab1" style="padding: 4px">
                <button tabindex="1" type="button" onclick="$('#dialog-dic').load('jsp/dialog/systree.jsp');" style="width: 100px;">Test11</button>
                <button tabindex="2" type="button" onclick="$('#dialog-dic').load('jsp/dialog/color.jsp');" style="width: 100px;">Test12</button>
            </div>
            <div id="tab2" style="padding: 4px">
                <button tabindex="1" type="button" onclick="$('#dialog-dic').load('jsp/dialog/sysprof.html');" style="width: 100px;">Test21</button>
                <button tabindex="2" type="button" onclick="alert('2');" style="width: 100px;">Test22</button>
            </div>
            <div id="tab3" style="padding: 4px">
                <button tabindex="1" type="button" onclick="alert('1');" style="width: 100px;">Test31</button>
                <button tabindex="2" type="button" onclick="alert('2');" style="width: 100px;">Test32</button>
            </div>         
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
