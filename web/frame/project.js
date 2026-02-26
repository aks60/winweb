import {Wincalc} from '../build/Wincalc.js';
import {product} from './product.js';
export let project = {wincalcMap: new Map(), prjprodRec: null, table1rowID: 1, table3rowID: 1};

//TODO При удалении проекта таблица 2 не удаляется
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
            {name: 'date4', width: 80, sorttype: "date"},
            {name: 'date6', width: 80, sorttype: "date"},
            {name: 'partner', width: 220, sorttype: "text"},
            {name: 'manager', width: 120, sorttype: "text"},
            {name: 'prjpart_id', hidden: true}
        ],
        onSelectRow: function (rowid, status, e) {
            let projectRow = $(project.table1).jqGrid('getRowData', rowid);
            project.projectRec = eProject.list.find(rec => projectRow.id == rec[eProject.id]);
            project.table1rowID = rowid;
            load_table3();   //загрузка таблицы 3         
        }
    });
    $(project.table3).jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        autowidth: true,
        height: 'auto',
        colNames: ['id', 'Наименование', 'Кол-во', 'Изображение'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'name', width: 220, sortable: false},
            {name: 'num', width: 24, sortable: false},
            {name: 'image', width: 68, sortable: false, formatter: function (cellvalue, options, rowObject) {
                    return '<canvas id="cnv' + options.rowId + '" width="68" height="68"></canvas>';
                }
            }
        ],
        onSelectRow: function (rowid, status, e) {
            let prjprodRow = $(project.table3).jqGrid('getRowData', rowid);
            project.prjprodRec = ePrjprod.list.find(rec => prjprodRow.id == rec[ePrjprod.id]);
            project.table3rowID = rowid;
        }
        //gridComplete: function () {} //использовать при загрузки рисунка
    });
    resize();
}

//Загрузка лроектов в таблицу
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
    resize();
    $(project.table1).jqGrid("setSelection", project.table1rowID);
}

//Загрузка конструкций в таблицу
export function load_table2(projectID) {
}

//Загрузка конструкций в таблицу
export function load_table3() {
    let projectID = project.projectRec[eProject.id];
    project.wincalcMap.clear();
    $(project.table3).jqGrid('clearGridData', true);
    let prjprodList = ePrjprod.list.filter(rec => projectID == rec[ePrjprod.project_id]); //фильтр конструкций заказа по ключу projectRow.id
    for (let i = 0; i < prjprodList.length; ++i) {

        let prjprodRec = prjprodList[i];
        $(project.table3).jqGrid('addRowData', i + 1, {
            id: prjprodRec[ePrjprod.id],
            name: prjprodRec[ePrjprod.name],
            num: prjprodRec[ePrjprod.num]
        });

        let canvas = document.getElementById('cnv' + (i + 1));
        let script = prjprodRec[ePrjprod.script];
        let winc = Wincalc.new(canvas, 68, 68, script);
        project.wincalcMap.set(prjprodRec[ePrjprod.id], winc);
    }
    $(project.table3).jqGrid("setSelection", project.table3rowID);
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

                let o1 = $(taq).attr('card_width');

                //Открытие диалога insert
                $(taq).dialog({
                    title: "Карточка ввода нового проекта",
                    width: $(taq).attr('card_width'),
                    height: $(taq).attr('card_height'),
                    modal: true,
                    resizable: false,
                    buttons: {
                        "Применить": function () {
                            let projectRec = eProject.vrec;
                            projectRec[0] = 'SEL';
                            projectRec[eProject.id] = datkey.id;
                            projectRec[eProject.num_ord] = $("#n21").val();
                            projectRec[eProject.num_acc] = $("#n22").val();
                            projectRec[eProject.manager] = login.data.user_fio;
                            projectRec[eProject.date4] = $("#n23").val();
                            projectRec[eProject.date6] = $("#n24").val();
                            projectRec[eProject.owner] = login.data.user_name;
                            projectRec[eProject.prjpart_id] = $("#n25").attr("fk");
                            if ($("#n25").attr("fk") === '-3') {
                                dialogMes('Сообщение', "<p>Контрагент не установлен");
                                return;
                            }
                            $.ajax({//запишем заказ в серверную базу данных
                                url: 'dbset?action=insertProject',
                                data: {param: JSON.stringify(projectRec)},
                                success: (data) => {
                                    if (data.result === 'ok') {
                                        eProject.list.push(projectRec);
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
export function update_table1(dialogCard) {

    let projectRow = getSelectedRow($(project.table1));
    let projectRec = eProject.list.find(rec => projectRow.id == rec[eProject.id]);
    $("#n21").val(projectRow.num_ord);
    $("#n22").val(projectRow.num_acc);
    $("#n23").val(projectRow.date4);
    $("#n24").val(projectRow.date6);
    $("#n25").val(projectRow.partner);
    $("#n25").attr("fk", projectRow.prjpart_id);
    $(dialogCard).dialog({//открытие диалога insert
        title: "Карточка редактирования заказа",
        width: $(dialogCard).attr('card_width'),
        height: $(dialogCard).attr('card_height'),
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

//Добавим запись в домен ePrjprod
export function insert_table3(table, prjprodRec) {
}

//Редактирования строки таблицы
export function update_table3(taq) {

    $("#n31").val(project.prjprodRec[ePrjprod.num]);
    $("#n32").val(project.prjprodRec[ePrjprod.name]);


    $(taq).dialog({//открытие диалога insert
        title: "Карточка редактирования заказа",
        width: $(taq).attr('card_width'),
        height: $(taq).attr('card_height'),
        modal: true,
        resizable: false,
        buttons: {
            "Применить": function () {
                project.prjprodRec[0] = 'UPD';
                project.prjprodRec[ePrjprod.num] = $("#n31").val();
                project.prjprodRec[ePrjprod.name] = $("#n32").val();
                $.ajax({
                    url: 'dbset?action=updatePrjprod',
                    data: {param: JSON.stringify(project.prjprodRec)},
                    success: (data) => {
                        if (data.result === 'ok') {
                            load_table3();
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

//Удаление строки таблицы 
export function delete_table3() {

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
                            for (let i = 0; i < ePrjprod.list.length; ++i) {
                                if (ePrjprod.list[i][ePrjprod.id] === project.prjprodRec[ePrjprod.id]) {
                                    ePrjprod.list.splice(i, 1);
                                }
                            }
                            load_table3();
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


