<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head style="margin: 0; padding: 0;">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>KITCARD</title>
        <script type="text/javascript">
//------------------------------------------------------------------------------
            var kitdetList = null;
//------------------------------------------------------------------------------
            function resize() {
                $("#tab1-kitcard").jqGrid('setGridWidth', $("#dialog-dic #pan1-kitcard").width() - 4);
                $("#tab1-kitcard").jqGrid('setGridHeight', $("#dialog-dic #pan1-kitcard").height() - 24);
                $("#tab2-kitcard").jqGrid('setGridWidth', $("#dialog-dic #pan2-kitcard").width() - 4);
                $("#tab2-kitcard").jqGrid('setGridHeight', $("#dialog-dic #pan2-kitcard").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                init_dialog($("#tab1-kitcard"), $("#tab2-kitcard"));
                init_table($("#tab1-kitcard"), $("#tab2-kitcard"));
                load_table($("#tab1-kitcard"), $("#tab2-kitcard"));

                $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                    resize();
                });
                resize();
            });
//------------------------------------------------------------------------------
            function init_dialog(table1, table2) {
                $("#dialog-dic").dialog({
                    title: "Справочник  комплектов",
                    width: 500,
                    height: 500,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            save_table(table2);
                            $(this).dialog("close");
                        },
                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            function init_table(table1, table2) {
                table1.jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Категория', 'Название компдекта'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'categ', width: 100},
                        {name: 'name', width: 240}
                    ],
                    onSelectRow: function (rowid) {
                        table2.jqGrid("clearGridData", true);
                        let kitsRow = table1.jqGrid('getRowData', rowid);
                        kitdetList = dbset.kitdetList.filter(rec => kitsRow.id == rec.list[eKitdet.kits_id]);
                        if (kitdetList != undefined) {
                            for (let i = 0; i < kitdetList.length; ++i) {
                                let tr = kitdetList[i];
                                let artiklRec = findef(tr[eKitdet.artikl_id], ARTIKL.id, dbset.artikl);
                                table2.jqGrid('addRowData', i + 1, {
                                    id: tr[eKitdet.id],
                                    code: artiklRec[eArtikl.code],
                                    name: artiklRec[eArtikl.name],
                                    color1_id: findef(tr[eKitdet.color1_id], COLOR.id, dbset.color)[eColor.name],
                                    unit: tr[eKitdet.unit]
                                });
                            }
                        }
                        table2.jqGrid("setSelection", 1);
                    }
                });
                table2.jqGrid({
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
//------------------------------------------------------------------------------
            function load_table(table1, table2) {
                table1.jqGrid('clearGridData', true);
                table2.jqGrid('clearGridData', true);
                for (let i = 0; i < dbset.kitsList.length; i++) {
                    let tr = dbset.kitsList[i].list;
                    table1.jqGrid('addRowData', i + 1, {
                        id: tr[KITS.id],
                        categ: tr[KITS.categ],
                        name: tr[KITS.name]
                    });
                }
                table1.jqGrid("setSelection", 1);
            }
            ;
//------------------------------------------------------------------------------
            function save_table(table2) {
                try {
                    for (let kitdetRec of kitdetList) {                       
                        $.ajax({ //запишем комплект в серверную базу данных
                            url: 'dbset?action=insertKits',
                            data: {
                                param: JSON.stringify({
                                    color1_id: kitdetRec[eKitdet.color1_id],
                                    color2_id: kitdetRec[eKitdet.color2_id],
                                    color3_id: kitdetRec[eKitdet.color3_id],
                                    artikl_id: kitdetRec[eKitdet.artikl_id],
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
                } catch (e) {
                    console.error('Error: kitcard.save_table() ' + e.message);
                }
            }
//------------------------------------------------------------------------------
        </script>         
    </head>
    <body>       
        <div id="pan1-kitcard" style="height: calc(40% - 8px); width: calc(100% - 4px);">
            <table id="tab1-kitcard"  class="ui-jqgrid-btable"></table>  
        </div>
        <div id="pan2-kitcard" style="height: 60%; width: calc(100% - 4px)"> 
            <table id="tab2-kitcard"  class="ui-jqgrid-btable"></table>
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>

