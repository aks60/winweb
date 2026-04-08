<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>TARIF</title>

        <script type="module">
            import {project} from './frame/project.js';
            import {Wincalc} from './build/Wincalc.js';
            import {tarif, resize, init_table, load_table} from './frame/tarif.js';

            const paramTaq = "<%= request.getParameter("param")%>";
            let artiklSet = new Set();
            let artiklRow = {};
            const winc = product.winCalc;
            tarif.table1 = document.getElementById('table1');
            $("#dialog-jsp").unbind().bind("dialogresize", (event, ui) => resize());

            init_table();
            load_table();

            $("button").button();
            prepareTool();
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
            <button id="btnTar1" style="width: 160px">TEST1</button>
            <button id="btnTar2" style="width: 160px">TEST2</button>            
        </div> 
        <div id = "context">                         
            <div id="centr" style="height: 100%;">
                <table id="table1"  class="ui-jqgrid-btable"></table> 
            </div>          
        </div>
        <div id="south">
            Итого:
        </div>
    </body>
</html>
