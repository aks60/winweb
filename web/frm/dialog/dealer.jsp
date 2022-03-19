<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>DEALER</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            function resize() {
                $("#tab-dealer").jqGrid('setGridWidth', $("#dialog-dic #pan-dealer").width());
                $("#tab-dealer").jqGrid('setGridHeight', $("#dialog-dic #pan-dealer").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                    resize();
                });
                init_dialog($("#tab-dealer"));
                init_table($("#tab-dealer"));
                load_table($("#tab-dealer"));
                resize();
            });
//------------------------------------------------------------------------------
            function init_dialog(table) {

                $("#dialog-dic").dialog({
                    title: "Справочник-",
                    width: 500,
                    height: 500,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            debugger;
                            let dealerRow = getSelectedRow($("#tab-dealer"));
                            $('#n25').attr("fk", dealerRow.id);
                            $('#n25').val(dealerRow.partner);
                            $("#dialog-dic").dialog("close");
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
                    colNames: ['id', 'Контрагент', 'Дилер'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'partner', width: 300, sorttype: "text"},
                        {name: 'manager', width: 200, sorttype: "text"}

                    ], ondblClickRow: function (rowid) {
                        let dealerRow = table.jqGrid('getRowData', rowid);
                        $('#n25').attr("fk", dealerRow.id);
                        $('#n25').val(dealerRow.partner);
                    }
                });
            }
//------------------------------------------------------------------------------ 
            function load_table(table) {
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
        <div id="pan-dealer" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-dealer"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>