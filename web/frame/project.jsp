<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
        <script type="module" src="frame/project.js"></script> 
        <title>PROJECT</title>

        <style>
            .selected {
                background-color: #ff0000; /* Цвет выделения */
                /*background-color: #d1e7dd;  Цвет выделения */
            }            
            #table2  {
                border-collapse: collapse;
            }
            #table2 tr {
                height: 68px;
            }
            #table2 td {
                border: 1px solid #79b7e7;
            }
            #table2 tr:hover {
                background:#E2EEFF;
            }
            #table2 .activeRow, #table2 .activeRow:hover {
                background:#6598C7;
                color:#fff;
            }
            #table2 tr > *:nth-child(1) {
                display: none !important;
            }
            #table2 tr > *:nth-child(2) {
                width: 390px !important;
            }
            #table2 tr > *:nth-child(3) {
                width: 30px !important;
            }
            #table2 tr > *:nth-child(4) {
                width: 68px !important;
            }
            #table2 tr > *:nth-child(5) {
                display: none !important;
            }
        </style>        

        <script type="module">
            import {resize, init_table, load_table1, insert_table1, update_table1, delete_table1, click_table1,
                    load_table2, delete_table2, click_table2} from './frame/project.js';
            import {project} from './frame/project.js';

            $(window).bind('resize', () => resize()).trigger('resize');
            project.table1 = document.getElementById('table1');
            project.table2 = document.getElementById('table2');

            project.table2.setAttribute('activeRowIndex', 1);
            project.table2.addEventListener('click', click_table2);

            init_table();
            load_table1();

            $("button").button();
            prepareTool();
            deployTaq(['#dialog-card']);
            $('#n23').datepicker();
            $('#n24').datepicker();

            document.getElementById('btnProj1').addEventListener('click', () => insert_table1('#dialog-card'));
            document.getElementById('btnProj2').addEventListener('click', () => update_table1('#dialog-card'));
            document.getElementById('btnProj3').addEventListener('click', () => delete_table1($('#table1')));
            document.getElementById('btnProd1').addEventListener('click', () => $('#dialog-dic').load('frame/dialog/systree.jsp'));
            document.getElementById('btnProd3').addEventListener('click', () => delete_table2());
            document.getElementById('btnTest1').addEventListener('click', test1);
            document.getElementById('btnTest2').addEventListener('click', test2);

            function test1() {
                debugger;
                let o1 = document.querySelectorAll('table2 tr');
                document.querySelectorAll('table2 tr').forEach(row => {
                    row.addEventListener('click', function () {
                        console.log('xxxxxxxxxxxxxxxx');
//                        debugger;
//                        // Удаляем класс у всех
//                        document.querySelectorAll('table2 tr').forEach(r => r.classList.remove('selected'));
//                        // Добавляем к текущей
//                        this.classList.add('selected');
                    });
                });
            }
            function test2() {
                const selectedRow = document.querySelector('table2 tr.selected');
                if (selectedRow) {
                    console.log(selectedRow.innerText); // Получить текст строки
                    console.log(selectedRow.dataset.id); // Получить ID из data-атрибута
                }
            }
        </script>
        <script type="text/javascript">
            
        </script>
    </head>
    <body>        
        <div id="north">
            <button id="btnProj1" style="width: 128px">Добавить заказ</button>
            <button id="btnProj2" style="width: 128px">Изменить заказ</button>
            <button id="btnProj3" style="width: 128px">Удалить заказ</button>
            &emsp;&emsp;&emsp;
            <button id="btnProd1" style="width: 136px">Добавить констр.</button>
            <button id="btnProd3" style="width: 128px">Удалить констр.</button>                        
            <button id="btnTest1">TEST</button>                        
            <button id="btnTest2">TEST</button>                        
        </div>     
        <div id = "context">     
            <div id="dialog-card" card_width="416" card_height="230" style="display: none;">                
                <jst id="n21" type='txt' label='Номер заказа' width='80' width2="120"></jst><br>
                <jst id="n22" type='txt' label='Номер счёта' width='80' width2="120"></jst>
                <input class='field' type='button' style='height: 18px;' value='<>' onclick="$('#n22').val($('#n21').val());"><br>
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
                        <table id="table3"  class="ui-jqgrid-btable"></table>
                    </div>
                    <div id="east3" style="overflow-y: auto; height: 100%; background: #efeffb">
                        <table id="table2">
                            <tr style="height: 22px; background-color: #e7f4f9">
                                <th></th><th>Наименование</th><th>Кол-во</th><th>Изображение</th>
                            </tr>
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
