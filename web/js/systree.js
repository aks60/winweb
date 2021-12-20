
systree.init_dialog = function (tabtree) {
    tabtree.dialog({
        autoOpen: true, // Открывать ли окно сразу 
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

systree.init_table1 = function (tabtree) {
    tabtree.jqGrid({
        datatype: "local",
        colNames: ['id', 'Категория'],
        colModel: [
            {name: 'id', index: 'id', width: 1, hidden: true, key: true},
            {name: 'name', index: 'cname', width: 180}
        ],
        gridview: true,
        sortname: 'id',
        treeGrid: true,
        treeGridModel: 'adjacency',
        ExpandColumn: 'name',
        ExpandColClick: true,
        onSelectRow: function (rowid) {
            loadTable(rowid);
        }
    });
}

systree.init_table2 = function (tabgrid) {
    tabgrid.jqGrid({
        datatype: "local",
        colNames: ['id', 'Наименование', 'Рисунок', 'parent'],
        colModel: [
            {name: 'id', hidden: true},
            {name: 'name', width: 80},
            {name: 'script', width: 80},
            {name: 'parent', hidden: true}]
    });
}

systree.load_table1 = function (table) {
    table.jqGrid("clearGridData", true);
    $.ajax({
        url: 'systree?action=sysTree',
        success: function (data) {
            systree.sysTree = data.sysTree;
            table[0].addJSONData({
                total: 1, page: 1,
                records: systree.sysTree.length,
                rows: systree.sysTree
            });
//            debugger;
//            systree.sysTree = data.sysTree;
//            for (i = 0; i < systree.sysTree.length; i++) {
//                let tr = systree.sysTree[i];
//                table.addRowData(i + 1, {
//                    id: tr.id,
//                    name: tr.name
//                });
//            }
            systree.resize();
        }
    });
}

systree.load_table2 = function (table) {
    table.jqGrid("clearGridData", true);
    $.ajax({
        url: 'systree?action=sysProd',
        success: function (data) {
            debugger;
            systree.sysProd = data.sysProd;
            for (i = 0; i < systree.sysProd.length; i++) {
                let tr = systree.sysProd[i];
                table.addRowData(i + 1, {
                    id: tr[0],
                    name: tr[1],
                    script: tr[2],
                    parent: tr[3]
                });
            }
            systree.resize();
        }
    });
}


