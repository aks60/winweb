<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="frm/dialog/systree.js"></script>
        <title>SYSTREE</title>

    </head>  
    <script type="text/javascript">
        systree.resize = function () {
            $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic #midl #centr").width());
            $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic #midl #centr").height() - 26);
            $("#tab2-dic").jqGrid('setGridWidth', $("#dialog-dic #midl #east").width());
            $("#tab2-dic").jqGrid('setGridHeight', $("#dialog-dic #midl #east").height() - 26);
        }

        $(document).ready(function () {
            $(window).bind('resize', function () {
                systree.resize();
            }).trigger('resize');

            systree.init_dialog($("#dialog-dic"));
            systree.init_table1($("#tab1-dic"));
            systree.load_table1($("#tab1-dic"));
            systree.init_table2($("#tab2-dic"));
            systree.load_table2($("#tab2-dic"));
        });

        window.onload = function () {
            alert('Страница загружена');
        };
    </script> 
</head> 
<body> 
    <div id="midl" style="position: relative; height: 99.6%; margin-right: 300px;">

        <div id="centr" style="height: 99.6%; width: 99%;">
            <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
        </div>

        <div id="east" style="position: absolute; height: 99.6%; width: 290px; top: 0; right: -300px;">
            <table id="tab2-dic"  class="ui-jqgrid-btable"></table> 
        </div>
    </div>  
</body> 
</html> 

