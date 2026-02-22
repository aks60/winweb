import {Wincalc} from '../build/Wincalc.js';
export let project = {wincalcMap: new Map(), prjprodRec: null};

//Масштабирование
export function  resize() {
    $("#context").css("height", window.innerHeight - 80);
    $("#table1").jqGrid('setGridWidth', $("#centr").width() - 5);
    $("#table1").jqGrid('setGridHeight', $("#centr").height() - 28);
}

//Текущий WINC 
export function get_winc() {
    if (project.wincalcMap !== undefined && project.prjprodRec !== undefined) {
        let prjprodID = project.prjprodRec[ePrjprod.id];
        return project.wincalcMap.get(prjprodID);
    }
    return null;
}

//Инициализация таблиц
export function init_table() {
    $(project.table1).jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Номер заказа', 'Номер счёта', 'Дата от...', 'Дата до...', 'Контрагент', 'User', 'prjpart_id'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'num_ord', width: 80, sorttype: "text"},
            {name: 'num_acc', width: 80, sorttype: "text"},
            {name: 'date4', width: 80, sorttype: "text"},
            {name: 'date6', width: 80, sorttype: "text"},
            {name: 'partner', width: 220, sorttype: "text"},
            {name: 'manager', width: 120, sorttype: "text"},
            {name: 'prjpart_id', hidden: true}
        ],
        //Загрузка таблицы 2
        onSelectRow: function (rowid, status, e) {
            click_table1(rowid);
        }
    });
    resize();
}

//Загрузка данных в таблицу
export function load_table1() {

    $(project.table1).jqGrid('clearGridData', true);
    eProject.list.sort((a, b) => b[eProject.id] - a[eProject.id]);
    for (let i = 0; i < eProject.list.length; i++) {
        let tr = eProject.list[i];
        $(project.table1).jqGrid('addRowData', i + 1, {
            id: tr[eProject.id],
            num_ord: tr[eProject.num_ord],
            num_acc: tr[eProject.num_acc],
            date4: tr[eProject.date4],
            date6: tr[eProject.date6],
            partner: findef(tr[eProject.prjpart_id], eDealer.id, eDealer)[eDealer.partner],
            manager: tr[eProject.manager],
            prjpart_id: tr[eProject.prjpart_id]
        });
    }
    $(project.table1).jqGrid("setSelection", 1);
    //$(project.table1).jqGrid("setSelection", rowID);
    resize();
}

//Добавить контрукцию в таблицу
export function load_table2(projectID) {

    //Очистим списки
    project.wincalcMap.clear();
    let rc = project.table2.rows.length;
    for (let i = 1; i < rc; i++) {
        project.table2.deleteRow(1);
    }
    //Заполним табл. конструкций            
    let prjprodList = ePrjprod.list.filter(rec => projectID == rec[ePrjprod.project_id]); //фильтр конструкций заказа по ключу projectRow.id
    if (prjprodList.length > 0) {
        let prjprodID = null;
        for (let rec of prjprodList) {

            //Добавим запись в домен ePrjprod
            insert_table2(project.table2, rec);
            //Выделение строки табл. конструкций
            if (project.prjprodRec !== null && project.prjprodRec[ePrjprod.id] === rec[ePrjprod.id]) {
                prjprodID = rec[ePrjprod.id];
            } else if (prjprodID === null) {
                prjprodID = rec[ePrjprod.id]; //первая конструкция
            }
        }
        document.getElementById('cnv' + prjprodID).click(); //программный клик на конструкции
    }
}

//Удаление строки таблицы
export function delete_table1(table) {

    let projectRow = getSelectedRow(table);
    if (projectRow != null) {
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
                        data: {param: JSON.stringify({id: projectRow.id})},
                        success: (data) => {
                            if (data.result === 'ok') {
                                table.jqGrid('delRowData', table.jqGrid('getGridParam', "selrow"));
                                for (let i = 0; i < eProject.list.length; ++i) {
                                    if (projectRow.id === eProject.list[i][eProject.id]) {
                                        eProject.list.splice(i, 1);
                                    }
                                }
                            } else
                                dialogMes('Сообщение', "<p>" + data.result);
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
}

//Вставка строки в таблицу
export function insert_table1(taq) {

    let projectRow = getSelectedRow($(project.table1));
    let projectRec = eProject.list.find(rec => projectRow.id = rec[eProject.id]);
    $.ajax({//генерации ключа на сервере
        url: 'dbset?action=genidProject',
        data: {param: JSON.stringify({})},
        success: (datkey) => {
            if (datkey.result === 'ok') {
                $("#n21").val(datkey.id);
                $("#n22").val('');
                $("#n23").val(formatDate2(new Date()));
                $("#n24").val('');
                $("#n25").val('');
                $("#n25").attr("fk", '-3');
                //Открытие диалога insert
                $(taq).dialog({
                    title: "Карточка ввода нового проекта",
                    width: $(taq).attr('card_width'),
                    height: $(taq).attr('card_height'),
                    modal: true,
                    resizable: false,
                    buttons: {
                        "Применить": function () {
                            if ($("#n25").attr("fk") === -3) {
                                dialogMes('Сообщение', "<p>Контрагент не установлен");
                                return;
                            }
                            $.ajax({//запишем заказ в серверную базу данных
                                url: 'dbset?action=insertProject',
                                data: {param: JSON.stringify({
                                        id: datkey.id,
                                        num_ord: $("#n21").val(),
                                        num_acc: $("#n22").val(),
                                        manager: login.data.user_fio,
                                        date4: $("#n23").val(),
                                        date6: $("#n24").val(),
                                        prjpart_id: $("#n25").attr("fk")})},
                                success: (data) => {

                                    if (data.result === 'ok') {
                                        let record = eProject.vrec();
                                        record[0] = 'SEL';
                                        record[eProject.id] = datkey.id;
                                        record[eProject.num_ord] = $("#n21").val();
                                        record[eProject.num_acc] = $("#n22").val();
                                        record[eProject.manager] = login.data.user_fio;
                                        record[eProject.date4] = $("#n23").val();
                                        record[eProject.date6] = $("#n24").val();
                                        record[eProject.owner] = login.data.user_name;
                                        record[eProject.prjpart_id] = $("#n25").attr("fk");
                                        eProject.list.push(record);
                                        load_table1($(project.table1));
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
            } else
                dialogMes('Сообщение', "<p>Ошибка при генерации ключа на сервере");
        },
        error: () => {
            dialogMes('Сообщение', "<p>Ошибка при генерации ключа на сервере");
        }
    });
}

//Редактирования строки таблицы
export function update_table1(taq) {

    let projectRow = getSelectedRow($(project.table1));
    let projectRec = eProject.list.find(rec => projectRow.id == rec[eProject.id]);
    $("#n21").val(projectRow.num_ord);
    $("#n22").val(projectRow.num_acc);
    $("#n23").val(projectRow.date4);
    $("#n24").val(projectRow.date6);
    $("#n25").val(projectRow.partner);
    $("#n25").attr("fk", projectRow.prjpart_id);
    $(taq).dialog({//открытие диалога insert
        title: "Карточка редактирования заказа",
        width: $(taq).attr('card_width'),
        height: $(taq).attr('card_height'),
        modal: true,
        resizable: false,
        buttons: {
            "Применить": function () {

                projectRec[0] = 'UPD';
                projectRec[eProject.num_ord] = $("#n21").val();
                projectRec[eProject.num_acc] = $("#n22").val();
                projectRec[eProject.manager] = login.data.user_fio;
                projectRec[eProject.date4] = $("#n23").val();
                projectRec[eProject.date6] = $("#n24").val();
                projectRec[eProject.owner] = login.data.user_name;
                projectRec[eProject.prjpart_id] = $("#n25").attr("fk");
                $.ajax({
                    url: 'dbset?action=updateProject',
                    data: {param: JSON.stringify(projectRec)},
                    success: (data) => {
                        if (data.result === 'ok') {
                            let rowid = $(project.table1).jqGrid('getGridParam', "selrow");
                            $(project.table1).jqGrid('setRowData', rowid, {
                                id: projectRec[eProject.id],
                                num_ord: projectRec[eProject.num_ord],
                                num_acc: projectRec[eProject.num_acc],
                                date4: projectRec[eProject.date4],
                                date6: projectRec[eProject.date6],
                                partner: findef(projectRec[eProject.prjpart_id], eDealer.id, eDealer)[eDealer.partner],
                                manager: projectRec[eProject.manager]
                            });
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

//Клик table2
export function click_table1(rowid) {
    debugger;
    let projectRow = (rowid) ? $(project.table1).jqGrid('getRowData', rowid) : null;
    load_table2(projectRow.id);
    project.projectRec = eProject.list.find(rec => projectRow.id == rec[eProject.id]);
}

//Добавим запись в домен ePrjprod
export function insert_table2(table, prjprodRec) {

    //Добавим запись в таблице конструкций
    let prjprodID = prjprodRec[ePrjprod.id];
    let canvas = document.createElement("canvas");
    canvas.class = "cnv";
    canvas.id = 'cnv' + prjprodID;

    let id = document.createTextNode(prjprodID);
    let name = document.createTextNode(prjprodRec[ePrjprod.name]);
    let script = prjprodRec[ePrjprod.script];

    //Создание экземпрляра окна
    let winc = Wincalc.new(canvas, 68, 68, script);
    project.wincalcMap.set(prjprodID, winc); //массив объектов winc

    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let tr = document.createElement('tr');
    tr.id = 'tr' + prjprodID;
    td1.appendChild(id);
    td2.appendChild(name);
    td3.appendChild(canvas);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    table.appendChild(tr);
}

//Клик table2
export function click_table2(e) {
    let row = taq_parent(e.target, 'TR');
    if (row) {
        let table = this;
        let idx = table.getAttribute('activeRowIndex');
        if (idx < table.rows.length) {
            table.rows[idx].classList.remove('activeRow');
        }
        row.classList.add('activeRow');
        table.setAttribute('activeRowIndex', row.rowIndex);
        let prjprodID = row.cells[0].innerHTML;
        project.prjprodRec = findef(prjprodID, ePrjprod.id, ePrjprod);
    }
}

function taq_parent(node, tag) { //рекурсия
    if (node)
        return (node.tagName === tag) ? node : taq_parent(node.parentElement, tag);
    return null;
}

//Удаление строки таблицы 
export function delete_table2() {

    if (project.prjprodRec != null) {
        $("#dialog-mes").html("<p><span class='ui-icon ui-icon-alert'>\n\
    </span> Вы действительно хотите удалить текущую запись?");
        $("#dialog-mes").dialog({
            title: "Подтверждение=",
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Да": function () {
                    $.ajax({
                        url: 'dbset?action=deletePrjprod',
                        data: {param: JSON.stringify({id: project.prjprodRec[ePrjprod.id]})},
                        success: (data) => {
                            if (data.result === 'ok') {
                                let id = 'tr' + project.prjprodRec[ePrjprod.id];
                                var trow = document.getElementById(id);
                                trow.remove();
                                for (let i = 0; i < ePrjprod.list.length; ++i) {
                                    if (ePrjprod.list[i][ePrjprod.id] === project.prjprodRec[ePrjprod.id]) {
                                        ePrjprod.list.splice(i, 1);
                                    }
                                }
                                //Перезагрузка таблицы конструкций
                                let rowid = $("#table1").jqGrid('getGridParam', "selrow");
                                $("#table1").jqGrid("setSelection", rowid);
                            } else
                                dialogMes('Сообщение', "<p>" + data.result);
                        },
                        error: () => {
                            dialogMes('Сообщение', "<p>Ошибка при удалении записи на сервере");
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
}


