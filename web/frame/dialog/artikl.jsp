<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>ARTIKL</title>
        <style>
            .no-wrap {
                white-space: nowrap;
            }
        </style>
        <script type="module">
            import {Wincalc} from './build/Wincalc.js';
            import {UCom} from './common/uCom.js';
            import {Type, PKjson} from './enums/enums.js';
            import {project} from './frame/project.js';
            import {product} from './frame/product.js';

            //var LEV1 = ["", "Проф.", "Акс.", "Пог.", "Инс.", "Зап."];
            const paramTaq = "<%= request.getParameter("param")%>";
            let artiklSet = new Set();
            const winc = product.winCalc;
            const elem = product.clickNodeElem;
            const tabArtikl = document.getElementById('tab-artikl');
            $("#dialog-jsp").unbind().bind("dialogresize", (event, ui) => resize());

            function resize() {
                $("#tab-artikl").jqGrid('setGridWidth', $("#dialog-jsp #pan-artikl").width());
                $("#tab-artikl").jqGrid('setGridHeight', $("#dialog-jsp #pan-artikl").height() - 24);
            }
            init_dialog();
            init_table();
            artikl_set();
            load_table();
            resize();

            function  init_dialog() {
                
                $("#dialog-jsp").dialog({
                    title: "Справочник артикулов",
                    width: 600,
                    height: 500,
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

                //TODO При сортировки столбца часть данных пропадает
                $(tabArtikl).jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Тип', 'Код артикула', 'Наименование артикула'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'type', width: 24, sortable: false},
                        {name: 'code', width: 160, sortable: false},
                        {name: 'name', width: 380, sortable: false}

                    ], ondblClickRow: function (rowid) {
                        save_table();
                        $("#dialog-jsp").dialog("close");
                    }
                });
            }

            function load_table() {
                $(tabArtikl).jqGrid('clearGridData', true);
                let artiklList = Array.from(artiklSet);               

                if ($('#body-jsp title').text() === 'PRODUCT') {
                    
                    if (paramTaq == 'n51') {
                        artiklList.sort((a, b) => a[eArtikl.code].localeCompare(b[eArtikl.code]));
                        //Стеклопакет 
                        for (let i = 0; i < artiklList.length; i++) {
                            let tr = artiklList[i];
                            $(tabArtikl).jqGrid('addRowData', i + 1, {
                                id: tr[eArtikl.id],
                                type: tr[eArtikl.level1] + '/' + tr[eArtikl.level2],
                                code: tr[eArtikl.code],
                                name: tr[eArtikl.name]});
                        }
                        //Ручка
                    } else if (paramTaq == 'n45') {
                        load2_table(2, 11);

                        //Подвес
                    } else if (paramTaq == 'n49') {
                        load2_table(2, 12);

                        //Замок
                    } else if (paramTaq == 'n4B') {
                        load2_table(2, 9);

                    }

                } else if ($('#body-jsp title').text() == 'KITS') {
                    for (let i = 0; i < eArtikl.list.length; i++) {
                        let tr = eArtikl.list[i];
                        $(tabArtikl).jqGrid('addRowData', i + 1, {
                            id: tr[eArtikl.id],
                            type: LEV1[tr[eArtikl.level1]],
                            code: tr[eArtikl.code],
                            name: tr[eArtikl.name]});
                    }
                }
                $(tabArtikl).jqGrid("setSelection", 1);
            }

            function artikl_set() {

                if (elem.type == Type.GLASS) {

                    let systreeRec = eSystree.list.find(rec => winc.nuni === rec[eSystree.id]);
                    if (systreeRec != undefined) {
                        let depth = systreeRec[eSystree.depth];
                        depth = depth.replace(/;/g, ',');
                        if (depth.charAt(depth.length - 1) === ',') {
                            depth = depth.substring(0, depth.length - 1);
                        }
                        depth = depth.split(',');
                        let artiklList = eArtikl.list.filter(rec =>
                            rec[eArtikl.depth] != undefined
                                    && rec[eArtikl.level1] === 5
                                    && [1, 2, 3].includes(rec[eArtikl.level2])
                                    && depth.includes(rec[eArtikl.depth].toString())
                        );
                        artiklList.forEach(rec => artiklSet.add(rec));
                    }
                }
            }

            function save_table() {
                try {
                    if ($('#body-jsp title').text() == 'PRODUCT') {
                        let rowid = $(tabArtikl).jqGrid('getGridParam', "selrow"); //index профиля из справочника
                        let artiklRow = $(tabArtikl).jqGrid('getRowData', rowid);  //record справочника
                        let prjprodID = project.prjprodRec[ePrjprod.id]; //id prjprod заказа
                        elem.artiklRec = eArtikl.find(artiklRow.id, false); //артикул
                        elem.artiklRecAn = eArtikl.find(artiklRow.id, true); //аналог       }

                        set_value_gson(Number(artiklRow.id));

                        //Запишем скрипт в локальн. бд 
                        project.prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => isEmpty(v));
                        let iwincalc = Wincalc.new(winc.cnv, winc.cnv.offsetWidth, winc.cnv.offsetHeight, project.prjprodRec[ePrjprod.script]);
                        project.mapWinc.set(prjprodID, iwincalc); //новый экз.

                        //Запишем скрипт в серверную базу данных
                        $.ajax({
                            url: 'dbset?action=updateScript',
                            data: {param: JSON.stringify(project.prjprodRec)},
                            success: (data) => {
                                if (data.result === 'ok') {

                                    set_value_html(artiklRow);
                                }
                            },
                            error: () => {
                                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                            }
                        });


                    } else if ($('#body-jsp title').text() == 'KITS') {
                        let artiklRow = getSelectedRow($(tabArtikl));
                        let artiklRec = eArtikl.list.find(rec => artiklRow.id == rec[eArtikl.id]);

                        if (kits.buttonSrc === 'n51' || kits.buttonSrc == 'n52') {
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
                                        prjprod_id: project.prjprodRec[ePrjprod.id]
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
                                        ePrjkit.list.push(record);
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
                    console.error('Error: save_table() ' + e.message);
                }
            }

            function  load2_table(level_1, level_2) {

                let pkSet = new Set();
                let artiklArr = eArtikl.list.filter(rec => rec[eArtikl.level1] == level_1 && rec[eArtikl.level2] == level_2);
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let prjprodID = project.prjprodRec[ePrjprod.id]; //id prjprod заказа
                let winc = project.mapWinc.get(prjprodID);
                let elem = winc.listElem.find(it => it.id == elemID);
                for (let furndetRec1 of eFurndet.list) {
                    if (furndetRec1[eFurndet.furniture_id1] == elem.sysfurnRec[eSysfurn.furniture_id]) {

                        if (furndetRec1[eFurndet.furniture_id2] == null) { //НЕ НАБОР                                
                            pkSet.add(furndetRec1[eFurndet.artikl_id]);
                        } else {
                            for (let furndetRec2 of eFurndet.list) {
                                if (furndetRec1[eFurndet.furniture_id2] == furndetRec2[eFurndet.furniture_id1]) {
                                    pkSet.add(furndetRec2[eFurndet.artikl_id]);
                                }
                            }
                        }
                    }
                }
                let artiklList = artiklArr.filter(rec => pkSet.has(rec[eArtikl.id]));
                for (let i = 0; i < artiklList.length; i++) {
                    let tr = artiklList[i];
                    $("#tab-artikl").jqGrid('addRowData', i + 1, {
                        id: tr[eArtikl.id],
                        type: LEV1[tr[eArtikl.level1]],
                        code: tr[eArtikl.code],
                        name: tr[eArtikl.name]
                    });
                }
            }

            //Запишем артикл в скрипт
            function set_value_gson(ID) {
                //Стеклопакет
                if (paramTaq === 'n51') {
                    UCom.setJsonParam(elem.gson, ['param', PKjson.artglasID], ID); //запишем артикл в скрипт
                    //Ручка
                } else if (paramTaq === 'n45') {
                    UCom.setJsonParam(elem.gson, ['param', PKjson.artiklHandl], ID); //запишем артикл в скрипт
                    //Подвес
                } else if (paramTaq === 'n49') {
                    UCom.setJsonParam(elem.gson, ['param', PKjson.artiklLoop], ID); //запишем артикл в скрипт
                    //Замок
                } else if (paramTaq === 'n4B') {
                    UCom.setJsonParam(elem.gson, ['param', PKjson.artiklLock], ID); //запишем артикл в скрипт
                }
            }

            //Запишем артикул в html
            function set_value_html(artiklRow) {
                //Стеклопакет
                if (paramTaq === 'n51') {
                    $("#n51").val(artiklRow.code);
                    $("#n52").val(artiklRow.name);

                    //Ручка
                } else if (paramTaq === 'n45') {
                    $("#n45").val(artiklRow.code + " ÷ " + artiklRow.name);
                    $("#n46").val('');

                    //Подвес
                } else if (paramTaq === 'n49') {
                    $("#n49").val(artiklRow.code + " ÷ " + artiklRow.name);
                    $("#n4A").val('');

                    //Замок
                } else if (paramTaq === 'n4B') {
                    $("#n4B").val(artiklRow.code + " ÷ " + artiklRow.name);
                    $("#n4C").val('');
                }
            }
        </script>        
    </head>
    <body>
        <div id="pan-artikl" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-artikl"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>

