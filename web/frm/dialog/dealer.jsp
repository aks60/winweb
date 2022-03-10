<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>DEALER</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            dealer.resize = function () {
                $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic").width() - 12);
                $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $(window).bind('resize', function () {
                    dealer.resize();
                }).trigger('resize');

                dealer.init_dialog($("#tab1-dic"));
                dealer.init_table($("#tab1-dic"))
                dealer.load_table($("#tab1-dic"))
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
                            dealer.row_tab1_dic = table.jqGrid('getRowData', rowid);
                            $('#n25').val(dealer.row_tab1_dic.manager);
                            $(this).dialog("close");
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
                    multiselect: false,
                    autowidth: true,
                    height: "auto",
                    colNames: ['id', 'Контрагент', 'Дилер'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'partner', width: 300, sorttype: "text"},
                        {name: 'manager', width: 200, sorttype: "text"}

                    ], ondblClickRow: function (rowid) {
                        let rowid = table.jqGrid('getGridParam', "selrow");
                        dealer.row_tab1_dic = table.jqGrid('getRowData', rowid);
                        $('#n25').val(dealer.row_tab1_dic.manager);
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
                setTimeout(() => artikl.resize(), 10);
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>