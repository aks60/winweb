<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>FURNITURE</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $(window).bind('resize', function () {
                    $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic").width());
                    $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic").height() - 24);
                }).trigger('resize');

                furniture.init_dialog($("#tab1-dic"));
                furniture.init_table($("#tab1-dic"))
                furniture.load_table($("#tab1-dic"))
            });
//------------------------------------------------------------------------------
            furniture.init_dialog = function (table) {

                $("#dialog-dic").dialog({
                    title: "Фурнитура системы",
                    width: 400,
                    height: 400,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            furniture.rec_dialog_save(table);
                            $(this).dialog("close");
                        },

                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            furniture.rec_dialog_save = function (table) {

                let rowid = table.getGridParam('selrow'); //index профиля из справочника
                let tableRec = table.getRowData(rowid);  //record справочника
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let proprodID = order.rec_table2[PROPROD.id]; //id proprod заказа

                let winc = order.wincalcMap.get(proprodID);
                let elem = winc.elemList.find(it => it.id == elemID);
                elem.obj.param = (elem.obj.param == undefined) ? {} : elem.obj.param;
                let sysfurnRec = dbset.sysfurnList.find(rec => tableRec.id == rec[SYSFURN.furniture_id] && winc.nuni == rec[SYSFURN.systree_id]);
                elem.obj.param.sysfurnID = sysfurnRec[SYSFURN.id]; //запишем профиль в скрипт
                let proprodRec = dbset.proprodList.find(rec => proprodID == rec[PROPROD.id]);
                proprodRec[PROPROD.script] = JSON.stringify(winc.obj, (k, v) => isEmpty(v)); //запишем профиль в локальн. бд  
                let iwincalc = win.build(winc.cnv, JSON.stringify(winc.obj, (k, v) => isEmpty(v)));
                order.wincalcMap.set(proprodID, iwincalc); //новый экз.

                $.ajax({//запишем профиль в серверную базу данных
                    url: 'dbset?action=updateScript',
                    data: {param: JSON.stringify({id: proprodID, script: JSON.stringify(winc.obj)})},
                    success: function (data) {
                        if (data.result == 'ok') {
                            $("#n43").val(tableRec.name);
                        }
                    },
                    error: function () {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере", 168);
                    }
                });
            }
//------------------------------------------------------------------------------
            furniture.init_table = function (table) {
                table.jqGrid({
                    datatype: "local",
                    gridview: true,
                    autowidth: true,
                    height: "auto",
                    colNames: ['id', 'Наименование'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'name', width: 400, sorttype: "text"}
                    ], ondblClickRow: function (rowid) {
                        furniture.rec_dialog_save(table);
                        $("#dialog-dic").dialog("close");
                    }
                });
            }
//------------------------------------------------------------------------------
            furniture.load_table = function (table) {

                table.jqGrid('clearGridData', true);
                let id = order.rec_table2[SYSPROF.id];
                let winc = order.wincalcMap.get(id);
                let furnitureList = [];
                for (let furnitureRec of dbset.furnitureList) {
                    for (let sysfurnRec of dbset.sysfurnList) {
                        if (furnitureRec[FURNITURE.id] == sysfurnRec[SYSFURN.furniture_id]
                                && sysfurnRec[SYSFURN.systree_id] == winc.nuni) {
                            furnitureList.push(furnitureRec);
                        }
                    }
                }
                for (let i = 0; i < furnitureList.length; i++) {
                    let tr = furnitureList[i];
                    table.jqGrid('addRowData', i + 1, {
                        id: tr[FURNITURE.id],
                        name: tr[FURNITURE.name]
                    });
                }
                table.jqGrid("setSelection", 1);
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>

