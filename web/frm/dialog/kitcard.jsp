<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head style="margin: 0; padding: 0;">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>KITCARD</title>
        <script type="text/javascript">
//------------------------------------------------------------------------------
            function resize2() {
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
                    resize2();
                });
                resize2();
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
                            rec_dialog_save(table2);
                            kits.load_table($("#table1"));
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
                        dbset.kitdetList = dbset.kitdetList.filter(rec => kitsRow.id == rec[KITDET.kits_id]);
                        if (dbset.kitdetList != undefined) {
                            for (let i = 0; i < dbset.kitdetList.length; ++i) {
                                let tr = dbset.kitdetList[i];
                                let artiklRec = findef(dbset.artiklList.find(rec => tr[KITDET.artikl_id] == rec[ARTIKL.id]), dbset.artiklList);
                                table2.jqGrid('addRowData', i + 1, {
                                    id: tr[KITDET.id],
                                    code: artiklRec[ARTIKL.code],
                                    name: artiklRec[ARTIKL.name],
                                    color1_id: findef(dbset.colorList.find(rec => tr[KITDET.color1_id] == rec[COLOR.id]), dbset.colorList)[COLOR.name],
                                    unit: tr[KITDET.unit]
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
                    let tr = dbset.kitsList[i];
                    table1.jqGrid('addRowData', i + 1, {
                        id: tr[KITS.id],
                        categ: tr[KITS.categ],
                        name: tr[KITS.name]
                    });
                }
                table1.jqGrid("setSelection", 1);
            };
//------------------------------------------------------------------------------
            function rec_dialog_save(table2) {
                //try {
                for (let kitdetRec of dbset.kitdetList) {
                    //Запишем заказ в серверную базу данных
                    $.ajax({
                        url: 'dbset?action=insertKits',
                        data: {
                            param: JSON.stringify({
                                color1_id: kitdetRec[KITDET.color1_id],
                                color2_id: kitdetRec[KITDET.color2_id],
                                color3_id: kitdetRec[KITDET.color3_id],
                                artikl_id: kitdetRec[KITDET.artikl_id],
                                proprod_id: dbrec.proprodRec[PROPROD.id]
                            })
                        },
                        success: (data) => {
                            if (data.result == 'ok') {
                                let record = new Array(13);
                                record[0] = 'SEL';
                                record[PROKIT.id] = data.prokitRec[PROKIT.id];
                                record[PROKIT.numb] = data.prokitRec[PROKIT.numb];
                                record[PROKIT.width] = data.prokitRec[PROKIT.width];
                                record[PROKIT.height] = data.prokitRec[PROKIT.height];
                                record[PROKIT.color1_id] = data.prokitRec[PROKIT.color1_id];
                                record[PROKIT.color2_id] = data.prokitRec[PROKIT.color2_id];
                                record[PROKIT.color3_id] = data.prokitRec[PROKIT.color3_id];
                                record[PROKIT.artikl_id] = data.prokitRec[KITDET.artikl_id];
                                record[PROKIT.proprod_id] = data.prokitRec[PROPROD.id];
                                kits.prokitList.push(record);
                            } else {
                                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                            }
                        },
                        error: () => {
                            dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                        }
                    });
                }
                //} catch (e) {
                //    console.error("Ошибка:kitcard.rec_dialog_save() " + e.message);
                //}                
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

