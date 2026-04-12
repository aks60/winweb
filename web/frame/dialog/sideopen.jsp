<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SIDEOPEN</title>
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
            const tabSideopen = document.getElementById('tab-sideopen');
            $("#dialog-jsp").unbind().bind("dialogresize", (event, ui) => resize());

            function resize() {
                $(tabSideopen).jqGrid('setGridWidth', $("#dialog-jsp #pan-sideopen").width());
                $(tabSideopen).jqGrid('setGridHeight', $("#dialog-jsp #pan-sideopen").height() - 24);
            }
            init_dialog();
            init_table();
            load_table();
            resize();

            function init_dialog() {
                $("#dialog-jsp").dialog({
                    title: "Направление открывания",
                    width: 400,
                    height: 400,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            sideopenRow = getSelectedRow($(tabSideopen));
                            save_table();
                            $(this).dialog("close");
                        },
                        "Удалить": function () {
                            sideopenRow = {ID: -3, name: ''};
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
                $(tabSideopen).jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Наименование'],
                    colModel: [
                        {name: 'ID', hidden: true},
                        {name: 'name', width: 400, sorttype: "text"}
                    ], ondblClickRow: function (rowid) {
                        sideopenRow = getSelectedRow($(tabSideopen));
                        save_table();
                        $("#dialog-jsp").dialog("close");
                    }
                });
            }

            function load_table() {

                $(tabSideopen).jqGrid('clearGridData', true);
                let typeopenList = [TypeOpen1.LEFT, TypeOpen1.LEFTUP, TypeOpen1.LEFMOV,
                    TypeOpen1.RIGH, TypeOpen1.RIGHUP, TypeOpen1.RIGMOV, TypeOpen1.UPPER, TypeOpen1.EMPTY];

                for (let i = 0; i < typeopenList.length; i++) {
                    let typeopenRec = typeopenList[i];
                    $(tabSideopen).jqGrid('addRowData', i + 1, {
                        ID: typeopenRec[0],
                        name: typeopenRec[2]
                    });
                }
                $(tabSideopen).jqGrid("setSelection", 1);
            }

            function save_table() {

                //Запишем текстуру в gson 
                set_value_gson();

                //Запишем скрипт в локальн. бд                       
                project.prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => UJson.isEmpty(v));

                $.ajax({//запишем профиль в серверную базу данных
                    url: 'dbset?action=updateScript',
                    data: {param: JSON.stringify(project.prjprodRec)},
                    success: function (data) {

                        if (data.result === 'ok') {

                            //Запишем текстуру в html
                            tree_to_html();

                        } else {
                            dialogMes('Сообщение', "<p>" + data.result);
                        }
                    },
                    error: function () {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                    }
                });
            }

            function set_value_gson() {

                let ID = Number(sideopenRow.ID);

                if (paramTaq === 'n44') {
                    UJson.updateJsonParam(com5t.gson, ['param', PKjson.typeOpen], ID);
                }
            }
        </script>        
    </head>
    <body>
        <div id="pan-sideopen" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-sideopen"  class="ui-jqgrid-btable"></table> 
        </div>
    </body>
</html>


