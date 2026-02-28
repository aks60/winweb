<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head style="margin: 0; padding: 0;">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>COLOR</title>  
        <script type="module">
            import {Wincalc} from './build/Wincalc.js';
            import {project} from './frame/project.js';
            import {product} from './frame/product.js';

            let level = "<%= request.getParameter("level")%>";
            var tab1Color = document.getElementById('tab1-color');
            var tab2Color = document.getElementById('tab2-color');

            function resize() {
                $(tab1Color).jqGrid('setGridWidth', $("#dialog-jsp #pan1-color").width());
                $(tab1Color).jqGrid('setGridHeight', $("#dialog-jsp #pan1-color").height() - 20);
                $(tab2Color).jqGrid('setGridWidth', $("#dialog-jsp #pan2-color").width());
                $(tab2Color).jqGrid('setGridHeight', $("#dialog-jsp #pan2-color").height() - 20);
            }

            $("#dialog-jsp").unbind().bind("dialogresize", function (event, ui) {
                resize();
            });
            init_dialog();
            init_table();
            if (level === '1') {
                load1_table();
            } else if (level === '2') {
                load2_table();
            }

            function init_dialog() {
                $("#dialog-jsp").dialog({
                    title: "Справочник текстур",
                    width: 400,
                    height: 500,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            save_table();
                            $(this).dialog("close");
                        },
                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }

            function init_table() {

                $(tab1Color).jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Группы текстур'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'name', width: 360}
                    ],
                    onSelectRow: function (rowid) {
                        $(tab2Color).jqGrid("clearGridData", true);
                        let colgrpRow = $(tab1Color).jqGrid('getRowData', rowid);
                        let base = ($('#body-jsp title').text() == 'KITS') ? kits : product;
                        if (base.colorArr.length == 0) {

                            let colorList = eColor.list.filter(rec => colgrpRow.id == rec.list[eColor.colgrp_id]);
                            for (let i = 0; i < colorList.length; i++) {
                                let colorRec = colorList[i];
                                $(tab2Color).jqGrid('addRowData', i + 1, {
                                    id: colorRec[eColor.id],
                                    name: colorRec[eColor.name]
                                });
                                let rgb = '#' + colorRec[eColor.rgb].toString(16);
                                $(tab2Color).jqGrid('setCell', i + 1, 'id', '', {background: rgb});
                            }
                        } else {
                            let colorArr = base.colorArr.filter(rec => colgrpRow.id == rec.list[eColor.colgrp_id]);
                            for (let i = 0; i < colorArr.length; i++) {
                                let colorRec = colorArr[i];
                                $(tab2Color).jqGrid('addRowData', i + 1, {
                                    id: colorRec[eColor.id],
                                    name: colorRec[eColor.name]
                                });
                                let rgb = '#' + colorRec[eColor.rgb].toString(16);
                                $(tab2Color).jqGrid('setCell', i + 1, 'id', '', {background: rgb});
                            }
                        }
                        $(tab2Color).jqGrid("setSelection", 1);
                        resize();
                    }
                });
                $(tab2Color).jqGrid({
                    datatype: "local",
                    colNames: ['Код', 'Описание текстур'],
                    colModel: [
                        {name: 'id', width: 60, key: true},
                        {name: 'name', width: 340}
                    ],
                    ondblClickRow: function (rowId) {
                        save_table();
                        $("#dialog-jsp").dialog("close");
                    }
                });
            }

            function load1_table() {
                $(tab1Color).jqGrid('clearGridData', true);
                $(tab2Color).jqGrid('clearGridData', true);
                let base = ($('#body-jsp title').text() == 'KITS') ? kits : product;
                if (base.groupSet.size > 0) {

                    let groupList = eGroup.list.filter(rec => base.groupSet.has(rec.list[GROUP.id]));
                    for (let i = 0; i < groupList.length; i++) {
                        let tr = groupList[i];
                        $(tab1Color).jqGrid('addRowData', i + 1, {
                            id: tr[GROUP.id],
                            name: tr[GROUP.name]
                        });
                    }
                }
                $(tab1Color).jqGrid("setSelection", 1);
                resize();
            }

            function load2_table() {
                $(tab1Color).jqGrid('clearGridData', true);
                $(tab2Color).jqGrid('clearGridData', true);
//                let base = ($('#body-jsp title').text() == 'KITS') ? kits : product;
//                if (base.groupSet.size > 0) {
//
//                    let groupList = eGroup.list.filter(rec => base.groupSet.has(rec.list[GROUP.id]));
//                    for (let i = 0; i < groupList.length; i++) {
//                        let tr = groupList[i];
//                        $(tab1Color).jqGrid('addRowData', i + 1, {
//                            id: tr[GROUP.id],
//                            name: tr[GROUP.name]
//                        });
//                    }
//                }
                $(tab1Color).jqGrid("setSelection", 1);
                resize();
            }

            function save_table() {
                try {
                    let rowid = $(tab2Color).jqGrid('getGridParam', "selrow"); //index профиля из справочника
                    let colorRow = $(tab2Color).jqGrid('getRowData', rowid); //record справочника

                    if ($('#body-jsp title').text() == 'PRODUCT') {

                        let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                        let prjprodID = project.prjprodRec[ePrjprod.id]; //id prjprod заказа
                        let winc = project.wincalcMap.get(prjprodID);
                        let elem = winc.listElem.find(it => it.id == elemID);
                        let param = elem.gson.param;
                        if (elem.gson.param == undefined) {
                            elem.gson.param = {};
                            param = elem.gson.param;
                        }
                        if (elem.typeForm() == 'STVORKA_SIDE') {
                            let sideLayout = ["", "stvorkaBottom", "stvorkaRight", "stvorkaTop", "stvorkaLeft"][Layout[elem.layout][0]];
                            if (elem.gson.param[sideLayout] == undefined) {
                                elem.gson.param[sideLayout] = {};
                                param = elem.gson.param[sideLayout];
                            } else {
                                param = elem.gson.param[sideLayout];
                            }
                        }

                        //Запишем текстуру в параметр
                        if (product.buttonSrc == 'n14')
                            winc.gson.color1 = colorRow.id;
                        else if (product.buttonSrc == 'n15')
                            winc.gson.color2 = colorRow.id;
                        else if (product.buttonSrc == 'n16')
                            winc.gson.color3 = colorRow.id;
                        else if (product.buttonSrc == 'n33')
                            param.colorID1 = colorRow.id;
                        else if (product.buttonSrc == 'n34')
                            param.colorID2 = colorRow.id;
                        else if (product.buttonSrc == 'n35')
                            param.colorID3 = colorRow.id;
                        else if (product.buttonSrc == 'n46')
                            elem.gson.param.colorHandl = colorRow.id;
                        else if (product.buttonSrc == 'n4A')
                            elem.gson.param.colorLoop = colorRow.id;
                        else if (product.buttonSrc == 'n4C')
                            elem.gson.param.colorLock = colorRow.id;
                        else if (product.buttonSrc == 'n53')
                            elem.gson.param.colorGlass = colorRow.id;

                        //Запишем скрипт в локальн. бд
                        let prjprodRec = ePrjprod.list.find(rec => prjprodID == rec.list[ePrjprod.id]);
                        let cnv = document.getElementById("cnv");
                        prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => isEmpty(v));
                        let winc2 = Wincalc.new(cnv, cnv.offsetWidth, cnv.offsetHeight, prjprodRec[ePrjprod.script]);
                        project.wincalcMap.set(prjprodID, winc2); //новый экз.

                        //Запишем скрипт в серверную базу данных
                        $.ajax({
                            url: 'dbset?action=updateScript',
                            data: {param: JSON.stringify({id: prjprodID, script: prjprodRec[ePrjprod.script]})},
                            success: function (data) {
                                if (data.result == 'ok') {
                                    //Запишем выбранную запись в тег страницы
                                    if (product.buttonSrc == 'n14')
                                        $("#n14").val(colorRow.name);
                                    else if (product.buttonSrc == 'n15')
                                        $("#n15").val(colorRow.name);
                                    else if (product.buttonSrc == 'n16')
                                        $("#n16").val(colorRow.name);
                                    else if (product.buttonSrc == 'n33')
                                        $("#n33").val(colorRow.name);
                                    else if (product.buttonSrc == 'n34')
                                        $("#n34").val(colorRow.name);
                                    else if (product.buttonSrc == 'n35')
                                        $("#n35").val(colorRow.name);
                                    else if (product.buttonSrc == 'n46')
                                        $("#n46").val(colorRow.name);
                                    else if (product.buttonSrc == 'n4A')
                                        $("#n4A").val(colorRow.name);
                                    else if (product.buttonSrc == 'n4C')
                                        $("#n4C").val(colorRow.name);
                                    else if (product.buttonSrc == 'n53')
                                        $("#n53").val(colorRow.name);

                                } else {
                                    dialogMes('Сообщение', "<p>" + data.result);
                                }
                            },
                            error: function () {
                                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                            }
                        });


                    } else if ($('#body-jsp title').text() == 'KITS') {
                        if (kits.buttonSrc == 'n53') {
                            $("#n53").val(colorRow.name);
                            $("#n53").attr("fk", colorRow.id);

                        } else if (kits.buttonSrc == 'n54') {
                            $("#n54").val(colorRow.name);
                            $("#n54").attr("fk", colorRow.id);

                        } else if (kits.buttonSrc == 'n55') {
                            $("#n55").val(colorRow.name);
                            $("#n55").attr("fk", colorRow.id);
                        }
                    }
                } catch (e) {
                    console.error('Error: color.rec_dialog_save() ' + e.message);
                }
            }


            //Текстура изделия
            function color1_list(colorNum) {
                try {
                    let winc = project.wincalcMap.get(project.prjprodRec[ePrjprod.id]);
                    let groupSet = new Set();
                    let colorSet = new Set();

                    let groupTxt = eSystree.list.find(rec => winc.nuni == rec[eSystree.id])[eSystree.cgrp];
                    let groupArr = (groupTxt === undefined) ? null : parserInt(groupTxt);
                    let systreeRec = eSystree.list.find(rec => winc.nuni == rec[eSystree.id]);
                    let colorTxt = (colorNum === 'n14') ? systreeRec[eSystree.col1]
                            : (colorNum === 'n15') ? systreeRec[eSystree.col2] : systreeRec[eSystree.col3];
                    let colorArr = (colorTxt === null) ? null : parserInt(colorTxt);

                    //Поле группы текстур заполнено
                    if (groupArr != null) {
                        for (let s1 of groupArr) { //группы
                            let groupSet2 = new Set();
                            let colorSet2 = new Set();
                            let b = false;
                            for (let rec of eColor.list) {
                                if (rec[eColor.colgrp_id] === s1) {
                                    groupSet2.add(rec[eColor.colgrp_id]); //группы
                                    colorSet2.add(rec); //текстуры
                                    for (let i = 0; i < colorArr.length; i = i + 2) { //тестуры
                                        if (rec[eColor.id] >= colorArr[i] && rec[eColor.id] <= colorArr[i + 1]) {
                                            b = true;
                                        }
                                    }
                                }
                            }
                            if (b === false) { //если небыло пападаний то добавляем всю группу
                                groupSet.add(groupSet2);
                                colorSet.add(colorSet2);
                            }
                        }
                    }
                    //Поле текстур заполнено
                    if (colorArr.length != 0) {
                        for (let rec of eColor.list) {
                            if (groupArr != null) {

                                for (let s1 of groupArr) { //группы
                                    if (rec[eColor.colgrp_id] === s1) {
                                        for (let i = 0; i < colorArr.length; i = i + 2) { //текстуры
                                            if (rec[eColor.id] >= colorArr[i] && rec[eColor.id] <= colorArr[i + 1]) {
                                                groupSet.add(rec[eColor.colgrp_id]);
                                                colorSet.add(rec);
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (let i = 0; i < colorArr.length; i = i + 2) { //тестуры
                                    if (rec[eColor.id] >= colorArr[i] && rec[eColor.id] <= colorArr[i + 1]) {
                                        groupSet.add(rec[eColor.colgrp_id]);
                                        colorSet.add(rec);
                                    }
                                }
                            }
                        }
                    }
                    dbrec.parent = 'winc';
                    product.groupSet = groupSet;
                    product.colorArr = Array.from(colorSet);
                    product.buttonSrc = colorNum;
                    $('#dialog-jsp').load('frame/dialog/color.jsp?param=1');

                } catch (e) {
                    errorLog('Error: color_to_windows() ' + e.message);
                }
            }

            //Заполнение
            export function color2_list(btnSrc) {
                try {
                    let nodeID = $(product.table2).jstree("get_selected")[0];
                    let prjprodID = project.prjprodRec[ePrjprod.id];
                    let winc = project.wincalcMap.get(prjprodID);
                    let elem = winc.listElem.find(it => it.id == nodeID);
                    let groupSet = new Set();
                    let colorSet = new Set();
                    let artiklElem = null;

                    if (btnSrc === 'n33')
                        artiklElem = elem.artiklRec;
                    else if (btnSrc === 'n34')
                        artiklElem = elem.artiklRec;
                    else if (btnSrc === 'n35')
                        artiklElem = elem.artiklRec;
                    else if (btnSrc === 'n46')
                        artiklElem = elem.handleRec;
                    else if (btnSrc === 'n4A')
                        artiklElem = elem.loopRec;
                    else if (btnSrc === 'n4C')
                        artiklElem = elem.lockRec;
                    else if (btnSrc === 'n53')
                        artiklElem = elem.artiklRec;

                    //Все текстуры артикула элемента конструкции
                    for (let rec of eArtdet.list) {
                        if (rec.list[eArtdet.artikl_id] === artiklElem[eArtikl.id]) {
                            if (rec.list[eArtdet.color_fk] < 0) { //все текстуры групы color_fk

                                eColor.ist.forEach(colorRec => {
                                    if (colorRec[eColor.colgrp_id] === Math.abs(rec.list[eArtdet.color_fk])) {

                                        groupSet.add(Math.abs(colorRec[eColor.colgrp_id]));
                                        colorSet.add(colorRec);
                                    }
                                });
                            } else { //текстура color_fk 
                                let color2Rec = eColor.list.find(rec3 => rec.list[eArtdet.color_fk] === rec3[eColor.id]);
                                groupSet.add(color2Rec[eColor.colgrp_id]);
                                colorSet.add(color2Rec);
                            }
                        }
                    }
                    dbrec.parent = 'elem';
                    product.groupSet = groupSet;
                    product.colorArr = Array.from(colorSet);
                    product.buttonSrc = btnSrc;
                    $('#dialog-jsp').load('frame/dialog/color.jsp');

                } catch (e) {
                    console.error('Error: product.color_to_element() ' + e.message);
                }
            }

        </script>         
    </head>
    <body>
        <div id="pan1-color" style="height: calc(40% - 8px); width: calc(100% - 4px);">
            <table id="tab1-color"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="pan2-color" style="height: 60%; width: calc(100% - 4px)">
            <table id="tab2-color"  class="ui-jqgrid-btable"></table>
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>

