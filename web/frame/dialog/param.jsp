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

                            debugger;
                            winc.gson.param = (winc.gson.param === undefined) ? {} : winc.gson.param;
                            winc.gson.param.ioknaParam = (winc.gson.param.ioknaParam === undefined) ? [] : winc.gson.param.ioknaParam;

                            //Удалим параметр из  "ioknaParam": [-8228б -90345]
                            for (let i = 0; i < winc.gson.param.ioknaParam.length; ++i) {
                                if (Number(product.syspar1Row.ID) === winc.gson.param.ioknaParam[i]) {
                                    winc.gson.param.ioknaParam.splice(i, 1);
                                }
                            }
                            //Запишем новый параметр в "ioknaParam": [-8228б -90345]
                            winc.gson.param.ioknaParam.push(parseInt(syspar1Row.ID));

                            //Запишем новый параметр в скрипт
                            project.prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => UJson.isEmpty(v));

                            $.ajax({//запишем скрипт в серверную базу данных
                                url: 'dbset?action=updateScript',
                                data: {param: JSON.stringify(project.prjprodRec)},
                                success: function (data) {
                                    if (data.result == 'ok') {

                                        //Обновим конструкцию
                                        tree_to_html();
                                    }
                                },
                                error: () => {
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
                    colNames: ['paramID', 'groupsID', 'Значение параметра'],
                    colModel: [
                        {name: 'ID', hidden: true},
                        {name: 'groupsID', hidden: true},
                        {name: 'txt', width: 400, sorttype: "text"}

                    ], onSelectRow: function (rowid) {
                        syspar1Row = $(tabParam).jqGrid('getRowData', rowid);

                    }, ondblClickRow: function (rowid) {
                        alert(rowid);
                        syspar1Row = $(tabParam).jqGrid('getRowData', rowid);
                        alert(syspar1Row.ID + ' ' + syspar1Row.txt);
                    }
                });
            }

            function load_table() {

                $(tabParam).jqGrid('clearGridData', true);
                let paramsList = eParams.list.filter(rec =>
                    Number(paramTaq) === rec[eParams.groups_id] &&
                            rec[eParams.id] != rec[eParams.groups_id]);                   
                paramsList.sort((a, b) => b[eParams.text] - a[eParams.text]);
                
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
