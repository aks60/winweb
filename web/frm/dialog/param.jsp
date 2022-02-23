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
                    title: "Профили системы",
                    width: 500,
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
                    colNames: ['id', 'Сторона', 'Код артикула', 'Наименование артикула'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'use_side', width: 60, sorttype: "text"},
                        {name: 'artikl_id', width: 80, sorttype: "text"},
                        {name: 'artikl_id', width: 200, sorttype: "text"}
                    ]
                });
            }
//------------------------------------------------------------------------------
            params.load_table1 = function (table) {
                table.jqGrid('clearGridData', true);
                for (let i = 0; i < dbset.sysprofList.length; i++) {
                    let tr = dbset.sysprofList[i];
                    table.jqGrid('addRowData', i + 1, {
                        id: tr[SYSPROF.id],
                        use_side: tr[SYSPROF.use_side],
                        artikl_id: tr[SYSPROF.artikl_id],
                        artikl_id: tr[SYSPROF.artikl_id]
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
