//============================  BASE  ==========================================
order.init_table = function (table1, table2) {
    table1.jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Номер заказа', 'Номер счёта', 'Дата от...', 'Дата до...', 'Контрагент', 'User'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'num_ord', width: 120, sorttype: "text"},
            {name: 'num_acc', width: 120, sorttype: "text"},
            {name: 'date4', width: 120, sorttype: "text"},
            {name: 'date6', width: 120, sorttype: "text"},
            {name: 'propart_id', width: 120, sorttype: "text"},
            {name: 'manager', width: 120, sorttype: "text"}
        ],
        onSelectRow: function (rowid) {
            table2.jqGrid('clearGridData', true);
            let orderRec = table1.jqGrid('getRowData', rowid);
            for (i = 0; i < dbset.proprodList.length; i++) {
                
                let proprodRec = dbset.proprodList[i];
                let script = proprodRec[PROPROD.script];
                if (proprodRec[3] == orderRec.id) {
                    
                    table2.jqGrid('addRowData', i + 1, {
                        id: proprodRec[PROPROD.id],
                        name: proprodRec[PROPROD.name],
                        script: proprodRec[PROPROD.script],
                        project_id: proprodRec[PROPROD.project_id],
                        systree_id: proprodRec[PROPROD.systree_id]
                    });
                }
            }
            table2.jqGrid("setSelection", 2);
        }
    });
    table2.jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        colNames: ['id', 'Наименование', 'Рисунок', 'project_id', 'systree_id'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'name', width: 120, sorttype: "text"},
            {name: 'script', width: 220, sorttype: "text"},
            {name: 'project_id', hidden: true},
            {name: 'systree_id', hidden: true}
        ],
        onSelectRow: function (rowid) {
            order.sel_table2 = table2.jqGrid('getRowData', rowid);
            //alert(rowid);
        }
    });
}
//------------------------------------------------------------------------------
order.load_table = function (table1, table2) {
    table1.jqGrid('clearGridData', true);
    $.ajax({
        url: 'order?action=orderList',
        success: function (data) {
            order.orderList = data.orderList;
            for (i = 0; i < order.orderList.length; i++) {
                let tr = order.orderList[i];
                table1.jqGrid('addRowData', i + 1, {
                    id: tr[0],
                    num_ord: tr[1],
                    num_acc: tr[2],
                    date4: tr[3],
                    date6: tr[4],
                    propart_id: tr[5],
                    manager: tr[6]
                });
            }
            table1.jqGrid("setSelection", 8);
            order.resize();
        }
    });
}
//------------------------------------------------------------------------------

