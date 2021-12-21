<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="js/kits.js"></script> 
        <title>KITS</title>

        <script type="text/javascript">
            kits.resize = function () {
                var height = window.innerHeight;
                $("#context").css("height", height - 60);
                $("#table1").jqGrid('setGridWidth', $("#centr").width() - 4);
                $("#table1").jqGrid('setGridHeight', $("#centr").height() - 24);
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    kits.resize();
                }).trigger('resize');

                kits.init_table1($("#table1"));
                kits.load_table1($("#table1"));
            });
        </script>         
    </head>
    <body>
        <div id = "context">
            <div id="north" style=" height: 20px; width: 100%;">
                NORTH
            </div>               
            <div id="centr" style="width: 100%; height: calc(100% - 52px)">
                <table id="table1"  class="ui-jqgrid-btable"></table> 
            </div>          
            <div id="south" style="height: 20px; width: 100%;">
                SOUTH
            </div>
        </div>
    </body>
</html>
