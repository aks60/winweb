<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head style="margin: 0; padding: 0;">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="frm/dialog/color.js"></script>
        <title>COLOR</title>
        
        <script type="text/javascript">
            color.resize = function () {
                $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic #centr").width());
                $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic #centr").height() - 20);
                $("#tab2-dic").jqGrid('setGridWidth', $("#dialog-dic #centr2").width());
                $("#tab2-dic").jqGrid('setGridHeight', $("#dialog-dic #centr2").height() - 20);
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    color.resize();
                }).trigger('resize');

                color.init_dialog($("#tab1-dic"), $("#tab2-dic"));
                color.init_table($("#tab1-dic"), $("#tab2-dic"));
                color.load_table($("#tab1-dic"), $("#tab2-dic"))                
            });
            
            window.onload = function () {
                alert('Страница загружена');
                //color.resize();
            };            
        </script>         
    </head>
    <body>
        <div id="centr" style="height: calc(40% - 8px); width: calc(100% - 4px);">
            <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="centr2" style="height: 60%; width: calc(100% - 4px)">
            <table id="tab2-dic"  class="ui-jqgrid-btable"></table>
        </div>
    </body>
</html>
