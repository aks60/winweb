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

            let groupSet = new Set(), colorSet = new Set(), colorArr = [];
            let levelNum = "<%= request.getParameter("level")%>";
            let colorNum = "<%= request.getParameter("color")%>";
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
            if (levelNum === '1') {
                color1_list();
            } else if (levelNum === '2') {
                color2_list();
            }
            load1_table();

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
                    onSelectRow: function (rowid, status, e) {
                        load2_table(rowid);
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
                resize();
            }

            function load1_table() {
                $(tab1Color).jqGrid('clearGridData', true);
                if (groupSet.size > 0) {

                    let groupsList = eGroups.list.filter(rec => groupSet.has(rec[eGroups.id]));
                    for (let i = 0; i < groupsList.length; i++) {
                        let tr = groupsList[i];
                        $(tab1Color).jqGrid('addRowData', i + 1, {
                            id: tr[eGroups.id],
                            name: tr[eGroups.name]
                        });
                    }
                }
                //resize();
                $(tab1Color).jqGrid("setSelection", 1);
            }

            function load2_table(rowid) {
                $(tab2Color).jqGrid('clearGridData', true);
                let groupsRow = $(tab1Color).jqGrid('getRowData', rowid);
                let colorList = eColor.list.filter(rec => groupsRow.id == rec[eColor.groups_id]);

                for (let i = 0, k = 0; i < colorList.length; i++) {
                    let colorRec = colorList[i];

                    if (colorArr.length == 0) {
                        $(tab2Color).jqGrid('addRowData', ++k, {
                            id: colorRec[eColor.id],
                            name: colorRec[eColor.name]
                        });
                    } else {
                        if (colorSet.has(colorRec[eColor.id]))
                            $(tab2Color).jqGrid('addRowData', ++k, {
                                id: colorRec[eColor.id],
                                name: colorRec[eColor.name]
                            });
                    }
                    let rgb = '#' + colorRec[eColor.rgb].toString(16);
                    $(tab2Color).jqGrid('setCell', i + 1, 'id', '', {background: rgb});
                }
                resize();
                $(tab2Color).jqGrid("setSelection", 1);
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
                        if (colorNum === 'n14')
                            winc.gson.color1 = colorRow.id;
                        else if (colorNum === 'n15')
                            winc.gson.color2 = colorRow.id;
                        else if (colorNum === 'n16')
                            winc.gson.color3 = colorRow.id;
                        else if (colorNum === 'n33')
                            param.colorID1 = colorRow.id;
                        else if (colorNum === 'n34')
                            param.colorID2 = colorRow.id;
                        else if (colorNum === 'n35')
                            param.colorID3 = colorRow.id;
                        else if (colorNum === 'n46')
                            elem.gson.param.colorHandl = colorRow.id;
                        else if (colorNum === 'n4A')
                            elem.gson.param.colorLoop = colorRow.id;
                        else if (colorNum === 'n4C')
                            elem.gson.param.colorLock = colorRow.id;
                        else if (colorNum === 'n53')
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
                                    if (colorNum === 'n14')
                                        $("#n14").val(colorRow.name);
                                    else if (colorNum === 'n15')
                                        $("#n15").val(colorRow.name);
                                    else if (colorNum === 'n16')
                                        $("#n16").val(colorRow.name);
                                    else if (colorNum === 'n33')
                                        $("#n33").val(colorRow.name);
                                    else if (colorNum === 'n34')
                                        $("#n34").val(colorRow.name);
                                    else if (colorNum === 'n35')
                                        $("#n35").val(colorRow.name);
                                    else if (colorNum === 'n46')
                                        $("#n46").val(colorRow.name);
                                    else if (colorNum === 'n4A')
                                        $("#n4A").val(colorRow.name);
                                    else if (colorNum === 'n4C')
                                        $("#n4C").val(colorRow.name);
                                    else if (colorNum === 'n53')
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
                        if (colorNum === 'n53') {
                            $("#n53").val(colorRow.name);
                            $("#n53").attr("fk", colorRow.id);

                        } else if (colorNum === 'n54') {
                            $("#n54").val(colorRow.name);
                            $("#n54").attr("fk", colorRow.id);

                        } else if (colorNum === 'n55') {
                            $("#n55").val(colorRow.name);
                            $("#n55").attr("fk", colorRow.id);
                        }
                    }
                } catch (e) {
                    errorLog('Error: color.rec_dialog_save() ' + e.message);
                }
            }

            //Текстура изделия
            function color1_list(colorNum) {
                try {
                    let winc = project.wincalcMap.get(project.prjprodRec[ePrjprod.id]);
                    let systreeRec = eSystree.list.find(rec => winc.nuni == rec[eSystree.id]);
                    if (systreeRec !== undefined)
                        var colorEnum =
                                (colorNum === 'n14') ? systreeRec[eSystree.col1] :
                                (colorNum === 'n15') ? systreeRec[eSystree.col2] :
                                systreeRec[eSystree.col3];
                    colorArr = (colorEnum === null) ? null : parserInt(colorEnum);

                    //Поле текстур заполнено                  
                    for (let colorRec of eColor.list) {

                        if (colorArr.length != 0) {
                            for (let i = 0; i < colorArr.length; i = i + 2) { //текстуры
                                if (colorRec[eColor.id] >= colorArr[i] && colorRec[eColor.id] <= colorArr[i + 1]) {
                                    groupSet.add(colorRec[eColor.groups_id]);
                                    colorSet.add(colorRec[eColor.id]);
                                }
                            }
                        } else {
                            groupSet.add(colorRec[eColor.groups_id]);
                            colorSet.add(colorRec[eColor.id]);
                        }
                    }
                } catch (e) {
                    errorLog('Error: color.color1_list() ' + e.message);
                }
            }

            //Текстура элемента конструкции
            function color2_list(colorNum) {
                try {
                    let nodeID = $(product.table2).jstree("get_selected")[0];
                    let prjprodID = project.prjprodRec[ePrjprod.id];
                    let winc = project.wincalcMap.get(prjprodID);
                    let elem = winc.listElem.find(it => it.id == nodeID);
                    let artiklElem = null;

                    if (colorNum === 'n33')
                        artiklElem = elem.artiklRec;
                    else if (colorNum === 'n34')
                        artiklElem = elem.artiklRec;
                    else if (colorNum === 'n35')
                        artiklElem = elem.artiklRec;
                    else if (colorNum === 'n46')
                        artiklElem = elem.handleRec;
                    else if (colorNum === 'n4A')
                        artiklElem = elem.loopRec;
                    else if (colorNum === 'n4C')
                        artiklElem = elem.lockRec;
                    else if (colorNum === 'n53')
                        artiklElem = elem.artiklRec;

                    //Все текстуры артикула элемента конструкции
                    for (let artdetRec of eArtdet.list) {
                        if (artdetRec[eArtdet.artikl_id] === artiklElem[eArtikl.id]) {
                            if (artdetRec[eArtdet.color_fk] < 0) { //все текстуры групы color_fk

                                for (let colorRec of eColor.ist) {
                                    if (colorRec[eColor.groups_id] === Math.abs(artdetRec[eArtdet.color_fk])) {

                                        groupSet.add(Math.abs(colorRec[eColor.groups_id]));
                                        colorSet.add(colorRec[eColor.id]);
                                    }
                                }
                            } else { //текстура color_fk 
                                let color2Rec = eColor.list.find(rec3 => artdetRec[eArtdet.color_fk] === rec3[eColor.id]);
                                groupSet.add(color2Rec[eColor.groups_id]);
                                colorSet.add(colorRec[eColor.id]);
                            }
                        }
                    }
                } catch (e) {
                    errorLog('Error: color.color2_list() ' + e.message);
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

