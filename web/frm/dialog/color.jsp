<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head style="margin: 0; padding: 0;">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>COLOR</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            color.resize = function () {
                $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic #centr").width());
                $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic #centr").height() - 20);
                $("#tab2-dic").jqGrid('setGridWidth', $("#dialog-dic #centr2").width());
                $("#tab2-dic").jqGrid('setGridHeight', $("#dialog-dic #centr2").height() - 20);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $(window).bind('resize', function () {
                    color.resize();
                }).trigger('resize');
                color.init_dialog($("#tab1-dic"), $("#tab2-dic"));
                color.init_table($("#tab1-dic"), $("#tab2-dic"));
                color.load_table($("#tab1-dic"), $("#tab2-dic"))
            });
//------------------------------------------------------------------------------
            window.onload = function () {
                alert('Страница загружена');
                //color.resize();
            };
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
//          try {  
                debugger;
                let rowid = table2.getGridParam('selrow'); //index профиля из справочника
                let tableRec = table2.getRowData(rowid); //record справочника
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let proprodID = order.rec_table2[PROPROD.id]; //id proprod заказа
                let winc = order.wincalcMap.get(proprodID);
                let elem = winc.elemList.find(it => it.id == elemID);
                let param = (elem.obj.param == undefined) ? {} : elem.obj.param;
                if (elem.type == 'STVORKA_SIDE') {
                    let sideLayout = ["", "stvorkaBottom", "stvorkaRight", "stvorkaTop", "stvorkaLeft"][Layout[elem.layout][0]];
                    if(elem.obj.param[sideLayout] == undefined) {
                        elem.obj.param[sideLayout] = {};
                        param = elem.obj.param[sideLayout];
                    } else {
                       param = elem.obj.param[sideLayout]; 
                    }
                }

                //Запишем профиль в скрипт
                if (product.buttonSrc == 'n14')
                    winc.obj.color1 = tableRec.id;
                else if (product.buttonSrc == 'n15')
                    winc.obj.color2 = tableRec.id;
                else if (product.buttonSrc == 'n16')
                    winc.obj.color3 = tableRec.id;
                else if (product.buttonSrc == 'n33')
                    param.colorID1 = tableRec.id;
                else if (product.buttonSrc == 'n34')
                    param.colorID2 = tableRec.id;
                else if (product.buttonSrc == 'n35')
                    param.colorID3 = tableRec.id;
                else if (product.buttonSrc == 'n46')
                    param.colorID1 = tableRec.id;
                else if (product.buttonSrc == 'n4A')
                    param.colorID2 = tableRec.id;
                else if (product.buttonSrc == 'n4C')
                    param.colorID3 = tableRec.id;

                let proprodRec = dbset.proprodList.find(rec => proprodID == rec[PROPROD.id]);
                proprodRec[PROPROD.script] = JSON.stringify(winc.obj, (k, v) => isEmpty(v)); //запишем профиль в локальн. бд  
                let winc2 = win.build(document.querySelector("#cnv2"), proprodRec[PROPROD.script]);
                order.wincalcMap.set(proprodID, winc2); //новый экз.


                //Запишем профиль в серверную базу данных
                $.ajax({
                    url: 'dbset?action=saveScript',
                    data: {param: JSON.stringify({id: proprodID, script: proprodRec[PROPROD.script]})},
                    success: function (data) {
                        if (data.result == 'ok') {
                            //Запишем выбранную запись в тег страницы
                            if (product.buttonSrc == 'n14')
                                $("#n14").val(tableRec.name);
                            else if (product.buttonSrc == 'n15')
                                $("#n15").val(tableRec.name);
                            else if (product.buttonSrc == 'n16')
                                $("#n16").val(tableRec.name);
                            else if (product.buttonSrc == 'n33')
                                $("#n33").val(tableRec.name);
                            else if (product.buttonSrc == 'n34')
                                $("#n34").val(tableRec.name);
                            else if (product.buttonSrc == 'n35')
                                $("#n35").val(tableRec.name);
                        }
                    },
                    error: function () {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере", 168);
                    }
                });
//         } catch (e) {
//            console.error("Ошибка:rec_dialog_save() " + e.message);
//         }
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
                        let colgrpRow = table1.getRowData(rowid);
                        if (product.colorArr.length == 0) {
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
                            let colorArr = product.colorArr.filter(rec => colgrpRow.id == rec[COLOR.colgrp_id]);
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
        </script>         
    </head>
    <body>
        <div id="centr" style="height: calc(40% - 8px); width: calc(100% - 4px);">
            <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="centr2" style="height: 60%; width: calc(100% - 4px)">
            <table id="tab2-dic"  class="ui-jqgrid-btable"></table>
        </div>
    </body>
</html>
