<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="frame/kits.js"></script> 
        <title>KITS</title>

        <script type="module">
            import {project} from './frame/project.js';
            import {Wincalc} from './build/Wincalc.js';
            import {product, resize, init_table, load_table, insert_table,
                    inser2_table, update_table, delete_table, artikl_to_kit,
                    color_to_kit} from './frame/product.js';

            $(window).bind('resize', resize); //.trigger('resize');

            kits.table1 = document.getElementById('table1');
            kits.init_table($("#table1"));
            kits.load_table($("#table1"));
            kits.resize();
            prepareTool();
            deployTaq(['#dialog-card']);

        </script>         
    </head>
    <body>
        <div id="north">   
            <button id="btnKit1" style="width: 160px" onClick="kits.insert_table($('#table1'));">Добавить комплект</button>
            <button id="btnKit2" style="width: 160px" onClick="kits.insert2_table($('#table1'));">Добавить артикул</button>
            <button id="btnKit3" style="width: 160px" onClick="kits.update_table('#dialog-card');">Изменить артикул</button>
            <button id="btnKit4" style="width: 160px" onClick="kits.delete_table($('#table1'));">Удалить артикул</button>            
        </div> 
        <div id = "context">               
            <div id="dialog-card" card_width="490" card_height="260" style="display: none;">
                <jst id="n53" type='btn' label='Основная текстура' width='126' width2="280" fk="-3" click="kits.color_to_kit('n53')"></jst><br>
                <jst id="n54" type='btn' label='Внутренняя текстура' width='126' width2="280" fk="-3" click="kits.color_to_kit('n54')"></jst><br>
                <jst id="n55" type='btn' label='Внешняя текстура' width='126' width2="280" fk="-3" click="kits.color_to_kit('n55')"></jst><br>
                <jst id="n56" type='txt' label='Длина' width='126' width2="80"></jst><br>
                <jst id="n57" type='txt' label='Ширина' width='126' width2="80"></jst><br>
                <jst id="n58" type='txt' label='Количество' width='126' width2="80"></jst><br>
            </div>            
            <div id="centr" style="height: 100%; margin-top: 2px;">
                <table id="table1"  class="ui-jqgrid-btable"></table> 
            </div>          
        </div>
        <div id="south">
            Итого:
        </div>
    </body>
</html>