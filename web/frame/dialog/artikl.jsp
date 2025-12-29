<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>ARTIKL</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            var TYPE = ["", "Профили", "Аксессуары", "Погонаж", "Инструмент", "Заполнения"];
//------------------------------------------------------------------------------            
            function resize() {
                $("#tab-artikl").jqGrid('setGridWidth', $("#dialog-dic #pan-artikl").width());
                $("#tab-artikl").jqGrid('setGridHeight', $("#dialog-dic #pan-artikl").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                    resize();
                });
                init_dialog($("#tab-artikl"));
                init_table($("#tab-artikl"))
                load_table($("#tab-artikl"))
                resize();
            });
//------------------------------------------------------------------------------
            function  init_dialog(table) {

                $("#dialog-dic").dialog({
                    title: "Справочник артикулов",
                    width: 600,
                    height: 500,
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
                    colNames: ['id', 'Тип', 'Код артикула', 'Наименование артикула'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'type', width: 84, sorttype: "text"},
                        {name: 'code', width: 180, sorttype: "text"},
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

                if ($('#outbody title').text() == 'PRODUCT') {
                    //Стеклопакет
                    if (product.buttonSrc == 'n51') {
                        for (let i = 0; i < product.artiklArr.length; i++) {
                            let tr = product.artiklArr[i];
                            table.jqGrid('addRowData', i + 1, {
                                id: tr[eArtikl.id],
                                type: TYPE[tr[eArtikl.level1]],
                                code: tr[eArtikl.code],
                                name: tr[eArtikl.name]});
                        }
                        //Ручка
                    } else if (product.buttonSrc == 'n45') {
                        load2_table(2, 11);

                        //Подвес
                    } else if (product.buttonSrc == 'n49') {
                        load2_table(2, 12);

                        //Замок
                    } else if (product.buttonSrc == 'n4B') {
                        load2_table(2, 9);

                    }

                } else if ($('#outbody title').text() == 'KITS') {
                    for (let i = 0; i < dbset.artiklList.length; i++) {
                        let tr = dbset.artiklList[i];
                        table.jqGrid('addRowData', i + 1, {
                            id: tr[eArtikl.id],
                            type: TYPE[tr[eArtikl.level1]],
                            code: tr[eArtikl.code],
                            name: tr[eArtikl.name]});
                    }
                }
                table.jqGrid("setSelection", 1);
            }
//------------------------------------------------------------------------------
            function save_table(table) {
                try {
                    if ($('#outbody title').text() == 'PRODUCT') {

                        let rowid = table.jqGrid('getGridParam', "selrow"); //index профиля из справочника
                        let tableRow = table.jqGrid('getRowData', rowid);  //record справочника
                        let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                        let prjprodID = order.prjprodRec[ePrjprod.id]; //id prjprod заказа
                        let prjprodRec = dbset.prjprodList.find(rec => prjprodID == rec.list[ePrjprod.id]);

                        let winc = order.wincalcMap.get(prjprodID);
                        let elem = winc.listElem.find(it => it.id == elemID);
                        elem.gson.param = (elem.gson.param == undefined) ? {} : elem.gson.param;

                        //Стеклопакет
                        if (product.buttonSrc == 'n51') {
                            elem.gson.param.artglasID = tableRow.id; //запишем профиль в скрипт
                            $("#n51").val(tableRow.code);
                            $("#n52").val(tableRow.name);

                            //Ручка
                        } else if (product.buttonSrc == 'n45') {
                            elem.gson.param.artiklHandl = tableRow.id; //запишем артикул в скрипт 
                            $("#n45").val(tableRow.code + " ÷ " + tableRow.name);
                            $("#n46").val('');

                            //Подвес
                        } else if (product.buttonSrc == 'n49') {
                            elem.gson.param.artiklLoop = tableRow.id; //запишем артикул в скрипт 
                            $("#n49").val(tableRow.code + " ÷ " + tableRow.name);
                            $("#n4A").val('');

                            //Замок
                        } else if (product.buttonSrc == 'n4B') {
                            elem.gson.param.artiklLock = tableRow.id; //запишем артикул в скрипт 
                            $("#n4B").val(tableRow.code + " ÷ " + tableRow.name);
                            $("#n4C").val('');
                        }

                        //Запишем скрипт в локальн. бд 
                        prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => isEmpty(v));
                        let winc2 = win.build(winc.cnv, prjprodRec[ePrjprod.script]);
                        order.wincalcMap.set(prjprodID, winc2); //новый экз.

                        //Запишем скрипт в серверную базу данных
                        $.ajax({
                            url: 'dbset?action=updateScript',
                            data: {param: JSON.stringify({id: prjprodID, script: JSON.stringify(winc.gson, (k, v) => isEmpty(v))})},
                            success: (data) => {
                                if (data.result != 'ok')
                                    dialogMes('Сообщение', "<p>" + data.result);
                            },
                            error: () => {
                                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                            }
                        });


                    } else if ($('#outbody title').text() == 'KITS') {
                        let artiklRow = getSelectedRow(table);
                        let artiklRec = dbset.artiklList.find(rec => artiklRow.id == rec.list[eArtikl.id]);

                        if (kits.buttonSrc == 'n51' || kits.buttonSrc == 'n52') {
                            $("#n51").val(artiklRow.code);
                            $("#n52").val(artiklRow.name);
                            $("#n51").attr("fk", artiklRow.id);
                            $("#n52").attr("fk", artiklRow.id);
                            
                            
                        } else {
                            $.ajax({//запишем комплект в серверную базу данных
                                url: 'dbset?action=insertKits',
                                data: {
                                    param: JSON.stringify({
                                        color1_id: artiklRec[eArtikl.color1_id],
                                        color2_id: artiklRec[eArtikl.color2_id],
                                        color3_id: artiklRec[eArtikl.color3_id],                        
                                        artikl_id: artiklRec[eArtikl.id],
                                        prjprod_id: order.prjprodRec[ePrjprod.id]
                                    })
                                },
                                success: (data) => {
                                    if (data.result == 'ok') {
                                        let record = new Array(13);
                                        record[0] = 'SEL';
                                        record[ePrjkit.id] = data.prjkitRec[ePrjkit.id];
                                        record[ePrjkit.numb] = data.prjkitRec[ePrjkit.numb];
                                        record[ePrjkit.width] = data.prjkitRec[ePrjkit.width];
                                        record[ePrjkit.height] = data.prjkitRec[ePrjkit.height];
                                        record[ePrjkit.color1_id] = data.prjkitRec[ePrjkit.color1_id];
                                        record[ePrjkit.color2_id] = data.prjkitRec[ePrjkit.color2_id];
                                        record[ePrjkit.color3_id] = data.prjkitRec[ePrjkit.color3_id];
                                        record[ePrjkit.artikl_id] = data.prjkitRec[ePrjkit.artikl_id];
                                        record[ePrjkit.prjprod_id] = data.prjkitRec[ePrjkit.prjprod_id];
                                        dbset.prjkitList.push(record);
                                    } else {
                                        dialogMes('Сообщение', "<p>" + data.result);
                                    }
                                    kits.load_table($("#table1"));
                                },
                                error: () => {
                                    dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                                }
                            });
                        }
                    }

                } catch (e) {
                    console.error('Error: artikl.rec_dialog_save() ' + e.message);
                }
            }
//------------------------------------------------------------------------------
            function  load2_table(level_1, level_2) {

                let pkSet = new Set();
                let artiklArr = dbset.artiklList.filter(rec => rec.list[eArtikl.level1] == level_1 && rec.list[eArtikl.level2] == level_2);
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let prjprodID = order.prjprodRec[ePrjprod.id]; //id prjprod заказа
                let winc = order.wincalcMap.get(prjprodID);
                let elem = winc.listElem.find(it => it.id == elemID);
                for (let furndetRec1 of dbset.furndetList) {
                    if (furndetRec1[eFurndet.furniture_id1] == elem.sysfurnRec[eSysfurn.furniture_id]) {

                        if (furndetRec1[eFurndet.furniture_id2] == null) { //НЕ НАБОР                                
                            pkSet.add(furndetRec1[eFurndet.artikl_id]);
                        } else {
                            for (let furndetRec2 of dbset.furndetList) {
                                if (furndetRec1[eFurndet.furniture_id2] == furndetRec2[eFurndet.furniture_id1]) {
                                    pkSet.add(furndetRec2[eFurndet.artikl_id]);
                                }
                            }
                        }
                    }
                }
                let artiklList = artiklArr.filter(rec => pkSet.has(rec.list[eArtikl.id]));
                for (let i = 0; i < artiklList.length; i++) {
                    let tr = artiklList[i];
                    $("#tab-artikl").jqGrid('addRowData', i + 1, {
                        id: tr[eArtikl.id],
                        type: TYPE[tr[eArtikl.level1]],
                        code: tr[eArtikl.code],
                        name: tr[eArtikl.name]
                    });
                }
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <div id="pan-artikl" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-artikl"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>

