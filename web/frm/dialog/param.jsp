<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SYSPROF</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------            
            function resize() {
                $("#tab-param").jqGrid('setGridWidth', $("#dialog-dic #pan-param").width());
                $("#tab-param").jqGrid('setGridHeight', $("#dialog-dic #pan-param").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                    resize2();
                });
                init_dialog($("#tab-param"));
                init_table($("#tab-param"));
                load_table($("#tab-param"));
                resize2();
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
                            let paramsRec = dbset.paramsList.find(rec => paramsRow.id == rec[PARAMS.id]);
                            let paramDef = paramsRow.id;                            
                            let proprodID = dbrec.proprodRec[PROPROD.id]; //id proprod заказа
                            let winc = dbrec.wincalcMap.get(dbrec.proprodRec[PROPROD.id]);
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
                let params2List = dbset.paramsList.filter(rec => product.groupParam == rec[PARAMS.params_id] && rec[PARAMS.id] != rec[PARAMS.params_id]);
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
        <div id="pan-param" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-param"  class="ui-jqgrid-btable"></table> 
            <div id="dialog-mes" title="Сообщение"></div>
        </div>
    </body>
</html>
