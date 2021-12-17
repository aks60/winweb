<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="js/kits.js"></script> 
        <title>JSP Page</title>
        <script type="text/javascript">
            kits.resize = function () {
                $("#table1").jqGrid('setGridWidth', $("#centr").width());
                $("#table1").jqGrid('setGridHeight', $("#centr").height() - 28);
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    kits.resize();
                }).trigger('resize');
            });
        </script>         
    </head>
    <body>
        <div id="nord" style="height: 20px">>
            NORD
        </div>
        <div id="centr"  style="height: auto">
            <table id="table1"  class="ui-jqgrid-btable"></table> 
            <script type="text/javascript">
                kits.init_table1($("#table1"));
                kits.load_table1($("#table1"));
            </script>  
        </div>
        <div id="south" style="height: 20px">>
            SOUTH 
        </div>

    </body>
</html>
