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
            dbrec.prorodRec = null;
            //==================================================================
            dbrec.wincalcMap.clear()
            let j = 1;
            let rc = table2.rows.length;
            for (let i = j; i < rc; i++) {
                table2.deleteRow(j);
            }
            let proprodID = null;
            for (let i = 0; i < dbset.proprodList.length; i++) {
                let proprodRec = dbset.proprodList[i];

                if (dbrec.orderRow.id == proprodRec[PROPROD.project_id]) {
                    order.add_proprodClone(table2, proprodRec);
                    if (proprodID == null) {
                        proprodID = proprodRec[PROPROD.id];
                    }
                }
            }
            if (proprodID != null && dbrec.prorodRec != undefined) {
                let id = 'cnv' + dbrec.prorodRec[PROPROD.id];
                document.getElementById(id).click();

            } else if (proprodID != null) {
                let id = 'cnv' + proprodID;
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
            partner: findef(dbset.dealerList.find(rec => tr[ORDER.propart_id] == rec[DEALER.id]), dbset.dealerList)[DEALER.partner],
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
                    url: 'dbset?action=deleteProprod',
                    data: {param: JSON.stringify({id: dbrec.prorodRec[PROPROD.id]})},
                    success: (data) => {
                        if (data.result == 'ok') {
                            let id = 'tr' + dbrec.prorodRec[PROPROD.id];
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
order.add_proprodClone = function (table2, proprodRec) {

    let canvas = document.createElement("canvas");
    canvas.class = "cnv";
    canvas.id = 'cnv' + proprodRec[PROPROD.id];
    canvas.width = 68;
    canvas.height = 68;

    let id = document.createTextNode(proprodRec[PROPROD.id]);
    let name = document.createTextNode(proprodRec[PROPROD.name]);
    let script = proprodRec[PROPROD.script];
    let iwincalc = win.build(canvas, script);

    //Массив объектов winc
    dbrec.wincalcMap.set(proprodRec[PROPROD.id], iwincalc);

    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let tr = document.createElement('tr');
    tr.id = 'tr' + proprodRec[PROPROD.id];

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
        let proprodID = row.cells[0].innerHTML;  
        //======================================================================
        dbrec.prorodRec = findef(dbset.proprodList.find(rec => proprodID == rec[PROPROD.id], dbset.proprodList));  
        //======================================================================
        let script = dbrec.prorodRec[PROPROD.script];
    }
}
//------------------------------------------------------------------------------
//Карточка ввода заказов
order.card_deploy = function (taq, type) {
    //debugger;

    if (type == 'INS') {
        //Открытие диалога insert
        $(taq).dialog({
            title: $(taq).attr('card_title'),
            width: $(taq).attr('card_width'),
            height: $(taq).attr('card_height'),
            modal: true,
            resizable: false,
            buttons: {
                "Добавить": function () {
                    //Запишем заказ в серверную базу данных
                    $.ajax({
                        url: 'dbset?action=insertOrder',
                        data: {param: JSON.stringify({num_ord: $("#n21").val(), num_acc: $("#n22").val(), manager: login.data.user_fio,
                                date4: $("#n23").val(), date6: $("#n24").val(), propart_id: dbrec.dealerRow.id})},
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
                                record[ORDER.propart_id] = dbrec.dealerRow.id;
                                dbset.orderList.push(record);
                                order.load_table($("#table1"));
                            } else
                                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
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
}
//------------------------------------------------------------------------------


