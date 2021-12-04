<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Main</title>
        <link rel="stylesheet" type="text/css" media="screen" href="css/yui3-3.18.1/cssgrids.css">
        <link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui-themes-1.13/themes/redmond/jquery-ui.min.css">       
        <link rel="stylesheet" type="text/css" media="screen" href="css/jqgrid-4.6.3/ui.jqgrid.css">

        <script type="text/javascript" src="js/jquery-3.6/jquery-3.6.0.min.js"></script>             
        <script type="text/javascript" src="js/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="text/javascript" src="js/jquery-ui-1.13/jquery-ui.min.js"></script>        

        <script type="text/javascript"src="js/jqgrid-4.6.3/i18n/grid.locale-ru.js"></script>
        <script type="text/javascript"src="js/jqgrid-4.6.3/jquery.jqGrid.min.js"></script>

        <script type="text/javascript">

            //глобальные данные
            var dataProp = [];

            //глобальные настройки и параметры
            jQuery.extend(jQuery.jgrid.defaults, {rowNum: 60});
            $.ajaxSetup({type: "POST", dataType: "json", async: true, cache: false});
            //системные свойства
            $.ajax({
                url: 'dict?action=property',
                success: function (data) {
                    dataProp = data;
//                    dataProp['dateNow'] = formatDate2(new Date());
                }
            });
            function loadBody(url) {
                $('#outbody').load(url, function () {
                    //upBody();
                    //$("button").button();
                });
            }
        </script>        
    </head>
    <body>
        <div id="outbody"></div>
        <script type="text/javascript">
            $("#outbody").load('view/login.jsp');
        </script>         
    </body>
</html>
