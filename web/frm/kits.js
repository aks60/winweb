//------------------------------------------------------------------------------
kits.init_table = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Артикул', 'Название', 'Основная', 'Внутренняя', 'Внешняя',
            'Длина', 'Ширина', 'Кол-во', 'artikl_id', 'color1_id', 'color2_id', 'color3_id'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'code', width: 80, sorttype: "text"},
            {name: 'name', width: 200, sorttype: "text"},
            {name: 'color1', width: 80, sorttype: "text"},
            {name: 'color2', width: 80, sorttype: "text"},
            {name: 'color3', width: 80, sorttype: "text"},
            {name: 'width', width: 60, sorttype: "text"},
            {name: 'height', width: 60, sorttype: "text"},
            {name: 'numb', width: 60, sorttype: "text"},
            {name: 'artikl_id', width: 80},
            {name: 'color1_id', width: 80},
            {name: 'color2_id', width: 80},
            {name: 'color3_id', width: 80}
        ]
    });
}
//------------------------------------------------------------------------------
kits.load_table = function (table) {
    table.jqGrid('clearGridData', true);
    if (order.wincalcMap.size != 0) {
        kits.prjkitList = dbset.prjkitList.filter(rec => order.prjprodRec[PRJPROD.id] == rec[PRJKIT.prjprod_id]);
        for (let i = 0; i < kits.prjkitList.length; i++) {
            let tr = kits.prjkitList[i];
            let artiklRec = findef(dbset.artiklList.find(rec => tr[PRJKIT.artikl_id] == rec[ARTIKL.id]), dbset.artiklList);
            table.jqGrid('addRowData', i + 1, {
                id: tr[KITS.id],
                code: artiklRec[ARTIKL.code],
                name: artiklRec[ARTIKL.name],
                color1: findef(dbset.colorList.find(rec => tr[PRJKIT.color1_id] == rec[COLOR.id]), dbset.colorList)[COLOR.name],
                color2: findef(dbset.colorList.find(rec => tr[PRJKIT.color2_id] == rec[COLOR.id]), dbset.colorList)[COLOR.name],
                color3: findef(dbset.colorList.find(rec => tr[PRJKIT.color3_id] == rec[COLOR.id]), dbset.colorList)[COLOR.name],
                width: tr[PRJKIT.width],
                height: tr[PRJKIT.height],
                numb: tr[PRJKIT.numb],
                artikl_id: tr[PRJKIT.artikl_id],
                color1_id: tr[PRJKIT.color1_id],
                color2_id: tr[PRJKIT.color2_id],
                color3_id: tr[PRJKIT.color3_id],
            });
        }
        table.jqGrid("setSelection", 1);        
    }
}
//------------------------------------------------------------------------------
kits.insert_table = function (table) {

    if (order.wincalcMap.size == 0) {
        dialogMes('Внимание', "<p>Выберите конструкцию заказа.");

    } else {
        $('#dialog-dic').load('frm/dialog/kitcard.jsp');
    }
}
//------------------------------------------------------------------------------
kits.insert2_table = function (table) {

    if (order.wincalcMap.size == 0) {
        dialogMes('Внимание', "<p>Выберите конструкцию заказа.");

    } else {
        $('#dialog-dic').load('frm/dialog/kitcard.jsp');
    }
}
//------------------------------------------------------------------------------
//Редактирования строки таблицы
kits.update_table = function (taq) {

    let prjkitRow = getSelectedRow($("#table1"));    

    $("#n51").val(prjkitRow.code);
    $("#n52").val(prjkitRow.name);
    $("#n53").val(prjkitRow.color1);
    $("#n54").val(prjkitRow.color2);
    $("#n55").val(prjkitRow.color3);
    $("#n56").val(prjkitRow.width);
    $("#n57").val(prjkitRow.height);
    $("#n58").val(prjkitRow.numb);

    $("#n51").attr("fk", prjkitRow.artikl_id);
    $("#n52").attr("fk", prjkitRow.artikl_id);
    $("#n53").attr("fk", prjkitRow.color1_id);
    $("#n54").attr("fk", prjkitRow.color2_id);
    $("#n55").attr("fk", prjkitRow.color3_id);
    
    console.log(prjkitRow);

    $(taq).dialog({//открытие диалога insert
        title: "Карточка редактирования артикула",
        width: $(taq).attr('card_width'),
        height: $(taq).attr('card_height'),
        modal: true,
        resizable: false,
        buttons: {
            "Применить": function () {
                let prjkitRec = dbset.prjkitList.find(rec => prjkitRow.id == rec[PRJKIT.id]);
                prjkitRec[0] = 'UPD';
                prjkitRec[PRJKIT.numb] = $("#n58").val();
                prjkitRec[PRJKIT.width] = $("#n56").val();
                prjkitRec[PRJKIT.height] = $("#n57").val();
                prjkitRec[PRJKIT.color1_id] = $("#n53").attr("fk");
                prjkitRec[PRJKIT.color2_id] = $("#n54").attr("fk");
                prjkitRec[PRJKIT.color3_id] = $("#n55").attr("fk");
                prjkitRec[PRJKIT.artikl_id] = $("#n51").attr("fk");                
                $.ajax({
                    url: 'dbset?action=updatePrjkit',
                    data: {param: JSON.stringify(prjkitRec)},
                    success: (data) => {
                        if (data.result == 'ok') {
                            alert();
//                            let rowid = $('#table1').jqGrid('getGridParam', "selrow");
//                            $('#table1').jqGrid('setRowData', rowid, {        
//                                id: prjkitRec[PRJKIT.id],
//                                num_ord: prjkitRec[PRJKIT.num_ord],
//                                num_acc: prjkitRec[PRJKIT.num_acc],
//                                date4: prjkitRec[PRJKIT.date4],
//                                date6: prjkitRec[PRJKIT.date6],
//                                partner: findef(dbset.dealerList.find(rec => prjkitRec[PRJKIT.prjpart_id] == rec[DEALER.id]), dbset.dealerList)[DEALER.partner],
//                                manager: prjkitRec[PRJKIT.manager]
//                            });
                        } else
                            dialogMes('Сообщение', "<p>" + data.result);
                    },
                    error: () => {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                    }
                });
                $(this).dialog("close");
            },
            "Отменить": function () {
                $(this).dialog("close");
            }
        }
    });
}
//------------------------------------------------------------------------------
kits.delete_table = function (table) {

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
                            for (let i = 0; i < dbset.prjkitList.length; ++i) {
                                if (prjkitID == dbset.prjkitList[i][PRJKIT.id]) {
                                    dbset.prjkitList.splise(i, 1);
                                }
                            }

                        } else
                            dialogMes('Сообщение', "<p>" + data.result);
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
