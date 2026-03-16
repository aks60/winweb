<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head style="margin: 0; padding: 0;">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>COLOR</title>  
        <script type="module">
            import {Type, Layout, PKjson} from './enums/enums.js';
            import {UCom} from './common/uCom.js';
            import {TFurniture} from './build/making/TFurniture.js';
            import {Wincalc} from './build/Wincalc.js';
            import {project} from './frame/project.js';
            import {product} from './frame/product.js';


            let groupSet = new Set();
            let colorSet = new Set();
            let eColorList = new Array();
            let colorFilter = []; //пример [1009,1009,1200,12380] шаг=2 в цыкле
            const paramTaq = "<%= request.getParameter("param")%>";
            const winc = product.winCalc;
            const elem = product.clickNodeElem;
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
            color_set();
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
            function color_set() {
                try {
                    let colorEnum = null, indexMark = null;
                    let systreeRec = eSystree.list.find(rec => winc.nuni == rec[eSystree.id]);

                    if (['n46', 'n4A', 'n4C', 'n53'].includes(paramTaq)) {
                        colorEnum = null;
                        indexMark = eArtdet.mark_c1;
                    } else if (['n14', 'n33'].includes(paramTaq)) {
                        colorEnum = systreeRec[eSystree.col1];
                        indexMark = eArtdet.mark_c1;
                    } else if (['n15', 'n34'].includes(paramTaq)) {
                        colorEnum = systreeRec[eSystree.col2];
                        indexMark = eArtdet.mark_c2;
                    } else if (['n16', 'n35'].includes(paramTaq)) {
                        colorEnum = systreeRec[eSystree.col3];
                        indexMark = eArtdet.mark_c3;
                    }

                    //Текстура по фильтрам цветов SYSTREE.COL
                    if ([Type.BOX_SIDE, Type.STV_SIDE, Type.IMPOST].includes(elem.type)) {
                        colorFilter = (colorEnum === null) ? [] : parserInt(colorEnum);
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
                    let colorRow = getSelectedRow($(tab2Color)); //row справочника

                    //Изделия
                    if ($('#body-jsp title').text() === 'PRODUCT') {
debugger;
                        //Запишем текстуру в gson 
                        set_value_gson(Number(colorRow.id)); 
                
                        //Переcтройка
                        winc.location();
                        TFurniture.calc(winc);
                        winc.draw();                        

                        //Запишем скрипт в локальн. бд                       
                        project.prjprodRec[ePrjprod.script] = JSON.stringify(winc.gson, (k, v) => isEmpty(v));

                        //Запишем скрипт в серверную базу данных
                        $.ajax({
                            url: 'dbset?action=updateScript',
                            data: {param: JSON.stringify(project.prjprodRec)},
                            success: function (data) {
                                
                                if (data.result === 'ok') {
                                    
                                    //Запишем текстуру в html
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
                        if (paramTaq === 'n53') {
                            $("#n53").val(colorRow.name);
                            $("#n53").attr("fk", colorRow.id);

                        } else if (paramTaq === 'n54') {
                            $("#n54").val(colorRow.name);
                            $("#n54").attr("fk", colorRow.id);

                        } else if (paramTaq === 'n55') {
                            $("#n55").val(colorRow.name);
                            $("#n55").attr("fk", colorRow.id);
                        }
                    }
                } catch (e) {
                    console.error(e.message);
                }
            }

            //Запишем текстуру в html
            function set_value_html(name) {
                if (paramTaq === 'n14')
                    $("#n14").val(name);
                else if (paramTaq === 'n15')
                    $("#n15").val(name);
                else if (paramTaq === 'n16')
                    $("#n16").val(name);
                else if (paramTaq === 'n33')
                    $("#n33").val(name);
                else if (paramTaq === 'n34')
                    $("#n34").val(name);
                else if (paramTaq === 'n35')
                    $("#n35").val(name);
                else if (paramTaq === 'n46')
                    $("#n46").val(name);
                else if (paramTaq === 'n4A')
                    $("#n4A").val(name);
                else if (paramTaq === 'n4C')
                    $("#n4C").val(name);
                else if (paramTaq === 'n53')
                    $("#n53").val(name);
            }

            //Запишем текстуру в скрипт
            function set_value_gson(ID) {

                if (elem.type === Type.STV_SIDE) {
                    let sideStv = ['', PKjson.stvorkaBot, PKjson.stvorkaRig, PKjson.stvorkaTop, PKjson.stvorkaLef][elem.layout[0]];
                    if (paramTaq === 'n33')
                        UCom.setJsonParam(elem.owner.gson, ['param', sideStv, PKjson.colorID1], ID);
                    else if (paramTaq === 'n34')
                        UCom.setJsonParam(elem.owner.gson, ['param', sideStv, PKjson.colorID2], ID);
                    else if (paramTaq === 'n35')
                        UCom.setJsonParam(elem.owner.gson, ['param', sideStv, PKjson.colorID3], ID);
                } else {
                    if (paramTaq === 'n14')
                        winc.gson.color1 = ID;
                    else if (paramTaq === 'n15')
                        winc.gson.color2 = ID;
                    else if (paramTaq === 'n16')
                        winc.gson.color3 = ID;
                    else if (paramTaq === 'n33')
                        UCom.setJsonParam(elem.gson, ['param', PKjson.colorID1], ID);
                    else if (paramTaq === 'n34')
                        UCom.setJsonParam(elem.gson, ['param', PKjson.colorID2], ID);
                    else if (paramTaq === 'n35')
                        UCom.setJsonParam(elem.gson, ['param', PKjson.colorID3], ID);
                    else if (paramTaq === 'n46')
                       UCom.setJsonParam(elem.gson, ['param', PKjson.colorHand], ID);
                    else if (paramTaq === 'n4A')
                        UCom.setJsonParam(elem.gson, ['param', PKjson.colorLoop], ID);
                    else if (paramTaq === 'n4C')
                        UCom.setJsonParam(elem.gson, ['param', PKjson.colorLock], ID);
                    else if (paramTaq === 'n53')
                        UCom.setJsonParam(elem.gson, ['param', PKjson.colorGlass], ID);
                }
            }

            //Получить артикул элемента конструкции
            function get_value_elem() {
                if (paramTaq === 'n14')
                    return elem.artiklRec;
                else if (paramTaq === 'n15')
                    return elem.artiklRec;
                else if (paramTaq === 'n16')
                    return elem.artiklRec;
                else if (paramTaq === 'n33')
                    return elem.artiklRec;
                else if (paramTaq === 'n34')
                    return elem.artiklRec;
                else if (paramTaq === 'n35')
                    return elem.artiklRec;
                else if (paramTaq === 'n46')
                    return elem.handRec[0];
                else if (paramTaq === 'n4A')
                    return elem.loopRec[0];
                else if (paramTaq === 'n4C')
                    return elem.lockRec[0];
                else if (paramTaq === 'n53')
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

