<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="module" src="frame/kits.js"></script>
        <title>KITS</title>

        <script type="module">
            import {project} from './frame/project.js';
            import {Wincalc} from './build/Wincalc.js';
            import {kits, resize, init_table, load_table, update_table, 
                delete_table, artikl_to_kit, color_to_kit} from './frame/kits.js';
           
            kits.table1 = document.getElementById('table1');
            init_table();
            load_table();
            
            $("button").button();
            prepareTool();
            deployTaq(['#dialog-card']);
            $(window).bind('resize', resize).trigger('resize');
            document.getElementById('btnKit3').addEventListener('click', () =>  update_table());
            document.getElementById('btnKit4').addEventListener('click', () =>  delete_table());            
        </script>         
    </head>
    <body>
        <div id="north">   
            <button id="btnKit1" style="width: 160px" onClick="$('#dialog-jsp').load('frame/dialog/kitcard.jsp')">Добавить комплект</button>
            <button id="btnKit2" style="width: 160px" onClick="$('#dialog-jsp').load('frame/dialog/artikl.jsp')">Добавить артикул</button>
            <button id="btnKit3" style="width: 160px">Изменить артикул</button>
            <button id="btnKit4" style="width: 160px">Удалить артикул</button>            
        </div> 
        <div id = "context">               
            <div id="dialog-card" card_width="490" card_height="260" style="display: none;">
                <jst id="k53" type='btn' label='Основная текстура' width='126' width2="280" fk="-3" click="kits.color_to_kit('k53')"></jst><br>
                <jst id="k54" type='btn' label='Внутренняя текстура' width='126' width2="280" fk="-3" click="kits.color_to_kit('k54')"></jst><br>
                <jst id="k55" type='btn' label='Внешняя текстура' width='126' width2="280" fk="-3" click="kits.color_to_kit('k55')"></jst><br>
                <jst id="k56" type='txt' label='Длина' width='126' width2="80"></jst><br>
                <jst id="k57" type='txt' label='Ширина' width='126' width2="80"></jst><br>
                <jst id="k58" type='txt' label='Количество' width='126' width2="80"></jst><br>
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