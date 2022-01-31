<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="frm/dialog/systree.js"></script>
        <title>SYSTREE</title>

        <style>
            #table2a tr:hover {background:#E2EEFF;}
            #table2a .activeRow, #table2a .activeRow:hover {background:#efeffb; color:#fff;}

            #table2a tr { height: 68px; };
            #table2a tr  > *:nth-child(1) { display: none !important; }
            #table2a tr > *:nth-child(2) { width: 212px !important; }
            #table2a tr > *:nth-child(3) { width: 68px !important;  }
        </style>

        <script type="text/javascript">
            systree.resize = function () {
                $("#table1a").jqGrid('setGridWidth', $("#dialog-dic #midl #centr").width());
                $("#table1a").jqGrid('setGridHeight', $("#dialog-dic #midl #centr").height() - 26);
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    systree.resize();
                }).trigger('resize');

                let tab_sysprod = document.getElementById('table2a');
                tab_sysprod.setAttribute('activeRowIndex', 0);
                tab_sysprod.addEventListener('click', systree.event_clicked);
                systree.init_dialog($("#dialog-dic"));
                systree.init_table($("#table1a"), tab_sysprod);
                systree.load_table($("#table1a"), tab_sysprod);
            });
        </script> 
    </head> 
    <body> 
        <div id="midl" style="position: relative; height: 99.6%; margin-right: 300px;">

            <div id="centr" style="height: 99.6%; width: 99%;">
                <table id="table1a"  class="ui-jqgrid-btable"></table> 
            </div>

            <div id="east" style="position: absolute; overflow-y: auto;  height: 99.6%; width: 290px; top: 0; right: -300px;">
                <table id="table2a" border="1" cellspacing="0" cellpadding="0" bordercolor='#79b7e7'>
                    <tr style="height: 22px; background-color: #e7f4f9">
                        <th></th><th>Наименование</th><th>Изображение</th></tr>
                </table>            
            </div>
        </div>                   
    </body> 
</html> 

