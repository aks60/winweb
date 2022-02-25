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
                            params.resize();
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
                    ]
                });
            }
//------------------------------------------------------------------------------
            params.load_table1 = function (table) {
                table.jqGrid('clearGridData', true);
                for (let i = 0; i < dbset.paramsList.length; i++) {
                    let tr = dbset.paramsList[i];
                    table.jqGrid('addRowData', i + 1, {
                        id: tr[PARAMS.id],
                        text: tr[PARAMS.text]
                    });
                }
                //sysprof.resize();
                //setTimeout(function () {sysprof.resize();}, 500);
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
