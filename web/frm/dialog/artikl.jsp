<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>ARTIKL</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            artikl.resize = function () {
                $("#tab-artikl").jqGrid('setGridWidth', $("#dialog-dic").width());
                $("#tab-artikl").jqGrid('setGridHeight', $("#dialog-dic").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-dic").bind("dialogresize", function (event, ui) {
                    artikl.resize();
                });
                artikl.init_dialog($("#tab-artikl"));
                artikl.init_table($("#tab-artikl"))
                artikl.load_table($("#tab-artikl"))
            });
//------------------------------------------------------------------------------
            artikl.init_dialog = function (table) {

                $("#dialog-dic").dialog({
                    title: "Справочник артикулов",
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
                try {
                    let rowid = table.jqGrid('getGridParam', "selrow"); //index профиля из справочника
                    let tableRow = table.jqGrid('getRowData', rowid);  //record справочника
                    let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                    let proprodID = order.rec_table2[PROPROD.id]; //id proprod заказа
                    let proprodRec = dbset.proprodList.find(rec => proprodID == rec[PROPROD.id]);

                    let winc = order.wincalcMap.get(proprodID);
                    let elem = winc.elemList.find(it => it.id == elemID);
                    elem.obj.param = (elem.obj.param == undefined) ? {} : elem.obj.param;

                    //Стеклопакет
                    if (product.buttonSrc == 'n51') {
                        elem.obj.param.artglasID = tableRow.id; //запишем профиль в скрипт
                        $("#n51").val(tableRow.code);
                        $("#n52").val(tableRow.name);

                        //Ручка
                    } else if (product.buttonSrc == 'n45') {
                        elem.obj.param.artiklHandl = tableRow.id; //запишем артикул в скрипт 
                        $("#n45").val(tableRow.code + " ÷ " + tableRow.name);
                        $("#n46").val('');

                        //Подвес
                    } else if (product.buttonSrc == 'n49') {
                        elem.obj.param.artiklLoop = tableRow.id; //запишем артикул в скрипт 
                        $("#n49").val(tableRow.code + " ÷ " + tableRow.name);
                        $("#n4A").val('');

                        //Замок
                    } else if (product.buttonSrc == 'n4B') {
                        elem.obj.param.artiklLock = tableRow.id; //запишем артикул в скрипт 
                        $("#n4B").val(tableRow.code + " ÷ " + tableRow.name);
                        $("#n4C").val('');
                    }

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
                    console.error("Ошибка: artikl.rec_dialog_save() " + e.message);
                }
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
            artikl.load = function (level_1, level_2) {

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
                    $("#tab-artikl").jqGrid('addRowData', i + 1, {
                        id: tr[ARTIKL.id], code: tr[ARTIKL.code], name: tr[ARTIKL.name]
                    });
                }
            }
//------------------------------------------------------------------------------ 
            artikl.load_table = function (table) {
                table.jqGrid('clearGridData', true);
                //Стеклопакет
                if (product.buttonSrc == 'n51') {
                    for (let i = 0; i < product.artiklArr.length; i++) {
                        let tr = product.artiklArr[i];
                        table.jqGrid('addRowData', i + 1, {id: tr[ARTIKL.id], code: tr[ARTIKL.code], name: tr[ARTIKL.name]});
                    }
                    //Ручка
                } else if (product.buttonSrc == 'n45') {
                    artikl.load(2, 11);

                    //Подвес
                } else if (product.buttonSrc == 'n49') {
                    artikl.load(2, 12);

                    //Замок
                } else if (product.buttonSrc == 'n4B') {
                    artikl.load(2, 9);

                }                            
                table.jqGrid("setSelection", 1);
                artikl.resize();
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <table id="tab-artikl"  class="ui-jqgrid-btable"></table> 
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>

