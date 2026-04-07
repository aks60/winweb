<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SYSPROF</title>

        <script type="module">
            import {Wincalc} from './build/Wincalc.js';
            import {Type, Layout, UseSide, PKjson} from './enums/enums.js';
            import {UJson} from './common/uJson.js';
            import {project} from './frame/project.js';
            import {product} from './frame/product.js';
            import {tree_to_html} from './frame/product.js';
            
            const paramTaq = "<%= request.getParameter("param")%>";
            let sysprofSet = new Set();
            let sysprofRow = {};
            const winc = product.winCalc;
            const com5t = product.clickTreeNodeElem;
            const tabSysprof = document.getElementById('tab-sysprof');
            $("#dialog-jsp").unbind().bind("dialogresize", (event, ui) => resize());

            function resize() {
                $(tabSysprof).jqGrid('setGridWidth', $("#dialog-jsp #pan-sysprof").width());
                $(tabSysprof).jqGrid('setGridHeight', $("#dialog-jsp #pan-sysprof").height() - 24);
            }

            init_dialog();
            init_table();
            data_set();
            load_table();
            resize();

            function init_dialog() {
                $("#dialog-jsp").dialog({
                    title: "Профили системы",
                    width: 450,
                    height: 400,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            sysprofRow = getSelectedRow($(tabSysprof));
                            save_table();
                            $(this).dialog("close");
                        },
                        "Удалить": function () {
                            sysprofRow = {id: -3, side: '', code: '@', name: ''};
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
                $(tabSysprof).jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Сторона', 'Код артикула', 'Наименование артикула'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'side', width: 60, sorttype: "text"},
                        {name: 'code', width: 140, sorttype: "text"},
                        {name: 'name', width: 340, sorttype: "text"}
                    ], ondblClickRow: function (rowid) {
                        sysprofRow = getSelectedRow($(tabSysprof));
                        save_table();
                        $("#dialog-jsp").dialog("close");
                    }
                });
            }

            function load_table() {

                $(tabSysprof).jqGrid('clearGridData', true);
                let sysprofList = Array.from(sysprofSet);
                for (let i = 0; i < sysprofList.length; i++) {
                    let tr = sysprofList[i];
                    let artiklRec = eArtikl.list.find(rec => tr[eSysprof.artikl_id] == rec[eArtikl.id]);
                    $(tabSysprof).jqGrid('addRowData', i + 1, {
                        id: tr[eSysprof.id],
                        side: UseSide.find(tr[eSysprof.use_side]),
                        code: artiklRec[eArtikl.code],
                        name: artiklRec[eArtikl.name]
                    });
                }
                $(tabSysprof).jqGrid("setSelection", 1);
            }

            function data_set() {

                //Коробка, створка
                if (paramTaq === 'n55' || paramTaq === 'n57') {

                    //Цикл по профилям ветки 
                    for (let sysprofRec of eSysprof.list) {
                        //Отфильтруем подходящие по параметрам
                        if (winc.nuni === sysprofRec[eSysprof.systree_id] && com5t.type[1] === sysprofRec[eSysprof.use_type]) {
                            sysprofSet.add(sysprofRec);
                        }
                    }
                    //Сторона коробки
                } else if (paramTaq === 'n31') {
                    //Цикл по профилям ветки 
                    for (let sysprofRec of eSysprof.list) {
                        //Отфильтруем подходящие по параметрам
                        if (winc.nuni === sysprofRec[eSysprof.systree_id] && com5t.type[1] === sysprofRec[eSysprof.use_type]) {
                            let useSideID = sysprofRec[eSysprof.use_side];
                            if (useSideID === com5t.layout[0]
                                    || ((com5t.layout === Layout.BOTT || com5t.layout === Layout.TOP) && useSideID === UseSide.HORIZ[0])
                                    || ((com5t.layout === Layout.RIGHT || com5t.layout === Layout.LEFT) && useSideID === UseSide.VERT[0])
                                    || useSideID === UseSide.ANY[0] || useSideID === UseSide.MANUAL[0]) {

                                sysprofSet.add(sysprofRec);
                            }
                        }
                    }
                }
            }

            function save_table() {

                //Запишем скрипт в gson 
                set_value_gson();

                //Запишем профиль в локальн. бд
                project.prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => UJson.isEmpty(v));

                //Запишем профиль в серверную базу данных
                $.ajax({
                    url: 'dbset?action=updateScript',
                    data: {param: JSON.stringify(project.prjprodRec)},
                    success: function (data) {
                        if (data.result === 'ok') {

                            //Запишем текстуру в html
                            tree_to_html();

                        } else
                            dialogMes('Сообщение', "<p>" + data.result);
                    },
                    error: function () {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                    }
                });
            }

            //Запишем профиль в скрипт
            function set_value_gson() {
                let ID = Number(sysprofRow.id);
                //Коробка
                if (paramTaq === 'n55') {
                    UJson.updateJsonParam(com5t.gson, ['param', PKjson.sysprofID], ID); //запишем профиль в скрипт
                    //Сторона коробки
                } else if (paramTaq === 'n57') {
                    UJson.updateJsonParam(com5t.gson, ['param', PKjson.sysprofID], ID);
                    //Стеклопакет
                } else if (paramTaq === 'n51') {
                    UJson.updateJsonParam(com5t.gson, ['param', PKjson.sysprofID], ID);
                }
            }
        </script>        
    </head>
    <body>
        <div id="pan-sysprof" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-sysprof"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>
