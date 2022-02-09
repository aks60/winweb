params.init_dialog = function (table) {
    table.dialog({
        title: "Профили системы",
        width: 500,
        height: 400,
        modal: true,
        buttons: {
            "Выбрать": function () {
                params.resize();
            },
            "Закрыть": function () {
                $(this).dialog("close");
            }
        }
    });
}

params.init_table1 = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Сторона', 'Код артикула', 'Наименование артикула'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'use_side', width: 60, sorttype: "text"},
            {name: 'artikl_id', width: 80, sorttype: "text"},
            {name: 'artikl_id', width: 200, sorttype: "text"}
        ]
    });
}

params.load_table1 = function (table) {
    table.jqGrid('clearGridData', true);
    for (let i = 0; i < dbset.sysprofList.length; i++) {
        let tr = dbset.sysprofList[i];
        table.jqGrid('addRowData', i + 1, {
            id: tr[0],
            use_side: tr[1],
            artikl_id: tr[2],
            artikl_id: tr[2]
        });
    }
    //sysprof.resize();
    //setTimeout(function () {sysprof.resize();}, 500);
}


