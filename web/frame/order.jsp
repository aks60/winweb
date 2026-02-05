<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
        <script type="module" src="frame/order.js"></script> 
        <title>PROJECT</title>

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

        <script type="module">
            import {resize, init_table, load_table1, click_table2} from './frame/order.js';

            $(document).ready(function () {

                $(window).bind('resize', () => resize()).trigger('resize');
                order.table1 = document.getElementById('table1');
                order.table2 = document.getElementById('table2');

                order.table2.setAttribute('activeRowIndex', 0);
                order.table2.addEventListener('click', click_table2);

                init_table();
                load_table1();

                $("button").button();
                prepareToolBar();
                deployTaq(['#dialog-card']);
                $('#n23').datepicker();
                $('#n24').datepicker();

            });

            function test() {
//                let rowid = $("#table1").jqGrid('getGridParam', "selrow"); //index профиля из справочника
//                let tableRec = $("#table1").jqGrid('getRowData', rowid);  //record справочника
//                alert(tableRec.num_ord);
//                let rowid = $("#table2").jqGrid('getGridParam', "selrow");
//                $("#table2").jqGrid("setSelection", rowid);
            }
        </script>
    </head>
    <body>        
        <div id="north">
            <button id="btnOrder1" style="width: 128px" onClick="insert_table1('#dialog-card');">Добавить заказ</button>
            <button id="btnOrder2" style="width: 128px" onClick="update_table1('#dialog-card');">Изменить заказ</button>
            <button id="btnOrder3" style="width: 128px" onClick="delete_table1($('#table1'))">Удалить заказ</button>
            <button id="btnProd1" style="width: 136px; margin-left: 60px;" onClick="$('#dialog-dic').load('frame/dialog/systree.jsp');">Добавить констр.</button>
            <button id="btnProd3" style="width: 128px" onClick="delete_table2();">Удалить констр.</button>                        
            <button id="btnProd3" style="width: 128px" onClick="test();">TEST</button>                        
        </div>     
        <div id = "context">     
            <div id="dialog-card" card_width="416" card_height="230" style="display: none;">
                <jst id="n21" type='txt' label='Номер заказа' width='80' width2="120"></jst><br>
                <jst id="n22" type='txt' label='Номер счёта' width='80' width2="120"></jst><br>
                <jst id="n23" type='txt' label='Дата от...' width='80' width2="80"></jst><br>
                <jst id="n24" type='txt' label='Дата до...' width='80' width2="80"></jst><br>
                <jst id="n25" type='btn' label='Контрагент' width='80' width2="260" fk="-3" click="$('#dialog-dic').load('frame/dialog/dealer.jsp');"></jst><br>
            </div>
            <div id="midl" style="position: relative; margin-right: 480px; height: 100%"> 

                <div id="centr" style="height: 100%; width: 100%; margin-top: 0px;">
                    <table id="table1"  class="ui-jqgrid-btable"></table> 
                </div>
                <div id="east" style="position: absolute; margin-top: 160px; width: 472px; top: 0; right: -480px; bottom: 0;">
                    <div id="east2" style="margin-left: -2px; margin-top: -162px; height: 158px; background: #efeffb">
                        <canvas id="cnv" style="border:2px solid black;" width="468" height="154"></canvas>
                        <table id="table3"  class="ui-jqgrid-btable"></table>
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
