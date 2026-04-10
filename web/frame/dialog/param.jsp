<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>PARAM</title>

        <script type="module">
            import {TypeOpen1, PKjson} from './enums/enums.js';
            import {project} from './frame/project.js';
            import {product} from './frame/product.js';
            import {UJson} from './common/uJson.js';
            import {tree_to_html} from './frame/product.js';

            let sideopenRow = {};
            const paramTaq = "<%= request.getParameter("param")%>";
            const winc = product.winCalc;
            const com5t = product.clickTreeNodeElem;
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
                            let rowid = $(tabParam).jqGrid('getGridParam', "selrow");
                            let paramsRow = $(tabParam).jqGrid('getRowData', rowid);
                            let paramsRec = eParams.list.find(rec => paramsRow.id == rec[eParams.id]);
                            let paramDef = paramsRow.id;
                            let prjprodID = project.prjprodRec[ePrjprod.id]; //id prjprod заказа
                            let titleID1 = paramsRec[eParams.groups_id];
                            winc.gson.param = (winc.gson.param == undefined) ? {} : winc.gson.param;
                            winc.gson.param.ioknaParam = (winc.gson.param.ioknaParam == undefined) ? [] : winc.gson.param.ioknaParam;
                            for (let i = 0; i < winc.gson.param.ioknaParam.length; ++i) {

                                let titleID2 = eParams.list.find(rec => winc.gson.param.ioknaParam[i] == rec[eParams.id])[eParams.groups_id];
                                if (titleID1 === titleID2) {
                                    winc.gson.param.ioknaParam.splice(i, 1);
                                }
                            }
                            winc.gson.param.ioknaParam.push(parseInt(paramDef)); //запишем профиль в скрипт

                            $.ajax({//запишем профиль в серверную базу данных
                                url: 'dbset?action=updateScript',
                                data: {param: JSON.stringify({id: prjprodID, script: JSON.stringify(winc.gson, (k, v) => UJson.isEmpty(v))})},
                                success: function (data) {
                                    if (data.result == 'ok') {
                                        winc.root.init_pardef_map();
                                        product.load_table($(tabParam));
                                    } else
                                        dialogMes('Сообщение', "<p>" + data.result);
                                },
                                error: function () {
                                    dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                                }
                            });
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
                    colNames: ['id', 'Значение параметра'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'text', width: 400, sorttype: "text"}
                    ], onSelectRow: function (rowid) {
                        let syspar1Row = $(tabParam).jqGrid('getRowData', rowid);
                    }
                });
            }

            function load_table() {

                $(tabParam).jqGrid('clearGridData', true);

                let params2List = eParams.list.filter(rec =>
                    Number(paramTaq) === rec[eParams.groups_id] && 
                            rec[eParams.id] != rec[eParams.groups_id]);

                for (let i = 0; i < params2List.length; i++) {
                    let paramsRec = params2List[i];
                    $(tabParam).jqGrid('addRowData', i + 1, {
                        id: paramsRec[eParams.id],
                        text: paramsRec[eParams.text]
                                //text: tr[eParams.params_id]
                    });
                }
                $(tabParam).jqGrid("setSelection", 1);
            }

        </script>        
    </head>
    <body>
        <div id="pan-param" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-param"  class="ui-jqgrid-btable"></table> 
        </div>
    </body>
</html>
