artikl.init_dialog = function (table) {
    table.dialog({
        title: "Справочник артиклов",
        width: 600,
        height: 400,
        modal: true,
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

artikl.init_table = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Код артикула', 'Наименование артикула'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'code', width: 200, sorttype: "text"},
            {name: 'name', width: 400, sorttype: "text"}
        ]
    });
}

artikl.load_table = function (table) {
    table.jqGrid('clearGridData', true);
    for (let i = 0; i < product.artiklArr.length; i++) {
        let tr = product.artiklArr[i];
        table.jqGrid('addRowData', i + 1, {
            id: tr[ARTIKL.id],
            code: tr[ARTIKL.code],
            name: tr[ARTIKL.name]
        });
    }
    //sysprof.resize();
    //setTimeout(function () {sysprof.resize();}, 500);  
}



