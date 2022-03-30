<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head style="margin: 0; padding: 0;">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>COLOR</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            function resize() {
                $("#tab1-color").jqGrid('setGridWidth', $("#dialog-dic #pan1-color").width());
                $("#tab1-color").jqGrid('setGridHeight', $("#dialog-dic #pan1-color").height() - 20);
                $("#tab2-color").jqGrid('setGridWidth', $("#dialog-dic #pan2-color").width());
                $("#tab2-color").jqGrid('setGridHeight', $("#dialog-dic #pan2-color").height() - 20);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                    resize();
                });
                init_dialog($("#tab1-color"), $("#tab2-color"));
                init_table($("#tab1-color"), $("#tab2-color"));
                load_table($("#tab1-color"), $("#tab2-color"))
            });
//------------------------------------------------------------------------------
            function init_dialog(table1, table2) {
                $("#dialog-dic").dialog({
                    title: "Справочник текстур",
                    width: 400,
                    height: 500,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            save_table(table2);
                            $(this).dialog("close");
                        },
                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            function init_table(table1, table2) {

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
                        let base = ($('#outbody title').text() == 'KITS') ? kits : product;
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
                        resize();
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
                        save_table(table2);
                        $("#dialog-dic").dialog("close");
                    }
                });
            }
//------------------------------------------------------------------------------
            function load_table(table1, table2) {
                table1.jqGrid('clearGridData', true);
                table2.jqGrid('clearGridData', true);
                let base = ($('#outbody title').text() == 'KITS') ? kits : product;
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
                resize();
            }
//------------------------------------------------------------------------------
            function save_table(table2) {
                try {
                    let rowid = table2.jqGrid('getGridParam', "selrow"); //index профиля из справочника
                    let colorRow = table2.jqGrid('getRowData', rowid); //record справочника
                    
                    if ($('#outbody title').text() == 'PRODUCT') {

                        let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                        let prjprodID = order.prjprodRec[PRJPROD.id]; //id prjprod заказа
                        let winc = order.wincalcMap.get(prjprodID);
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
                            winc.obj.color1 = colorRow.id;
                        else if (product.buttonSrc == 'n15')
                            winc.obj.color2 = colorRow.id;
                        else if (product.buttonSrc == 'n16')
                            winc.obj.color3 = colorRow.id;
                        else if (product.buttonSrc == 'n33')
                            param.colorID1 = colorRow.id;
                        else if (product.buttonSrc == 'n34')
                            param.colorID2 = colorRow.id;
                        else if (product.buttonSrc == 'n35')
                            param.colorID3 = colorRow.id;
                        else if (product.buttonSrc == 'n46')
                            elem.obj.param.colorHandl = colorRow.id;
                        else if (product.buttonSrc == 'n4A')
                            elem.obj.param.colorLoop = colorRow.id;
                        else if (product.buttonSrc == 'n4C')
                            elem.obj.param.colorLock = colorRow.id;
                        else if (product.buttonSrc == 'n53')
                            elem.obj.param.colorGlass = colorRow.id;

                        //Запишем скрипт в локальн. бд
                        let prjprodRec = dbset.prjprodList.find(rec => prjprodID == rec[PRJPROD.id]);
                        prjprodRec[PRJPROD.script] = JSON.stringify(winc.obj, (k, v) => isEmpty(v));
                        let winc2 = win.build(document.querySelector("#cnv"), prjprodRec[PRJPROD.script]);
                        order.wincalcMap.set(prjprodID, winc2); //новый экз.

                        //Запишем скрипт в серверную базу данных
                        $.ajax({
                            url: 'dbset?action=updateScript',
                            data: {param: JSON.stringify({id: prjprodID, script: prjprodRec[PRJPROD.script]})},
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
                        
                        
                    } else if($('#outbody title').text() == 'KITS') {
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

