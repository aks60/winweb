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

        <script type="text/javascript">
            
            //Глобальные данные
            var winc = {dh_frame: 64, dh_cross: 80, naxl: 12};
            var utils = {}, dataset = {}, login = {}, users = {}, order = {},
                    product = {}, dialog = {}, systree = {}, kits = {}, color = {}, sysprof = {};
                      
            $(document).ready(function () {
                //Глобальные настройки и параметры 
                jQuery.extend(jQuery.jgrid.defaults, {rowNum: 60});
                $.ajaxSetup({type: "POST", dataType: "json", async: true, cache: false});
                $('button').button();
            });

            window.onload = function () {
                dataset.load_colorList();
                dataset.load_prodList();
            };
        </script> 
        <script type="module" src="frm/builder/wincalc.js"></script>         
        <script type="text/javascript" src="frm/builder/dataset.js"></script>
        <script type="text/javascript"src="frm/utils.js"></script> 

    </head>
    <body>
        <div id="mainmenu" style="display: none;"></div>
        <div id="outbody"></div>  
        <div id="dialog-dic"</div> 
        <div id="dialog-mes"></div> 

        <script type="text/javascript">
            $("#mainmenu").load('frm/menu.jsp');
            $("#outbody").load('frm/login.jsp');
        </script> 
    </body>
</html>
