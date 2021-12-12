<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="js/order.js"></script> 
        <title>Order</title>
        <style>
            #north, #west, #midl, #south, #centr, #east {
                border: 2px solid #ccc;
            }
        </style> 
        <script type="text/javascript">
            $(document).ready(function () {
                $(window).bind('resize', function () {
                    var height = window.innerHeight - 168;
                    $("#midl").css("height", height);
                    $("#table1").setGridWidth($("#centr").width());
                }).trigger('resize');

                load_users();
            });
        </script>
    </head>
    <body>
        <div id="midl" style="margin-right: 200px;">
            <div id="centr" style="position: absolute; height: 100%; width: 100%;">
                CENTR
<!--                <table id="table1"  class="ui-jqgrid-btable"></table> 
                <script type="text/javascript">
                    $(function () {
                        $("#table1").jqGrid({
                            datatype: "local",
                            autowidth: true,
                            height: 'auto',
                            colNames: ['id', 'Номер заказа', 'Номер счёта', 'Дата от...', 'Дата до...', 'Диллер', 'User'],
                            colModel: [
                                {name: 'id', hidden: true},
                                {name: 'name', width: 120, sorttype: "text"},
                                {name: 'name', width: 120, sorttype: "text"},
                                {name: 'name', width: 120, sorttype: "text"},
                                {name: 'name', width: 120, sorttype: "text"},
                                {name: 'name', width: 120, sorttype: "text"},
                                {name: 'name', width: 120, sorttype: "text"}
                            ]
                        });
                    });
                </script> -->
            </div>
            <div id="east" style="position: absolute; height: 100%; width: 198px; right: -200px;">
                EAST
            </div>
        </div>
        <div id="south" style="height: 20px">
            SOUTH
        </div>
    </body>
</html>
