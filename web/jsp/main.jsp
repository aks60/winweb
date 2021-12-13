<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Main</title>
        <link rel="stylesheet" type="text/css" href="css/yui3-3.18.1/cssreset.css">
        <link rel="stylesheet" type="text/css" href="css/yui3-3.18.1/cssfonts.css">
        <link rel="stylesheet" type="text/css" href="css/yui3-3.18.1/cssgrids.css">            

        <link rel="stylesheet" type="text/css" media="screen" href="css/yui3-3.18.1/cssgrids.css">
        <link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui-1.13/redmond/jquery-ui.min.css">          
        <link rel="stylesheet" type="text/css" media="screen" href="css/jqgrid-4.6.3/ui.jqgrid.css">
        <!--<link rel="stylesheet" type="text/css" media="screen" href="css/ui.html/ui.html.css">--> 

        <script type="text/javascript" src="js/jquery-3.6/jquery-3.6.0.min.js"></script>             
        <script type="text/javascript" src="js/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="text/javascript" src="js/jquery-ui-1.13/jquery-ui.min.js"></script>        

        <script type="text/javascript"src="js/jqgrid-4.6.3/i18n/grid.locale-ru.js"></script>
        <script type="text/javascript"src="js/jqgrid-4.6.3/jquery.jqGrid.min.js"></script>

        <script type="text/javascript">

            //глобальные данные
            var login = {};
            var users = {};
            var order = {};
            
            var dataProp = [];
            var userList = [];
            var orderList = [];

            //глобальные настройки и параметры           
            $(function () {
                jQuery.extend(jQuery.jgrid.defaults, {rowNum: 60});
                $.ajaxSetup({type: "POST", dataType: "json", async: true, cache: false});
                $('#tabs').tabs();
                $('button').button();
            });

            //системные свойства
            $.ajax({
                url: 'dict?action=property',
                success: function (data) {
                    dataProp = data;
//                    dataProp['dateNow'] = formatDate2(new Date());
                }
            });
        </script> 
    </head>
    <body>
        <div id="tabs" style="display: none;">
            <ul>
                <li><a href="#tab1">Заказы</a>
                <li><a href="#tab2">Изделия</a>
                <li><a href="#tab3">Комплектация</a>            
            </ul>
            <div id="tab1">
                <!--TAB1-->
            </div>
            <div id="tab2">
                <!--TAB2-->
            </div>
            <div id="tab3">
                <!--TAB3-->
            </div>         
        </div>          
        <div id="outbody"></div>
        <script type="text/javascript">
            $("#outbody").load('jsp/login.jsp');
        </script>         
    </body>
</html>
