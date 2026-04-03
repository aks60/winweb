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
            import {UJson} from './common/uJson.js';
            import {Type, PKjson} from './enums/enums.js';
            import {TFurniture} from './build/making/TFurniture.js';
            import {project} from './frame/project.js';
            import {product} from './frame/product.js';
            import {tree_to_html} from './frame/product.js';

            const LEV1 = ["", "Проф.", "Акс.", "Пог.", "Инс.", "Зап."];
            const LEV2 = ["", "Стекло", "Стеклопакет", "Сеннгвич", "", ""];
            const paramTaq = "<%= request.getParameter("param")%>";
            let artiklSet = new Set(), handlSet = new Set();
            let artiklRow = {};
            const winc = product.winCalc;
            const com5t = product.clickTreeNodeElem;
            const tabArtikl = document.getElementById('tab-artikl');
            $("#dialog-jsp").unbind().bind("dialogresize", (event, ui) => resize());

            function resize() {
                $("#tab-artikl").jqGrid('setGridWidth', $("#dialog-jsp #pan-artikl").width());
                $("#tab-artikl").jqGrid('setGridHeight', $("#dialog-jsp #pan-artikl").height() - 24);
            }
            init_dialog();
            init_table();
            data_set();
            load_table();
            resize();

            function init_dialog() {

                $("#dialog-jsp").dialog({
                    title: "Справочник артикулов",
                    width: 600,
                    height: 500,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            artiklRow = getSelectedRow($(tabArtikl));
                            save_table();
                            $(this).dialog("close");
                        },
                        "Удалить": function () {
                            artiklRow = {id: -3, type: '0/0', code: '@', name: 'virtual'};
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
                    rowNum: -1,
                    colNames: ['id', 'Тип', 'Код артикула', 'Наименование артикула'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'type', width: 60},
                        {name: 'code', width: 160},
                        {name: 'name', width: 380, cellattr: function (rowId, val, rawObject, cm, rdata) {
                                return 'style="white-space: nowrap;"';
                            }}

                    ], ondblClickRow: function (rowid) {
                        artiklRow = getSelectedRow($(tabArtikl));
                        save_table();
                        $("#dialog-jsp").dialog("close");
                    }
                });
            }

            function load_table() {
                $(tabArtikl).jqGrid('clearGridData', true);
                let artiklList = Array.from(artiklSet);

                if ($('#body-jsp title').text() === 'PRODUCT') {
                    if (paramTaq == 'n45' || paramTaq == 'n51') {
                        artiklList.sort((a, b) => a[eArtikl.code].localeCompare(b[eArtikl.code]));
                        for (let i = 0; i < artiklList.length; i++) {
                            let tr = artiklList[i];
                            $(tabArtikl).jqGrid('addRowData', i + 1, {
                                id: tr[eArtikl.id],
                                type: LEV1[tr[eArtikl.level1]] + '/' + tr[eArtikl.level2],
                                code: tr[eArtikl.code],
                                name: tr[eArtikl.name]});
                        }
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

            function data_set() {

                if ($('#body-jsp title').text() === 'PRODUCT') {

                    //Заполнение
                    if (paramTaq === 'n51') {
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

                        //Ручка, петля, замок
                    } else if (paramTaq === 'n45' || paramTaq === 'n49' || paramTaq === 'n4B') {
                        let filterSet = new Set();
                        let furnitureID = com5t.sysfurnRec[eSysfurn.furniture_id];
                        const level2 = (paramTaq === 'n45') ? 11 : (paramTaq === 'n49') ? 12 : 9;
                        let artiklList = eArtikl.list.filter(rec => rec[eArtikl.level1] === 2 && rec[eArtikl.level2] === level2);

                        //Цикл по детализации
                        for (let furndetRec1 of eFurndet.list) { //первый уровень
                            if (furndetRec1[eFurndet.furniture_id1] === furnitureID) {
  //if(furndetRec1[1] === 15512 || furndetRec1[1] === 15513) debugger;
                                //Фильтр по детализации определённого типа определённой фурнитуры
                                if (furndetRec1[eFurndet.furniture_id2] === null) { //НЕ НАБОР
                                    filterSet.add(furndetRec1[eFurndet.artikl_id]);
                                } else { //ЭТО НАБОР
                                    for (let furndetRec2 of eFurndet.list) { //второй уровень
                                        if (furndetRec1[eFurndet.furniture_id2] === furndetRec2[eFurndet.furniture_id1]) {
                                            filterSet.add(furndetRec2[eFurndet.artikl_id]);
                                        }
                                    }
                                }
                            }
                        }
                        for (let id of filterSet) {
                            let artiklRec = artiklList.find(rec => rec[eArtikl.id] === id);
                            if (artiklRec !== undefined) {
                                artiklSet.add(artiklRec);
                            }
                        }
                    }
                }
            }

            function save_table() {
                try {
                    if ($('#body-jsp title').text() == 'PRODUCT') {

                        //Запишем артикл в gson 
                        set_value_gson();

                        //Запишем скрипт в локальн. бд 
                        project.prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => UJson.isEmpty(v));
                        
                        //Запишем скрипт в серверную базу данных
                        $.ajax({
                            url: 'dbset?action=updateScript',
                            data: {param: JSON.stringify(project.prjprodRec)},
                            success: (data) => {
                                if (data.result === 'ok') {

                                    //Запишем текстуру в html
                                    tree_to_html();
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
            
            //Запишем артикл в скрипт
            function set_value_gson() {

                let ID = Number(artiklRow.id);
                
                if (paramTaq === 'n51') {  
                    UJson.updateJsonParam(com5t.gson, ['param', PKjson.artiklID], ID);
                    //Ручка
                } else if (paramTaq === 'n45') {
                    UJson.updateJsonParam(com5t.gson, ['param', PKjson.artiklHand], ID);
                    //Подвес
                } else if (paramTaq === 'n49') {
                    UJson.updateJsonParam(com5t.gson, ['param', PKjson.artiklLoop], ID);
                    //Замок
                } else if (paramTaq === 'n4B') {
                    UJson.updateJsonParam(com5t.gson, ['param', PKjson.artiklLock], ID);
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

