<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>PARAM</title>

        <script type="module">
            import {TypeOpen1, PKjson} from './enums/enums.js';
            import {TFurniture} from './build/making/TFurniture.js';
            import {project} from './frame/project.js';
            import {product} from './frame/product.js';
            import {UJson} from './common/uJson.js';
            import {tree_to_html} from './frame/product.js';

            let syspar1Row = {};
            const paramTaq = "<%= request.getParameter("param")%>";
            const winc = product.winCalc;
            const tabParam = document.getElementById('tab-param');
            $("#dialog-jsp").unbind().bind("dialogresize", (event, ui) => resize());

            function resize() {
                $(tabParam).jqGrid('setGridWidth', $("#dialog-jsp #pan-param").width());
                $(tabParam).jqGrid('setGridHeight', $("#dialog-jsp #pan-param").height() - 24);
            }

            init_dialog();
            init_table();
            load_table();
            resize();


            function init_dialog() {
                $("#dialog-jsp").dialog({
                    title: "Справочник параметров",
                    width: 400,
                    height: 400,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            syspar1Row = getSelectedRow($(tabParam));;
                            save_table();
                            $(this).dialog("close");
                        },
                        "Удалить": function () {
                            syspar1Row = {ID: -3, text: ''};
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
                $(tabParam).jqGrid({
                    datatype: "local",
                    //sortname: 'txt',
                    colNames: ['paramID', 'groupsID', 'Значение параметра'],
                    colModel: [
                        {name: 'ID', hidden: true},
                        {name: 'groupsID', hidden: true},
                        {name: 'txt', width: 400, sorttype: "text"}

                    ], ondblClickRow: function (rowid) {
                        syspar1Row = $(tabParam).jqGrid('getRowData', rowid);
                        save_table();
                        $("#dialog-jsp").dialog("close");
                    }
                });
            }

            function load_table() {

                $(tabParam).jqGrid('clearGridData', true);
                let paramsList = eParams.list.filter(rec =>
                    Number(paramTaq) === rec[eParams.groups_id] &&
                            rec[eParams.id] != rec[eParams.groups_id]);

                paramsList.sort((a, b) => a[eParams.text].localeCompare(b[eParams.text]));

                for (let i = 0; i < paramsList.length; i++) {
                    let paramsRec = paramsList[i];
                    $(tabParam).jqGrid('addRowData', i + 1, {
                        ID: paramsRec[eParams.id],
                        groupsID: paramsRec[eParams.groups_id],
                        txt: paramsRec[eParams.text]
                    });
                }
                $(tabParam).jqGrid("setSelection", 1);
            }

            function save_table() {
                debugger;
                try {
                    winc.gson.param = (winc.gson.param === undefined) ? {} : winc.gson.param;
                    winc.gson.param.ioknaParam = (winc.gson.param.ioknaParam === undefined) ? [] : winc.gson.param.ioknaParam;

                    //Удалим параметр из  "ioknaParam": [-8228, -90345]
                    for (let i = 0; i < winc.gson.param.ioknaParam.length; ++i) {
                        let paramsRec = eParams.list.seek(eParams.vrec, rec => rec[eParams.id] === Number(winc.gson.param.ioknaParam[i]));

                        //let o1 = product.syspar1Row.groupsID;
                        //let o2 = paramsRec[eParams.groups_id];

                        if (Number(product.syspar1Row.groupsID) === paramsRec[eParams.groups_id]) {
                            winc.gson.param.ioknaParam.splice(i, 1);
                        }
                    }
                    //Запишем новый параметр в "ioknaParam": [-8228, -90345]
                    if (syspar1Row.ID != -3)
                        winc.gson.param.ioknaParam.push(parseInt(syspar1Row.ID));

                    //Запишем новый параметр в скрипт
                    project.prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => UJson.isEmpty(v));

                    $.ajax({//Запишем скрипт в серверную базу данных
                        url: 'dbset?action=updateScript',
                        data: {param: JSON.stringify(project.prjprodRec)},
                        success: function (data) {
                            if (data.result == 'ok') {

                                //Обновим конструкцию
                                winc.parametr();
                                winc.artikle();
                                winc.location();
                                TFurniture.calc(winc);
                                winc.draw();
                                let rowid = $(product.table1).jqGrid('getGridParam', "selrow");
                                $(product.table1).jqGrid('setRowData', rowid, {val: syspar1Row.txt});
                            }
                        },
                        error: () => {
                            dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                        }
                    });
                } catch (e) {
                    console.error(e.message);
                }
            }
            function set_value_gson() {
            }
        </script>        
    </head>
    <body>
        <div id="pan-param" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-param"  class="ui-jqgrid-btable"></table> 
        </div>
    </body>
</html>
