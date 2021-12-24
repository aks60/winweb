<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
        <script type="text/javascript" src="frm/order.js"></script>
        <title>Order</title>

        <script type="text/javascript">
            order.resize = function () {
                var height = window.innerHeight;
                $("#context").css("height", height - 80);
                $("#table1").jqGrid('setGridWidth', $("#centr").width() - 5);
                $("#table1").jqGrid('setGridHeight', $("#centr").height() - 28);
                $("#table2").jqGrid('setGridWidth', $("#east3").width() - 2);
                $("#table2").jqGrid('setGridHeight', $("#east3").height() - 28);
            }


            $(document).ready(function () {
                $(window).bind('resize', function () {
                    order.resize();
                }).trigger('resize');

                order.load_product();
                order.init_table1($("#table1"));
                order.load_table1($("#table1"));
                order.init_table2($("#table2"));
                $("#table1").jqGrid("setGridParam", {
                    onSelectRow: function (rowid, status) {
                        order.sel_table1 = $("#table1").getRowData(rowid);
                        order.load_table2($("#table2"));                        
                    }
                });
                $("#table2").jqGrid("setGridParam", {
                    onSelectRow: function (rowid, status) {
                        order.sel_table2 = $("#table2").getRowData(rowid);                       
                    }
                });
                order.resize();
            });
        </script>
    </head>
    <body>        
        <div id="north" style="height: 20px;">
           <button onClick="wincalc.script();">Кнопка</button>
        </div>     
        <div id = "context">        
            <div id="midl" style="position: relative; margin-right: 480px; height: 100%">
                <div id="centr" style="height: 100%; width: 100%;">
                    <table id="table1"  class="ui-jqgrid-btable"></table> 
                </div>
                <div id="east" style="position: absolute; margin-top: 300px; width: 472px; top: 0; right: -480px; bottom: 0">
                    <div id="east2" style="margin-left: -2px; margin-top: -302px; height: 298px;">
                        EAST2
                    </div>
                    <div id="east3" style="height: 100%;">
                        <table id="table2"  class="ui-jqgrid-btable"></table>    
                    </div>
                </div>
            </div>
        </div>
        <div id="south" style="height: 20px">
            SOUTH
        </div> 

    </body>
</html>
