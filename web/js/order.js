
order.init_table1 = function (table) {
    $(function () {
        table.jqGrid({
            datatype: "local",
            rownumbers: true,
            colNames: ['id', 'Номер заказа', 'Номер счёта', 'Дата от...', 'Дата до...', 'Контрагент', 'User'],
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
}

order.load_table1 = function (table) {
    table.jqGrid("clearGridData", true);
    $.ajax({
        url: 'order?action=orderList',
        success: function (data) {
            order.orderList = data.orderList;
            for (i = 0; i < order.orderList.length; i++) {
                table.addRowData(i + 1, {
                    id: order.orderList[i][0],
                    num_ord: order.orderList[i][1],
                    num_acc: order.orderList[i][2],
                    date4: order.orderList[i][3],
                    date6: order.orderList[i][4],
                    propart_id: order.orderList[i][5],
                    manager: order.orderList[i][6]
                });
            }
            order.resize();
        }
    });
}

order.init_table2 = function (table) {
    $(function () {
        table.jqGrid({
            datatype: "local",
            rownumbers: true,
            colNames: ['id', 'Наименование', 'Рисунок', 'project_id', 'systree_id'],
            colModel: [
                {name: 'id', hidden: true},
                {name: 'name', width: 120, sorttype: "text"},
                {name: 'scripl', width: 120, sorttype: "text"},
                {name: 'project_id', hidden: true},
                {name: 'systree_id', hidden: true}
            ]
        });
    });
}

order.load_table2 = function (table) {
    table.jqGrid("clearGridData", true);
    $.ajax({
        url: 'prod?action=prodList',
        data: {prodID: 777},
        success: function (data) {
            order.prodList = data.prodList;
            for (i = 0; i < order.prodList.length; i++) {
                table.addRowData(i + 1, {
                    id: order.prodList[i][0],
                    name: order.prodList[i][1],
                    script: order.prodList[i][2],
                    project_id: order.prodList[i][3],
                    systree_id: order.prodList[i][4]
                });
            }
            order.resize();
        }
    });
}


