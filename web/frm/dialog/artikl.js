artikl.init_dialog = function (table) {
    table.dialog({
        title: "Справочник артиклов",
        width: 600,
        height: 500,
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
            {name: 'atype', width: 60, sorttype: "text"},
            {name: 'code', width: 200, sorttype: "text"},
            {name: 'name', width: 340, sorttype: "text"}
        ]
    });
}

artikl.load_table1 = function (table) {
    table.jqGrid('clearGridData', true);
//    for (let i = 0; i < dbset.artiklList.length; i++) {
    for (let i = 0; i < 100; i++) {
        let tr = dbset.artiklList[i];
        table.jqGrid('addRowData', i + 1, {
            id: tr[ARTIKL.id],
            atype: tr[ARTIKL.level1],
            code: tr[ARTIKL.code],
            name: tr[ARTIKL.name]
        });
    }
    //sysprof.resize();
    //setTimeout(function () {sysprof.resize();}, 500);  
}



