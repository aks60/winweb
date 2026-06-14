import {Wincalc} from '../build/Wincalc.js';
import {login} from './login.js';

export let partner = {};

partner.test = function () { 
    $().value(777);
};

//Масштабирование
partner.resize = function () {
    $("#context").css("height", window.innerHeight - 48);
    $(partner.table1).jqGrid('setGridWidth', $("#centr").width());
    $(partner.table1).jqGrid('setGridHeight', $("#centr").height() - 34);
};

//Инициализация таблиц
partner.init_table = function () {
    $(partner.table1).jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        rownumWidth: 20,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Заказчик', 'Орг-ия'],
        colModel: [
            {name: 'ID', hidden: true},
            {name: 'partner', width: 400, sorttype: "text"},
            {name: 'flag2', width: 24}
        ],
        onSelectRow: function (rowid, status, e) {
            partner.rowid = rowid;
            partner.prjpartRow = $(partner.table1).jqGrid('getRowData', rowid);
            partner.prjpartRec = ePrjpart.list.find(rec => Number(partner.prjpartRow.ID) === rec[ePrjpart.id]);
            partner.select_table1();
            partner.selection_tabs(partner.prjpartRec[ePrjpart.flag2]);
        },
        gridComplete: function () {
            partner.resize();

        }
    });
};

//Загрузка лроектов в таблицу
partner.load_table1 = function () {
    $(partner.table1).jqGrid('clearGridData', true);
    let partnerList = ePrjpart.list.filter(rec => rec[ePrjpart.login] === login.login && rec[ePrjpart.category] === 'заказчик');
    partnerList.sort((a, b) => b[ePrjpart.id] - a[ePrjpart.id]);
    for (let i = 0; i < partnerList.length; i++) {
        let tr = partnerList[i];
        $(partner.table1).jqGrid('addRowData', i + 1, {
            ID: tr[ePrjpart.id],
            partner: tr[ePrjpart.partner],
            flag2: tr[ePrjpart.flag2]
        });
    }
    if (partnerList.length > 0) {
        $(partner.table1).jqGrid("setSelection", 1);
    }
};

partner.select_table1 = function () {
    partner.rec_to_txt(partner.prjpartRec, '#p')
};

partner.selection_tabs = function (num) {
    $("#east1, #east2").hide();
    if (num === 0) {
        $("#east1").show();
    } else if (num === 1) {
        $("#east2").show();
    }
};

partner.kart_tabs = function (num) {
    $("#tab1, #tab2").hide();
    if (num === 0) {
        $("#tab1").show();
    } else if (num === 1) {
        $("#tab2").show();
    }
};

partner.insert_table1 = function () {

    let taq = document.getElementById('dialog-card1');
    let partnerRow = getSelectedRow($(partner.table1));
    $.ajax({//генерации ключа на сервере
        url: 'dbset?action=genidPrjpart',
        data: {param: JSON.stringify({})},
        success: (datkey) => {
            if (datkey.result === 'ok') {
                const fields = Array.from({length: 30 - 11 + 1}, (_, i) => 11 + i);
                fields.forEach(it => $('#k' + it).val(''));

                //Открытие диалога insert
                $(taq).dialog({
                    title: "Карточка ввода нового заказчика",
                    width: $(taq).attr('card_width'),
                    height: $(taq).attr('card_height'),
                    modal: true,
                    resizable: false,
                    buttons: {
                        "Применить": function () {
                            let prjpartRec = ePrjpart.vrec();
                            prjpartRec[0] = 'SEL';
                            prjpartRec[ePrjpart.id] = datkey.id;

                            partner.txt_to_rec(prjpartRec, '#k');

                            $.ajax({//запишем заказ в серверную базу данных
                                url: 'dbset?action=insertPrjpart',
                                data: {param: JSON.stringify(prjpartRec)},
                                success: (data) => {
                                    if (data.result === 'ok') {
                                        ePrjpart.list.push(prjpartRec);
                                        partner.load_table1($(partner.table1));
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
};

//Редактирования строки таблицы
partner.update_table1 = function () {
    let dialogCard = $('#dialog-card1');
    let prjpartRec = partner.prjpartRec;
    partner.kart_tabs(prjpartRec[ePrjpart.flag2]);
    partner.rec_to_txt(prjpartRec, '#k');

    dialogCard.dialog({//открытие диалога insert
        title: "Карточка редактирования заказа",
        width: dialogCard.attr('card_width'),
        height: dialogCard.attr('card_height'),
        modal: true,
        resizable: false,
        buttons: {
            "Применить": function () {
                partner.txt_to_rec(prjpartRec, '#k');
                partner.rec_to_txt(prjpartRec, '#p');
                partner.selection_tabs(prjpartRec[ePrjpart.flag2]);
                $.ajax({
                    url: 'dbset?action=updatePrjpart',
                    data: {param: JSON.stringify(prjpartRec)},
                    success: (data) => {
                        if (data.result === 'ok') {
                            $(partner.table1).jqGrid('setRowData', partner.rowid, {
                                partner: prjpartRec[ePrjpart.partner],
                                flag2: prjpartRec[ePrjpart.flag2]
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
};

//Удаление строки таблицы
partner.delete_table1 = function () {
    let prjpartRow = partner.prjpartRow;
    if (prjpartRow !== null) {
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
                        url: 'dbset?action=deletePrjpart',
                        data: {param: JSON.stringify({id: prjpartRow.ID})},
                        success: (data) => {
                            if (data.result === 'ok') {
                                $(partner.table1).jqGrid('delRowData', $(partner.table1).jqGrid('getGridParam', "selrow"));
                                for (let i = 0; i < ePrjpart.list.length; ++i) {
                                    if (Number(prjpartRow.ID) === ePrjpart.list[i][ePrjpart.id]) {
                                        ePrjpart.list.splice(i, 1);
                                    }
                                }
                                $(partner.table1).jqGrid("setSelection", 1, true);
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
};

partner.txt_to_rec = function (prjpartRec, pre) {
    prjpartRec[ePrjpart.flag2] = $("#dialog-card1").tabs("option", "active");
    prjpartRec[ePrjpart.login] = login.login;
    prjpartRec[ePrjpart.category] = 'заказчик';
    prjpartRec[ePrjpart.partner] = $(pre + 11).val();

    prjpartRec[ePrjpart.addr_phon] = $(pre + 12).val();
    prjpartRec[ePrjpart.addr_emai] = $(pre + 13).val();
    prjpartRec[ePrjpart.addr_leve1] = $(pre + 14).val();
    prjpartRec[ePrjpart.addr_leve2] = $(pre + 15).val();
    prjpartRec[ePrjpart.note] = $(pre + 16).val();

    prjpartRec[ePrjpart.org_contact] = $(pre + 18).val();
    prjpartRec[ePrjpart.org_phone] = $(pre + 19).val();
    prjpartRec[ePrjpart.org_email] = $(pre + 20).val();
    prjpartRec[ePrjpart.org_leve1] = $(pre + 21).val();
    prjpartRec[ePrjpart.org_leve2] = $(pre + 22).val();

    prjpartRec[ePrjpart.bank_name] = $(pre + 24).val();
    prjpartRec[ePrjpart.bank_inn] = $(pre + 25).val();
    prjpartRec[ePrjpart.bank_rs] = $(pre + 26).val();
    prjpartRec[ePrjpart.bank_bik] = $(pre + 27).val();
    prjpartRec[ePrjpart.bank_ks] = $(pre + 28).val();
    prjpartRec[ePrjpart.bank_kpp] = $(pre + 29).val();
    prjpartRec[ePrjpart.bank_ogrn] = $(pre + 30).val();
};

partner.rec_to_txt = function (prjpartRec, pre) {
    $(pre + 11).val(prjpartRec[ePrjpart.partner]); //Заказчик
    $(pre + 12).val(prjpartRec[ePrjpart.addr_phon]); //Телефон
    $(pre + 13).val(prjpartRec[ePrjpart.addr_emai]); //E-mail
    $(pre + 14).val(prjpartRec[ePrjpart.addr_leve1]); //Адрес 1го уровня
    $(pre + 15).val(prjpartRec[ePrjpart.addr_leve2]); //Адрес 2го уровня
    $(pre + 16).val(prjpartRec[ePrjpart.note]); //Примечание 

    $(pre + 17).val(prjpartRec[ePrjpart.partner]); //Заказчик
    $(pre + 18).val(prjpartRec[ePrjpart.org_contact]); //Контакт. лицо
    $(pre + 19).val(prjpartRec[ePrjpart.org_phone]); //Телефон
    $(pre + 20).val(prjpartRec[ePrjpart.org_email]); //E-mail
    $(pre + 21).val(prjpartRec[ePrjpart.org_leve1]); //Адрес 1го уровня
    $(pre + 22).val(prjpartRec[ePrjpart.org_leve2]); //Адрес 2го уровня

    $(pre + 24).val(prjpartRec[ePrjpart.bank_name]); //Банк
    $(pre + 25).val(prjpartRec[ePrjpart.bank_inn]); //ИНН'
    $(pre + 26).val(prjpartRec[ePrjpart.bank_rs]); //Р/С'
    $(pre + 27).val(prjpartRec[ePrjpart.bank_bik]); //БИК'
    $(pre + 28).val(prjpartRec[ePrjpart.bank_ks]); //К/С'
    $(pre + 29).val(prjpartRec[ePrjpart.bank_kpp]); //КПП'
    $(pre + 30).val(prjpartRec[ePrjpart.bank_ogrn]); //ОГРН    
};