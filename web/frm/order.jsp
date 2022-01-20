<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
        <script type="text/javascript" src="frm/order.js"></script> 
        <title>Order</title>

        <style>
            #table2 tr:hover {background:#E2EEFF;}
            #table2 .activeRow, #table2 .activeRow:hover {background:#6598C7; color:#fff;}

            #table2 tr { height: 68px; };
            #table2 tr  > *:nth-child(1) { display: none !important; }
            #table2 tr > *:nth-child(2) { width: 390px !important; }
            #table2 tr > *:nth-child(3) { width: 68px !important;  }
        </style>        

        <script type="text/javascript">

            order.resize = function () {
                $("#context").css("height", window.innerHeight - 80);
                $("#table1").jqGrid('setGridWidth', $("#centr").width() - 5);
                $("#table1").jqGrid('setGridHeight', $("#centr").height() - 28);
            }

            function test() {
                let id = 'cnv' + order.proprodID;
                document.getElementById(id).click();                
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    order.resize();
                }).trigger('resize');

                let tab_sysprod = document.getElementById('table2');
                tab_sysprod.setAttribute('activeRowIndex', 0);
                tab_sysprod.addEventListener('click', order.event_clicked);
                order.init_table($("#table1"), tab_sysprod);
                order.load_table($("#table1"), tab_sysprod);
//                $('#dialog-dic').load('frm/dialog/systree.jsp');
            });
        </script>
    </head>
    <body>        
        <div id="north" style="height: 20px;">
            <button onClick="winc.build(document.getElementById('cnv'), order.rec_table2[PROPROD.script]);">Кнопка1</button>
            <button id="c2" onClick="$('#dialog-dic').load('frm/dialog/systree.jsp');">Кнопка2</button>
            <button onClick="test()">Кнопка3</button>
        </div>     
        <div id = "context">        
            <div id="midl" style="position: relative; margin-right: 480px; height: 100%">
                <div id="centr" style="height: 100%; width: 100%;">
                    <table id="table1"  class="ui-jqgrid-btable"></table> 
                </div>
                <div id="east" style="position: absolute; margin-top: 200px; width: 472px; top: 0; right: -480px; bottom: 0;">
                    <div id="east2" style="margin-left: -2px; margin-top: -202px; height: 198px;">

                        <canvas id="cnv" style="border:2px solid black;" width="460" height="190"></canvas>

                    </div>
                    <div id="east3" style="overflow-y: auto; height: 100%;">
                        <table id="table2" border="1" cellspacing="0" cellpadding="0" bordercolor='#79b7e7'>
                            <tr style="height: 22px; background-color: #e7f4f9">
                                <th></th><th>Наименование</th><th>Изображение</th></tr>
                        </table>                         
                    </div>
                </div>
            </div>
        </div>
        <div id="south" style="height: 20px">
            SOUTH
        </div> 
    </body>
</html>
