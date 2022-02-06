artikl.init_dialog = function (table) {
    table.dialog({
        title: "Справочник артиклов",
        width: 500,
        height: 400,
        modal: false,
        buttons: {
            "Выбрать": function () {
                sysprof.resize();
            },
            "Закрыть": function () {
                $(this).dialog("close");
            }
        }
    });
}

artikl.init_table1 = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Тип артикула', 'Код артикула', 'Наименование артикула'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'types', width: 60, sorttype: "text"},
            {name: 'artikl_id', width: 80, sorttype: "text"},
            {name: 'artikl_id', width: 200, sorttype: "text"}
        ]
    });
}

artikl.load_table1 = function (table) {
    table.jqGrid('clearGridData', true);
//    for (let i = 0; i < dbset.artiklList.length; i++) {
    for (let i = 0; i < 100; i++) {
        let tr = dbset.artiklList[i];
        table.jqGrid('addRowData', i + 1, {
            id: tr[0],
            types: tr[1],
            artikl_id: tr[2],
            artikl_id: tr[2]
        });
    }
    //sysprof.resize();
    //setTimeout(function () {sysprof.resize();}, 500);  
}



