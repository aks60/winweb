<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head style="margin: 0; padding: 0;">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="js/dialog/color.js"></script>
        <title>COLOR</title>
        
        <script type="text/javascript">
            color.resize = function () {
                $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic #north").width());
                $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic #north").height() - 20);
                $("#tab2-dic").jqGrid('setGridWidth', $("#dialog-dic #south").width());
                $("#tab2-dic").jqGrid('setGridHeight', $("#dialog-dic #south").height() - 20);
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    color.resize();
                }).trigger('resize');

                color.init_dialog($("#dialog-dic"));
                color.init_table1($("#tab1-dic"))
                color.load_table1($("#tab1-dic"))
                color.init_table2($("#tab2-dic"));
                color.load_table2($("#tab2-dic"));
            });
        </script>         
    </head>
    <body>
        <div id="north" style="height: calc(40% - 8px); width: calc(100% - 4px);">
            <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="south" style="height: 60%; width: calc(100% - 4px)">
            <table id="tab2-dic"  class="ui-jqgrid-btable"></table>
        </div>
    </body>
</html>
