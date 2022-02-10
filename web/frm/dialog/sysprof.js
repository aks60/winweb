//------------------------------------------------------------------------------
sysprof.init_dialog = function (table) {

    $("#dialog-dic").dialog({
        title: "Профили системы",
        width: 600,
        height: 400,
        modal: true,
        buttons: {
            "Выбрать": function () {
                let rowid = table.getGridParam('selrow');
                let tableRec = table.getRowData(rowid);
 
                //Запишем выбранную запись в src
                $("#n31").val(tableRec.code);
                $("#n32").val(tableRec.name);

                $(this).dialog("close");
            },
            "Закрыть": function () {
                $(this).dialog("close");
            }
        }
    });
}
//------------------------------------------------------------------------------
sysprof.init_table = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Сторона', 'Код артикула', 'Наименование артикула'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'side', width: 60, sorttype: "text"},
            {name: 'code', width: 200, sorttype: "text"},
            {name: 'name', width: 340, sorttype: "text"}
        ]
    });
}
//------------------------------------------------------------------------------
sysprof.load_table = function (table) {

    table.jqGrid('clearGridData', true);
    let id = order.rec_table2[SYSPROF.id];
    let winc = order.wincalcMap.get(id);

    for (let i = 0; i < product.sysprofArr.length; i++) {
        let tr = product.sysprofArr[i];
        let artRec = dbset.artiklList.find(rec => tr[SYSPROF.artikl_id] == rec[ARTIKL.id]);
        table.jqGrid('addRowData', i + 1, {
            id: tr[SYSPROF.id],
            side: sysprof.use_name(tr[SYSPROF.use_side]),
            code: artRec[ARTIKL.code],
            name: artRec[ARTIKL.name]
        });
    }
    table.jqGrid("setSelection", 1);
}
sysprof.use_name = (v) => {
    for (let k in UseSide) {
        if (v == UseSide[k][0])
            return UseSide[k][1];
    }
}
//------------------------------------------------------------------------------