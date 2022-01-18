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
                $("#tab-sysprod").jqGrid('setGridWidth', $("#dialog-dic #midl #east").width());
                $("#tab-sysprod").jqGrid('setGridHeight', $("#dialog-dic #midl #east").height() - 26);
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    systree.resize();
                }).trigger('resize');

                systree.init_dialog($("#dialog-dic"));
                systree.init_table($("#tab-systree"), document.getElementById('tab-sysprod'));
                systree.load_table($("#tab-systree"), document.getElementById('tab-sysprod'));
            });
            function test() {
                var index = $("#tab-sysprod tbody tr.info").index();
                console.log(index);
            }
        </script> 
    </head> 
    <body> 
        <div id="midl" style="position: relative; height: 99.6%; margin-right: 300px;">

            <div id="centr" style="height: 99.6%; width: 99%;">
                <table id="tab-systree"  class="ui-jqgrid-btable"></table> 
            </div>

            <div id="east" style="position: absolute; height: 99.6%; width: 290px; top: 0; right: -300px;">
                <table id="tab-sysprod" border="1" cellspacing="0" cellpadding="0" bordercolor='#79b7e7'>
                    <tr style="height: 22px; background-color: #e7f4f9">
                        <th></th><th>Наименование</th><th>Изображение</th></tr>
                </table>            
            </div>
        </div>  
        <script>
            function parentTag(node, tag) {
                if (node)
                    return (node.tagName == tag) ? node : parentTag(node.parentElement, tag);
                return null;
            }
            let table = document.getElementById('tab-sysprod');
            table.setAttribute('activeRowIndex', 0);
            table.addEventListener('click', clicked);
            function clicked(e) {
                var row = parentTag(e.target, 'TR');
                if (row) {
                    var tbl = this, idx = tbl.getAttribute('activeRowIndex');
                    tbl.rows[idx].classList.remove('activeRow');
                    row.classList.add('activeRow');
                    tbl.setAttribute('activeRowIndex', row.rowIndex);
                    systree.sysprodID = row.cells[0].innerHTML;
//                    alert('info = ' + systree.sysprodID);
                }
            }
        </script>          
    </body> 
</html> 

