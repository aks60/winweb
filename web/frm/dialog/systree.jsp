<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="frm/dialog/systree.js"></script>
        <title>SYSTREE</title>

        <style>
            #tab-sysprod tr { height:68px; } 
            #tab-sysprod tr :first-child { width: 212px; }
            #tab-sysprod tr :last-child { width: 68px; }
        </style>

        <script type="text/javascript">
            systree.resize = function () {
                $("#tab1-dic").jqGrid('setGridWidth', $("#dialog-dic #midl #centr").width());
                $("#tab1-dic").jqGrid('setGridHeight', $("#dialog-dic #midl #centr").height() - 26);
                $("#tab-sysprod").jqGrid('setGridWidth', $("#dialog-dic #midl #east").width());
                $("#tab-sysprod").jqGrid('setGridHeight', $("#dialog-dic #midl #east").height() - 26);
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    systree.resize();
                }).trigger('resize');

                systree.init_dialog($("#dialog-dic"));
                systree.init_table($("#tab1-dic"), $("#tab-sysprod"));
                systree.load_table($("#tab1-dic"), $("#tab-sysprod"));
            });
        </script> 
    </head> 
    <body> 
        <div id="midl" style="position: relative; height: 99.6%; margin-right: 300px;">

            <div id="centr" style="height: 99.6%; width: 99%;">
                <table id="tab1-dic"  class="ui-jqgrid-btable"></table> 
            </div>

            <div id="east" style="position: absolute; height: 99.6%; width: 290px; top: 0; right: -300px;">
                <table id="tab-sysprod" border="1">
                    <tr style="height: 20px; background-color: #e7f4f9"><th>Наименование</th><th>Изображение</th></tr>
                    <tr> <td>Ячейка 1</td><td>Ячейка 2</td> </tr>
                    <tr> <td>Ячейка 3</td><td>Ячейка 4</td> </tr>
                </table>            
            </div>
        </div>  
    </body> 
</html> 

