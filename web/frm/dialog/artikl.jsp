<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="frm/dialog/artikl.js"></script>
        <title>ARTIKL</title>
        
        <script type="text/javascript">
            artikl.resize = function () {
                $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic #centr").width());
                $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic #centr").height() - 24);
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    artikl.resize();
                }).trigger('resize');

                artikl.init_dialog($("#dialog-dic"));
                artikl.init_table1($("#tab1-dic"))
                artikl.load_table1($("#tab1-dic"))
            });
            
        </script>        
    </head>
    <body>
        <div id="centr" style="height: calc(100% - 4px); width: 100%;">
            <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
        </div>
    </body>
</html>

