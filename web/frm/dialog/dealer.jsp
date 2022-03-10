<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>DEALER</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            dealer.resize = function () {
                $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic").width());
                $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $(window).bind('resize', function () {
                    dealer.resize();
                }).trigger('resize');

                dealer.init_dialog($("#tab1-dic"));
                dealer.init_table($("#tab1-dic"))
                dealer.load_table($("#tab1-dic"))
            });
//------------------------------------------------------------------------------
            dealer.init_dialog = function (table) {

                $("#dialog-dic").dialog({
                    title: "Справочник-",
                    width: 600,
                    height: 400,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            //dealer.rec_dialog_save(table);
                            $(this).dialog("close");
                        },
                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            dealer.rec_dialog_save = function (table) {
                try {
                    let rowid = table.getGridParam('selrow'); //index профиля из справочника
                    let tableRow = table.getRowData(rowid);  //record справочника
                    let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                    let proprodID = order.rec_table2[PROPROD.id]; //id proprod заказа
                    let proprodRec = dbset.proprodList.find(rec => proprodID == rec[PROPROD.id]);

                    let winc = order.wincalcMap.get(proprodID);
                    let elem = winc.elemList.find(it => it.id == elemID);
                    elem.obj.param = (elem.obj.param == undefined) ? {} : elem.obj.param;

                    //Запишем скрипт в локальн. бд 
                    proprodRec[PROPROD.script] = JSON.stringify(winc.obj, (k, v) => isEmpty(v));
                    let winc2 = win.build(winc.cnv, proprodRec[PROPROD.script]);
                    order.wincalcMap.set(proprodID, winc2); //новый экз.

                    //Запишем скрипт в серверную базу данных
                    $.ajax({
                        url: 'dbset?action=updateScript',
                        data: {param: JSON.stringify({id: proprodID, script: JSON.stringify(winc.obj, (k, v) => isEmpty(v))})},
                        success: (data) => {
                            if (data.result != 'ok')
                                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                        },
                        error: () => {
                            dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                        }
                    });

                } catch (e) {
                    console.error("Ошибка: dealer.rec_dialog_save() " + e.message);
                }
            }
//------------------------------------------------------------------------------
            dealer.init_table = function (table) {

                table.jqGrid({
                    datatype: "local",
                    multiselect: false,
                    autowidth: true,
                    height: "auto",
                    colNames: ['id', 'Контрагент', 'Диллер'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'partner', width: 400, sorttype: "text"},
                        {name: 'manager', width: 200, sorttype: "text"}

                    ], ondblClickRow: function (rowid) {
                        //dealer.rec_dialog_save(table);
                        $("#dialog-dic").dialog("close");
                    }
                });
            }
//------------------------------------------------------------------------------
            dealer.load = function () {

                let pkSet = new Set();
                let artiklArr = dbset.artiklList.filter(rec => rec[ARTIKL.level1] == level_1 && rec[ARTIKL.level2] == level_2);
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let proprodID = order.rec_table2[PROPROD.id]; //id proprod заказа
                let winc = order.wincalcMap.get(proprodID);
                let elem = winc.elemList.find(it => it.id == elemID);
                for (let furndetRec1 of dbset.furndetList) {
                    if (furndetRec1[FURNDET.furniture_id1] == elem.sysfurnRec[SYSFURN.furniture_id]) {

                        if (furndetRec1[FURNDET.furniture_id2] == null) { //НЕ НАБОР                                
                            pkSet.add(furndetRec1[FURNDET.artikl_id]);
                        } else {
                            for (let furndetRec2 of dbset.furndetList) {
                                if (furndetRec1[FURNDET.furniture_id2] == furndetRec2[FURNDET.furniture_id1]) {
                                    pkSet.add(furndetRec2[FURNDET.artikl_id]);
                                }
                            }
                        }
                    }
                }
                let artiklList = artiklArr.filter(rec => pkSet.has(rec[ARTIKL.id]));
                for (let i = 0; i < artiklList.length; i++) {
                    let tr = artiklList[i];
                    $("#tab1-dic").jqGrid('addRowData', i + 1, {
                        id: tr[ARTIKL.id], code: tr[ARTIKL.code], name: tr[ARTIKL.name]
                    });
                }
            }
//------------------------------------------------------------------------------ 
            dealer.load_table = function (table) {
                for (let i = 0; i < dbset.dealerList.length; i++) {
                    let tr = dbset.dealerList[i];
                    table.jqGrid('addRowData', i + 1, {
                        id: tr[ARTIKL.id], 
                        partner: tr[ARTIKL.code], 
                        manager: tr[ARTIKL.name]});
                }
                table.jqGrid("setSelection", 1);
                setTimeout(() => artikl.resize(), 100);
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>