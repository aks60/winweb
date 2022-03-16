<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head style="margin: 0; padding: 0;">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>COLOR</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            color.resize = function () {
                $("#tab1-color").jqGrid('setGridWidth', $("#dialog-dic #pan1-color").width());
                $("#tab1-color").jqGrid('setGridHeight', $("#dialog-dic #pan1-color").height() - 20);
                $("#tab2-color").jqGrid('setGridWidth', $("#dialog-dic #pan2-color").width());
                $("#tab2-color").jqGrid('setGridHeight', $("#dialog-dic #pan2-color").height() - 20);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                    color.resize();
                });
                color.init_dialog($("#tab1-color"), $("#tab2-color"));
                color.init_table($("#tab1-color"), $("#tab2-color"));
                color.load_table($("#tab1-color"), $("#tab2-color"))
            });
//------------------------------------------------------------------------------
            color.init_dialog = function (table1, table2) {
                $("#dialog-dic").dialog({
                    title: "Справочник текстур",
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
                        let colgrpRow = table1.jqGrid('getRowData', rowid);
                        let base = (color.parent != 'kits') ? product : kits;
                        if (base.colorArr.length == 0) {

                            let colorList = dbset.colorList.filter(rec => colgrpRow.id == rec[COLOR.colgrp_id]);
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
                            let colorArr = base.colorArr.filter(rec => colgrpRow.id == rec[COLOR.colgrp_id]);
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
                        color.rec_dialog_save(table2);
                        $("#dialog-dic").dialog("close");
                    }
                });
            };
//------------------------------------------------------------------------------
            color.load_table = function (table1, table2) {
                table1.jqGrid('clearGridData', true);
                table2.jqGrid('clearGridData', true);
                let base = (color.parent != 'kits') ? product : kits;
                if (base.groupSet.size > 0) {

                    let groupList = dbset.groupList.filter(rec => base.groupSet.has(rec[GROUP.id]));
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
            color.rec_dialog_save = function (table2) {
                try {
                    let rowid = table2.jqGrid('getGridParam', "selrow"); //index профиля из справочника
                    let row_table2 = table2.jqGrid('getRowData', rowid); //record справочника
                    if (color.parent != 'kits') {

                        let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                        let proprodID = order.rec_table2[PROPROD.id]; //id proprod заказа
                        let winc = order.wincalcMap.get(proprodID);
                        let elem = winc.elemList.find(it => it.id == elemID);
                        let param = elem.obj.param;
                        if (elem.obj.param == undefined) {
                            elem.obj.param = {};
                            param = elem.obj.param;
                        }
                        if (elem.type == 'STVORKA_SIDE') {
                            let sideLayout = ["", "stvorkaBottom", "stvorkaRight", "stvorkaTop", "stvorkaLeft"][Layout[elem.layout][0]];
                            if (elem.obj.param[sideLayout] == undefined) {
                                elem.obj.param[sideLayout] = {};
                                param = elem.obj.param[sideLayout];
                            } else {
                                param = elem.obj.param[sideLayout];
                            }
                        }

                        //Запишем текстуру в параметр
                        if (product.buttonSrc == 'n14')
                            winc.obj.color1 = row_table2.id;
                        else if (product.buttonSrc == 'n15')
                            winc.obj.color2 = row_table2.id;
                        else if (product.buttonSrc == 'n16')
                            winc.obj.color3 = row_table2.id;
                        else if (product.buttonSrc == 'n33')
                            param.colorID1 = row_table2.id;
                        else if (product.buttonSrc == 'n34')
                            param.colorID2 = row_table2.id;
                        else if (product.buttonSrc == 'n35')
                            param.colorID3 = row_table2.id;
                        else if (product.buttonSrc == 'n46')
                            elem.obj.param.colorHandl = row_table2.id;
                        else if (product.buttonSrc == 'n4A')
                            elem.obj.param.colorLoop = row_table2.id;
                        else if (product.buttonSrc == 'n4C')
                            elem.obj.param.colorLock = row_table2.id;
                        else if (product.buttonSrc == 'n53')
                            elem.obj.param.colorGlass = row_table2.id;

                        //Запишем скрипт в локальн. бд
                        let proprodRec = dbset.proprodList.find(rec => proprodID == rec[PROPROD.id]);
                        proprodRec[PROPROD.script] = JSON.stringify(winc.obj, (k, v) => isEmpty(v));
                        let winc2 = win.build(document.querySelector("#cnv2"), proprodRec[PROPROD.script]);
                        order.wincalcMap.set(proprodID, winc2); //новый экз.

                        //Запишем скрипт в серверную базу данных
                        $.ajax({
                            url: 'dbset?action=updateScript',
                            data: {param: JSON.stringify({id: proprodID, script: proprodRec[PROPROD.script]})},
                            success: function (data) {
                                if (data.result == 'ok') {
                                    //Запишем выбранную запись в тег страницы
                                    if (product.buttonSrc == 'n14')
                                        $("#n14").val(row_table2.name);
                                    else if (product.buttonSrc == 'n15')
                                        $("#n15").val(row_table2.name);
                                    else if (product.buttonSrc == 'n16')
                                        $("#n16").val(row_table2.name);
                                    else if (product.buttonSrc == 'n33')
                                        $("#n33").val(row_table2.name);
                                    else if (product.buttonSrc == 'n34')
                                        $("#n34").val(row_table2.name);
                                    else if (product.buttonSrc == 'n35')
                                        $("#n35").val(row_table2.name);
                                    else if (product.buttonSrc == 'n46')
                                        $("#n46").val(row_table2.name);
                                    else if (product.buttonSrc == 'n4A')
                                        $("#n4A").val(row_table2.name);
                                    else if (product.buttonSrc == 'n4C')
                                        $("#n4C").val(row_table2.name);
                                    else if (product.buttonSrc == 'n53')
                                        $("#n53").val(row_table2.name);
                                }
                            },
                            error: function () {
                                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                            }
                        });
                    } else {
                        if (kits.buttonSrc == 'n22') {
                            $("#n22").val(row_table2.name);
                            color.color1ID = row_table2.id;
                            $("#n24").val(row_table2.name);
                            color.color2ID = row_table2.id;
                            $("#n26").val(row_table2.name);
                            color.color3ID = row_table2.id;

                        } else if (kits.buttonSrc == 'n24') {
                            $("#n24").val(row_table2.name);
                            color.color2ID = row_table2.id;
                            $("#n26").val(row_table2.name);
                            color.color3ID = row_table2.id;

                        } else if (kits.buttonSrc == 'n26') {
                            $("#n26").val(row_table2.name);
                            color.color3ID = row_table2.id;
                        }
                    }
                } catch (e) {
                    console.error("Ошибка: color.rec_dialog_save() " + e.message);
                }
            }
//------------------------------------------------------------------------------
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

