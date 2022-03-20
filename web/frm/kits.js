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
//Редактирования строки таблицы
kits.update_table1 = function (taq) {

    let prjkitRow = getSelectedRow($("#table1"));
    let orderRec = dbset.prjkitList.find(rec => prjkitRow.id = rec[PRJKIT.id]);

//    $("#n21").val(orderRow.num_ord);
//    $("#n22").val(orderRow.num_acc);
//    $("#n23").val(orderRow.date4);
//    $("#n24").val(orderRow.date6);
//    $("#n25").val(orderRow.partner);
//    $("#n25").attr("fk", orderRow.prjpart_id);

    $(taq).dialog({//открытие диалога insert
        title: "Карточка редактирования артикула",
        width: $(taq).attr('card_width'),
        height: $(taq).attr('card_height'),
        modal: true,
        resizable: false,
        buttons: {
            "Применить": function () {
//
//                orderRec[0] = 'UPD';
//                orderRec[ORDER.num_ord] = $("#n21").val();
//                orderRec[ORDER.num_acc] = $("#n22").val();
//                orderRec[ORDER.manager] = login.data.user_fio;
//                orderRec[ORDER.date4] = $("#n23").val();
//                orderRec[ORDER.date6] = $("#n24").val();
//                orderRec[ORDER.owner] = login.data.user_name;
//                orderRec[ORDER.prjpart_id] = $("#n25").attr("fk");
//                $.ajax({
//                    url: 'dbset?action=updateOrder',
//                    data: {param: JSON.stringify(orderRec)},
//                    success: (data) => {
//                        if (data.result == 'ok') {
//                            let rowid = $('#table1').jqGrid('getGridParam', "selrow");
//                            $('#table1').jqGrid('setRowData', rowid, {
//                                id: orderRec[ORDER.id],
//                                num_ord: orderRec[ORDER.num_ord],
//                                num_acc: orderRec[ORDER.num_acc],
//                                date4: orderRec[ORDER.date4],
//                                date6: orderRec[ORDER.date6],
//                                partner: findef(dbset.dealerList.find(rec => orderRec[ORDER.prjpart_id] == rec[DEALER.id]), dbset.dealerList)[DEALER.partner],
//                                manager: orderRec[ORDER.manager]
//                            });
//                        } else
//                            dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
//                    },
//                    error: () => {
//                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
//                    }
//                });
                $(this).dialog("close");
            },
            "Отменить": function () {
                $(this).dialog("close");
            }
        }
    });
}
//------------------------------------------------------------------------------
