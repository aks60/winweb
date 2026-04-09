<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="module" src="frame/tarific.js"></script>
        <title>TARIF</title>
        <style>
            .ui-jqgrid .ui-jqgrid-htable .ui-th-div {
                height: auto;
                white-space: normal;
            }
        </style>
        <script type="module">
            import {project} from './frame/project.js';
            import {product} from './frame/product.js';
            import {Wincalc} from './build/Wincalc.js';
            import {tarif, resize, init_table, load_table} from './frame/tarific.js';
         
            tarif.table1 = document.getElementById('table1');
            $("#dialog-jsp").unbind().bind("dialogresize", (event, ui) => resize());

            init_table();
            load_table();
            resize();

            prepareTool('tarif');   
            $(window).bind('resize', resize).trigger('resize');
            document.getElementById('btnTar1').addEventListener('click', () => test());
            document.getElementById('btnTar2').addEventListener('click', () => test());

            function test() {
                console.log("777");
            }
        </script>         
    </head>
    <body>
        <div id="north">   
            <button id="btnTar1" style="width: 80px; margin-left: 20px;">Соед</button>
            <button id="btnTar2" style="width: 80px; margin-left: 4px;">Вст</button>            
            <button id="btnTar3" style="width: 80px; margin-left: 4px;">Зап</button>            
            <button id="btnTar4" style="width: 80px; margin-left: 4px;">Фурн</button>            
            <button id="btnTar5" style="width: 80px; margin-left: 4px;">Комп</button>            
        </div> 
        <div id = "context">                         
            <div id="centr" style="height: calc(100% - 24px);">
                <table id="table1"  class="ui-jqgrid-btable"></table> 
            </div>          
        </div>
        <div id="south">
            Итого:
        </div>
    </body>
</html>
