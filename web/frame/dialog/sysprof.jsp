<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SYSPROF</title>

        <script type="module">
            import {Wincalc} from './build/Wincalc.js';
            import {Type, Layout, UseSide, PKjson} from './enums/enums.js';
            import {UCom} from './common/uCom.js';
            import {project} from './frame/project.js';
            import {product} from './frame/product.js';

            const paramTaq = "<%= request.getParameter("param")%>";
            let sysprofSet = new Set();
            const winc = product.winCalc;
            const elem = product.clickTreeNodeElem;
            const tabSysprof = document.getElementById('tab-sysprof');
            $("#dialog-jsp").unbind().bind("dialogresize", (event, ui) => resize());

            function resize() {
                $(tabSysprof).jqGrid('setGridWidth', $("#dialog-jsp #pan-sysprof").width());
                $(tabSysprof).jqGrid('setGridHeight', $("#dialog-jsp #pan-sysprof").height() - 24);
            }

            init_dialog();
            init_table();
            sysprof_set();
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
                            save_table();
                            $(this).dialog("close");
                        },
                        "По умолчанию": function () {
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

            function sysprof_set() {
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
                        //artiklList.foEach(it => )
                    }
                } else {
                    //Цикл по профилям ветки 
                    for (let sysprofRec of eSysprof.list) {
                        //Отфильтруем подходящие по параметрам
                        if (winc.nuni === sysprofRec[eSysprof.systree_id] && elem.type[1] === sysprofRec[eSysprof.use_type]) {
                            let useSideID = sysprofRec[eSysprof.use_side];
                            if (useSideID === elem.layout[0]
                                    || ((elem.layout === Layout.BOTT || elem.layout === Layout.TOP) && useSideID === UseSide.HORIZ[0])
                                    || ((elem.layout === Layout.RIGHT || elem.layout === Layout.LEFT) && useSideID === UseSide.VERT[0])
                                    || useSideID === UseSide.ANY[0] || useSideID === UseSide.MANUAL[0]) {

                                sysprofSet.add(sysprofRec);
                            }
                        }
                    }
                }
            }

            function save_table() {

                let rowid = $(tabSysprof).jqGrid('getGridParam', "selrow"); //index профиля из справочника
                let sysprofRow = $(tabSysprof).jqGrid('getRowData', rowid);  //record справочника               

                //Запишем скрипт в gson 
                set_value_gson(sysprofRow);
                winc.location();

                //Запишем профиль в локальн. бд
                project.prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => isEmpty(v));

                //Запишем профиль в серверную базу данных
                $.ajax({
                    url: 'dbset?action=updateScript',
                    data: {param: JSON.stringify(project.prjprodRec)},
                    success: function (data) {
                        if (data.result === 'ok') {
                            $("#n31").val(elem.artiklRec[eArtikl.code]);
                            $("#n32").val(elem.artiklRec[eArtikl.name]);
                            $("#n36").val((elem.artiklRec[eArtikl.analog_id] === null) ? '' : elem.artiklRecAn[eArtikl.code]);
                        } else
                            dialogMes('Сообщение', "<p>" + data.result);
                    },
                    error: function () {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                    }
                });
            }

            //Запишем профиль в скрипт
            function set_value_gson(sysprofRow) {
                
                if (elem.type == Type.BOX_SIDE) { //коробка
                    UCom.setJsonParam(elem.gson, ['param', PKjson.sysprofID], sysprofRow.id); //запишем профиль в скрипт
                    
                } else if (elem.type == Type.STV_SIDE) { //створка 
                    let sideStv = ["", PKjson.stvorkaBot, PKjson.stvorkaRig, PKjson.stvorkaTop, PKjson.stvorkaLef][elem.layout[0]];
                    UCom.setJsonParam(elem.owner.gson, ['param', sideStv, PKjson.sysprofID], sysprofRow.id);
                    
                } else if (elem.type == Type.GLASS) {

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
