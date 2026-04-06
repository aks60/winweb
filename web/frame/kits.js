
import {Type, TypeOpen1, Layout, LayoutHand, PKjson} from '../enums/enums.js';
import {project} from './project.js';

export let kits = {};

//Масштабирование
export function resize() {

    var height = window.innerHeight;
    $("#context").css("height", height - 80);
    $(kits.table1).jqGrid('setGridWidth', $("#centr").width() - 4);
    $(kits.table1).jqGrid('setGridHeight', $("#centr").height() - 30);
}

export function init_table() {
    $(kits.table1).jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        rownumWidth: 20,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Артикул', 'Название', 'Основная', 'Внутренняя', 'Внешняя', 'Длина', 'Ширина', 'Кол-во'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'code', width: 80, sorttype: "text"},
            {name: 'name', width: 200, sorttype: "text"},
            {name: 'color1', width: 80, sorttype: "text"},
            {name: 'color2', width: 80, sorttype: "text"},
            {name: 'color3', width: 80, sorttype: "text"},
            {name: 'width', width: 60, sorttype: "text"},
            {name: 'height', width: 60, sorttype: "text"},
            {name: 'numb', width: 60, sorttype: "text"}
        ],
        onSelectRow: function (rowid) {
            let prjkitRow = $(kits.table1).jqGrid('getRowData', rowid);
            kits.prjkitRec = findef(prjkitRow.id, ePrjkit.id, ePrjkit);
        }
    });
}

export function load_table() {
    $(kits.table1).jqGrid('clearGridData', true);
    if (project.mapWinc.size !== 0) {
        let prjkitList = ePrjkit.list.filter(rec => project.prjprodRec[ePrjprod.id] === rec[ePrjkit.prjprod_id]);
        for (let i = 0; i < prjkitList.length; i++) {
            let prjkitRec = prjkitList[i];
            let artiklRec = findef(prjkitRec[ePrjkit.artikl_id], eArtikl.id, eArtikl);
            $(kits.table1).jqGrid('addRowData', i + 1, {
                id: prjkitRec[eKits.id],
                code: artiklRec[eArtikl.code],
                name: artiklRec[eArtikl.name],
                color1: findef(prjkitRec[ePrjkit.color1_id], eColor.id, eColor)[eColor.name],
                color2: findef(prjkitRec[ePrjkit.color2_id], eColor.id, eColor)[eColor.name],
                color3: findef(prjkitRec[ePrjkit.color3_id], eColor.id, eColor)[eColor.name],
                width: prjkitRec[ePrjkit.width],
                height: prjkitRec[ePrjkit.height],
                numb: prjkitRec[ePrjkit.numb]
            });
        }
        $(kits.table1).jqGrid("setSelection", 1);
    }
}

//Редактирования строки таблицы
export function update_table() {

    let dialogTaq = '#dialog-card';
    let rowid = $(kits.table1).jqGrid('getGridParam', "selrow");
    let prjkitRow = $(kits.table1).jqGrid('getRowData', rowid);
    let prjkitRec = ePrjkit.list.find(rec => Number(prjkitRow.id) === rec[ePrjkit.id]);
    $("#k53").val(prjkitRow.color1);
    $("#k54").val(prjkitRow.color2);
    $("#k55").val(prjkitRow.color3);
    $("#k56").val(prjkitRow.width);
    $("#k57").val(prjkitRow.height);
    $("#k58").val(prjkitRow.numb);
    $("#k53").attr("fk", prjkitRec[ePrjkit.color1_id]);
    $("#k54").attr("fk", prjkitRec[ePrjkit.color2_id]);
    $("#k55").attr("fk", prjkitRec[ePrjkit.color3_id]);

    $(dialogTaq).dialog({//открытие диалога insert
        title: "Карточка редактирования артикула",
        width: $(dialogTaq).attr('card_width'),
        height: $(dialogTaq).attr('card_height'),
        modal: true,
        resizable: false,
        buttons: {
            "Применить": function () {

                prjkitRec[ePrjkit.numb] = $("#k58").val();
                prjkitRec[ePrjkit.width] = $("#k56").val();
                prjkitRec[ePrjkit.height] = $("#k57").val();
                prjkitRec[ePrjkit.color1_id] = $("#k53").attr("fk");
                prjkitRec[ePrjkit.color2_id] = $("#k54").attr("fk");
                prjkitRec[ePrjkit.color3_id] = $("#k55").attr("fk");

                $.ajax({
                    url: 'dbset?action=updatePrjkit',
                    data: {param: JSON.stringify(prjkitRec)},
                    success: (data) => {
                        if (data.result === 'ok') {
                            $('#table1').jqGrid('setRowData', rowid, {
                                color1: $("#k53").val(),
                                color2: $("#k54").val(),
                                color3: $("#k55").val(),
                                width: $("#k56").val(),
                                height: $("#k57").val(),
                                numb: $("#k58").val(),
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

export function delete_table() {

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
                let rowid = $(kits.table1).jqGrid('getGridParam', "selrow");
                let prjkitRow = $(kits.table1).jqGrid('getRowData', rowid);
                let prjkitRec = ePrjkit.list.find(rec => Number(prjkitRow.id) === rec[ePrjkit.id]);
                $.ajax({
                    url: 'dbset?action=deletePrjkit',
                    data: {param: JSON.stringify(prjkitRec)},
                    success: (data) => {
                        if (data.result === 'ok') {
                            $(kits.table1).jqGrid("delRowData", rowid);
                            for (let i = 0; i < ePrjkit.list.length; ++i) {
                                if (Number(prjkitRow.id) === ePrjkit.list[i][ePrjkit.id]) {
                                    ePrjkit.list.splice(i, 1);
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

//Заполнение
export function color_to_kit(btnSrc) {
    try {
        let groupSet = new Set();
        let colorSet = new Set();
        let prjkitRow = getSelectedRow($('#table1'));
        let prjkitRec = ePrjkit.list.find(rec => prjkitRow.id == rec[ePrjkit.id]);

        for (let rec of eArtdet.list) {
            if (rec[eArtdet.artikl_id] == prjkitRec[ePrjkit.artikl_id]) {
                if (rec[eArtdet.color_fk] < 0) { //все текстуры групы color_fk

                    eColor.list.forEach(colorRec => {
                        if (colorRec[eColor.colgrp_id] == Math.abs(rec[eArtdet.color_fk])) {

                            groupSet.add(Math.abs(colorRec[eColor.colgrp_id]));
                            colorSet.add(colorRec);
                        }
                    });
                } else { //текстура color_fk 
                    let color2Rec = eColor.list.find(rec3 => rec[eArtdet.color_fk] == rec3[eColor.id]);
                    groupSet.add(color2Rec[eColor.colgrp_id]);
                    colorSet.add(color2Rec);
                }
            }
        }
        kits.groupSet = groupSet;
        kits.colorArr = Array.from(colorSet);
        kits.buttonSrc = btnSrc;
        $('#dialog-jsp').load('frame/dialog/color.jsp');

    } catch (e) {
        console.error(e.message);
    }
}