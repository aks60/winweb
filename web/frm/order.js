//------------------------------------------------------------------------------
order.init_table = function (table1, table2) {
    table1.jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Номер заказа', 'Номер счёта', 'Дата от...', 'Дата до...', 'Контрагент', 'User'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'num_ord', width: 80, sorttype: "text"},
            {name: 'num_acc', width: 80, sorttype: "text"},
            {name: 'date4', width: 80, sorttype: "text"},
            {name: 'date6', width: 80, sorttype: "text"},
            {name: 'partner', width: 220, sorttype: "text"},
            {name: 'manager', width: 120, sorttype: "text"}
        ],
        onSelectRow: function (rowid) {
            //==================================================================
            dbrec.orderRow = table1.jqGrid('getRowData', rowid);
            dbrec.prjprodRec = null;
            //==================================================================
            dbrec.wincalcMap.clear()
            let j = 1;
            let rc = table2.rows.length;
            for (let i = j; i < rc; i++) {
                table2.deleteRow(j);
            }
            let prjprodID = null;
            for (let i = 0; i < dbset.prjprodList.length; i++) {
                let prjprodRec = dbset.prjprodList[i];

                if (dbrec.orderRow.id == prjprodRec[PRJPROD.project_id]) {
                    order.add_prjprodClone(table2, prjprodRec);
                    if (prjprodID == null) {
                        prjprodID = prjprodRec[PRJPROD.id];
                    }
                }
            }
            if (prjprodID != null && dbrec.prjprodRec != undefined) {
                let id = 'cnv' + dbrec.prjprodRec[PRJPROD.id];
                document.getElementById(id).click();

            } else if (prjprodID != null) {
                let id = 'cnv' + prjprodID;
                document.getElementById(id).click();
            }
            $('#table2 tr > *:nth-child(1)').hide();
        }
    });
    order.resize();
}
//------------------------------------------------------------------------------
order.load_table = function (table1, table2) {

    table1.jqGrid('clearGridData', true);
    dbset.orderList.sort((a, b) => b[ORDER.id] - a[ORDER.id]);
    for (let i = 0; i < dbset.orderList.length; i++) {
        let tr = dbset.orderList[i];
        if (dbrec.orderRow != undefined && tr[ORDER.id] == order.orderRowd) {
            order.rowid_table1 = i + 1;
        }
        table1.jqGrid('addRowData', i + 1, {
            id: tr[ORDER.id],
            num_ord: tr[ORDER.num_ord],
            num_acc: tr[ORDER.num_acc],
            date4: tr[ORDER.date4],
            date6: tr[ORDER.date6],
            partner: findef(dbset.dealerList.find(rec => tr[ORDER.prjpart_id] == rec[DEALER.id]), dbset.dealerList)[DEALER.partner],
            manager: tr[ORDER.manager]
        });
    }
    table1.jqGrid("setSelection", order.rowid_table1);
    order.resize();
}
//------------------------------------------------------------------------------
order.delete_table1 = function (table1) {
    $("#dialog-mes").html("<p><span class='ui-icon ui-icon-alert'>\n\
    </span> Вы действительно хотите удалить текущий заказ?");
    $("#dialog-mes").dialog({
        title: "Подтверждение",
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Да": function () {
                $.ajax({
                    url: 'dbset?action=deleteProject',
                    data: {param: JSON.stringify({id: dbrec.orderRow.id})},
                    success: (data) => {
                        if (data.result == 'ok') {
                            let rowid = table1.jqGrid('getGridParam', "selrow");
                            if (rowid != null)
                                table1.jqGrid('delRowData', rowid);
                        } else
                            dialogMes('Сообщение', "<p>Ошибка при удалении заказа на сервере");
                    },
                    error: () => {
                        dialogMes('Сообщение', "<p>Ошибка при удалении заказа на сервере");
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
order.delete_table2 = function () {

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
                $.ajax({
                    url: 'dbset?action=deletePrjprod',
                    data: {param: JSON.stringify({id: dbrec.prjprodRec[PRJPROD.id]})},
                    success: (data) => {
                        if (data.result == 'ok') {
                            let id = 'tr' + dbrec.prjprodRec[PRJPROD.id];
                            var trow = document.getElementById(id);
                            trow.remove();
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
order.add_prjprodClone = function (table2, prjprodRec) {

    let canvas = document.createElement("canvas");
    canvas.class = "cnv";
    canvas.id = 'cnv' + prjprodRec[PRJPROD.id];
    canvas.width = 68;
    canvas.height = 68;

    let id = document.createTextNode(prjprodRec[PRJPROD.id]);
    let name = document.createTextNode(prjprodRec[PRJPROD.name]);
    let script = prjprodRec[PRJPROD.script];
    let iwincalc = win.build(canvas, script);

    //Массив объектов winc
    dbrec.wincalcMap.set(prjprodRec[PRJPROD.id], iwincalc);

    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let tr = document.createElement('tr');
    tr.id = 'tr' + prjprodRec[PRJPROD.id];

    td1.appendChild(id);
    td2.appendChild(name);
    td3.appendChild(canvas);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    table2.appendChild(tr);

}
//------------------------------------------------------------------------------
order.taq_parent = function (node, tag) {
    if (node)
        return (node.tagName == tag) ? node : order.taq_parent(node.parentElement, tag);
    return null;
}
order.click_table2 = function (e) {

    let row = order.taq_parent(e.target, 'TR');
    if (row) {
        let table = this;
        let idx = table.getAttribute('activeRowIndex');
        table.rows[idx].classList.remove('activeRow');
        row.classList.add('activeRow');
        table.setAttribute('activeRowIndex', row.rowIndex);
        let prjprodID = row.cells[0].innerHTML;
        //======================================================================
        dbrec.prjprodRec = findef(dbset.prjprodList.find(rec => prjprodID == rec[PRJPROD.id], dbset.prjprodList));
        //======================================================================
        let script = dbrec.prjprodRec[PRJPROD.script];
    }
}
//------------------------------------------------------------------------------
//Карточка ввода заказов
order.card_deploy = function (taq, type) {

    let orderRec = dbset.orderList.find(rec => dbrec.orderRow.id = rec[ORDER.id]);
    dbrec.dealerRec = dbset.dealerList.find(rec => orderRec[ORDER.prjpart_id] == rec[DEALER.id]);

    $("#n21").val(dbrec.orderRow.num_ord);
    $("#n22").val(dbrec.orderRow.num_acc);
    $("#n23").val(dbrec.orderRow.date4);
    $("#n24").val(dbrec.orderRow.date6);
    $("#n25").val(dbrec.dealerRec[DEALER.partner]);

    //Открытие диалога insert
    $(taq).dialog({
        title: $(taq).attr('card_title'),
        width: $(taq).attr('card_width'),
        height: $(taq).attr('card_height'),
        modal: true,
        resizable: false,
        buttons: {
            "Применить": function () {
                if (type == 'INS') {
                    //Запишем заказ в серверную базу данных
                    $.ajax({
                        url: 'dbset?action=insertOrder',
                        data: {param: JSON.stringify({num_ord: $("#n21").val(), num_acc: $("#n22").val(), manager: login.data.user_fio,
                                date4: $("#n23").val(), date6: $("#n24").val(), prjpart_id: dbrec.dealerRec[DEALER.id]})},
                        success: (data) => {

                            if (data.result == 'ok') {
                                let record = new Array(41);
                                record[0] = 'SEL';
                                record[ORDER.id] = data.id;
                                record[ORDER.num_ord] = $("#n21").val();
                                record[ORDER.num_acc] = $("#n22").val();
                                record[ORDER.manager] = login.data.user_fio;
                                record[ORDER.date4] = $("#n23").val();
                                record[ORDER.date6] = $("#n24").val();
                                record[ORDER.owner] = login.data.user_name;
                                record[ORDER.prjpart_id] = dbrec.dealerRec[DEALER.id];
                                dbset.orderList.push(record);
                                order.load_table($("#table1"));
                            } else
                                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                        },
                        error: () => {
                            dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                        }
                    });
                } else if (type == 'UPD') {
                    orderRec[0] = 'SEL';
                    orderRec[ORDER.num_ord] = $("#n21").val();
                    orderRec[ORDER.num_acc] = $("#n22").val();
                    orderRec[ORDER.manager] = login.data.user_fio;
                    orderRec[ORDER.date4] = $("#n23").val();
                    orderRec[ORDER.date6] = $("#n24").val();
                    orderRec[ORDER.owner] = login.data.user_name;
                    orderRec[ORDER.prjpart_id] = dbrec.dealerRec[DEALER.id];
                    $.ajax({
                        url: 'dbset?action=updateOrder',
                        data: {param: JSON.stringify(orderRec)},
                        success: (data) => {
                            if (data.result == 'ok') {
                                let rowid = $('#table1').jqGrid('getGridParam', "selrow");
                                $('#table1').jqGrid('setRowData', rowid, {
                                    id: orderRec[ORDER.id],
                                    num_ord: orderRec[ORDER.num_ord],
                                    num_acc: orderRec[ORDER.num_acc],
                                    date4: orderRec[ORDER.date4],
                                    date6: orderRec[ORDER.date6],
                                    partner: dbrec.dealerRec[DEALER.partner],
                                    manager: orderRec[ORDER.manager]
                                });
                            } else
                                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                        },
                        error: () => {
                            dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                        }
                    });

                }
                $(this).dialog("close");
            },
            "Отменить": function () {
                $(this).dialog("close");
            }
        }
    });
}
//------------------------------------------------------------------------------


