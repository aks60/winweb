
systree.init_tree = function (tabtree) {
    tabtree.jqGrid({
        datatype: "local",
        colNames: ['id', 'Наименование'],
        colModel: [
            {name: 'id', key: true, width: 1, hidden: true, key: true},
            {name: 'name', width: 180}
        ],
        gridview: true,
        sortname: 'id',
        treeGrid: true,
        treeGridModel: 'adjacency',
        ExpandColumn: 'name',
        ExpandColClick: true,
        onSelectRow: function (rowid) {
//            loadTable(rowid);
        }
    });
}

systree.load_tree = function (tabtree) {
    $.ajax({
        url: 'dict?action=dictTree',
        success: function (data) {
            objDic2.table = data;
            tabtree[0].addJSONData({
                total: 1,
                page: 1,
                records: objDic2.table.dic1.length,
                rows: objDic2.table.dic1
            });
        }
    });
}


