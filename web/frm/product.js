product.init_table1 = function (table) {
        table.jqGrid({
            datatype: "local",
            gridview: true,
            //rownumbers: true,
            autowidth: true,
            height: "auto",            
            colNames: ['id', 'Наименование', 'Рисунок', 'project_id', 'systree_id'],
            colModel: [
                {name: 'id', hidden: true},
                {name: 'name', width: 120, sorttype: "text"},
                {name: 'scripl', width: 120, sorttype: "text"},
                {name: 'project_id', hidden: true},
                {name: 'systree_id', hidden: true}
            ]
        });
}

product.load_table1 = function (table) {
    for (i = 0; i < order.prodList.length; i++) {
        let tr = order.prodList[i];
        table.jqGrid('addRowData', i + 1, {
            id: tr[0],
            name: tr[1],
            script: tr[2],
            project_id: tr[3],
            systree_id: tr[4]
        });
    }
    product.resize();

}


