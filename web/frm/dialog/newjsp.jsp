<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>ARTIKL</title>

        <script type="text/javascript">

//------------------------------------------------------------------------------
            $(document).ready(function () {
                init_dialog($("#tab-newjsp"));
                init_table($("#tab-newjsp"))
                load_table($("#tab-newjsp"))
            });
//------------------------------------------------------------------------------
            function init_dialog(table) {

                $("#dialog-dic").dialog({
                    title: "Справочник артикулов",
                    width: 600,
                    height: 400,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
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
                    multiselect: false,
                    autowidth: true,
                    height: "auto",
                    colNames: ['id', 'Код артикула*'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'code', width: 200, sorttype: "text"}

                    ]
                });
            }
//------------------------------------------------------------------------------ 
            function load_table(table) {
                console.log($("#tab-newjsp"));
                for (let i = 0; i < 3; i++) {
                    console.log('name' + i);
                    table.jqGrid('addRowData', i + 1, {
                        id: i,
                        code: 'name' + i
                    });
                }
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <table id="tab-newjsp"  class="ui-jqgrid-btable"></table> 
    </body>
</html>


