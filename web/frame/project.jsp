<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
        <script type="module" src="frame/project.js"></script> 
        <title>PROJECT</title>

        <style>
            #north button.ui-widget{
                height: 20px;
            }
        </style>        

        <script type="module">
            import {project} from './frame/project.js';

            $(window).unbind('resize').bind('resize', project.resize);
            project.table1 = document.getElementById('table1');
            project.table2 = document.getElementById('table2');
            project.table3 = document.getElementById('table3');
            deployTaq(['#dialog-card1', '#dialog-card2', '#dialog-card3', '#east2']);

            project.init_table();
            project.load_table1();
            project.load_table2();

            prepareTool('project');
            $('#p23').datepicker();
            $('#p24').datepicker();
            $('#p25').datepicker();

            function test1() {
                progress('open');
            }
            function test2() {
                resize();
            }
        </script>
        <script type="text/javascript">

        </script>
    </head>
    <body>        
        <div id = "context">     
            <div id="dialog-card1" card_width="416" card_height="250" style="display: none;">                
                <jst id="p21" type='txt' label='Номер заказа' width='120' width2="120"></jst><br>
                <jst id="p22" type='txt' label='Номер счёта' width='120' width2="120"></jst>
                <input class='field' type='button' style='height: 18px;' value='<>' onclick="$('#p22').val($('#p21').val());"><br>
                <jst id="p23" type='txt' label='Дата регистрации' width='120' width2="80"></jst><br>        
                <jst id="p24" type='txt' label='Дата расчёта' width='120' width2="80"></jst>
                <input class='field' type='button' style='height: 18px;' value='<>' onclick="$('#p24').val($('#p23').val());"><br>        
                <jst id="p25" type='txt' label='Дата в производство' width='120' width2="80"></jst>
                <input class='field' type='button' style='height: 18px;' value='<>' onclick="$('#p25').val($('#p24').val());"><br>        
                <jst id="p26" type='btn' label='Заказчик' width='120' width2="220" fk="-3" click="$('#dialog-jsp').load('frame/dialog/dealer.jsp');"></jst><br>
            </div>
            <div id="dialog-card2" card_width="416" card_height="230" style="display: none;">                
                <jst id="p31" type='txt' label='Количество' width='80' width2="40"></jst><br>
                <jst id="p32" type='area' label='Наименование конструкции' width='80' height='80' width2="290" resize=none;></jst>
            </div>
            <div id="dialog-card3" card_width="260" card_height="180" style="display: none;">                
                <jst id="p35" type='txt' label='Cкидка конструкции' width='160' width2="40"></jst><br>
                <jst id="p36" type='txt' label='Cкидка комплектации' width='160' width2="40"></jst><br>
                <jst id="p37" type='txt' label='Cкидка общая' width='160' width2="40"></jst>
            </div>
            <div id="midl" style="position: relative; margin-right: 400px; height: 100%"> 

                <div id="centr" style="height: 100%; width: 100%; margin-top: 0px;">
                    <table id="table1"  class="ui-jqgrid-btable"></table> 
                </div>
                <div id="east" style="position: absolute; width: 394px; height: 100%; top: 0; right: -400px;  border: 1px groove #ccc;">
                    <div id="east2" style="height: 180px; background: #efeffb">
                        <jst id="p33" type='txt' label='Площадь заказа' width='120' width2="60"></jst><br>
                        <jst id="p34" type='txt' label='Вес заказа' width='120' width2="60"></jst><br><br>                        
                        <table id="table2"  class="ui-jqgrid-btable"></table>
                    </div>
                    <div id="east3" style="background: #efeffb;">
                        <table id="table3"  class="ui-jqgrid-btable"></table>                       
                    </div>
                </div>
            </div>
        </div>
        <div id="south"></div> 
    </body>
</html>
