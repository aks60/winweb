<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>FURNITURE</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            function resize() {
                $("#tab-furniture").jqGrid('setGridWidth', $("#dialog-dic #pan-furniture").width());
                $("#tab-furniture").jqGrid('setGridHeight', $("#dialog-dic #pan-furniture").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                    resize();
                });
                init_dialog($("#tab-furniture"));
                init_table($("#tab-furniture"))
                load_table($("#tab-furniture"))
                resize(); //баг!
                resize();
            });
//------------------------------------------------------------------------------
            function init_dialog(table) {

                $("#dialog-dic").dialog({
                    title: "Фурнитура системы",
                    width: 400,
                    height: 480,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            save_table(table);
                            $(this).dialog("close");
                        },

                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            function init_table(table) {
                table.jqGrid({
                    datatype: "local",
//                    gridview: true,
//                    autowidth: true,
//                    height: "auto",
                    colNames: ['id', 'Наименование'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'name', width: 360, sorttype: "text"}
                    ], ondblClickRow: function (rowid) {
                        save_table(table);
                        $("#dialog-dic").dialog("close");
                    }
                });
            }
//------------------------------------------------------------------------------
            function load_table(table) {

                table.jqGrid('clearGridData', true);
                let id = order.prjprodRec[SYSPROF.id];
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
            function save_table(table) {

                let rowid = table.jqGrid('getGridParam', "selrow"); //index профиля из справочника
                let tableRec = table.jqGrid('getRowData', rowid);  //record справочника
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let prjprodID = order.prjprodRec[PRJPROD.id]; //id prjprod заказа

                let winc = order.wincalcMap.get(prjprodID);
                let elem = winc.elemList.find(it => it.id == elemID);
                elem.wson.param = (elem.wson.param == undefined) ? {} : elem.wson.param;
                let sysfurnRec = dbset.sysfurnList.find(rec => tableRec.id == rec[SYSFURN.furniture_id] && winc.nuni == rec[SYSFURN.systree_id]);
                elem.wson.param.sysfurnID = sysfurnRec[SYSFURN.id]; //запишем профиль в скрипт
                let prjprodRec = dbset.prjprodList.find(rec => prjprodID == rec[PRJPROD.id]);
                prjprodRec[PRJPROD.script] = JSON.stringify(winc.wson, (k, v) => isEmpty(v)); //запишем профиль в локальн. бд  
                let iwincalc = win.build(winc.cnv, JSON.stringify(winc.wson, (k, v) => isEmpty(v)));
                order.wincalcMap.set(prjprodID, iwincalc); //новый экз.

                $.ajax({//запишем профиль в серверную базу данных
                    url: 'dbset?action=updateScript',
                    data: {param: JSON.stringify({id: prjprodID, script: JSON.stringify(winc.wson)})},
                    success: function (data) {
                        if (data.result == 'ok') {
                            $("#n43").val(tableRec.name);
                        } else
                            dialogMes('Сообщение', "<p>" + data.result);
                    },
                    error: function () {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                    }
                });
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <div id="pan-furniture" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-furniture"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>

