<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>PARAM</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------            
            function resize() {
                $("#tab-param").jqGrid('setGridWidth', $("#dialog-dic #pan-param").width());
                $("#tab-param").jqGrid('setGridHeight', $("#dialog-dic #pan-param").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                    resize();
                });
                init_dialog($("#tab-param"));
                init_table($("#tab-param"));
                load_table($("#tab-param"));
                resize();
            });
//------------------------------------------------------------------------------            
            function init_dialog(table) {
                $("#dialog-dic").dialog({
                    title: "Справочник параметров",
                    width: 400,
                    height: 400,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            let rowid = table.jqGrid('getGridParam', "selrow");
                            let paramsRow = table.jqGrid('getRowData', rowid);
                            let paramsRec = eParams.list.find(rec => paramsRow.id == rec.list[eParams.id]);
                            let paramDef = paramsRow.id;                            
                            let prjprodID = order.prjprodRec[ePrjprod.id]; //id prjprod заказа
                            let winc = order.wincalcMap.get(order.prjprodRec[ePrjprod.id]);
                            let titleID1 = paramsRec[eParams.params_id];
                            winc.gson.param = (winc.gson.param == undefined) ? {} : winc.gson.param;
                            winc.gson.param.ioknaParam = (winc.gson.param.ioknaParam == undefined) ? [] : winc.gson.param.ioknaParam;
                            for(let i = 0; i < winc.gson.param.ioknaParam.length; ++i) {
                                
                              let titleID2 = eParams.list.find(rec => winc.gson.param.ioknaParam[i] == rec.list[eParams.id])[eParams.params_id];
                              if(titleID1 == titleID2) {
                                  winc.gson.param.ioknaParam.splice(i, 1);
                              }
                            }
                            winc.gson.param.ioknaParam.push(parseInt(paramDef)); //запишем профиль в скрипт
                            
                            $.ajax({//запишем профиль в серверную базу данных
                                url: 'dbset?action=updateScript',
                                data: {param: JSON.stringify({id: prjprodID, script: JSON.stringify(winc.gson, (k, v) => isEmpty(v))})},
                                success: function (data) {
                                    if (data.result == 'ok') {
                                        winc.root.init_pardef_map();
                                        product.load_table($('#table1'));
                                    } else 
                                        dialogMes('Сообщение', "<p>" + data.result);
                                },
                                error: function () {
                                    dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
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
            function init_table(table) {
                table.jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Значение параметра'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'text', width: 400, sorttype: "text"}
                    ], onSelectRow: function (rowid) {
                        let syspar1Row = table.jqGrid('getRowData', rowid);
                    }
                });
            }
//------------------------------------------------------------------------------
            function load_table(table) {
                table.jqGrid('clearGridData', true);
                let params2List = eParams.list.filter(rec => product.groupParam == rec.list[eParams.params_id] && rec.list[eParams.id] != rec.list[eParams.params_id]);
                for (let i = 0; i < params2List.length; i++) {
                    let tr = params2List[i];
                    table.jqGrid('addRowData', i + 1, {
                        id: tr[eParams.id],
                        text: tr[eParams.text]
                        //text: tr[eParams.params_id]
                    });
                }
                table.jqGrid("setSelection", 1);
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <div id="pan-param" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-param"  class="ui-jqgrid-btable"></table> 
            <div id="dialog-mes" title="Сообщение"></div>
        </div>
    </body>
</html>
