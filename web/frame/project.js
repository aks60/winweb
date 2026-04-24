import {Wincalc} from '../build/Wincalc.js';
import {product} from './product.js';
export let project = {mapWinc: new Map(), prjprodRec: null, table1rowID: 1, table3rowID: 1};

//TODO При удалении проекта таблица 2 не удаляется
//Масштабирование
export function  resize() {
    $("#context").css("height", window.innerHeight - 80);
    $("#table1").jqGrid('setGridWidth', $("#centr").width());
    $("#table1").jqGrid('setGridHeight', $("#centr").height() - 28);
    $("#table2").jqGrid('setGridWidth', $("#east").width() - 4);
    $("#table3").jqGrid('setGridWidth', $("#east").width() - 4);
}

//Инициализация таблиц
export function init_table() {
    $(project.table1).jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        rownumWidth: 20,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Номер заказа', 'Номер счёта', 'Дата от...', 'Дата до...', 'Контрагент', 'User', 'prjpart_id'],
        colModel: [
            {name: 'ID', hidden: true},
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
            project.projectRec = eProject.list.find(rec => Number(projectRow.ID) === rec[eProject.id]);
            project.table1rowID = rowid;
            load_table2();
            load_table3();   //загрузка таблицы 3         
        },
        gridComplete: function () {
            resize();
        }
    });
    $(project.table2).jqGrid({
        datatype: "local",
        gridview: true,
        autowidth: true,
        height: 'auto',
        colNames: ['id', '', 'Проц.скидки', 'Без скидок', 'Со скидкой'],
        colModel: [
            {name: 'ID', hidden: true},
            {name: 'name', width: 120, sortable: false},
            {name: 'disc', width: 80, sortable: false, edittype: 'text'},
            {name: 'cost1', width: 100, sortable: false},
            {name: 'cost2', width: 100, sortable: false},
        ]
    });

    $(project.table3).jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        rownumWidth: 20,
        autowidth: true,
        height: 'auto',
        colNames: ['id', 'Наименование', 'Кол-во', 'Изображение'],
        colModel: [
            {name: 'ID', hidden: true},
            {name: 'name', width: 220, sortable: false},
            {name: 'num', width: 24, sortable: false},
            {name: 'image', width: 68, sortable: false, formatter: function (cellvalue, options, rowObject) {
                    return '<canvas id="cnv' + options.rowId + '" width="68" height="68"></canvas>';
                }
            }
        ],
        onSelectRow: function (rowid, status, e) {
            let prjprodRow = $(project.table3).jqGrid('getRowData', rowid);
            project.prjprodRec = ePrjprod.list.find(rec => Number(prjprodRow.ID) === rec[ePrjprod.id]);
            project.table3rowID = rowid;
            product.winCalc = project.mapWinc.get(project.prjprodRec[ePrjprod.id]);
        }
        //gridComplete: function () {} //использовать при загрузки рисунка
    });
}

//Загрузка лроектов в таблицу
export function load_table1() {

    $(project.table1).jqGrid('clearGridData', true);
    eProject.list.sort((a, b) => b[eProject.id] - a[eProject.id]);
    for (let i = 0; i < eProject.list.length; i++) {
        let tr = eProject.list[i];
        $(project.table1).jqGrid('addRowData', i + 1, {
            ID: tr[eProject.id],
            num_ord: tr[eProject.num_ord],
            num_acc: tr[eProject.num_acc],
            date4: tr[eProject.date4],
            date6: tr[eProject.date6],
            partner: findef(tr[eProject.prjpart_id], eDealer.id, eDealer)[eDealer.partner],
            manager: tr[eProject.manager],
            prjpart_id: tr[eProject.prjpart_id]
        });
    }
    $(project.table1).jqGrid("setSelection", project.table1rowID);
}

//Загрузка конструкций в таблицу
export function load_table2() {

    const rubf = new Intl.NumberFormat('ru-RU', {style: 'currency', currency: 'RUB'});

    $(project.table2).jqGrid('clearGridData', true);
    $('#p33').val(Math.round(project.projectRec[eProject.square] / 1000000 * 100) / 100); //площадь
    $('#p34').val(Math.round(project.projectRec[eProject.weight] * 100) / 100); //вес 

    $(project.table2).jqGrid('addRowData', 1, {ID: 1, name: 'Конструкции',
        disc: project.projectRec[eProject.disc_win], //скидка конструкции 
        cost1: rubf.format(project.projectRec[eProject.cost1_win]), //cтоимость конструкций без скидки
        cost2: rubf.format(project.projectRec[eProject.cost2_win])}); //cтоимость конструкций co скидкой
    $(project.table2).jqGrid('addRowData', 2, {ID: 2, name: 'Комплектации',
        disc: project.projectRec[eProject.disc_kit], //скидка комплектации
        cost1: rubf.format(project.projectRec[eProject.cost1_kit]), //стоимость комплектации без скидки
        cost2: rubf.format(project.projectRec[eProject.cost1_kit])}); //стоимость комплектации со скидкой
    $(project.table2).jqGrid('addRowData', 3, {ID: 3, name: 'Итого за заказ',
        disc: project.projectRec[eProject.disc_all], //скидка общая
        cost1: rubf.format(project.projectRec[eProject.cost1_win] + project.projectRec[eProject.cost1_kit]), //итого стоимость без скидки
        cost2: rubf.format(project.projectRec[eProject.cost2_win] + project.projectRec[eProject.cost2_kit])}); //итого стоимость со скидкой
}

//Загрузка конструкций в таблицу
export function load_table3() {
    let projectID = project.projectRec[eProject.id];
    project.mapWinc.clear();
    $(project.table3).jqGrid('clearGridData', true);
    let prjprodList = ePrjprod.list.filter(rec => projectID == rec[ePrjprod.project_id]); //фильтр конструкций заказа по ключу projectRow.ID
    for (let i = 0; i < prjprodList.length; ++i) {

        let prjprodRec = prjprodList[i];
        $(project.table3).jqGrid('addRowData', i + 1, {
            ID: prjprodRec[ePrjprod.id],
            name: prjprodRec[ePrjprod.name],
            num: prjprodRec[ePrjprod.num]
        });

        let canvas = document.getElementById('cnv' + (i + 1));
        let script = prjprodRec[ePrjprod.script];
        let winc = Wincalc.new(canvas, 68, 68, script);
        project.mapWinc.set(prjprodRec[ePrjprod.id], winc);
    }
    $(project.table3).jqGrid("setSelection", project.table3rowID);
}

//Вставка строки в таблицу
export function insert_table1(taq) {

    let projectRow = getSelectedRow($(project.table1));
    let projectRec = eProject.list.find(rec => Number(projectRow.ID) === rec[eProject.id]);
    $.ajax({//генерации ключа на сервере
        url: 'dbset?action=genidProject',
        data: {param: JSON.stringify({})},
        success: (datkey) => {
            if (datkey.result === 'ok') {
                $("#p21").val(datkey.id);
                $("#p22").val('');
                $("#p23").val(formatDate2(new Date()));
                $("#p24").val('');
                $("#p25").val('');
                $("#p25").attr("fk", '-3');

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
                            projectRec[eProject.num_ord] = $("#p21").val();
                            projectRec[eProject.num_acc] = $("#p22").val();
                            projectRec[eProject.manager] = login.data.user_fio;
                            projectRec[eProject.date4] = $("#p23").val();
                            projectRec[eProject.date6] = $("#p24").val();
                            projectRec[eProject.owner] = login.data.user_name;
                            projectRec[eProject.prjpart_id] = $("#p25").attr("fk");
                            if ($("#p25").attr("fk") === '-3') {
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
    let projectRec = eProject.list.find(rec => Number(projectRow.ID) === rec[eProject.id]);
    $("#p21").val(projectRow.num_ord);
    $("#p22").val(projectRow.num_acc);
    $("#p23").val(projectRow.date4);
    $("#p24").val(projectRow.date6);
    $("#p25").val(projectRow.partner);
    $("#p25").attr("fk", projectRow.prjpart_id);
    $(dialogCard).dialog({//открытие диалога insert
        title: "Карточка редактирования заказа",
        width: $(dialogCard).attr('card_width'),
        height: $(dialogCard).attr('card_height'),
        modal: true,
        resizable: false,
        buttons: {
            "Применить": function () {

                projectRec[0] = 'UPD';
                projectRec[eProject.num_ord] = $("#p21").val();
                projectRec[eProject.num_acc] = $("#p22").val();
                projectRec[eProject.manager] = login.data.user_fio;
                projectRec[eProject.date4] = $("#p23").val();
                projectRec[eProject.date6] = $("#p24").val();
                projectRec[eProject.owner] = login.data.user_name;
                projectRec[eProject.prjpart_id] = $("#p25").attr("fk");
                $.ajax({
                    url: 'dbset?action=updateProject',
                    data: {param: JSON.stringify(projectRec)},
                    success: (data) => {
                        if (data.result === 'ok') {
                            let rowid = $(project.table1).jqGrid('getGridParam', "selrow");
                            $(project.table1).jqGrid('setRowData', rowid, {
                                ID: projectRec[eProject.id],
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
                        data: {param: JSON.stringify({id: projectRow.ID})},
                        success: (data) => {
                            if (data.result === 'ok') {
                                table.jqGrid('delRowData', table.jqGrid('getGridParam', "selrow"));
                                for (let i = 0; i < eProject.list.length; ++i) {
                                    if (Number(projectRow.ID) === eProject.list[i][eProject.id]) {
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

//Редактирования строки таблицы
export function update_table2(dialogCard) {

    $("#p35").val($(project.table2).jqGrid('getCell', 1, 2));
    $("#p36").val($(project.table2).jqGrid('getCell', 2, 2));
    $("#p37").val($(project.table2).jqGrid('getCell', 3, 2));

    $(dialogCard).dialog({
        title: "Карточка редактирования заказа",
        width: $(dialogCard).attr('card_width'),
        height: $(dialogCard).attr('card_height'),
        modal: true,
        resizable: false,
        buttons: {
            "Применить": function () {

                project.projectRec[eProject.disc_win] = $('#p35').val();
                project.projectRec[eProject.disc_kit] = $('#p36').val();
                project.projectRec[eProject.disc_all] = $('#p37').val();

                $.ajax({
                    url: 'dbset?action=updateProject',
                    data: {param: JSON.stringify(project.projectRec)},
                    success: (data) => {
                        
                        if (data.result === 'ok') {
                            load_table2();
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

//Добавим запись в домен ePrjprod
export function insert_table3(table, prjprodRec) {
}

//Редактирования строки таблицы
export function update_table3(taq) {

    $("#p31").val(project.prjprodRec[ePrjprod.num]);
    $("#p32").val(project.prjprodRec[ePrjprod.name]);


    $(taq).dialog({//открытие диалога insert
        title: "Карточка редактирования заказа",
        width: $(taq).attr('card_width'),
        height: $(taq).attr('card_height'),
        modal: true,
        resizable: false,
        buttons: {
            "Применить": function () {
                project.prjprodRec[0] = 'UPD';
                project.prjprodRec[ePrjprod.num] = $("#p31").val();
                project.prjprodRec[ePrjprod.name] = $("#p32").val();
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

export function calculate_project() {
    try {
        $.ajax({
            url: 'dbset?action=calculateProject',
            data: {'projectID': project.projectRec[eProject.id]},
            success: (data) => {
                debugger;
                if (data.result === 'ok') {
                    let projectRec = data.projectRec;

                    project.projectRec[eProject.square] = projectRec[eProject.square];
                    project.projectRec[eProject.weight] = projectRec[eProject.weight];
                    project.projectRec[eProject.cost1_win] = projectRec[eProject.cost1_win];
                    project.projectRec[eProject.cost2_win] = projectRec[eProject.cost2_win];
                    project.projectRec[eProject.cost1_kit] = projectRec[eProject.cost1_kit];
                    project.projectRec[eProject.cost2_kit] = projectRec[eProject.cost2_kit];

                    load_table2();

                } else
                    dialogMes('Сообщение', "<p>" + data.result);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error("AJAX Error: " + textStatus, errorThrown);
                dialogMes('Сообщение', "<p>Ошибка при калькуляции заказа на сервере");
            }
        });
    } catch (e) {
        console.error(e.message);
    }
}


