<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>DEALER</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            dealer.resize = function () {
                $("#tab-dealer").jqGrid('setGridWidth', $("#dialog-dic #centr").width());
                $("#tab-dealer").jqGrid('setGridHeight', $("#dialog-dic #centr").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                    dealer.resize();
                });
                dealer.init_dialog($("#tab-dealer"));
                dealer.init_table($("#tab-dealer"));
                dealer.load_table($("#tab-dealer"));
                dealer.resize();
            });
//------------------------------------------------------------------------------
            dealer.init_dialog = function (table) {

                $("#dialog-dic").dialog({
                    title: "Справочник-",
                    width: 500,
                    height: 500,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            let rowid = table.jqGrid('getGridParam', "selrow");
                            dealer.row_tab1dic = table.jqGrid('getRowData', rowid);
                            $('#n25').val(dealer.row_tab1dic.partner);
                            $("#dialog-dic").dialog("close");
                        },
                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            dealer.init_table = function (table) {

                table.jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Контрагент', 'Дилер'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'partner', width: 300, sorttype: "text"},
                        {name: 'manager', width: 200, sorttype: "text"}

                    ], ondblClickRow: function (rowid) {
                        dealer.row_tab1dic = table.jqGrid('getRowData', rowid);
                        $('#n25').val(dealer.row_tab1dic.partner);
                        $("#dialog-dic").dialog("close");
                    }
                });
            }
//------------------------------------------------------------------------------ 
            dealer.load_table = function (table) {
                for (let i = 0; i < dbset.dealerList.length; i++) {
                    let tr = dbset.dealerList[i];
                    table.jqGrid('addRowData', i + 1, {
                        id: tr[DEALER.id],
                        partner: tr[DEALER.partner],
                        manager: tr[DEALER.manager]});
                }
                table.jqGrid("setSelection", 1);
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <div id="centr" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-dealer"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>