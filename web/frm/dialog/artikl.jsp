<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>ARTIKL</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            artikl.resize = function () {
                $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic").width());
                $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $(window).bind('resize', function () {
                    artikl.resize();
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
                let tableRow = table.getRowData(rowid);  //record справочника
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let proprodID = order.rec_table2[PROPROD.id]; //id proprod заказа

                let winc = order.wincalcMap.get(proprodID);
                let elem = winc.elemList.find(it => it.id == elemID);
                elem.obj.param = (elem.obj.param == undefined) ? {} : elem.obj.param;

                //Стеклопакет
                if (artikl.dialogType == 1) {
                    elem.obj.param.artglasID = tableRow.id; //запишем профиль в скрипт
                    $("#n51").val(tableRow.code);
                    $("#n52").val(tableRow.name);

                    //Ручка
                } else if (artikl.dialogType == 2) {
                    elem.obj.param.artiklHandl = tableRow.id; //запишем артикул в скрипт 
                    $("#n45").val(tableRow.code + " ÷ " + tableRow.name);
                    $("#n46").val('');

                    //Подвес
                } else if (artikl.dialogType == 3) {
                    elem.obj.param.artiklLoop = tableRow.id; //запишем артикул в скрипт 
                    $("#n49").val(tableRow.code + " ÷ " + tableRow.name);
                    $("#n4A").val('');
                }

                let proprodRec = dbset.proprodList.find(rec => proprodID == rec[PROPROD.id]);
                proprodRec[PROPROD.script] = JSON.stringify(winc.obj, (k, v) => isEmpty(v)); //запишем профиль в локальн. бд  
                let winc2 = win.build(winc.cnv, proprodRec[PROPROD.script]);
                order.wincalcMap.set(proprodID, winc2); //новый экз.

                //Запишем профиль в серверную базу данных
                dbset.saveScript = (winc2, proprodID);

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
                //Стеклопакет
                if (artikl.dialogType == 1) {
                    for (let i = 0; i < product.artiklArr.length; i++) {
                        let tr = product.artiklArr[i];
                        table.jqGrid('addRowData', i + 1, {
                            id: tr[ARTIKL.id], code: tr[ARTIKL.code], name: tr[ARTIKL.name]
                        });
                    }

                    //Ручка
                } else if (artikl.dialogType == 2) {
                    let pkSet = new Set();
                    let artiklArr = dbset.artiklList.filter(rec => rec[ARTIKL.level1] == 2 && rec[ARTIKL.level2] == 11);
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
                        table.jqGrid('addRowData', i + 1, {
                            id: tr[ARTIKL.id], code: tr[ARTIKL.code], name: tr[ARTIKL.name]
                        });
                    }
                    //Подвес
                } else if (artikl.dialogType == 3) {
                   
                    let pkSet = new Set();
                    let artiklArr = dbset.artiklList.filter(rec => rec[ARTIKL.level1] == 2 && rec[ARTIKL.level2] == 12);
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
                        table.jqGrid('addRowData', i + 1, {
                            id: tr[ARTIKL.id], code: tr[ARTIKL.code], name: tr[ARTIKL.name]
                        });
                    }
                    //Замок
                } else if (artikl.dialogType == 4) {
                   
                    let pkSet = new Set();
                    let artiklArr = dbset.artiklList.filter(rec => rec[ARTIKL.level1] == 2 && rec[ARTIKL.level2] == 9);
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
                        table.jqGrid('addRowData', i + 1, {
                            id: tr[ARTIKL.id], code: tr[ARTIKL.code], name: tr[ARTIKL.name]
                        });
                    }                    
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

