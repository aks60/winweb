<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SYSPROF</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------            
            params.resize = function () {
                $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic #centr").width());
                $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic #centr").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $(window).bind('resize', function () {
                    params.resize();
                }).trigger('resize');

                params.init_dialog($("#dialog-dic"));
                params.init_table1($("#tab1-dic"))
                params.load_table1($("#tab1-dic"))
            });
//------------------------------------------------------------------------------            
            params.init_dialog = function (table) {
                table.dialog({
                    title: "Справочник параметров",
                    width: 400,
                    height: 400,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            let rowid = table.getGridParam('selrow');
                            let paramsRow = table.getRowData(rowid);
                            let proprodID = order.rec_table2[PROPROD.id]; //id proprod заказа
                            let winc = order.wincalcMap.get(order.rec_table2[PROPROD.id]);
                            //let script = order.rec_table2[PROPROD.script];
                            winc.obj.param = (winc.obj.param == undefined) ? {} : winc.obj.param;
                            winc.obj.param.ioknaParam = (winc.obj.param.ioknaParam == undefined) ? [] : winc.obj.param.ioknaParam;
                            winc.obj.param.ioknaParam.push(paramsRow[PARAMS.id]); //запишем профиль в скрипт

                            $.ajax({//запишем профиль в серверную базу данных
                                url: 'dbset?action=saveScript',
                                data: {param: JSON.stringify({id: proprodID, script: JSON.stringify(winc.obj, (k, v) => isEmpty(v))})},
                                success: function (data) {
                                    if (data.result == 'ok') {
                                        //Запишем выбранную запись в тег страницы
                                        $("#n51").val(tableRow.code);
                                        $("#n52").val(tableRow.name);
                                    }
                                },
                                error: function () {
                                    dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере", 168);
                                }
                            });

//            int index = UGui.getIndexRec(tab5);
//            int index2 = UGui.getIndexRec(tab7);
//            if (index != -1) {
//                Record sysprodRec = qSysprod.get(index);
//                String script = sysprodRec.getStr(eSysprod.script);
//                String script2 = UGui.paramdefAdd(script, record.getInt(eParams.id), qParams);
//                sysprodRec.set(eSysprod.script, script2);
//                qSysprod.execsql();
//                iwin().build(script2);
//                UGui.stopCellEditing(tab2, tab3, tab4, tab5, tab7);
//                selectionWinTree();
//                UGui.setSelectedIndex(tab7, index2);

                        },
                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            params.init_table1 = function (table) {
                table.jqGrid({
                    datatype: "local",
                    gridview: true,
                    autowidth: true,
                    height: "auto",
                    colNames: ['id', 'Значение параметра'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'text', width: 400, sorttype: "text"}
                    ], onSelectRow: function (rowid) {
                        let syspar1Row = table.getRowData(rowid);
                        //debugger;
                    }
                });
            }
//------------------------------------------------------------------------------
            params.load_table1 = function (table) {
                table.jqGrid('clearGridData', true);
                let params2List = dbset.paramsList.filter(rec => product.group_param == rec[PARAMS.params_id] && rec[PARAMS.id] != rec[PARAMS.params_id]);
                for (let i = 0; i < params2List.length; i++) {
                    let tr = params2List[i];
                    table.jqGrid('addRowData', i + 1, {
                        id: tr[PARAMS.id],
                        text: tr[PARAMS.text]
                    });
                }
                table.jqGrid("setSelection", 1);
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <div id="centr" style="height: calc(100% - 4px); width: 100%;">
            <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
        </div>
    </body>
</html>
