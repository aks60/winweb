<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>SYSTREE</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="js/systree.js"></script> 
    </head>
    <style type="text/css">
        #midl {
            border: 0 !important;
        }
    </style>    
    <script type="text/javascript">
        $(document).ready(function () {
            $(window).bind('resize', function () {
                systree.resize();
            }).trigger('resize');
            
            systree.init_dialog($("#dialog"));
        });

        systree.resize = function () {
            $("#table-tree").jqGrid('setGridWidth', $("#centr").width());
            $("#table-tree").jqGrid('setGridHeight', $("#centr").height() - 26);
            $("#table-grid").jqGrid('setGridWidth', $("#east").width());
            $("#table-grid").jqGrid('setGridHeight', $("#east").height() - 26);
        }
    </script> 
</head> 
<body> 
    <div id="dialog" title="Системы профилей">
        <div id="midl" style="position: relative; height: 99.6%; margin-right: 300px;">
            
            <div id="centr" style="height: 99.6%; width: 100%;">
                <table id="table-tree"  class="ui-jqgrid-btable"></table> 
                <script type="text/javascript">
                    systree.init_tree($("#table-tree"))
                    systree.load_tree($("#table-tree"))
                </script>
            </div>
            
            <div id="east" style="position: absolute; height: 99.6%; width: 290px; top: 0; right: -300px;">
                <table id="table-grid"  class="ui-jqgrid-btable"></table>
                <script type="text/javascript">
                    systree.init_grid($("#table-grid"));
                    systree.load_grid($("#table-grid"));
                </script>  
            </div>
            
        </div> 
    </div> 
    <!--<input type="button" value="Открыть окно" id="btnl" onclick="$('#dialog').dialog('open');" >--> 
</body> 
</html> 

