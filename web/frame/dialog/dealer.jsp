<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>DEALER</title>

        <script type="module">

            let tabDealer = document.getElementById('tab-dealer');

            function resize() {
                $(tabDealer).jqGrid('setGridWidth', $("#dialog-dic #pan-dealer").width());
                $(tabDealer).jqGrid('setGridHeight', $("#dialog-dic #pan-dealer").height() - 24);
            }
            $("#dialog-dic").unbind().bind("dialogresize", (event, ui) => resize());
            
            init_dialog();
            init_table();
            load_table();
            resize();

            function init_dialog() {

                $("#dialog-dic").dialog({
                    title: "Справочник-",
                    width: 500,
                    height: 500,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            let dealerRow = getSelectedRow($(tabDealer));
                            $('#n25').val(dealerRow.partner);
                            $('#n25').attr("fk", dealerRow.id);
                            $("#dialog-dic").dialog("close");
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
                    colNames: ['id', 'Контрагент', 'Дилер'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'partner', width: 300, sorttype: "text"},
                        {name: 'manager', width: 200, sorttype: "text"}

                    ], ondblClickRow: function (rowid) {
                        let dealerRow = getSelectedRow($(tabDealer));
                        $('#n25').val(dealerRow.partner);
                        $('#n25').attr("fk", dealerRow.id);
                        $("#dialog-dic").dialog("close");
                    }
                });
            }

            function load_table() {
                for (let i = 0; i < eDealer.list.length; i++) {
                    let tr = eDealer.list[i];
                    $(tabDealer).jqGrid('addRowData', i + 1, {
                        id: tr[eDealer.id],
                        partner: tr[eDealer.partner],
                        manager: tr[eDealer.login]});
                }
                $(tabDealer).jqGrid("setSelection", 1);
            }

        </script>        
    </head>
    <body>
        <div id="pan-dealer" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-dealer"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>