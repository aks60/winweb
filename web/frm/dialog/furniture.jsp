<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="frm/dialog/furniture.js"></script>
        <title>FURNITURE</title>

        <script type="text/javascript">

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic").width());
                    $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic").height() - 24);
                }).trigger('resize');

                furniture.init_dialog($("#tab1-dic"));
                furniture.init_table($("#tab1-dic"))
                furniture.load_table($("#tab1-dic"))
            });

        </script>        
    </head>
    <body>
        <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
    </body>
</html>

