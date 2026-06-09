import {Wincalc} from '../build/Wincalc.js';
import {login} from './login.js';

export let partner = {};

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
        colNames: ['id', 'Заказчик', 'Организация'],
        colModel: [
            {name: 'ID', hidden: true},
            {name: 'partner', width: 400, sorttype: "text"},
            {name: 'flag2', width: 40}
        ],
        onSelectRow: function (rowid, status, e) {
            let prjpartRow = $(partner.table1).jqGrid('getRowData', rowid);
            partner.prjpartRec = ePrjpart.list.find(rec => Number(prjpartRow.ID) === rec[ePrjpart.id]);
            partner.select_table1();
            if (prjpartRow.flag2 === '0') {
                partner.btn_to_tabs('btn1');
            } else {
                partner.btn_to_tabs('btn2');
            }
        },
        gridComplete: function () {
            partner.resize();
            
        }
    });
};

//Загрузка лроектов в таблицу
partner.load_table1 = function () {
    $(partner.table1).jqGrid('clearGridData', true);
    let partnerList = ePrjpart.list; //.filter(rec => rec[ePrjpart.login] === login.login && rec[ePrjpart.category] === 'заказчик');
    partnerList.sort((a, b) => b[ePrjpart.id] - a[ePrjpart.id]);
    for (let i = 0; i < 60; i++) {
        let tr = partnerList[i];
        $(partner.table1).jqGrid('addRowData', i + 1, {
            ID: tr[ePrjpart.id],
            partner: tr[ePrjpart.partner],
            flag2: tr[ePrjpart.flag2]
        });
    }
    //$(partner.table1).jqGrid("setSelection", partner.table1rowID);
};

partner.select_table1 = function () {
    let rec = partner.prjpartRec;

    $("#p11").val(rec[ePrjpart.partner]); //Заказчик
    $("#p12").val(rec[ePrjpart.addr_phon]); //Телефон
    $("#p13").val(rec[ePrjpart.addr_emai]); //E-mail
    $("#p14").val(rec[ePrjpart.addr_leve1]); //Адрес 1го уровня
    $("#p15").val(rec[ePrjpart.addr_leve2]); //Адрес 2го уровня
    $("#p16").val(rec[ePrjpart.note]); //Примечание      

    $("#p17").val(rec[ePrjpart.partner]); //Заказчик
    $("#p18").val(rec[ePrjpart.org_conta]); //Контакт. лицо
    $("#p19").val(rec[ePrjpart.org_phone]); //Телефон
    $("#p20").val(rec[ePrjpart.org_email]); //E-mail
    $("#p21").val(rec[ePrjpart.org_leve1]); //Адрес 1го уровня
    $("#p22").val(rec[ePrjpart.org_leve2]); //Адрес 2го уровня
    $("#p23").val(rec[ePrjpart.note]); //Примечание

    $("#p24").val(rec[ePrjpart.bank_name]); //Банк
    $("#p25").val(rec[ePrjpart.bank_inn]); //ИНН'
    $("#p26").val(rec[ePrjpart.bank_rs]); //Р/С'
    $("#p27").val(rec[ePrjpart.bank_bik]); //БИК'
    $("#p28").val(rec[ePrjpart.bank_ks]); //К/С'
    $("#p29").val(rec[ePrjpart.bank_kpp]); //КПП'
    $("#p30").val(rec[ePrjpart.bank_ogrn]); //ОГРН    
};

partner.btn_to_tabs = function (btnTaq) {
    $("#east1, #east2").hide();
    if (btnTaq === 'btn1') {
        $("#east1").show();
    } else if (btnTaq === 'btn2') {
        $("#east2").show();
    }
};

partner.insert_table1 = function () {

    let taq = document.getElementById('dialog-card1');
    let partnerRow = getSelectedRow($(partner.table1));
    let partnerRec = ePrjpart.list.find(rec => Number(partnerRow.ID) === rec[ePrjpart.id]);
    $.ajax({//генерации ключа на сервере
        url: 'dbset?action=genidPrjpart',
        data: {param: JSON.stringify({})},
        success: (datkey) => {
            if (datkey.result === 'ok') {

                //Открытие диалога insert
                $(taq).dialog({
                    title: "Карточка ввода нового дилера",
                    width: $(taq).attr('card_width'),
                    height: $(taq).attr('card_height'),
                    modal: true,
                    resizable: false,
                    buttons: {
                        "Применить": function () {
                            let prjpartRec = ePrjpart.vrec;
                            prjpartRec[0] = 'SEL';

                            if ($("#p26").attr("fk") === '-3') {
                                dialogMes('Сообщение', "<p>Контрагент не установлен");
                                return;
                            }
                            $.ajax({//запишем заказ в серверную базу данных
                                url: 'dbset?action=insertPartner',
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