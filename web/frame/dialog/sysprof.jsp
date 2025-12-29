<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SYSPROF</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            function resize() {
                $("#tab-sysprof").jqGrid('setGridWidth', $("#dialog-dic #pan-sysprof").width());
                $("#tab-sysprof").jqGrid('setGridHeight', $("#dialog-dic #pan-sysprof").height() - 24);
            }            
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                    resize();
                });
                init_dialog($("#tab-sysprof"));
                init_table($("#tab-sysprof"))
                load_table($("#tab-sysprof"))
                resize();
            });
//------------------------------------------------------------------------------
            function init_dialog(table) {
                $("#dialog-dic").dialog({
                    title: "Профили системы",
                    width: 450,
                    height: 400,
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
                    colNames: ['id', 'Сторона', 'Код артикула', 'Наименование артикула'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'side', width: 60, sorttype: "text"},
                        {name: 'code', width: 140, sorttype: "text"},
                        {name: 'name', width: 340, sorttype: "text"}
                    ], ondblClickRow: function (rowid) {
                        save_table(table);
                        $("#dialog-dic").dialog("close");
                    }
                });
            }
//------------------------------------------------------------------------------
            function load_table(table) {

                table.jqGrid('clearGridData', true);
                let id = order.prjprodRec[eSysprof.id];
                let winc = order.wincalcMap.get(id);

                for (let i = 0; i < product.sysprofArr.length; i++) {
                    let tr = product.sysprofArr[i];
                    let artRec = dbset.artiklList.find(rec => tr[eSysprof.artikl_id] == rec.list[eArtikl.id]);
                    table.jqGrid('addRowData', i + 1, {
                        id: tr[eSysprof.id],
                        side: use_name(tr[eSysprof.use_side]),
                        code: artRec[eArtikl.code],
                        name: artRec[eArtikl.name]
                    });
                }
                table.jqGrid("setSelection", 1);
            }
//------------------------------------------------------------------------------
            function save_table(table) {

                let rowid = table.jqGrid('getGridParam', "selrow"); //index профиля из справочника
                let tableRec = table.jqGrid('getRowData', rowid);  //record справочника
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let prjprodID = order.prjprodRec[ePrjprod.id]; //id prjprod заказа

                let winc = order.wincalcMap.get(prjprodID);
                let elem = winc.listElem.find(it => it.id == elemID);
                if (elem.gson.param == undefined) {
                    elem.gson.param = {};
                }
                if (elem.typeForm() == "BOX_SIDE") { //коробка
                    elem.gson.param.sysprofID = tableRec.id; //запишем профиль в скрипт

                } else { //створка       
                    let sideLayout = ["", "stvorkaBottom", "stvorkaRight", "stvorkaTop", "stvorkaLeft"][Layout[elem.layout][0]];
                    elem.gson.param[sideLayout] = {sysprofID: tableRec.id};
                }

                //Запишем профиль в локальн. бд
                let prjprodRec = dbset.prjprodList.find(rec => prjprodID == rec.list[ePrjprod.id]);
                prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => isEmpty(v));
                let iwincalc = win.build(winc.cnv, JSON.stringify(winc.gson, (k, v) => isEmpty(v)));
                order.wincalcMap.set(prjprodID, iwincalc); //новый экз.

                //Запишем профиль в серверную базу данных
                $.ajax({
                    url: 'dbset?action=updateScript',
                    data: {param: JSON.stringify({id: prjprodID, script: JSON.stringify(winc.gson)})},
                    success: function (data) {
                        if (data.result == 'ok') {
                            $("#n31").val(tableRec.code);
                            $("#n32").val(tableRec.name);
                        } else
                            dialogMes('Сообщение', "<p>" + data.result);
                    },
                    error: function () {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                    }
                });
            }            
//------------------------------------------------------------------------------
            let use_name = (v) => {
                for (let k in UseSide) {
                    if (v == UseSide[k][0])
                        return UseSide[k][1];
                }
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <div id="pan-sysprof" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-sysprof"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>
