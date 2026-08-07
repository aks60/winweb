<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>DEALER</title>

        <script type="module">
            import {login} from './frame/login.js';

            let tabDealer = document.getElementById('tab-dealer');

            function resize() {
                $(tabDealer).jqGrid('setGridWidth', $("#dialog-jsp #pan-dealer").width());
                $(tabDealer).jqGrid('setGridHeight', $("#dialog-jsp #pan-dealer").height() - 24);
            }

            init_dialog();
            init_table();
            load_table();
            $(window).unbind('resize').bind('resize', resize).trigger('resize');

            function init_dialog() {

                $("#dialog-jsp").dialog({
                    title: "Справочник",
                    width: 500,
                    height: 500,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            let dealerRow = getSelectedRow($(tabDealer));
                            $('#p26').val(dealerRow.partner);
                            $('#p26').attr("fk", dealerRow.ID);
                            $("#dialog-jsp").dialog("close");
                        },
                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }

            function init_table() {

                $(tabDealer).jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Заказчик', 'User'],
                    colModel: [
                        {name: 'ID', hidden: true},
                        {name: 'partner', width: 300, sorttype: "text"},
                        {name: 'login', width: 200, sorttype: "text"}

                    ], ondblClickRow: function (rowid) {
                        let dealerRow = getSelectedRow($(tabDealer));
                        $('#p26').val(dealerRow.partner);
                        $('#p26').attr("fk", dealerRow.ID);
                        $("#dialog-jsp").dialog("close");
                    }
                });
            }

            function load_table() {
                for (let i = 0; i < ePrjpart.list.length; i++) {
                    let dealerRec = ePrjpart.list[i];
                    if (login.login === dealerRec[ePrjpart.login]) {
                        $(tabDealer).jqGrid('addRowData', i + 1, {
                            ID: dealerRec[ePrjpart.id],
                            partner: dealerRec[ePrjpart.partner],
                            login: dealerRec[ePrjpart.login]});
                    }
                }
                $(tabDealer).jqGrid("setSelection", 1);
            }

        </script>        
    </head>
    <body>
        <div id="pan-dealer" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-dealer"  class="ui-jqgrid-btable"></table> 
        </div>
    </body>
</html>