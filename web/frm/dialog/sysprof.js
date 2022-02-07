sysprof.init_dialog = function (table) {
    table.dialog({
        title: "Профили системы",
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

sysprof.init_table1 = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Сторона', 'Код артикула', 'Наименование артикула'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'side', width: 60, sorttype: "text"},
            {name: 'code', width: 80, sorttype: "text"},
            {name: 'name', width: 200, sorttype: "text"}
        ]
    });
}

sysprof.load_table1 = function (table) {
    table.jqGrid('clearGridData', true);
    let id = order.rec_table2[SYSPROF.id];
    let winc = order.wincalcMap.get(id);
    let sysprofList = dbset.sysprofList.filter(rec => winc.nuni == rec[SYSPROF.systree_id]);

    for (let i = 0; i < sysprofList.length; i++) {
        let tr = sysprofList[i];
        let arec = dbset.artiklList.find(rec => tr[SYSPROF.artikl_id] == rec[ARTIKL.id]);
        //debugger;
        table.jqGrid('addRowData', i + 1, {
            id: tr[SYSPROF.id],
            side: sysprof.use_name(tr[SYSPROF.use_side]),
            code: arec[ARTIKL.code],
            name: arec[ARTIKL.name]
        });
    }
}
sysprof.use_name = (v) => {
    for (let k in UseSide) {
        if (v == UseSide[k][0])
            return UseSide[k][1];
    }
}
