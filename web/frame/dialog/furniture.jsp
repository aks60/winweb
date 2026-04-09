<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>     
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>FURNITURE</title>

        <script type="module">
            import {Wincalc} from './build/Wincalc.js';
            import {project} from './frame/project.js';
            import {UJson} from './common/uJson.js';
            import {product} from './frame/product.js';

//            let furnitureRow = {}, furnitureList = [];
//            const paramTaq = "<%= request.getParameter("param")%>";
//            const winc = product.winCalc;
            const tabFurn = document.getElementById('tab-furniture');
            $("#tab-furniture").unbind().bind("dialogresize", (event, ui) => resize());
            
            function resize() {
                alert('aks');
                $("#tab-furniture").jqGrid('setGridWidth', $("#dialog-jsp #pan-furniture").width());
                $("#tab-furniture").jqGrid('setGridHeight', $("#dialog-jsp #pan-furniture").height() - 24);
            }

            init_dialog();
            init_table();
//            data_set();
//            load_table();
            resize();

            function init_dialog() {

                $("#dialog-jsp").dialog({
                    title: "Фурнитура системы",
                    width: 400,
                    height: 480,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            furnitureRow = getSelectedRow($(tabFurn));
                            save_table();
                            $(this).dialog("close");
                        },
                        "Удалить": function () {
                            furnitureRow = {id: -3, name: ''};
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
                
                $(tabFurn).jqGrid({
                    datatype: "local",
                    rowNum: -1,
                    colNames: ['id', 'Наименование'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'name', width: 360, sorttype: "text"}
                    ], ondblClickRow: function (rowid) {
                        furnitureRow = getSelectedRow($(tabFurn));
                        save_table();
                        $("#dialog-jsp").dialog("close");
                    }
                });
            }

//            function load_table() {
//                $(tabFurn).jqGrid('clearGridData', true);
//                for (let i = 0; i < furnitureList.length; i++) {
//                    let furnitureRec = furnitureList[i];
//                    $(tabFurn).jqGrid('addRowData', i + 1, {
//                        id: furnitureRec[eFurniture.id],
//                        name: furnitureRec[eFurniture.name]
//                    });
//                }
//                $(tabFurn).jqGrid("setSelection", 1);
//            }
//
//            function data_set() {
//                for (let sysfurnRec of eSysfurn.list) {
//                    if (sysfurnRec[eSysfurn.systree_id] === winc.nuni) {
//                        
//                        for (let furnitureRec of eFurniture.list) {
//                            if (furnitureRec[eFurniture.id] == sysfurnRec[eSysfurn.furniture_id]) {
//                                furnitureList.push(furnitureRec);
//                            }
//                        }
//                    }
//                }
//            }
//
//            function save_table() {
//
//                let rowid = $(tabFurn).jqGrid('getGridParam', "selrow"); //index профиля из справочника
//                let tableRec = $(tabFurn).jqGrid('getRowData', rowid);  //record справочника
//                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
//                let prjprodID = project.prjprodRec[ePrjprod.id]; //id prjprod заказа
//
//                let winc = project.mapWinc.get(prjprodID);
//                let elem = winc.listElem.find(it => it.id == elemID);
//                elem.gson.param = (elem.gson.param == undefined) ? {} : elem.gson.param;
//                let sysfurnRec = eSysfurn.list.find(rec => tableRec.id == rec[eSysfurn.furniture_id] && winc.nuni == rec[eSysfurn.systree_id]);
//                elem.gson.param.sysfurnID = sysfurnRec[eSysfurn.id]; //запишем профиль в скрипт
//                let prjprodRec = ePrjprod.list.find(rec => prjprodID == rec[ePrjprod.id]);
//                prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => UJson.isEmpty(v)); //запишем профиль в локальн. бд  
//                let iwincalc = Wincalc.new(winc.cnv, winc.cnv.offsetWidth, winc.cnv.offsetHeight, JSON.stringify(winc.gson, (k, v) => UJson.isEmpty(v)));
//                project.mapWinc.set(prjprodID, iwincalc); //новый экз.isEmpty(
//
//                $.ajax({//запишем профиль в серверную базу данных
//                    url: 'dbset?action=updateScript',
//                    data: {param: JSON.stringify({id: prjprodID, script: JSON.stringify(winc.gson)})},
//                    success: function (data) {
//                        if (data.result == 'ok') {
//                            $("#n43").val(tableRec.name);
//                        } else
//                            dialogMes('Сообщение', "<p>" + data.result);
//                    },
//                    error: function () {
//                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
//                    }
//                });
//            }
        </script>        
    </head>
    <body>
        <div id="pan-furniture" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-furniture"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>

