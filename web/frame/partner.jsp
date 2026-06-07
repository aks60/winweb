<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="module" src="frame/partner.js"></script> 
        <title>PARTNER</title>
        <style>
.container {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* Растягивает контейнер на весь экран */
}

.content {
    flex-grow: 1; /* Заставляет этот блок занимать всё свободное место */
}
        </style>        
        <script type="module">
            import {partner} from './frame/partner.js';

            partner.table1 = document.getElementById('table1');
            $(window).unbind('resize').bind('resize', partner.resize);
            partner.init_table();
            partner.load_table1();          
            //prepareTool('partner');
            //$(partner.table1).jqGrid({gridComplete: function () { partner.resize();}});
            partner.resize();
        </script>         
    </head>   
    <body>
        <div id = "context">     
            <div id="dialog-card1" card_width="416" card_height="250" style="display: none;">                
             </div>
            <div id="dialog-card2" card_width="416" card_height="230" style="display: none;">                
            </div>
            <div id="dialog-card3" card_width="260" card_height="180" style="display: none;">                
            </div>
            <div id="midl" style="position: relative; margin-right: 600px; height: 100%"> 

                <div id="centr" style="height: 100%; width: 100%; margin-top: 0px;">
                    <table id="table1"  class="ui-jqgrid-btable"></table> 
                </div>
                <div id="east" style="position: absolute; width: 594px; height: 100%; top: 0; right: -600px;  border: 1px groove #ccc;">
                    <div id="east2" style="height: 180px; background: #efeffb">
                    </div>
                    <div id="east3" style="background: #efeffb;">                    
                    </div>
                </div>
            </div>
        </div>
        <div id="south"></div> 
    </body>
</html>
