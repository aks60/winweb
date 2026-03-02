<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head style="margin: 0; padding: 0;">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>COLOR</title>  
        <script type="module">
            import {Wincalc} from './build/Wincalc.js';
            import {project} from './frame/project.js';
            import {product} from './frame/product.js';

            let groupSet = new Set(); 
            let colorSet = new Set();
            let colorFilter = []; //пример [1009,1009,1200,12380] шаг=2 в цыкле
            let colorNum = "<%= request.getParameter("color")%>";
            let winc = project.wincalcMap.get(project.prjprodRec[ePrjprod.id]);
            let elem = product.clickNodeElem;
            var tab1Color = document.getElementById('tab1-color');
            var tab2Color = document.getElementById('tab2-color');

            function resize() {
                $(tab1Color).jqGrid('setGridWidth', $("#dialog-jsp #pan1-color").width());
                $(tab1Color).jqGrid('setGridHeight', $("#dialog-jsp #pan1-color").height() - 20);
                $(tab2Color).jqGrid('setGridWidth', $("#dialog-jsp #pan2-color").width());
                $(tab2Color).jqGrid('setGridHeight', $("#dialog-jsp #pan2-color").height() - 20);
            }

            $("#dialog-jsp").unbind().bind("dialogresize", function (event, ui) {
                resize();
            });
            init_dialog();
            init_table();
            color_set();
            load1_table();

            function init_dialog() {
                $("#dialog-jsp").dialog({
                    title: "Справочник текстур",
                    width: 400,
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

                $(tab1Color).jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Группы текстур'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'name', width: 360}
                    ],
                    onSelectRow: function (rowid, status, e) {
                        load2_table(rowid);
                    }
                });
                $(tab2Color).jqGrid({
                    datatype: "local",
                    colNames: ['Код', 'Описание текстур'],
                    colModel: [
                        {name: 'id', width: 60, key: true},
                        {name: 'name', width: 340}
                    ],
                    ondblClickRow: function (rowId) {
                        save_table();
                        $("#dialog-jsp").dialog("close");
                    }
                });
                resize();
            }

            function load1_table() {
                $(tab1Color).jqGrid('clearGridData', true);
                if (groupSet.size > 0) {

                    let groupsList = eGroups.list.filter(rec => groupSet.has(rec[eGroups.id]));
                    for (let i = 0; i < groupsList.length; i++) {
                        let tr = groupsList[i];
                        $(tab1Color).jqGrid('addRowData', i + 1, {
                            id: tr[eGroups.id],
                            name: tr[eGroups.name]
                        });
                    }
                }
                //resize();
                $(tab1Color).jqGrid("setSelection", 1);
            }

            function load2_table(rowid) {
                $(tab2Color).jqGrid('clearGridData', true);
                let groupsRow = $(tab1Color).jqGrid('getRowData', rowid);
                let colorList = eColor.list.filter(rec => groupsRow.id == rec[eColor.groups_id]);

                for (let i = 0, k = 0; i < colorList.length; i++) {
                    let colorRec = colorList[i];

                    if (colorFilter.length == 0) {
                        $(tab2Color).jqGrid('addRowData', ++k, {
                            id: colorRec[eColor.id],
                            name: colorRec[eColor.name]
                        });
                    } else {
                        if (colorSet.has(colorRec[eColor.id]))
                            $(tab2Color).jqGrid('addRowData', ++k, {
                                id: colorRec[eColor.id],
                                name: colorRec[eColor.name]
                            });
                    }
                    let rgb = '#' + colorRec[eColor.rgb].toString(16);
                    $(tab2Color).jqGrid('setCell', i + 1, 'id', '', {background: rgb});
                }
                resize();
                $(tab2Color).jqGrid("setSelection", 1);
            }

            //Текстура изделия
            function color_set() {
                try {
                    let systreeRec = eSystree.list.find(rec => winc.nuni == rec[eSystree.id]);
                    var colorEnum =
                            (colorNum === 'n14') ? systreeRec[eSystree.col1] :
                            (colorNum === 'n15') ? systreeRec[eSystree.col2] :
                            systreeRec[eSystree.col3];
                    var indexMark =
                            (colorNum === 'n14') ? eArtdet.mark_c1 :
                            (colorNum === 'n15') ? eArtdet.mark_c2 :
                            eArtdet.mark_c3;
                    colorFilter = (colorEnum === null) ? [] : parserInt(colorEnum);
                    let eColorList = [...eColor.list];

                    //Текстура по фильтрам цветов SYSTREE.COL
                    if (colorFilter.length !== 0) {
                        eColorList.length = 0;
                        for (let colorRec of eColor.list) {
                            for (let i = 0; i < colorFilter.length; i = i + 2) { //текстуры
                                if (colorRec[eColor.id] >= colorFilter[i] && colorRec[eColor.id] <= colorFilter[i + 1]) {
                                    eColorList.push(colorRec);
                                }
                            }
                        }
                    }
                    //Текстура по таблице цветов ARTDET
                    let artiklElem = get_artikl_elem(colorNum, elem.winc);

                    //Все текстуры артикула элемента конструкции
                    for (let artdetRec of eArtdet.list) {
                        if (artdetRec[eArtdet.artikl_id] === artiklElem[eArtikl.id]) {
                            if (artdetRec[indexMark] == '1') { //фильтр стороны  
                                for (let colorRec of eColorList) {

                                    if (colorRec[eColor.groups_id] === artdetRec[eArtdet.color_fk]) { //все текстуры групы (-)color_fk
                                        groupSet.add(colorRec[eColor.groups_id]);
                                        colorSet.add(colorRec[eColor.id]);

                                    } else if (colorRec[eColor.id] === Math.abs(artdetRec[eArtdet.color_fk])) {  //текстура (+)color_fk 
                                        groupSet.add(colorRec[eColor.groups_id]);
                                        colorSet.add(colorRec[eColor.id]);
                                    }
                                }
                            }
                        }
                    }

                } catch (e) {
                    errorLog('Error: color.color_set() ' + e.message);
                }
            }

            function save_table() {
                try {
                    let rowid = $(tab2Color).jqGrid('getGridParam', "selrow"); //index профиля из справочника
                    let colorRow = $(tab2Color).jqGrid('getRowData', rowid); //record справочника

                    //Изделия
                    if ($('#body-jsp title').text() === 'PRODUCT') {

                        if (elem.gson.param === undefined) {
                            elem.gson.param = {};
                        }
                        if (elem.type === 'STV_SIDE') {
                            let sideLayout = ["", "stvorkaBot", "stvorkaRig", "stvorkaTop", "stvorkaLef"][Layout[elem.layout][0]];
                            if (elem.gson.param[sideLayout] === undefined) {
                                elem.gson.param[sideLayout] = {};
                            } 
                        }

                        set_color_gson(winc, colorRow.id); //запишем текстуру в gson

                        //Запишем скрипт в локальн. бд
                        let prjprodRec = ePrjprod.list.find(rec => prjprodID == rec.list[ePrjprod.id]);
                        let cnv = document.getElementById("cnv");
                        prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => isEmpty(v));
                        let winc2 = Wincalc.new(cnv, cnv.offsetWidth, cnv.offsetHeight, prjprodRec[ePrjprod.script]);
                        project.wincalcMap.set(prjprodID, winc2); //новый экз.

                        //Запишем скрипт в серверную базу данных
                        $.ajax({
                            url: 'dbset?action=updateScript',
                            data: {param: JSON.stringify({id: prjprodID, script: prjprodRec[ePrjprod.script]})},
                            success: function (data) {
                                if (data.result == 'ok') {
                                    set_value_html(colorRow.name);
                                } else {
                                    dialogMes('Сообщение', "<p>" + data.result);
                                }
                            },
                            error: function () {
                                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                            }
                        });


                        //Комплекты
                    } else if ($('#body-jsp title').text() === 'KITS') {
                        if (colorNum === 'n53') {
                            $("#n53").val(colorRow.name);
                            $("#n53").attr("fk", colorRow.id);

                        } else if (colorNum === 'n54') {
                            $("#n54").val(colorRow.name);
                            $("#n54").attr("fk", colorRow.id);

                        } else if (colorNum === 'n55') {
                            $("#n55").val(colorRow.name);
                            $("#n55").attr("fk", colorRow.id);
                        }
                    }
                } catch (e) {
                    errorLog('Error: color.rec_dialog_save() ' + e.message);
                }
            }
            
            //Запишем текстуру в html
            function set_value_html(name) {               
                if (colorNum === 'n14')
                    $("#n14").val(name);
                else if (colorNum === 'n15')
                    $("#n15").val(name);
                else if (colorNum === 'n16')
                    $("#n16").val(name);
                else if (colorNum === 'n33')
                    $("#n33").val(name);
                else if (colorNum === 'n34')
                    $("#n34").val(name);
                else if (colorNum === 'n35')
                    $("#n35").val(name);
                else if (colorNum === 'n46')
                    $("#n46").val(name);
                else if (colorNum === 'n4A')
                    $("#n4A").val(name);
                else if (colorNum === 'n4C')
                    $("#n4C").val(name);
                else if (colorNum === 'n53')
                    $("#n53").val(name);
            }

            //Запишем текстуру в скрипт
            function set_color_gson(winc, id) {

                if (colorNum === 'n14')
                    winc.gson.color1 = id;
                else if (colorNum === 'n15')
                    winc.gson.color2 = id;
                else if (colorNum === 'n16')
                    winc.gson.color3 = id;
                else if (colorNum === 'n33')
                    elem.gson.param.colorID1 = id;
                else if (colorNum === 'n34')
                    elem.gson.param.colorID2 = id;
                else if (colorNum === 'n35')
                    elem.gson.param.colorID3 = id;
                else if (colorNum === 'n46')
                    elem.gson.param.colorHandl = id;
                else if (colorNum === 'n4A')
                    elem.gson.param.colorLoop = id;
                else if (colorNum === 'n4C')
                    elem.gson.param.colorLock = id;
                else if (colorNum === 'n53')
                    elem.gson.param.colorGlass = id;
            }

            //Получить артикул элемента конструкции
            function get_artikl_elem(colorNum, elem) {
                if (colorNum === 'n14')
                    return elem.artiklRec;
                else if (colorNum === 'n15')
                    return elem.artiklRec;
                else if (colorNum === 'n16')
                    return elem.artiklRec;
                else if (colorNum === 'n33')
                    return elem.artiklRec;
                else if (colorNum === 'n34')
                    return elem.artiklRec;
                else if (colorNum === 'n35')
                    return elem.artiklRec;
                else if (colorNum === 'n46')
                    return elem.handleRec;
                else if (colorNum === 'n4A')
                    return elem.loopRec;
                else if (colorNum === 'n4C')
                    return elem.lockRec;
                else if (colorNum === 'n53')
                    return elem.artiklRec;
                else
                    return null;
            }

        </script>         
    </head>
    <body>
        <div id="pan1-color" style="height: calc(40% - 8px); width: calc(100% - 4px);">
            <table id="tab1-color"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="pan2-color" style="height: 60%; width: calc(100% - 4px)">
            <table id="tab2-color"  class="ui-jqgrid-btable"></table>
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>

