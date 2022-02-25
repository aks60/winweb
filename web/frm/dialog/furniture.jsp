<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>FURNITURE</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $(window).bind('resize', function () {
                    $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic").width());
                    $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic").height() - 24);
                }).trigger('resize');

                furniture.init_dialog($("#tab1-dic"));
                furniture.init_table($("#tab1-dic"))
                furniture.load_table($("#tab1-dic"))
            });
//------------------------------------------------------------------------------
            furniture.init_dialog = function (table) {

                $("#dialog-dic").dialog({
                    title: "Фурнитура системы",
                    width: 600,
                    height: 400,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            furniture.rec_dialog_save(table);
                            $(this).dialog("close");
                        },

                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            furniture.rec_dialog_save = function (table) {
/*
                let rowid = table.getGridParam('selrow'); //index профиля из справочника
                let tableRec = table.getRowData(rowid);  //record справочника
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let proprodID = order.row_table2[PROPROD.id]; //id proprod заказа

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

                let proprodRec = dbset.proprodList.find(rec => proprodID == rec[PROPROD.id]);
                proprodRec[PROPROD.script] = JSON.stringify(winc.obj, (k, v) => isEmpty(v)); //запишем профиль в локальн. бд  
                let iwincalc = win.build(winc.cnv, JSON.stringify(winc.obj, (k, v) => isEmpty(v)));
                order.wincalcMap.set(proprodID, iwincalc); //новый экз.

                $.ajax({//запишем профиль в серверную базу данных
                    url: 'dbset?action=saveScript',
                    data: {param: JSON.stringify({id: proprodID, script: JSON.stringify(winc.obj)})},
                    success: function (data) {
                        if (data.result == 'ok') {
                            //Запишем выбранную запись в тег страницы
                            $("#n31").val(tableRec.code);
                            $("#n32").val(tableRec.name);
                        }
                    },
                    error: function () {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере", 168);
                    }
                });
*/                
            }
//------------------------------------------------------------------------------
            furniture.init_table = function (table) {
                table.jqGrid({
                    datatype: "local",
                    gridview: true,
                    autowidth: true,
                    height: "auto",
                    colNames: ['id', 'Наименование'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'name', width: 340, sorttype: "text"}
                    ], ondblClickRow: function (rowid) {
                        furniture.rec_dialog_save(table);
                        $("#dialog-dic").dialog("close");
                    }
                });
            }
//------------------------------------------------------------------------------
            furniture.load_table = function (table) {
/*
                table.jqGrid('clearGridData', true);
                let id = order.row_table2[SYSPROF.id];
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
*/                
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
    </body>
</html>

