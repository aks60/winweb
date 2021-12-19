<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="js/color.js"></script>
        <title>COLOR</title>
        <script type="text/javascript">
            color.resize = function () {
//                var height = window.innerHeight - 68;
//                $("#midl").css("height", height);
            }

            $("button").button();

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    color.resize();
                }).trigger('resize');
            });
        </script>         
    </head>
    <body>
        <div id="north" style="height: calc(40% - 16px); width: calc(100% - 4px);">
            <table id="table1"  class="ui-jqgrid-btable"></table> 
            <script type="text/javascript">
                color.init_table1($("#table1"))
                color.load_table1($("#table1"))
            </script>
        </div>

        <div id="east" style="height: 60%; width: calc(100% - 4px)">
            <table id="table2"  class="ui-jqgrid-btable"></table>
            <script type="text/javascript">
                color.init_table2($("#table2"));
                color.load_table2($("#table2"));
            </script>  
        </div>
    </body>
</html>
