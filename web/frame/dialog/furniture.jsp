<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>FURNITURE</title>

        <script type="module">
            import {Wincalc} from './build/Wincalc.js';
            import {project} from './frame/project.js';
//------------------------------------------------------------------------------
            function resize() {
                $("#tab-furniture").jqGrid('setGridWidth', $("#dialog-jsp #pan-furniture").width());
                $("#tab-furniture").jqGrid('setGridHeight', $("#dialog-jsp #pan-furniture").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-jsp").unbind().bind("dialogresize", function (event, ui) {
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

                $("#dialog-jsp").dialog({
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
                        $("#dialog-jsp").dialog("close");
                    }
                });
            }
//------------------------------------------------------------------------------
            function load_table(table) {

                table.jqGrid('clearGridData', true);
                let id = project.prjprodRec[eSysprof.id];
                let winc = project.wincalcMap.get(id);
                let furnitureList = [];
                for (let furnitureRec of eFurniture.list) {
                    for (let sysfurnRec of eSysfurn.list) {
                        if (furnitureRec[eFurnituire.id] == sysfurnRec[eSysfurn.furniture_id]
                                && sysfurnRec[eSysfurn.systree_id] == winc.nuni) {
                            furnitureList.push(furnitureRec);
                        }
                    }
                }
                for (let i = 0; i < furnitureList.length; i++) {
                    let tr = furnitureList[i];
                    table.jqGrid('addRowData', i + 1, {
                        id: tr[eFurnituire.id],
                        name: tr[eFurnituire.name]
                    });
                }
                table.jqGrid("setSelection", 1);
            }
//------------------------------------------------------------------------------
            function save_table(table) {

                let rowid = table.jqGrid('getGridParam', "selrow"); //index профиля из справочника
                let tableRec = table.jqGrid('getRowData', rowid);  //record справочника
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let prjprodID = project.prjprodRec[ePrjprod.id]; //id prjprod заказа

                let winc = project.wincalcMap.get(prjprodID);
                let elem = winc.listElem.find(it => it.id == elemID);
                elem.gson.param = (elem.gson.param == undefined) ? {} : elem.gson.param;
                let sysfurnRec = eSysfurn.list.find(rec => tableRec.id == rec.list[eSysfurn.furniture_id] && winc.nuni == rec.list[eSysfurn.systree_id]);
                elem.gson.param.sysfurnID = sysfurnRec[eSysfurn.id]; //запишем профиль в скрипт
                let prjprodRec = ePrjprod.list.find(rec => prjprodID == rec.list[ePrjprod.id]);
                prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => isEmpty(v)); //запишем профиль в локальн. бд  
                let iwincalc = Wincalc.new(winc.cnv, winc.cnv.offsetWidth, winc.cnv.offsetHeight, JSON.stringify(winc.gson, (k, v) => isEmpty(v)));
                project.wincalcMap.set(prjprodID, iwincalc); //новый экз.

                $.ajax({//запишем профиль в серверную базу данных
                    url: 'dbset?action=updateScript',
                    data: {param: JSON.stringify({id: prjprodID, script: JSON.stringify(winc.gson)})},
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

