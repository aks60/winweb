<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>     
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>FURNITURE</title>

        <script type="module">
            import {PKjson} from './enums/enums.js';
            import {project} from './frame/project.js';            
            import {product} from './frame/product.js';
            import {UJson} from './common/uJson.js';
            import {tree_to_html} from './frame/product.js';

            let furnitureRow = {}, furnitureList = [];
            const paramTaq = "<%= request.getParameter("param")%>";
            const winc = product.winCalc;
            const com5t = product.clickTreeNodeElem;
            const tabFurn = document.getElementById('tab-furniture');

            function resize() {
                $(tabFurn).jqGrid('setGridWidth', $("#dialog-jsp #pan-furniture").width());
                $(tabFurn).jqGrid('setGridHeight', $("#dialog-jsp #pan-furniture").height() - 24);
            }

            init_dialog();
            init_table();
            data_set();
            load_table();
            $(window).bind('resize', resize).trigger('resize');

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
                            furnitureRow = {ID: -3, name: ''};
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
                    colNames: ['id', 'Наименование'],
                    colModel: [
                        {name: 'ID', hidden: true},
                        {name: 'name', width: 360, sorttype: "text"}
                    ], ondblClickRow: function (rowid) {
                        furnitureRow = getSelectedRow($(tabFurn));
                        save_table();
                        $("#dialog-jsp").dialog("close");
                    }
                });
            }

            function load_table() {
                $(tabFurn).jqGrid('clearGridData', true);
                for (let i = 0; i < furnitureList.length; i++) {
                    let furnitureRec = furnitureList[i];
                    $(tabFurn).jqGrid('addRowData', i + 1, {
                        ID: furnitureRec[eFurniture.id],
                        name: furnitureRec[eFurniture.name]
                    });
                }
                $(tabFurn).jqGrid("setSelection", 1);
            }

            function data_set() {
                for (let sysfurnRec of eSysfurn.list) {
                    if (sysfurnRec[eSysfurn.systree_id] === winc.nuni) {

                        for (let furnitureRec of eFurniture.list) {
                            if (furnitureRec[eFurniture.id] == sysfurnRec[eSysfurn.furniture_id]) {
                                furnitureList.push(furnitureRec);
                            }
                        }
                    }
                }
            }

            function save_table() {
                
                //Запишем артикл в gson 
                set_value_gson();

                //Запишем скрипт в локальн. бд 
                project.prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => UJson.isEmpty(v));

                $.ajax({
                    url: 'dbset?action=updateScript',
                    data: {param: JSON.stringify(project.prjprodRec)},
                    success: (data) => {
                        if (data.result === 'ok') {

                            //Запишем текстуру в html
                            tree_to_html();
                        }
                    },
                    error: () => {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                    }
                });
            }

            function set_value_gson() {  
                let sysfurnRec = eSysfurn.list.seek(eSysfurn.vrec, rec => rec[eSysfurn.furniture_id] === Number(furnitureRow.ID));
                if (paramTaq === 'n43') {
                    UJson.updateJsonParam(com5t.gson, ['param', PKjson.sysfurnID], sysfurnRec[eSysfurn.id]);
                }
            }
        </script>        
    </head>
    <body>
        <div id="pan-furniture" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-furniture"  class="ui-jqgrid-btable"></table> 
        </div>
    </body>
</html>

