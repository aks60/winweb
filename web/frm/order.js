//------------------------------------------------------------------------------
order.init_table1 = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        autowidth: true,
        height: "auto",
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
}

order.init_table2 = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        colNames: ['id', 'Наименование', 'Рисунок', 'project_id', 'systree_id'],
        colModel: [
            {name: 'id', hidden: true},
            {name: 'name', width: 120, sorttype: "text"},
            {name: 'script', width: 220, sorttype: "text"},
            {name: 'project_id', hidden: true},
            {name: 'systree_id', hidden: true}
        ]
    });
}

order.load_table1 = function (table) {
    table.jqGrid('clearGridData', true);
    $.ajax({
        url: 'order?action=orderList',
        success: function (data) {
            order.orderList = data.orderList;
            for (i = 0; i < order.orderList.length; i++) {
                let tr = order.orderList[i];
                table.jqGrid('addRowData', i + 1, {
                    id: tr[0],
                    num_ord: tr[1],
                    num_acc: tr[2],
                    date4: tr[3],
                    date6: tr[4],
                    propart_id: tr[5],
                    manager: tr[6]
                });
            }
            table.jqGrid("setSelection", 8);
//            order.resize();
        }
    });    
}

order.load_table2 = function (table) {
    table.jqGrid('clearGridData', true);
    if (order.sel_table1 != undefined) {
        for (i = 0; i < dataset.productList.length; i++) {
            let productRec = dataset.productList[i];
            let script = productRec[2];
            //debugger;
            if (productRec[3] == order.sel_table1.id) {
                table.jqGrid('addRowData', i + 1, {
                    id: productRec[0],
                    name: productRec[1],
                    script: productRec[2],
                    project_id: productRec[3],
                    systree_id: productRec[4]
                });
            }
        }
        table.jqGrid("setSelection", 1);
    }
}


