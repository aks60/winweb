<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head style="margin: 0; padding: 0;">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>KITCARD</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            kitkard.resize = function () {
                $("#tab1-kitcard").jqGrid('setGridWidth', $("#dialog-card #pan2a").width() - 4);
                $("#tab1-kitcard").jqGrid('setGridHeight', $("#dialog-card #pan2a").height() - 24);
                $("#tab2-kitcard").jqGrid('setGridWidth', $("#dialog-card #pan2b").width() - 4);
                $("#tab2-kitcard").jqGrid('setGridHeight', $("#dialog-card #pan2b").height() - 24);
                var width = $('#pan1').width();
                $("#pan1 .field[dx]").each(function (index) {
                    var dx = $(this).attr('dx');
                    $(this).width((width - dx) + 'px');
                });                
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                kitkard.init_dialog($("#tab1-kitcard"), $("#tab2-kitcard"));
                kitkard.init_table($("#tab1-kitcard"), $("#tab2-kitcard"));
                kitkard.load_table($("#tab1-kitcard"), $("#tab2-kitcard"))

                taq_deploy(['#pan1']);
                $("#dialog-card").unbind().bind("dialogresize", function (event, ui) {
                    kitkard.resize();
                });
                kitkard.resize(); //баг?
                kitkard.resize();
            });
//------------------------------------------------------------------------------
            kitkard.init_dialog = function (table1, table2) {
                $("#dialog-card").dialog({
                    title: "Справочник текстур*",
                    width: 800,
                    height: 500,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            kitkard.rec_dialog_save(table2);
                            $(this).dialog("close");
                        },
                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            kitkard.init_table = function (table1, table2) {

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
                        let row_table1 = table1.jqGrid('getRowData', rowid);
                        let kitdetList = dbset.kitdetList.filter(rec => row_table1.id == rec[KITDET.kits_id]);
                        if (kitdetList != undefined) {
                            for (let i = 0; i < kitdetList.length; ++i) {
                                let tr = kitdetList[i];
                                let artiklRec = findef(dbset.artiklList.find(rec => tr[KITDET.artikl_id] == rec[ARTIKL.id]), dbset.artiklList);
                                table2.jqGrid('addRowData', i + 1, {
                                    id: tr[KITDET.id],
                                    code: artiklRec[ARTIKL.code],
                                    name: artiklRec[ARTIKL.name],
                                    color1_id: findef(dbset.colorList.find(rec => tr[KITDET.color1_id] == rec[COLOR.id]), dbset.colorList)[COLOR.name],
                                    color2_id: findef(dbset.colorList.find(rec => tr[KITDET.color2_id] == rec[COLOR.id]), dbset.colorList)[COLOR.name],
                                    color3_id: findef(dbset.colorList.find(rec => tr[KITDET.color3_id] == rec[COLOR.id]), dbset.colorList)[COLOR.name],
                                    unit: tr[KITDET.unit],
                                    flag: tr[KITDET.flag]
                                });
                            }
                        }
                        table2.jqGrid("setSelection", 1);
                    }
                });              
                table2.jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Артикул', 'Название', 'Основная текстура',
                        'Внутренняя текстура', 'Внешняя текстура', 'Ед.изм.', 'Основн.элемент'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'code', width: 20},
                        {name: 'name', width: 120},
                        {name: 'color1_id', width: 60},
                        {name: 'color2_id', width: 60},
                        {name: 'color3_id', width: 60},
                        {name: 'unit', width: 10},
                        {name: 'flag', width: 10}
                    ],
                    ondblClickRow: function (rowId) {
                        kitkard.rec_dialog_save(table2);
                        $("#dialog-card").dialog("close");
                    },
                    onSelectRow: function (rowid) {
                        let row_tab2_kitcard = table2.jqGrid('getRowData', rowid);
                        kits.rec_tab2_kitcard = findef(dbset.artdetList.find(rec => row_tab2_kitcard.id == rec[ARTDET.artikl_id]), dbset.artdetList);
                    }
                });
            }
//------------------------------------------------------------------------------
            kitkard.load_table = function (table1, table2) {
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
            kitkard.rec_dialog_save = function (table2) {
                try {

                } catch (e) {
                    console.error("Ошибка:kitkard.rec_dialog_savee() " + e.message);
                }
            }            
//------------------------------------------------------------------------------
        </script>         
    </head>
    <body>
        <div id="pan1" style="height: 84px; width: calc(100% - 4px);"> 
            <jst id="n21" type='txt' label='Кол.компл.' width='80' width2="40"></jst>
            <jst id="n22" type='btn' label='Основная текстура' width='130' dx="400" click="kits.color_to_kits('n22')"></jst><br>
            <jst id="n23" type='txt' label='Длина' width='80' width2="40"></jst>
            <jst id="n24" type='btn' label='Внутренняя текстура' width='130' dx="400" click="kits.color_to_kits('n24')"></jst><br>
            <jst id="n25" type='txt' label='Ширина' width='80' width2="40"></jst>
            <jst id="n26" type='btn' label='Внешняя текстура' width='130' dx="400" click="kits.color_to_kits('n26')"></jst><br>
        </div>        
        <div id="pan2" style="height: calc(100% - 86px); width: calc(100% - 4px); border: 1px groove #f00;"> 
            <div id="pan2a" style="height: 60%; width: 100%;">
                <table id="tab1-kitcard"  class="ui-jqgrid-btable"></table>  
            </div>
            <div id="pan2b" style="height: 40%; width: 100%;"> 
                <table id="tab2-kitcard"  class="ui-jqgrid-btable"></table>
            </div>
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>

