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

            let parID = "<%= request.getParameter("param")%>";
            var tab1Color = document.getElementById('tab1-color');
            var tab2Color = document.getElementById('tab2-color');

            function resize() {
                $(tab1Color).jqGrid('setGridWidth', $("#dialog-dic #pan1-color").width());
                $(tab1Color).jqGrid('setGridHeight', $("#dialog-dic #pan1-color").height() - 20);
                $(tab2Color).jqGrid('setGridWidth', $("#dialog-dic #pan2-color").width());
                $(tab2Color).jqGrid('setGridHeight', $("#dialog-dic #pan2-color").height() - 20);
            }

            $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                resize();
            });
            init_dialog();
            init_table();
            if (parID === '1')
                load1_table();
            else if (parID === '2')
                load2_table();

            function init_dialog() {
                $("#dialog-dic").dialog({
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
                        let base = ($('#outbody title').text() == 'KITS') ? kits : product;
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
                        $("#dialog-dic").dialog("close");
                    }
                });
            }

            function load1_table() {
                $(tab1Color).jqGrid('clearGridData', true);
                $(tab2Color).jqGrid('clearGridData', true);
//                let base = ($('#outbody title').text() == 'KITS') ? kits : product;
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

            function load2_table() {
                $(tab1Color).jqGrid('clearGridData', true);
                $(tab2Color).jqGrid('clearGridData', true);
//                let base = ($('#outbody title').text() == 'KITS') ? kits : product;
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

                    if ($('#outbody title').text() == 'PRODUCT') {

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


                    } else if ($('#outbody title').text() == 'KITS') {
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

