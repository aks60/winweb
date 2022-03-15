<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SYSPROF</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            sysprof.resize = function () {
                $("#tab-sysprof").jqGrid('setGridWidth', $("#dialog-dic #centr").width());
                $("#tab-sysprof").jqGrid('setGridHeight', $("#dialog-dic #centr").height() - 24);
            }            
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                    sysprof.resize();
                });
                sysprof.init_dialog($("#tab-sysprof"));
                sysprof.init_table($("#tab-sysprof"))
                sysprof.load_table($("#tab-sysprof"))
                sysprof.resize();
            });
//------------------------------------------------------------------------------
            sysprof.init_dialog = function (table) {
                $("#dialog-dic").dialog({
                    title: "Профили системы",
                    width: 450,
                    height: 400,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            sysprof.rec_dialog_save(table);
                            $(this).dialog("close");
                        },

                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            sysprof.init_table = function (table) {
                table.jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Сторона', 'Код артикула', 'Наименование артикула'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'side', width: 60, sorttype: "text"},
                        {name: 'code', width: 140, sorttype: "text"},
                        {name: 'name', width: 340, sorttype: "text"}
                    ], ondblClickRow: function (rowid) {
                        sysprof.rec_dialog_save(table);
                        $("#dialog-dic").dialog("close");
                    }
                });
            }
//------------------------------------------------------------------------------
            sysprof.load_table = function (table) {

                table.jqGrid('clearGridData', true);
                let id = order.rec_table2[SYSPROF.id];
                let winc = order.wincalcMap.get(id);

                for (let i = 0; i < product.sysprofArr.length; i++) {
                    let tr = product.sysprofArr[i];
                    let artRec = dbset.artiklList.find(rec => tr[SYSPROF.artikl_id] == rec[ARTIKL.id]);
                    table.jqGrid('addRowData', i + 1, {
                        id: tr[SYSPROF.id],
                        side: sysprof.use_name(tr[SYSPROF.use_side]),
                        code: artRec[ARTIKL.code],
                        name: artRec[ARTIKL.name]
                    });
                }
                table.jqGrid("setSelection", 1);
            }
//------------------------------------------------------------------------------
            sysprof.rec_dialog_save = function (table) {

                let rowid = table.jqGrid('getGridParam', "selrow"); //index профиля из справочника
                let tableRec = table.jqGrid('getRowData', rowid);  //record справочника
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let proprodID = order.rec_table2[PROPROD.id]; //id proprod заказа

                let winc = order.wincalcMap.get(proprodID);
                let elem = winc.elemList.find(it => it.id == elemID);
                if (elem.obj.param == undefined) {
                    elem.obj.param = {};
                }
                if (elem.type == "FRAME_SIDE") { //коробка
                    elem.obj.param.sysprofID = tableRec.id; //запишем профиль в скрипт

                } else { //створка       
                    let sideLayout = ["", "stvorkaBottom", "stvorkaRight", "stvorkaTop", "stvorkaLeft"][Layout[elem.layout][0]];
                    elem.obj.param[sideLayout] = {sysprofID: tableRec.id};
                }

                //Запишем профиль в локальн. бд
                let proprodRec = dbset.proprodList.find(rec => proprodID == rec[PROPROD.id]);
                proprodRec[PROPROD.script] = JSON.stringify(winc.obj, (k, v) => isEmpty(v));
                let iwincalc = win.build(winc.cnv, JSON.stringify(winc.obj, (k, v) => isEmpty(v)));
                order.wincalcMap.set(proprodID, iwincalc); //новый экз.

                //Запишем профиль в серверную базу данных
                $.ajax({
                    url: 'dbset?action=updateScript',
                    data: {param: JSON.stringify({id: proprodID, script: JSON.stringify(winc.obj)})},
                    success: function (data) {
                        if (data.result == 'ok') {
                            $("#n31").val(tableRec.code);
                            $("#n32").val(tableRec.name);
                        }
                    },
                    error: function () {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                    }
                });
            }            
//------------------------------------------------------------------------------
            sysprof.use_name = (v) => {
                for (let k in UseSide) {
                    if (v == UseSide[k][0])
                        return UseSide[k][1];
                }
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <div id="centr" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-sysprof"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>
