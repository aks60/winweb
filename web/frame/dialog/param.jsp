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

                            let rowidZ = $(tabParam).jqGrid('getGridParam', "selrow");
                            let paramsRowZ = $(tabParam).jqGrid('getRowData', rowidZ);
                            let paramsRow = getSelectedRow($(tabParam));
debugger;                            
                            let paramsRec = eParams.list.find(rec => Number(paramsRow.ID) === rec[eParams.id]);
                            winc.gson.param = (winc.gson.param === undefined) ? {} : winc.gson.param;
                            winc.gson.param.ioknaParam = (winc.gson.param.ioknaParam === undefined) ? [] : winc.gson.param.ioknaParam;

                            for (let i = 0; i < winc.gson.param.ioknaParam.length; ++i) {
                                let groupsID = eParams.list.find(rec => Number(winc.gson.param.ioknaParam[i]) === rec[eParams.id])[eParams.groups_id];
                                if (groupsID === Number(paramsRow.groups_id)) {
                                    winc.gson.param.ioknaParam.splice(i, 1);
                                }
                            }
                            //Запишем параметр в скрипт
                            winc.gson.param.ioknaParam.push(parseInt(paramsRow.ID)); 
                            project.prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => UJson.isEmpty(v));

                            $.ajax({//запишем профиль в серверную базу данных
                                url: 'dbset?action=updateScript',
                                data: {param: JSON.stringify(project.prjprodRec)},
                                success: function (data) {
                                    if (data.result == 'ok') {

                                        //Запишем текстуру в html
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
                        {name: 'id2', hidden: true},
                        {name: 'txt', width: 400, sorttype: "text"}  
                        
                    ], onSelectRow: function (rowid) {
                        let syspar1Row = $(tabParam).jqGrid('getRowData', rowid);
                        
                    },  ondblClickRow: function (rowid) {
                        alert(rowid);
                        let syspar1Row = $(tabParam).jqGrid('getRowData', rowid);
                        alert(syspar1Row.ID + ' ' + syspar1Row.txt);                        
                    }
                });
            }

            function load_table() {

                $(tabParam).jqGrid('clearGridData', true);

                let paramsList = eParams.list.filter(rec =>
                    Number(paramTaq) === rec[eParams.groups_id] &&
                            rec[eParams.id] != rec[eParams.groups_id]);
                    
                for (let i = 0; i < paramsList.length; i++) {
                    let paramsRec = paramsList[i];
                    //let o1 = paramsRec[eParams.groups_id];
                    //debugger;
                    $(tabParam).jqGrid('addRowData', i + 1, {
                        ID: paramsRec[eParams.id],
                        id2: paramsRec[eParams.groups_id],
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
