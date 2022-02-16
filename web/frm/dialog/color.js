//------------------------------------------------------------------------------
//import {draw_elements} from './drawing.js';
//------------------------------------------------------------------------------
color.init_dialog = function (table1, table2) {

    $("#dialog-dic").dialog({
        title: "Справочник текстур*",
        width: 400,
        height: 500,
        modal: true,
        buttons: {
            "Выбрать": function () {
                color.rec_dialog_save(table2);
                $(this).dialog("close");
            },
            "Закрыть": function () {
                $(this).dialog("close");
            }
        }
    });
}
//------------------------------------------------------------------------------
color.rec_dialog_save = function (table2) {
//    try {
    let rowid = table2.getGridParam('selrow'); //index профиля из справочника
    let tableRec = table2.getRowData(rowid);  //record справочника
    let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
    let proprodID = order.rec_table2[PROPROD.id]; //id proprod заказа
    let winc = order.wincalcMap.get(proprodID);

    //Запишем профиль в скрипт
    if (product.buttonSrc == 1)
        winc.obj.color1 = tableRec.id;
    else if (product.buttonSrc == 2)
        winc.obj.color2 = tableRec.id;
    else if (product.buttonSrc == 3)
        winc.obj.color3 = tableRec.id;

    let proprodRec = dbset.proprodList.find(rec => proprodID == rec[PROPROD.id]);
    proprodRec[PROPROD.script] = JSON.stringify(winc.obj, (k, v) => isEmpty(v)); //запишем профиль в локальн. бд  
    let winc2 = win.build(document.querySelector("#cnv2"), proprodRec[PROPROD.script]);
    order.wincalcMap.set(proprodID, winc2); //новый экз.

    $.ajax({//запишем профиль в серверную базу данных
        url: 'dbset?action=saveScript',
        data: {param: JSON.stringify({id: proprodID, script: JSON.stringify(winc.obj, (k, v) => isEmpty(v))})},
        success: function (data) {
            if (data.result == 'ok') {
                //Запишем выбранную запись в тег страницы
                if (product.buttonSrc == 1)
                    $("#n14").val(tableRec.name);
                else if (product.buttonSrc == 2)
                    $("#n15").val(tableRec.name);
                else if (product.buttonSrc == 3)
                    $("#n16").val(tableRec.name);
            }
        },
        error: function () {
            dialogMes("<p>Ошибка при сохранении данных на сервере");
        }
    });
//    } catch (e) {
//        console.error("Ошибка:rec_dialog_save() " + e.message);
//    }
}
//------------------------------------------------------------------------------
color.init_table = function (table1, table2) {

    table1.jqGrid({
        datatype: "local",
        colNames: ['id', 'Группы текстур'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'name', width: 360}
        ],
        onSelectRow: function (rowid) {
            table2.jqGrid("clearGridData", true);
            let colgrpRec = table1.getRowData(rowid);
            if (product.colorArr.length == 0) {
                let colorList = dbset.colorList.filter(rec => colgrpRec.id == rec[COLOR.colgrp_id]);
                for (let i = 0; i < colorList.length; i++) {
                    let colorRec = colorList[i];
                    table2.jqGrid('addRowData', i + 1, {
                        id: colorRec[COLOR.id],
                        name: colorRec[COLOR.name]
                    });
                    let rgb = '#' + colorRec[COLOR.rgb].toString(16);
                    table2.jqGrid('setCell', i + 1, 'id', '', {background: rgb});
                }
            } else {
                let colorArr = product.colorArr.filter(rec => colgrpRec.id == rec[COLOR.colgrp_id]);
                for (let i = 0; i < colorArr.length; i++) {
                    let colorRec = colorArr[i];
                    table2.jqGrid('addRowData', i + 1, {
                        id: colorRec[COLOR.id],
                        name: colorRec[COLOR.name]
                    });
                    let rgb = '#' + colorRec[COLOR.rgb].toString(16);
                    table2.jqGrid('setCell', i + 1, 'id', '', {background: rgb});
                }
            }
            table2.jqGrid("setSelection", 1);
            color.resize();
        }
    });

    table2.jqGrid({
        datatype: "local",
        colNames: ['Код', 'Описание текстур'],
        colModel: [
            {name: 'id', width: 60, key: true},
            {name: 'name', width: 340}
        ],
        ondblClickRow: function (rowId) {
            alert("2 click");
        }
    });
};
//------------------------------------------------------------------------------
color.load_table = function (table1, table2) {
    table1.jqGrid('clearGridData', true);
    table2.jqGrid('clearGridData', true);
    if (product.groupSet.size > 0) {
        let groupList = dbset.groupList.filter(rec => product.groupSet.has(rec[GROUP.id]));
        for (let i = 0; i < groupList.length; i++) {
            let tr = groupList[i];
            table1.jqGrid('addRowData', i + 1, {
                id: tr[GROUP.id],
                name: tr[GROUP.name]
            });
        }
    }
    table1.jqGrid("setSelection", 1);
    color.resize();
};
//------------------------------------------------------------------------------
