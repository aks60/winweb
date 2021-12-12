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
                    var height = window.innerHeight - 108;
                    $("#midl").css("height", height);
                    $("#table1").setGridWidth($("#centr").width());
                }).trigger('resize');

                //load_orders();
            });
            
            function load_orders() {
                $('#table1').jqGrid("clearGridData", true);
                $.ajax({
                    url: 'users?action=orderList',
                    beforeSend: function () {},
                    success: function (data) {
                        //debugger;
                        userList = data.userList;
                        var tr = userList[0];
                        for (i = 1; i < userList.length; i++) {
                            $("#table1").addRowData(i + 1, {
                                id: userList[i][tr[0]], fio: userList[i][tr[1]],
                                desc: userList[i][tr[2]], login: userList[i][tr[3]],
                                role: userList[i][tr[4]]
                            });
                        }
                    }
                });
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
                </script> 
            </div>
            <div id="east" style="position: absolute; height: 100%; width: 396px; top: 0; right: -400px;">
                EAST
            </div>
        </div>
        <div id="south" style="height: 20px">
            SOUTH
        </div>
    </body>
</html>
