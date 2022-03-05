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

                params.init_dialog($("#tab1-dic"));
                params.init_table1($("#tab1-dic"));
                params.load_table1($("#tab1-dic"));
            });
//------------------------------------------------------------------------------            
            params.init_dialog = function (table) {
                $("#dialog-dic").dialog({
                    title: "Справочник параметров",
                    width: 400,
                    height: 400,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            let rowid = table.getGridParam('selrow');
                            let paramsRow = table.getRowData(rowid);
                            let paramsRec = dbset.paramsList.find(rec => paramsRow.id == rec[PARAMS.id]);
                            let paramDef = paramsRow.id;                            
                            let proprodID = order.rec_table2[PROPROD.id]; //id proprod заказа
                            let winc = order.wincalcMap.get(order.rec_table2[PROPROD.id]);
                            let titleID1 = paramsRec[PARAMS.params_id];
                            winc.obj.param = (winc.obj.param == undefined) ? {} : winc.obj.param;
                            winc.obj.param.ioknaParam = (winc.obj.param.ioknaParam == undefined) ? [] : winc.obj.param.ioknaParam;
                            for(let i = 0; i < winc.obj.param.ioknaParam.length; ++i) {
                                
                              let titleID2 = dbset.paramsList.find(rec => winc.obj.param.ioknaParam[i] == rec[PARAMS.id])[PARAMS.params_id];
                              if(titleID1 == titleID2) {
                                  winc.obj.param.ioknaParam.splice(i, 1);
                              }
                            }
                            winc.obj.param.ioknaParam.push(parseInt(paramDef)); //запишем профиль в скрипт
                            
                            $.ajax({//запишем профиль в серверную базу данных
                                url: 'dbset?action=updateScript',
                                data: {param: JSON.stringify({id: proprodID, script: JSON.stringify(winc.obj, (k, v) => isEmpty(v))})},
                                success: function (data) {
                                    if (data.result == 'ok') {
                                        winc.root.init_pardef_map();
                                        product.load_table($('#table1'));
                                    }
                                },
                                error: function () {
                                    dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере", 168);
                                }
                            });
                            $(this).dialog("close");
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
                        //text: tr[PARAMS.params_id]
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
            <div id="dialog-mes" title="Сообщение"></div>
        </div>
    </body>
</html>
