<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="js/kits.js"></script> 
        <title>JSP Page</title>

        <script type="text/javascript">
            kits.resize = function () {
                var height = window.innerHeight - 146;
                $("#centr").css("height", height);
                $("#table1").jqGrid('setGridWidth', $("#centr").width());
                $("#table1").jqGrid('setGridHeight', $("#centr").height() - 26);
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    kits.resize();
                }).trigger('resize');
            });
        </script>         
    </head>
    <body>
        <div id="north" style=" height: 20px; width: 100%;">
            NORTH
        </div>
        <!--<div id="midl" style="position: relative;">-->                
            <div id="centr" style="width: 100%;">
                <table id="tab1-color"  class="ui-jqgrid-btable"></table> 
                <script type="text/javascript">
                    kits.init_table1($("#table1"));
                    kits.load_table1($("#table1"));
                </script>  
            </div>          
        <!--</div>-->
        <div id="south" style="height: 20px; width: 100%;">
            SOUTH
        </div>
    </body>
</html>
