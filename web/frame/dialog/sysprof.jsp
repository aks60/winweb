<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SYSPROF</title>

        <script type="module">
            import {Wincalc} from './build/Wincalc.js';
            import {project} from './frame/project.js';
            import {product} from './frame/product.js';

            const paramTaq = "<%= request.getParameter("param")%>";
            let sysprofSet = new Set();
            const winc = product.winCalc;
            const elem = product.clickNodeElem;
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

                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
                resize();
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
                    let artRec = eArtikl.list.find(rec => tr[eSysprof.artikl_id] == rec.list[eArtikl.id]);
                    $(tabSysprof).jqGrid('addRowData', i + 1, {
                        id: tr[eSysprof.id],
                        side: use_name(tr[eSysprof.use_side]),
                        code: artRec[eArtikl.code],
                        name: artRec[eArtikl.name]
                    });
                }
                $(tabSysprof).jqGrid("setSelection", 1);
            }
            
            function sysprof_set() {
                //Цикл по профилям ветки 
                for (let sysprofRec of eSysprof.list) {
                    //Отфильтруем подходящие по параметрам
                    if (winc.nuni === sysprofRec[eSysprof.systree_id] && Type[elem.type][1] === sysprofRec[eSysprof.use_type]) {
                        let use_side_ID = sysprofRec[eSysprof.use_side];
                        if (use_side_ID === Layout[elem.layout][0]
                                || ((elem.layout === Layout.BOTT || elem.layout === Layout.TOP) && use_side_ID === UseSide.HORIZ[0])
                                || ((elem.layout === Layout.RIGHT || elem.layout === Layout.LEFT) && use_side_ID === UseSide.VERT[0])
                                || use_side_ID === UseSide.ANY[0] || use_side_ID === UseSide.MANUAL[0]) {

                            sysprofSet.add(sysprofRec);
                        }
                    }
                }                
            }

            function save_table() {

                let rowid = $(tabSysprof).jqGrid('getGridParam', "selrow"); //index профиля из справочника
                let tableRec = $(tabSysprof).jqGrid('getRowData', rowid);  //record справочника
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let prjprodID = project.prjprodRec[ePrjprod.id]; //id prjprod заказа

                let winc = project.mapWinc.get(prjprodID);
                let elem = winc.listElem.find(it => it.id == elemID);
                if (elem.gson.param == undefined) {
                    elem.gson.param = {};
                }
                if (elem.type == Type.BOX_SIDE) { //коробка
                    elem.gson.param.sysprofID = tableRec.id; //запишем профиль в скрипт

                } else { //створка       
                    let sideLayout = ["", "stvorkaBot", "stvorkaRig", "stvorkaTop", "stvorkaLef"][Layout[elem.layout][0]];
                    elem.gson.param[sideLayout] = {sysprofID: tableRec.id};
                }

                //Запишем профиль в локальн. бд
                let prjprodRec = ePrjprod.list.find(rec => prjprodID == rec.list[ePrjprod.id]);
                prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => isEmpty(v));
                let iwincalc = Wincalc.new(winc.cnv, winc.cnv.offsetWidth, winc.cnv.offsetHeight, JSON.stringify(winc.gson, (k, v) => isEmpty(v)));
                project.mapWinc.set(prjprodID, iwincalc); //новый экз.

                //Запишем профиль в серверную базу данных
                $.ajax({
                    url: 'dbset?action=updateScript',
                    data: {param: JSON.stringify({id: prjprodID, script: JSON.stringify(winc.gson)})},
                    success: function (data) {
                        if (data.result == 'ok') {
                            $("#n31").val(tableRec.code);
                            $("#n32").val(tableRec.name);
                        } else
                            dialogMes('Сообщение', "<p>" + data.result);
                    },
                    error: function () {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                    }
                });
            }

            let use_name = (v) => {
                for (let k in UseSide) {
                    if (v == UseSide[k][0])
                        return UseSide[k][1];
                }
            };
        </script>        
    </head>
    <body>
        <div id="pan-sysprof" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-sysprof"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>
