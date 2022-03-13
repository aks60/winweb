<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head style="margin: 0; padding: 0;">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>KITCARD</title>

        <script type="text/javascript">
            let kitk = {};
//------------------------------------------------------------------------------
            kitk.resize = function () {
                var winWidth = $('#pan1').width() - 24;
                $("#pan1 .field[dx]").each(function (index) {
                    var width = $(this).attr('dx');
                    $(this).width((winWidth - width) + 'px');
                });                
                $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic #pan2a").width());
                $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic #pan2a").height() - 20);
                $("#tab2-dic").jqGrid('setGridWidth', $("#dialog-dic #pan2b").width());
                $("#tab2-dic").jqGrid('setGridHeight', $("#dialog-dic #pan2b").height() - 20);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $(window).bind('resize', function () {
                    kitk.resize();
                }).trigger('resize');
                
                kitk.init_dialog($("#tab1-dic"), $("#tab2-dic"));
                kitk.init_table($("#tab1-dic"), $("#tab2-dic"));
                kitk.load_table($("#tab1-dic"), $("#tab2-dic"))
                taq_deploy(['#pan1']);
            });
//------------------------------------------------------------------------------
            kitk.init_dialog = function (table1, table2) {

                $("#dialog-dic").dialog({
                    title: "Справочник текстур*",
                    width: 600,
                    height: 600,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            //kitk.rec_dialog_save(table2);
                            $(this).dialog("close");
                        },
                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            kitk.rec_dialog_save = function (table2) {
                try {
//                    let rowid = table2.jqGrid('getGridParam', "selrow"); //index профиля из справочника
//                    let tableRec = table2.jqGrid('getRowData', rowid); //record справочника
//                    let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
//                    let proprodID = order.rec_table2[PROPROD.id]; //id proprod заказа
//                    let winc = order.wincalcMap.get(proprodID);
//                    let elem = winc.elemList.find(it => it.id == elemID);
//                    let param = elem.obj.param;
//                    if (elem.obj.param == undefined) {
//                        elem.obj.param = {};
//                        param = elem.obj.param;
//                    }
//                    if (elem.type == 'STVORKA_SIDE') {
//                        let sideLayout = ["", "stvorkaBottom", "stvorkaRight", "stvorkaTop", "stvorkaLeft"][Layout[elem.layout][0]];
//                        if (elem.obj.param[sideLayout] == undefined) {
//                            elem.obj.param[sideLayout] = {};
//                            param = elem.obj.param[sideLayout];
//                        } else {
//                            param = elem.obj.param[sideLayout];
//                        }
//                    }
//
//                    //Запишем скрипт в локальн. бд
//                    let proprodRec = dbset.proprodList.find(rec => proprodID == rec[PROPROD.id]);
//                    proprodRec[PROPROD.script] = JSON.stringify(winc.obj, (k, v) => isEmpty(v));
//                    let winc2 = win.build(document.querySelector("#cnv2"), proprodRec[PROPROD.script]);
//                    order.wincalcMap.set(proprodID, winc2); //новый экз.

                } catch (e) {
                    console.error("Ошибка: rec_dialog_save() " + e.message);
                }
            }
//------------------------------------------------------------------------------
            kitk.init_table = function (table1, table2) {

                table1.jqGrid({
                    datatype: "local",
                    autowidth: true,
                    height: "auto",
                    colNames: ['id', 'Группы текстур'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'name', width: 360}
                    ],
                    onSelectRow: function (rowid) {
                        //table2.jqGrid("clearGridData", true);
                        //table2.jqGrid("setSelection", 1);
                        kitk.resize();
                    }
                });
                table2.jqGrid({
                    datatype: "local",
                    autowidth: true,
                    height: 'auto',
                    colNames: ['Код', 'Описание текстур'],
                    colModel: [
                        {name: 'id', width: 60, key: true},
                        {name: 'name', width: 340}
                    ],
                    ondblClickRow: function (rowId) {
                        //kitk.rec_dialog_save(table2);
                        $("#dialog-dic").dialog("close");
                    }
                });
            };
//------------------------------------------------------------------------------
            kitk.load_table = function (table1, table2) {
//                table1.jqGrid('clearGridData', true);
//                table2.jqGrid('clearGridData', true);
//                if (product.groupSet.size > 0) {
//                    let groupList = dbset.groupList.filter(rec => product.groupSet.has(rec[GROUP.id]));
//                    for (let i = 0; i < groupList.length; i++) {
//                        let tr = groupList[i];
//                        table1.jqGrid('addRowData', i + 1, {
//                            id: tr[GROUP.id],
//                            name: tr[GROUP.name]
//                        });
//                    }
//                }
//                table1.jqGrid("setSelection", 1);
//                kitkard.resize();
            };
//------------------------------------------------------------------------------
        </script>         
    </head>
    <body>
        <div id="pan1" style="width: calc(100% - 4px); height: calc(30%);"> 
            <jst id="n21" type='txt' label='Кол.компл.' width='80' width2="40"></jst>
            <jst id="n22" type='btn' label='Основная текстура' width='130' dx="180"></jst><br>
            <jst id="n23" type='txt' label='Длина' width='80' width2="40"></jst>
            <jst id="n24" type='btn' label='Внутренняя текстура' width='130' width2="80"></jst><br>
            <jst id="n25" type='txt' label='Ширина' width='80' width2="40"></jst>
            <jst id="n26" type='btn' label='Внешняя текстура' width='130' width2="80"></jst><br>
        </div>        
        <div id="pan2" style="height: calc(70%); width: calc(100%);">        
            <div id="pan2a" style="height: calc(58%); width: calc(100% - 4px);">           
                <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
            </div>         
            <div id="pan2b" style="height: 100px; width: calc(100% - 4px);"> 
                <table id="tab2-dic"  class="ui-jqgrid-btable"></table>
            </div>
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>

