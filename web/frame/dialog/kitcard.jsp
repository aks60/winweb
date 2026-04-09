<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>KITCARD</title>
        <script type="module">

            import {Wincalc} from './build/Wincalc.js';
            import {project} from './frame/project.js';
            import {product} from './frame/product.js';
            import {kits, load_table as load_kits} from './frame/kits.js';
            
            let kitdetList = null;
            const winc = product.winCalc;
            const tab1Kitcard = document.getElementById('tab1-kitcard');
            const tab2Kitcard = document.getElementById('tab2-kitcard');
            $("#dialog-jsp").unbind().bind("dialogresize", (event, ui) => resize());
            
            function resize() {
                $("#tab1-kitcard").jqGrid('setGridWidth', $("#dialog-jsp #pan1-kitcard").width());
                $("#tab1-kitcard").jqGrid('setGridHeight', $("#dialog-jsp #pan1-kitcard").height() - 24);
                $("#tab2-kitcard").jqGrid('setGridWidth', $("#dialog-jsp #pan2-kitcard").width());
                $("#tab2-kitcard").jqGrid('setGridHeight', $("#dialog-jsp #pan2-kitcard").height() - 24);
            }

            init_dialog();
            init_table();
            load_table();
            resize();

            function init_dialog() {
                $("#dialog-jsp").dialog({
                    title: "Справочник  комплектов",
                    width: 500,
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
                $(tab1Kitcard).jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Категория', 'Название комплекта'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'categ', width: 100},
                        {name: 'name', width: 240}
                    ],
                    onSelectRow: function (rowid) {
                        $(tab2Kitcard).jqGrid("clearGridData", true);
                        
                        let kitsRow = $(tab1Kitcard).jqGrid('getRowData', rowid);
                        kitdetList = eKitdet.list.filter(rec => Number(kitsRow.id) === rec[eKitdet.kits_id]);
                        if (kitdetList.length !== 0) {
                            for (let i = 0; i < kitdetList.length; ++i) {
                                let kitdetRec = kitdetList[i];
                                let artiklRec = findef(kitdetRec[eKitdet.artikl_id], eArtikl.id, eArtikl);
                                
                                $(tab2Kitcard).jqGrid('addRowData', i + 1, {
                                    id: kitdetRec[eKitdet.id],
                                    code: artiklRec[eArtikl.code],
                                    name: artiklRec[eArtikl.name],
                                    color1_id: findef(kitdetRec[eKitdet.color1_id], eColor.id, eColor)[eColor.name],
                                    unit: kitdetRec[eKitdet.unit]
                                });
                            }
                        }
                        $(tab2Kitcard).jqGrid("setSelection", 1);
                    }
                });
                $(tab2Kitcard).jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Артикул', 'Название', 'Текстура', 'Ед.изм.'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'code', width: 60},
                        {name: 'name', width: 180},
                        {name: 'color1_id', width: 80},
                        {name: 'unit', width: 40}
                    ]
                });
            }

            function load_table() {
                $(tab1Kitcard).jqGrid('clearGridData', true);
                $(tab2Kitcard).jqGrid('clearGridData', true);
                
                for (let i = 0; i < eKits.list.length; i++) {
                    let kitsRec = eKits.list[i];
                    
                    $(tab1Kitcard).jqGrid('addRowData', i + 1, {
                        id: kitsRec[eKits.id],
                        categ: eGroups.list.find(rec => rec[eGroups.id] === kitsRec[eKits.groups_id])[eGroups.name],
                        name: kitsRec[eKits.name]
                    });
                }
                $(tab1Kitcard).jqGrid("setSelection", 1);
            }

            function save_table() {
                try {
                        let prjkitList = new Array();
                        for (let kitdetRec of kitdetList) { 
                            let prjkitRec = [...ePrjkit.vrec];
                            prjkitRec[ePrjkit.artikl_id] = kitdetRec[eKitdet.color1_id];
                            prjkitRec[ePrjkit.color2_id] = kitdetRec[eKitdet.color2_id];
                            prjkitRec[ePrjkit.color1_id] = kitdetRec[eKitdet.color3_id];
                            prjkitRec[ePrjkit.artikl_id] = kitdetRec[eKitdet.artikl_id];
                            prjkitRec[ePrjkit.project_id] = project.projectRec[eProject.id];
                            prjkitRec[ePrjkit.prjprod_id] = project.prjprodRec[ePrjprod.id];
                            prjkitList.push(prjkitRec);
                        }
                        $.ajax({//запишем комплект в серверную базу данных
                            url: 'dbset?action=insertKits',
                            data: {param: JSON.stringify(prjkitList)},   
                            success: (data) => {
                                if (data.result == 'ok') {
                                    for (let record of data.prjkitList) {
                                        ePrjkit.list.push(record);
                                    }                                
                                } else {
                                    dialogMes('Сообщение', "<p>" + data.result);
                                }
                                load_kits();
                            },
                            error: () => {
                                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                            }
                        });
                } catch (e) {
                    console.error(e.message);
                }
            }
        </script>         
    </head>
    <body>       
        <div id="pan1-kitcard" style="height: calc(60% - 8px); width: calc(100% - 4px);">
            <table id="tab1-kitcard"  class="ui-jqgrid-btable"></table>  
        </div>
        <div id="pan2-kitcard" style="height: 40%; width: calc(100% - 4px)"> 
            <table id="tab2-kitcard"  class="ui-jqgrid-btable"></table>
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>

