//------------------------------------------------------------------------------
systree.init_dialog = function (tabtree) {
    
    tabtree.dialog({
        title: "Конструкции систем профилей",
        width: 600,
        height: 500,
        modal: false,
        buttons: {
            "Выбрать": function () {
                systree.resize();
            },
            "Закрыть": function () {
                $(this).dialog("close");
            }
        }
    });
}
//------------------------------------------------------------------------------
systree.init_table = function (table1, table2) {
    
    table1.jqGrid({
        datatype: "local",
        colNames: ['id', 'Категория'],
        colModel: [
            {name: 'id', index: 'id', width: 1, hidden: true, key: true},
            {name: 'name', index: 'cname', width: 180}
        ],
        treeIcons: {plus: 'ui-icon-folder-collapsed', minus: 'ui-icon-folder-open', leaf: 'ui-icon-document'},
        autowidth: true,
        height: "auto",
        sortname: 'id',
        treeGrid: true,
        treeGridModel: 'adjacency',
        ExpandColumn: 'name',
        ExpandColClick: true,
        onSelectRow: function (rowid) {
            
            table2.jqGrid("clearGridData", true);
            let systreeRec = table1.getRowData(rowid);
            for (i = 0; i < dataset.productList.length; i++) {
                let productRec = dataset.productList[i];
                if (systreeRec.id == productRec[2]) {
                    table2.jqGrid('addRowData', i + 1, {
                        id: productRec[0],
                        name: productRec[1],
                        script: productRec[2],
                        parent: productRec[3]
                    });
                }
            }
            systree.resize();
        }
    });
    table2.jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Наименование', 'Рисунок', 'parent'],
        colModel: [
            {name: 'id', hidden: true},
            {name: 'name', width: 80},
            {name: 'script', width: 80},
            {name: 'parent', hidden: true}]
    });
}
//------------------------------------------------------------------------------
systree.load_table = function (table) {
    
    table.jqGrid('clearGridData', true);
    $.ajax({
        url: 'systree?action=sysTree',
        success: function (data) {
            systree.sysTree = data.sysTree;
            table[0].addJSONData({
                total: 1, page: 1,
                records: systree.sysTree.length,
                rows: systree.sysTree
            });
            
            table.setSelection(1);
        }
    });
}
//------------------------------------------------------------------------------


