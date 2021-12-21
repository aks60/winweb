<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
        <script type="text/javascript" src="js/order.js"></script>
        <title>Order</title>

        <script type="text/javascript">
            order.resize = function () {
                var height = window.innerHeight;
                $("#context").css("height", height - 60);
                $("#table1").jqGrid('setGridWidth', $("#centr").width() - 4);
                $("#table1").jqGrid('setGridHeight', $("#centr").height() - 28);
                $("#table2").jqGrid('setGridWidth', $("#east3").width() - 4);
                $("#table2").jqGrid('setGridHeight', $("#east3").height() - 28);
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    order.resize();
                }).trigger('resize');

                order.init_table1($("#table1"));
                order.load_table1($("#table1"));
                order.init_table2($("#table2"));
                order.load_table2($("#table2"));
            });
        </script>
    </head>
    <body>
        <div id = "context">
            <div id="midl" style="position: relative; margin-right: 480px; height: calc(100% - 24px)">
                <div id="centr" style="height: 100%; width: 100%;">
                    <table id="table1"  class="ui-jqgrid-btable"></table> 
                </div>
                <div id="east" style="position: absolute; margin-top: 300px; width: 480px; top: 0; right: -480px; bottom: 0">
                    <div id="east2" style="margin-top: -302px; height: 300px;">
                        EAST2
                    </div>
                    <div id="east3" style="height: 100%; width: 98.6%;">
                        <table id="table2"  class="ui-jqgrid-btable"></table> 
                    </div>                
                </div>
            </div>
            <div id="south" style="height: 20px">
                SOUTH
            </div> 
        </div> 
    </body>
</html>
