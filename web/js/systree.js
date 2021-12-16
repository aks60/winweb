
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

systree.init_tabtree = function (tabtree) {
    tabtree.jqGrid({
        datatype: "local",
        colNames: ['id', 'Категория'],
        colModel: [{name: 'id', index: 'id', width: 1, hidden: true, key: true},
            {name: 'name', index: 'cname', width: 180}],
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

systree.init_tabgrid = function (tabgrid) {
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

systree.load_tabtree = function (table) {
//    table.jqGrid("clearGridData", true);
//    $.ajax({
//        url: 'catflog?action=sysTree',
//        success: function (data) {
//            systree.sysTree = data;
//            let tr = users.userList[0];
//            for (i = 1; i < users.userList.length; i++) {
//                table.addRowData(i + 1, {
//                    id: users.userList[i][tr[0]],
//                    name: users.userList[i][tr[1]]
//                });
//            }
//            systree.resize();
//        }
//    });
}

systree.load_tabgrid = function (table) {
    table.jqGrid("clearGridData", true);
    $.ajax({
        url: 'catalog?action=sysProd',
        success: function (data) {
            systree.sysProd = data.sysProd;
            let tr = systree.sysProd[0];
            for (i = 1; i < systree.sysProd.length; i++) {
                table.addRowData(i + 1, {
                    id: systree.sysProd[i][tr[0]],
                    name: systree.sysProd[i][tr[1]],
                    script: systree.sysProd[i][tr[2]],
                    parent: systree.sysProd[i][tr[3]],
                });
            }
            systree.resize();
        }
    });
}


