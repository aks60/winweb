<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="frm/dialog/systree.js"></script>
        <title>SYSTREE</title>

        <style>
            #tab-sysprod tr:hover {background:#E2EEFF;}
            #tab-sysprod .activeRow, #tab-sysprod .activeRow:hover {background:#6598C7; color:#fff;}

            #tab-sysprod tr { height: 68px; };
            #tab-sysprod tr  > *:nth-child(1) { display: none !important; }
            #tab-sysprod tr > *:nth-child(2) { width: 212px !important; }
            #tab-sysprod tr > *:nth-child(3) { width: 68px !important;  }
        </style>

        <script type="text/javascript">
            systree.resize = function () {
                $("#tab-systree").jqGrid('setGridWidth', $("#dialog-dic #midl #centr").width());
                $("#tab-systree").jqGrid('setGridHeight', $("#dialog-dic #midl #centr").height() - 26);
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    systree.resize();
                }).trigger('resize');

                let tab_sysprod = document.getElementById('tab-sysprod');
                tab_sysprod.setAttribute('activeRowIndex', 0);
                tab_sysprod.addEventListener('click', systree.event_clicked);
                systree.init_dialog($("#dialog-dic"));
                systree.init_table($("#tab-systree"), tab_sysprod);
                systree.load_table($("#tab-systree"), tab_sysprod);
            });
        </script> 
    </head> 
    <body> 
        <div id="midl" style="position: relative; height: 99.6%; margin-right: 300px;">

            <div id="centr" style="height: 99.6%; width: 99%;">
                <table id="tab-systree"  class="ui-jqgrid-btable"></table> 
            </div>

            <div id="east" style="position: absolute; overflow-y: auto;  height: 99.6%; width: 290px; top: 0; right: -300px;">
                <table id="tab-sysprod" border="1" cellspacing="0" cellpadding="0" bordercolor='#79b7e7'>
                    <tr style="height: 22px; background-color: #e7f4f9">
                        <th></th><th>Наименование</th><th>Изображение</th></tr>
                </table>            
            </div>
        </div>                   
    </body> 
</html> 

