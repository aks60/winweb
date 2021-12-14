<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Order</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="js/order.js"></script> 
        <style>
            #north, #west, #midl, #south, #centr, #east, #east2 {
                border: 2px solid #ccc;
            }
        </style> 
        <script type="text/javascript">
            $(document).ready(function () {
                $(window).bind('resize', function () {
                    page_resize3();
                }).trigger('resize');
            });

            function page_resize3() {
                var height = window.innerHeight - 108;
                $("#midl").css("height", height);
                $("#table1").jqGrid('setGridWidth', $("#centr").width());
                $("#table1").jqGrid('setGridHeight', $("#centr").height() - 28);
            }
        </script>
    </head>
    <body>
        <div id="midl" style="position: relative; margin-right: 400px;">
            <div id="centr" style="height: 100%; width: 100%;">
                <table id="table1"  class="ui-jqgrid-btable"></table> 
                <script type="text/javascript">
                    $(function () {
                        $("#table1").jqGrid({
                            datatype: "local",
                            rownumbers: true,
                            colNames: ['id', 'Номер заказа=', 'Номер счёта', 'Дата от...', 'Дата до...', 'Контрагент', 'User'],
                            colModel: [
                                {name: 'id', hidden: true},
                                {name: 'num_ord', width: 120, sorttype: "text"},
                                {name: 'num_acc', width: 120, sorttype: "text"},
                                {name: 'date4', width: 120, sorttype: "text"},
                                {name: 'date6', width: 120, sorttype: "text"},
                                {name: 'propart_id', width: 120, sorttype: "text"},
                                {name: 'manager', width: 120, sorttype: "text"}
                            ]
                        });
                    });
                    order.load($("#table1"));
                </script> 
            </div>
            <div id="east" style="position: absolute; height: 100%; width: 396px; top: 0; right: -400px;">
                <div id="east2" style="height: 300px">
                    EAST2
                </div>
                <div id="east3">
                    EAST3
                </div>                
            </div>
        </div>
        <div id="south" style="height: 20px">
            SOUTH
        </div> 
    </body>
</html>
