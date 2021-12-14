
order.load = function (table) {
    table.jqGrid("clearGridData", true);
    $.ajax({
        url: 'order?action=orderList',
        success: function (data) {
            orderList = data.orderList;
            for (i = 0; i < orderList.length; i++) {
                table.addRowData(i + 1, {
                    id: orderList[i][0],
                    num_ord: orderList[i][1],
                    num_acc: orderList[i][2],
                    date4: orderList[i][3],
                    date6: orderList[i][4],
                    propart_id: orderList[i][5],
                    manager: orderList[i][6]
                });
            }
            page_resize3();
        }
    });
}


