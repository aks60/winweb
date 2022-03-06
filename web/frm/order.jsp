<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
        <script type="text/javascript" src="frm/order.js"></script> 
        <title>Order</title>

        <style>
            #table2 tr:hover {
                background:#E2EEFF;
            }
            #table2 .activeRow, #table2 .activeRow:hover {
                background:#6598C7;
                color:#fff;
            }
            #table2 tr {
                height: 68px;
            }
            #table2 tr > *:nth-child(1) {
                display: none !important;
            }
            #table2 tr > *:nth-child(2) {
                width: 390px !important;
            }
            #table2 tr > *:nth-child(3) {
                width: 68px !important;
            }
            #table2 tr > *:nth-child(4) {
                display: none !important;
            }
        </style>        

        <script type="text/javascript">

            order.resize = function () {
                $("#context").css("height", window.innerHeight - 80);
                $("#table1").jqGrid('setGridWidth', $("#centr").width() - 5);
                $("#table1").jqGrid('setGridHeight', $("#centr").height() - 28);
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    order.resize();
                }).trigger('resize');
                let tab_sysprod = document.getElementById('table2');
                tab_sysprod.setAttribute('activeRowIndex', 0);
                tab_sysprod.addEventListener('click', order.click_table2);
                order.init_table($("#table1"), tab_sysprod);
                order.load_table($("#table1"), tab_sysprod);
                prepareToolBar();
            });
            
            function test() {
                dialogMes('Сообщение', 'Логин может состоять только из букв английского алфавита и цифр');
            }            
        </script>
    </head>
    <body>        
        <div id="north">
            <button id="btnOrder1" style="width: 128px" onClick="">Добавить заказ</button>
            <button id="btnOrder2" style="width: 128px" onClick="">Изменить заказ</button>
            <button id="btnOrder3" style="width: 128px" onClick="">Удалить заказ</button>
            
            <button id="btnProd1" style="width: 136px; margin-left: 60px;" onClick="$('#dialog-dic').load('frm/dialog/systree.jsp');">Добавить констр.</button>
            <button id="btnProd3" style="width: 128px" onClick="order.delete_proprod();">Удалить констр.</button>            
            <button id="btnTest" onClick="test();">Test</button>
        </div>     
        <div id = "context">        
            <div id="midl" style="position: relative; margin-right: 480px; height: 100%">
                <div id="centr" style="height: 100%; width: 100%;">
                    <table id="table1"  class="ui-jqgrid-btable"></table> 
                </div>
                <div id="east" style="position: absolute; margin-top: 160px; width: 472px; top: 0; right: -480px; bottom: 0;">
                    <div id="east2" style="margin-left: -2px; margin-top: -162px; height: 158px; background: #efeffb">

                        <canvas id="cnv" style="border:2px solid black;" width="468" height="154"></canvas>

                    </div>
                    <div id="east3" style="overflow-y: auto; height: 100%; background: #efeffb">
                        <table id="table2" border="1" cellspacing="0" cellpadding="0" bordercolor='#79b7e7'>
                            <tr style="height: 22px; background-color: #e7f4f9">
                                <th></th><th>Наименование</th><th>Изображение</th></tr>
                        </table>                         
                    </div>
                </div>
            </div>
        </div>
        <div id="south">
            Итого:
        </div> 
    </body>
</html>
