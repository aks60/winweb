//------------------------------------------------------------------------------
kits.init_table = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Артикул', 'Название', 'Основная', 'Внутренняя', 'Внешняя', 'Длина', 'Ширина', 'Кол-во'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'code', width: 80, sorttype: "text"},
            {name: 'name', width: 200, sorttype: "text"},
            {name: 'color1_id', width: 80, sorttype: "text"},
            {name: 'color2_id', width: 80, sorttype: "text"},
            {name: 'color3_id', width: 80, sorttype: "text"},
            {name: 'width', width: 60, sorttype: "text"},
            {name: 'height', width: 60, sorttype: "text"},
            {name: 'numb', width: 60, sorttype: "text"}
        ]
    });
}
//------------------------------------------------------------------------------
kits.load_table = function (table) {
    table.jqGrid('clearGridData', true);
    kits.prjkitList = dbset.prjkitList.filter(rec => order.prjprodRec[PRJPROD.id] == rec[PRJKIT.prjprod_id]);
    for (let i = 0; i < kits.prjkitList.length; i++) {
        let tr = kits.prjkitList[i];
        let artiklRec = findef(dbset.artiklList.find(rec => tr[PRJKIT.artikl_id] == rec[ARTIKL.id]), dbset.artiklList);
        table.jqGrid('addRowData', i + 1, {
            id: tr[KITS.id],
            code: artiklRec[ARTIKL.code],
            name: artiklRec[ARTIKL.name],
            color1_id: findef(dbset.colorList.find(rec => tr[PRJKIT.color1_id] == rec[COLOR.id]), dbset.colorList)[COLOR.name],
            color2_id: findef(dbset.colorList.find(rec => tr[PRJKIT.color2_id] == rec[COLOR.id]), dbset.colorList)[COLOR.name],
            color3_id: findef(dbset.colorList.find(rec => tr[PRJKIT.color3_id] == rec[COLOR.id]), dbset.colorList)[COLOR.name],
            width: tr[PRJKIT.width],
            height: tr[PRJKIT.height],
            numb: tr[PRJKIT.numb]
        });
    }
    kits.resize();
}
//------------------------------------------------------------------------------
kits.delete_record = function (table) {

    $("#dialog-mes").html("<p><span class='ui-icon ui-icon-alert'>\n\
    </span> Вы действительно хотите удалить текущую запись?");
    $("#dialog-mes").dialog({
        title: "Подтверждение",
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Да": function () {
                let rowid = table.jqGrid('getGridParam', "selrow");
                let prjkitID = table.jqGrid('getRowData', rowid).id;
                $.ajax({
                    url: 'dbset?action=deletePrjkit',
                    data: {param: JSON.stringify({id: prjkitID})},
                    success: (data) => {
                        if (data.result == 'ok') {
                            table.jqGrid("delRowData", rowid);
                            for(let i = 0; i < dbset.prjkitList.length; ++i) {
                                if(prjkitID == dbset.prjkitList[i][PRJKIT.id]) {
                                   dbset.prjkitList.splise(i, 1); 
                                }
                            }
                            
                        } else
                            dialogMes('Сообщение', "<p>Ошибка при удалении записи на сервере");
                    },
                    error: () => {
                        dialogMes('Сообщение', "<p>Ошибка при удалении записи на сервер");
                    }
                });
                $(this).dialog("close");
            },
            Нет: function () {
                $(this).dialog("close");
            }
        }
    });
}
//------------------------------------------------------------------------------
