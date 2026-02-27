<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
        <script type="text/javascript" src="lib-js/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="module" src="frame/product.js"></script>
        <title>PROJECT</title>
        <style>
            .abs {
                position: absolute;
                /*border: 1px solid #00f;*/
            }
            #north {
                /*border: 1px solid #00f;*/
            }
            #context {
                top: 60px;
                margin-top: -4px;
                height: calc(100% - 80px);
            }
            #west1 {
                background: #efeffb;
                width: 30px;
                height: 100%;
            }
            #west2 {
                width: calc(100% - 434px);
                height: calc(100% - 5px);
                left: 32px;
            }
            #east1 {
                background: #efeffb;
                width: 388px;
                height: 270px;
                right: 0px;
            }

            #east2 {
                background: #efeffb;
                overflow-y: auto;
                width: 388px;
                height: calc(100% - 270px);
                right: 0px;
                bottom: 0px;
            }
            #south {
                display: inlin-block;
                bottom: 2px;
            }
            .toolWest1 {
                width: 24px;
                margin-top: 10px;
                margin-left: 3px;
                padding-left: 2px;
                /*text-align: left;*/
            }
        </style>
        <script type="module">
            import {product, wincalcNew, resize, init_table, load_table2,
                    update_script, color_to_windows} from './frame/product.js';

            deployTaq(['#tabs-1', '#tabs-2', '#tabs-3', '#tabs-4', '#tabs-5']);
            wincalcNew();
            $(window).bind('resize', resize); //.trigger('resize');
            product.table1 = document.getElementById('table1');
            product.table2 = document.getElementById('table2');

            init_table();
            load_table2();

            prepareTool();
            document.getElementById('n14').addEventListener('click', color_to_windows('n14'));
            document.getElementById('n15').addEventListener('click', color_to_windows('n15'));
            document.getElementById('n16').addEventListener('click', color_to_windows('n16'));
            
            document.getElementById('btnTest1').addEventListener('click', test1);
            document.getElementById('btnTest2').addEventListener('click', test2);

            function test1() {
            }
            function test2() {
            }
        </script>  
    </head>
    <body>
        <div id='north' style=''>
            <button id="btnTest1" style="width: 48px; margin-left: 40px;">TEST</button>
            <button id="btnTest2" style="width: 48px; margin-left: 40px;">TEST</button>
        </div>  
        <div id='context' class='abs' style=''>
            <div id='west1' class='abs' style=''>
                <button id="btnReset" class="toolWest1"></button>
                <button id="btnTop" class="toolWest1"></button>
                <button id="btnBot" class="toolWest1"></button>
                <button id="btnLef" class="toolWest1"></button>
                <button id="btnRig" class="toolWest1"></button>
                <button id="btnSceleton" class="toolWest1"></button>
            </div>
            <div id='west2' class='abs' style=''>
                <canvas id="cnv"  tabindex="-1"  style='width: 100%; height: 100%; border: 1px solid #ccc;'></canvas>  
            </div> 
            <div id='east1' class='abs' style=''>

                <div id="tabs-1" style="padding: 0px;">  
                    <p class="pantitle">Основные размеры</p> 
                    <jst id="n11" type='txt' label='Ширина' width='80' width2="60" nul='r'></jst><br>
                    <jst id="n12" type='txt' label='Высота' width='80' width2="60" nul='r'></jst><br>
                    <p class="pantitle">Текстура изделия</p> 
                    <jst id="n14" type='btn' label='Основная' width='80' width2="260"></jst><br>
                    <jst id="n15" type='btn' label='Внутренняя' width='80' width2="260"></jst><br>
                    <jst id="n16" type='btn' label='Внещняя' width='80' width2="260"></jst><br>
                </div>

                <div id="tabs-2" style="padding: 0px; display: none;">   
                    <table id="table1"  class="ui-jqgrid-btable"></table>
                </div>

                <div id="tabs-3" style="padding: 0px; display: none;">
                    <p class="pantitle">Сторона коробки</p> 
                    <jst id="n31" type='btn' label='Артикул' width='80' width2="260" click="product.sysprof_to_frame('n31');"></jst><br>
                    <jst id="n32" type='txt' label='Название' width='80' width2="288"></jst><br>
                    <p class="pantitle">Текстура изделия</p>  
                    <jst id="n33" type='btn' label='Основная' width='80' width2="260" click="product.color_to_element('n33');"></jst><br>                          
                    <jst id="n34" type='btn' label='Внутренняя' width='80' width2="260" click="product.color_to_element('n34');"></jst><br>                          
                    <jst id="n35" type='btn' label='Внещняя' width='80' width2="260" click="product.color_to_element('n35');"></jst><br>                          
                </div>

                <div id="tabs-4" style="padding: 0px; display: none;">
                    <p class="pantitle">Створка</p> 
                    <jst id="n41" type='txt' label='Ширина' width='60' width2="60"></jst> &nbsp; &nbsp;
                    <jst id="n42" type='txt' label='Высота' width='60' width2="60"></jst><br>                        
                    <jst id="n43" type='btn' label='Фурнитура' width='120' width2="220" click="product.furniture_to_stvorka('n43');"></jst><br>                          
                    <jst id="n44" type='btn' label='Сторона открывания' width='120' width2="220" click="product.sideopen_to_stvorka('n44')"></jst><br>
                    <jst id="n45" type='btn' label='Ручка (арт/наименов)' width='120' width2="220" click="product.artikl_to_stvorka('n45');"></jst><br>
                    <jst id="n46" type='btn' label='Текстура ручки' width='120' width2="220" click="product.color_to_element('n46');"></jst><br>                            
                    <jst id="n47" type='txt' label='Высота ручки' width='120' width2="153"></jst>
                    <jst id="n48" type='btn' label='' width='0' width2="47" click=""></jst><br>                            
                    <jst id="n49" type='btn' label='Подвес (арт/наименов)' width='120' width2="220" click="product.artikl_to_stvorka('n49');"></jst><br>
                    <jst id="n4A" type='btn' label='Текстура подвеса' width='120' width2="220" click="product.color_to_element('n4A');"></jst><br>
                    <jst id="n4B" type='btn' label='Замок (арт/наименов)' width='120' width2="220" click="product.artikl_to_stvorka('n4B');"></jst><br>
                    <jst id="n4C" type='btn' label='Текстура замка' width='120' width2="220" click="product.color_to_element('n4C');"></jst><br>
                </div>

                <div id="tabs-5" style="padding: 0px; display: none;">
                    <p class="pantitle">Заполнение</p> 
                    <jst id="n51" type='btn' label='Артикул' width='80' width2="260" click="product.artikl_to_glass('n51');"></jst><br>
                    <jst id="n52" type='txt' label='Название' width='80' width2="288"></jst><br>
                    <jst id="n53" type='btn' label='Цвет' width='80' width2="260" click="product.color_to_element('n53');"></jst><br>
                </div>                
            </div>   
            <div id='east2' class='abs' style=''>
                <div id="table2"></div>
            </div>       
        </div>  
        <div id='south' class='abs' style=''>
            Итого: 
        </div>  
    </body>
</html>