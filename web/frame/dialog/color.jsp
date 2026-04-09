<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>COLOR</title>  
        <script type="module">
            import {Type, Layout, PKjson} from './enums/enums.js';
            import {UJson} from './common/uJson.js';
            import {TFurniture} from './build/making/TFurniture.js';
            import {project} from './frame/project.js';
            import {product} from './frame/product.js';
            import {kits} from './frame/kits.js';
            import {tree_to_html} from './frame/product.js';

            let groupSet = new Set();
            let colorSet = new Set();
            let eColorList = new Array();
            let colorFilter = []; //пример [1009,1009,1200,12380] шаг=2 в цыкле
            let colorRow = {};
            const paramTaq = "<%= request.getParameter("param")%>";
            const winc = product.winCalc;
            const com5t = product.clickTreeNodeElem;
            const tab1Color = document.getElementById('tab1-color');
            const tab2Color = document.getElementById('tab2-color');
            $("#dialog-jsp").unbind().bind("dialogresize", (event, ui) => resize());
            
            function resize() {
                $(tab1Color).jqGrid('setGridWidth', $("#dialog-jsp #pan1-color").width());
                $(tab1Color).jqGrid('setGridHeight', $("#dialog-jsp #pan1-color").height() - 20);
                $(tab2Color).jqGrid('setGridWidth', $("#dialog-jsp #pan2-color").width());
                $(tab2Color).jqGrid('setGridHeight', $("#dialog-jsp #pan2-color").height() - 20);
            }
            init_dialog();
            init_table();
            data_set();
            load1_table();
            resize();

            function init_dialog() {
                $("#dialog-jsp").dialog({
                    title: "Справочник текстур",
                    width: 400,
                    height: 500,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            colorRow = getSelectedRow($(tab2Color));
                            save_table();
                            $(this).dialog("close");
                        },
                        "Удалить": function () {
                            colorRow = {id: -3, name: ''};
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
                        colorRow = getSelectedRow($(tab2Color));
                        save_table();
                        $("#dialog-jsp").dialog("close");
                    }
                });
            }

            function load1_table() {
                $(tab1Color).jqGrid('clearGridData', true);
                if (groupSet.size > 0) {
                    let groupsList = eGroups.list.filter(rec => groupSet.has(rec[eGroups.id]));
                    groupsList.forEach((tr, i) => {

                        $(tab1Color).jqGrid('addRowData', i + 1, {
                            id: tr[eGroups.id],
                            name: tr[eGroups.name]
                        });
                    });
                }
                $(tab1Color).jqGrid("setSelection", 1);
            }

            function load2_table(rowid) {
                $(tab2Color).jqGrid('clearGridData', true);
                let groupsRow = $(tab1Color).jqGrid('getRowData', rowid);
                let colorList = eColorList.filter(rec => groupsRow.id == rec[eColor.groups_id] && colorSet.has(rec[eColor.id]));
                colorList.forEach((tr, i) => {

                    $(tab2Color).jqGrid('addRowData', i + 1, {
                        id: tr[eColor.id],
                        name: tr[eColor.name]
                    });
                    let rgb = '#' + tr[eColor.rgb].toString(16);
                    $(tab2Color).jqGrid('setCell', i + 1, 'id', '', {background: rgb});
                });
                $(tab2Color).jqGrid("setSelection", 1);
            }

            //Текстура изделия
            function data_set() {
              
                try {
                    let colorTxt = null, indexMark = null;
                    let systreeRec = eSystree.list.find(rec => winc.nuni == rec[eSystree.id]);

                    if (['n46', 'n4A', 'n4C', 'n53', 'k53'].includes(paramTaq)) {
                        indexMark = eArtdet.mark_c1;
                    } else if(paramTaq === 'k54')  {
                        indexMark = eArtdet.mark_c2; 
                    } else if(paramTaq === 'k55')  {
                        indexMark = eArtdet.mark_c3; 
                    } else if (['n14', 'n33', 'n60'].includes(paramTaq)) {
                        colorTxt = systreeRec[eSystree.col1];
                        indexMark = eArtdet.mark_c1;
                    } else if (['n15', 'n34', 'n61'].includes(paramTaq)) {
                        colorTxt = systreeRec[eSystree.col2];
                        indexMark = eArtdet.mark_c2;
                    } else if (['n16', 'n35', 'n62'].includes(paramTaq)) {
                        colorTxt = systreeRec[eSystree.col3];
                        indexMark = eArtdet.mark_c3;
                    }

                    //Текстура по фильтрам цветов SYSTREE.COL
                    if (['n46', 'n4A', 'n4C', 'n53', 'n65'].includes(paramTaq) === false) {
                        colorFilter = (colorTxt === null) ? [] : parserInt(colorTxt);
                        if (colorFilter.length !== 0) {
                            for (let colorRec of eColor.list) {
                                for (let i = 0; i < colorFilter.length; i = i + 2) { //текстуры
                                    if (colorRec[eColor.id] >= colorFilter[i] && colorRec[eColor.id] <= colorFilter[i + 1]) {
                                        eColorList.push(colorRec);
                                    }
                                }
                            }
                        }
                    }
                    if (eColorList.length === 0) { //если фильтра нет
                        eColorList = eColor.list;
                    }

                    //Артикул элемента
                    let artiklElem = get_value_elem();

                    //Текстура по таблице цветов ARTDET                                                                        
                    for (let artdetRec of eArtdet.list) { //все текстуры артикула элемента конструкции                     
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
                    console.error(e.message);
                }
            }

            function save_table() {
                try {
                    //Изделия
                    if ($('#body-jsp title').text() === 'PRODUCT') {

                        //Запишем текстуру в gson 
                        set_value_gson();

                        //Запишем скрипт в локальн. бд                       
                        project.prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => UJson.isEmpty(v));

                        //Запишем скрипт в серверную базу данных
                        $.ajax({
                            url: 'dbset?action=updateScript',
                            data: {param: JSON.stringify(project.prjprodRec)},
                            success: function (data) {

                                if (data.result === 'ok') {

                                    //Запишем текстуру в html
                                    tree_to_html();

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
                        if (paramTaq === 'k53') {
                            $("#k53").val(colorRow.name);
                            $("#k53").attr("fk", colorRow.id);

                        } else if (paramTaq === 'k54') {
                            $("#k54").val(colorRow.name);
                            $("#k54").attr("fk", colorRow.id);

                        } else if (paramTaq === 'k55') {
                            $("#k55").val(colorRow.name);
                            $("#k55").attr("fk", colorRow.id);
                        }                       
                    }
                } catch (e) {
                    console.error(e.message);
                }
            }

            //Запишем текстуру в скрипт
            function set_value_gson() {
                
                let ID = Number(colorRow.id);

                if (com5t.type === Type.STV_SIDE) {
                    let sideStv = ['', PKjson.stvorkaBot, PKjson.stvorkaRig, PKjson.stvorkaTop, PKjson.stvorkaLef][com5t.layout[0]];
                    if (paramTaq === 'n33') {
                        UJson.updateJsonParam(com5t.owner.gson, ['param', sideStv, PKjson.colorID1], ID);
                    } else if (paramTaq === 'n34') {
                        UJson.updateJsonParam(com5t.owner.gson, ['param', sideStv, PKjson.colorID2], ID);
                    } else if (paramTaq === 'n35') {
                        UJson.updateJsonParam(com5t.owner.gson, ['param', sideStv, PKjson.colorID3], ID);
                    }
                } else {
                    if (['n14', 'n33', 'n60', 'n65'].includes(paramTaq)) {
                        UJson.updateJsonParam(com5t.gson, ['param', PKjson.colorID1], ID);
                    } else if (['n15', 'n34', 'n61'].includes(paramTaq)) {
                        UJson.updateJsonParam(com5t.gson, ['param', PKjson.colorID2], ID);
                    } else if (['n16', 'n35', 'n62'].includes(paramTaq)) {
                        UJson.updateJsonParam(com5t.gson, ['param', PKjson.colorID3], ID);
                    } else if (paramTaq === 'n46') {
                        UJson.updateJsonParam(com5t.gson, ['param', PKjson.colorHand], ID);
                    } else if (paramTaq === 'n4A') {
                        UJson.updateJsonParam(com5t.gson, ['param', PKjson.colorLoop], ID);
                    } else if (paramTaq === 'n4C') {
                        UJson.updateJsonParam(com5t.gson, ['param', PKjson.colorLock], ID);
                    } else if (paramTaq === 'n53') {
                        UJson.updateJsonParam(com5t.gson, ['param', PKjson.colorID1], ID);
                    }
                }
            }

            //Получить артикул элемента конструкции
            function get_value_elem() {
                if (paramTaq === 'n14')
                    return com5t.artiklRec;
                else if (paramTaq === 'n15')
                    return com5t.artiklRec;
                else if (paramTaq === 'n16')
                    return com5t.artiklRec;
                else if (paramTaq === 'n33')
                    return com5t.artiklRec;
                else if (paramTaq === 'n34')
                    return com5t.artiklRec;
                else if (paramTaq === 'n35')
                    return com5t.artiklRec;
                else if (paramTaq === 'n46')
                    return com5t.handRec[0];
                else if (paramTaq === 'n4A')
                    return com5t.loopRec[0];
                else if (paramTaq === 'n4C')
                    return com5t.lockRec[0];
                else if (paramTaq === 'n53')
                    return com5t.artiklRec;
                else if (paramTaq === 'n60')
                    return com5t.artiklRec;
                else if (paramTaq === 'n61')
                    return com5t.artiklRec;
                else if (paramTaq === 'n62')
                    return com5t.artiklRec;
                else if (paramTaq === 'n65')
                    return com5t.artiklRec;
                else if (paramTaq === 'k53')
                    return eArtikl.list.find(rec => rec[eArtikl.id] === kits.prjkitRec[ePrjkit.artikl_id]);
                else if (paramTaq === 'k54')
                    return eArtikl.list.find(rec => rec[eArtikl.id] === kits.prjkitRec[ePrjkit.artikl_id]);
                else if (paramTaq === 'k55')
                    return eArtikl.list.find(rec => rec[eArtikl.id] === kits.prjkitRec[ePrjkit.artikl_id]);
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

