<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>ARTIKL</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $(window).bind('resize', function () {
                    $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic").width());
                    $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic").height() - 24);
                }).trigger('resize');

                artikl.init_dialog($("#tab1-dic"));
                artikl.init_table($("#tab1-dic"))
                artikl.load_table($("#tab1-dic"))
            });
//------------------------------------------------------------------------------
            artikl.init_dialog = function (table) {

                $("#dialog-dic").dialog({
                    title: "Справочник-",
                    width: 600,
                    height: 400,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            artikl.rec_dialog_save(table);
                            $(this).dialog("close");
                        },

                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            artikl.rec_dialog_save = function (table) {
                // try {
                let rowid = table.getGridParam('selrow'); //index профиля из справочника
                let tableRec = table.getRowData(rowid);  //record справочника
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let proprodID = order.rec_table2[PROPROD.id]; //id proprod заказа

                let winc = order.wincalcMap.get(proprodID);
                let elem = winc.elemList.find(it => it.id == elemID);
                if (elem.obj.param == undefined) {
                    elem.obj.param = {};
                }
                elem.obj.param.artglasID = tableRec.id; //запишем профиль в скрипт
                let proprodRec = dbset.proprodList.find(rec => proprodID == rec[PROPROD.id]);
                proprodRec[PROPROD.script] = JSON.stringify(winc.obj, (k, v) => isEmpty(v)); //запишем профиль в локальн. бд  
                let winc2 = win.build(winc.cnv, proprodRec[PROPROD.script]);
                order.wincalcMap.set(proprodID, winc2); //новый экз.

                $.ajax({//запишем профиль в серверную базу данных
                    url: 'dbset?action=saveScript',
                    data: {param: JSON.stringify({id: proprodID, script: JSON.stringify(winc.obj, (k, v) => isEmpty(v))})},
                    success: function (data) {
                        if (data.result == 'ok') {
                            //Запишем выбранную запись в тег страницы
                            $("#n51").val(tableRec.code);
                            $("#n52").val(tableRec.name);
                        }
                    },
                    error: function () {
                        dialogMes("<p>Ошибка при сохранении данных на сервере");
                    }
                });
                // } catch (e) {
                //     console.error("Ошибка:rec_dialog_save() " + e.message);
                // }
            }
//------------------------------------------------------------------------------
            artikl.init_table = function (table) {

                table.jqGrid({
                    datatype: "local",
                    multiselect: false,
                    autowidth: true,
                    height: "auto",
                    colNames: ['id', 'Код артикула', 'Наименование артикула'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'code', width: 200, sorttype: "text"},
                        {name: 'name', width: 400, sorttype: "text"}

                    ], ondblClickRow: function (rowid) {
                        artikl.rec_dialog_save(table);
                        $("#dialog-dic").dialog("close");
                    }
                });
            }
//------------------------------------------------------------------------------
            artikl.load_table = function (table) {
                table.jqGrid('clearGridData', true);

                for (let i = 0; i < product.artiklArr.length; i++) {
                    let tr = product.artiklArr[i];
                    table.jqGrid('addRowData', i + 1, {
                        id: tr[ARTIKL.id],
                        code: tr[ARTIKL.code],
                        name: tr[ARTIKL.name]
                    });
                }
                table.jqGrid("setSelection", 1);
                //setTimeout(function () {artikl.resize();}, 500);  
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
    </body>
</html>

