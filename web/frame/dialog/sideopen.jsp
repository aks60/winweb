<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SIDEOPEN</title>

        <script type="module">
            import {TypeOpen1, PKjson} from './enums/enums.js';
            import {project} from './frame/project.js';
            import {UJson} from './common/uJson.js';
            import {tree_to_html} from './frame/product.js';

            const paramTaq = "<%= request.getParameter("param")%>";
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
                        {name: 'id', hidden: true, key: true},
                        {name: 'name', width: 400, sorttype: "text"}
                    ], ondblClickRow: function (rowid) {
                        save_table();
                        $("#dialog-jsp").dialog("close");
                    }
                });
            }

            function load_table() {

                let typeOpen = [TypeOpen1.LEFT, TypeOpen1.LEFTUP, TypeOpen1.LEFTMOV,
                    TypeOpen1.RIGHT, TypeOpen1.RIGHTUP, TypeOpen1.RIGHTMOV, TypeOpen1.UPPER, TypeOpen1.FIXED];
                $(tabSideopen).jqGrid('clearGridData', true);
                for (let i = 0; i < typeOpen.length; i++) {
                    let elem = typeOpen[i];
                    $(tabSideopen).jqGrid('addRowData', i + 1, {
                        id: elem[0],
                        name: elem[2]
                    });
                }
                $(tabSideopen).jqGrid("setSelection", 1);
            }

            function save_table() {

                let rowid = $(tabSideopen).jqGrid('getGridParam', "selrow"); //index профиля из справочника
                let tableRec = $(tabSideopen).jqGrid('getRowData', rowid);  //record справочника
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let prjprodID = project.prjprodRec[ePrjprod.id]; //id prjprod заказа

                let winc = project.mapWinc.get(prjprodID);
                let elem = winc.listElem.find(it => it.id == elemID);
                elem.gson.param = (elem.gson.param == undefined) ? {} : elem.gson.param;
                elem.gson.param.typeOpen = tableRec.id; //запишем тип открывания
                let prjprodRec = ePrjprod.list.find(rec => prjprodID == rec[ePrjprod.id]);
                prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => UJson.isEmpty(v)); //запишем профиль в локальн. бд  
                let iwincalc = Wincalc.new(winc.cnv, winc.cnv.offsetWidth, winc.cnv.offsetHeight, JSON.stringify(winc.gson, (k, v) => UJson.isEmpty(v)));
                project.mapWinc.set(prjprodID, iwincalc); //новый экз.

                $.ajax({//запишем профиль в серверную базу данных
                    url: 'dbset?action=updateScript',
                    data: {param: JSON.stringify({id: prjprodID, script: JSON.stringify(winc.gson)})},
                    success: function (data) {
                        if (data.result == 'ok') {
                            $("#n44").val(tableRec.name);
                        } else
                            dialogMes('Сообщение', "<p>" + data.result);
                    },
                    error: function () {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                    }
                });
            }
            
            function set_value_gson() {
                
            }            
        </script>        
    </head>
    <body>
        <div id="pan-sideopen" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-sideopen"  class="ui-jqgrid-btable"></table> 
        </div>
    </body>
</html>


