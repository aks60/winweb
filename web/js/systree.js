
systree.init_dialog = function (tabtree) {
    $(function () {
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
    });
}

systree.init_tree = function (tabtree) {
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

systree.init_grid = function (tabgrid) {
    tabgrid.jqGrid({
        datatype: "local",
        colNames: ['№пп', 'Наименование'],
        colModel: [{name: 'npp', width: 40}, {name: 'name', width: 80}]
    });
}

systree.load_tree = function (tabtree) {
//    $.ajax({
//        url: 'dict?action=dictTree',
//        success: function (data) {
//            objDic2.table = data;
//            tabtree[0].addJSONData({
//                total: 1,
//                page: 1,
//                records: objDic2.table.dic1.length,
//                rows: objDic2.table.dic1
//            });
//        }
//    });
}

systree.load_grid = function (tabgrid) {

}


