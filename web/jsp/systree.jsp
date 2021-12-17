<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="js/systree.js"></script>
        <title>SYSTREE</title>
        
    </head>
    </style>    
    <script type="text/javascript">
        systree.resize = function () {
            $("#table-tree").jqGrid('setGridWidth', $("#dialog-tree #midl #centr").width());
            $("#table-tree").jqGrid('setGridHeight', $("#dialog-tree #midl #centr").height() - 26);
            $("#table-grid").jqGrid('setGridWidth', $("#dialog-tree #midl #east").width());
            $("#table-grid").jqGrid('setGridHeight', $("#dialog-tree #midl #east").height() - 26);
        }
        
        $(document).ready(function () {
            $(window).bind('resize', function () {
                systree.resize();
            }).trigger('resize');

            systree.init_dialog($("#dialog-tree"));
        });
    </script> 
</head> 
<body> 
    <div id="midl" style="position: relative; height: 99.6%; margin-right: 300px;">

        <div id="centr" style="height: 99.6%; width: 99%;">
            <table id="table-tree"  class="ui-jqgrid-btable"></table> 
            <script type="text/javascript">
                systree.init_tabtree($("#table-tree"))
                systree.load_tabtree($("#table-tree"))
            </script>
        </div>

        <div id="east" style="position: absolute; height: 99.6%; width: 290px; top: 0; right: -300px;">
            <table id="table-grid"  class="ui-jqgrid-btable"></table>
            <script type="text/javascript">
                systree.init_tabgrid($("#table-grid"));
                systree.load_tabgrid($("#table-grid"));
            </script>  
        </div>

    </div>  
</body> 
</html> 

