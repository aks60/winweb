//------------------------------------------------------------------------------
kits.init_table = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
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
                numb: tr[PRJKIT.numb]
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
    try {
        $('#dialog-dic').load('frm/dialog/artikl.jsp');

    } catch (e) {
        console.error("Ошибка: kits.insert2_table() " + e.message);
    }
}
//------------------------------------------------------------------------------
//Редактирования строки таблицы
kits.update_table = function (taq) {

    let rowid = $("#table1").jqGrid('getGridParam', "selrow");
    let prjkitRow = $("#table1").jqGrid('getRowData', rowid)
    let prjkitRec = dbset.prjkitList.find(rec => prjkitRow.id == rec[PRJKIT.id]);

    $("#n53").val(prjkitRow.color1);
    $("#n54").val(prjkitRow.color2);
    $("#n55").val(prjkitRow.color3);
    $("#n56").val(prjkitRow.width);
    $("#n57").val(prjkitRow.height);
    $("#n58").val(prjkitRow.numb);
    $("#n53").attr("fk", prjkitRec[PRJKIT.color1_id]);
    $("#n54").attr("fk", prjkitRec[PRJKIT.color2_id]);
    $("#n55").attr("fk", prjkitRec[PRJKIT.color3_id]);

    $(taq).dialog({//открытие диалога insert
        title: "Карточка редактирования артикула",
        width: $(taq).attr('card_width'),
        height: $(taq).attr('card_height'),
        modal: true,
        resizable: false,
        buttons: {
            "Применить": function () {

                prjkitRec[0] = 'UPD';
                prjkitRec[PRJKIT.numb] = $("#n58").val();
                prjkitRec[PRJKIT.width] = $("#n56").val();
                prjkitRec[PRJKIT.height] = $("#n57").val();
                prjkitRec[PRJKIT.color1_id] = $("#n53").attr("fk");
                prjkitRec[PRJKIT.color2_id] = $("#n54").attr("fk");
                prjkitRec[PRJKIT.color3_id] = $("#n55").attr("fk");

                $.ajax({
                    url: 'dbset?action=updatePrjkit',
                    data: {param: JSON.stringify(prjkitRec)},
                    success: (data) => {
                        if (data.result == 'ok') {
                            $('#table1').jqGrid('setRowData', rowid, {
                                color1: $("#n53").val(),
                                color2: $("#n54").val(),
                                color3: $("#n55").val(),
                                width: $("#n56").val(),
                                height: $("#n57").val(),
                                numb: $("#n58").val(),
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
kits.artikl_to_kit = function (btnSrc) {
    try {
        kits.buttonSrc = btnSrc;
        $('#dialog-dic').load('frm/dialog/artikl.jsp');

    } catch (e) {
        console.error("Ошибка: kits.artikl_to_kit() " + e.message);
    }
}
//-----------------------  Заполнение  -----------------------------------------
kits.color_to_kit = function (btnSrc) {
/*    try {
        

        let nodeID = $("#tree-winc").jstree("get_selected")[0];
        let prjprodID = order.prjprodRec[PRJPROD.id];
        let winc = order.wincalcMap.get(prjprodID);
        let elem = winc.elemList.find(it => it.id == nodeID);
        let groupSet = new Set();
        let colorSet = new Set();
        let artiklElem = null;

        if (btnSrc == 'n33')
            artiklElem = elem.artiklRec;
        else if (btnSrc == 'n34')
            artiklElem = elem.artiklRec;
        else if (btnSrc == 'n35')
            artiklElem = elem.artiklRec;
        else if (btnSrc == 'n46')
            artiklElem = elem.handleRec;
        else if (btnSrc == 'n4A')
            artiklElem = elem.loopRec;
        else if (btnSrc == 'n4C')
            artiklElem = elem.lockRec;
        else if (btnSrc == 'n53')
            artiklElem = elem.artiklRec;

        //Все текстуры артикула элемента конструкции
        for (let rec of dbset.artdetList) {
            if (rec[ARTDET.artikl_id] == artiklElem[ARTIKL.id]) {
                if (rec[ARTDET.color_fk] < 0) { //все текстуры групы color_fk

                    dbset.colorList.forEach(colorRec => {
                        if (colorRec[COLOR.colgrp_id] == Math.abs(rec[ARTDET.color_fk])) {

                            groupSet.add(Math.abs(colorRec[COLOR.colgrp_id]));
                            colorSet.add(colorRec);
                        }
                    });
                } else { //текстура color_fk 
                    let color2Rec = dbset.colorList.find(rec3 => rec[ARTDET.color_fk] == rec3[COLOR.id]);
                    groupSet.add(color2Rec[COLOR.colgrp_id]);
                    colorSet.add(color2Rec);
                }
            }
        }
        dbrec.parent = 'elem';
        product.groupSet = groupSet;
        product.colorArr = Array.from(colorSet);
        product.buttonSrc = btnSrc;
        $('#dialog-dic').load('frm/dialog/color.jsp');
       */ 
    try {
        let groupSet = new Set();
        let colorSet = new Set();        
        let prjkitRow = getSelectedRow($('#table1'));
        let prjkitRec = dbset.prjkitList.find(rec => prjkitRow.id == rec[PRJKIT.id]);
        for (let rec of dbset.artdetList) {
            if (rec[ARTDET.artikl_id] == prjkitRec[PRJKIT.artikl_id]) {
                if (rec[ARTDET.color_fk] < 0) { //все текстуры групы color_fk

                    dbset.colorList.forEach(colorRec => {
                        if (colorRec[COLOR.colgrp_id] == Math.abs(rec[ARTDET.color_fk])) {

                            groupSet.add(Math.abs(colorRec[COLOR.colgrp_id]));
                            colorSet.add(colorRec);
                        }
                    });
                } else { //текстура color_fk 
                    let color2Rec = dbset.colorList.find(rec3 => rec[ARTDET.color_fk] == rec3[COLOR.id]);
                    groupSet.add(color2Rec[COLOR.colgrp_id]);
                    colorSet.add(color2Rec);
                }
            }
        }  
        kits.groupSet = groupSet;
        kits.colorArr = Array.from(colorSet);        
        kits.buttonSrc = btnSrc;
        $('#dialog-dic').load('frm/dialog/color.jsp');

    } catch (e) {
        console.error("Ошибка: kits.color_to_kit() " + e.message);
    }
}
//------------------------------------------------------------------------------
