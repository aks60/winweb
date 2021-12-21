<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SA-OKNA</title>

        <link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui-1.13/redmond/jquery-ui.css">          
        <link rel="stylesheet" type="text/css" media="screen" href="css/jqgrid-4.6.3/ui.jqgrid.css">
        <link rel="stylesheet" type="text/css" media="screen" href="css/menu.css">

        <script type="text/javascript" src="js/jquery-2.2.4/jquery-2.2.4.min.js"></script>             
        <script type="text/javascript" src="js/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="text/javascript" src="js/jquery-ui-1.13/jquery-ui.min.js"></script>        

        <script type="text/javascript"src="js/jqgrid-4.6.3/i18n/grid.locale-ru.js"></script>
        <script type="text/javascript"src="js/jqgrid-4.6.3/jquery.jqGrid.js"></script>         

        <style type="text/css">
            #context, #north, #west, #west2, #centr, #east, #east2, #east3, #south {  border: 2px solid #ccc; }
            #context {  border: 2px solid #0000ff; }
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
                $("#mainmenu").load('jsp/menu.jsp', function () {  onMenu(); });
            });
        </script> 
    </head>
    <body>
        <div id="mainmenu" style="display: none;"></div>
        <div id="outbody"></div>  
        <div id="dialog-dic"</div> 
        <div id="dialog-mes"></div> 

        <script type="text/javascript">
           // $("#mainmenu").load('jsp/menu.jsp', function () {  onMenu(); });
            $("#outbody").load('jsp/login.jsp');
        </script> 
    </body>
</html>
