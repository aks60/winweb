<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="js/dialog/sysprof.js"></script>
        <title>SYSPROF</title>
        
        <script type="text/javascript">
            win.sysprof.resize = function () {
                $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic #centr").width());
                $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic #centr").height());
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    win.sysprof.resize();
                }).trigger('resize');

                win.sysprof.init_dialog($("#dialog-dic"));
                win.sysprof.init_table1($("#tab1-dic"))
                win.sysprof.load_table1($("#tab1-dic"))
            });

            win.sysprof.init_dialog($("#tab1-dic"));

        </script>        
    </head>
    <body>
        <div id="centr" style="height: calc(100% - 4px); width: 100%;">
            <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
        </div>
    </body>
</html>
