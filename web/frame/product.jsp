<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
        <script type="text/javascript" src="lib-js/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="module" src="frame/product.js"></script>
        <title>PRODUCT</title>
        <style>
            #scale-hor, #scale-ver, #scale-cnv {
                display: inline-block;
                border: 0;
                /*border: 1px solid #00f;*/
            }
            #scale-hor {
                width: 100%;
                height: 24px;
            }
            #scale-ver {
                transform: rotate(-90deg);
                transform-origin: right 0px;
                position: absolute;
                height: 24px;
            }
            #scale-cnv {
                width: calc(100% - 32px);
                height: calc(100% - 34px);
                margin-left: 30px;
            }
            #scale-hor input{
                margin-top: 14px;
            }
            #scale-ver input {
            }
/*            #scale-hor input, #scale-ver input {
                text-align: center;
                font-weight: bold;
                font-size: 16px;
                height: 12px;
                border: 0;
                border-left: 2px solid #00f;
                border-right: 2px solid #00f;
            }*/
            #spinner {
                width: 80px;
                font-size: 16px;
                font-weight: bold;
                padding: 0;
            }
        </style>  
        <script type="module">
            import {resize, server_to_fields, init_table, load_tree,
                    click_canvas_xy, click_spinner, update_script} from './frame/product.js';

            server_to_fields();
            $(document).ready(function () {
                
                deployTaq(['#tabs-1', '#tabs-2', '#tabs-3', '#tabs-4', '#tabs-5']);
                $(window).bind('resize', () => resize()).trigger('resize');
                product.table1 = document.getElementById('table1');
                product.tabtree = document.getElementById('tree-winc');

                init_table();
                load_tree();

                prepareToolBar();
                let cvs = document.querySelector("#cnv");
                cvs.addEventListener('mousedown', (e) => click_canvas_xy(cvs, e));
                $("#spinner").spinner({step: 0.5, numberFormat: "n"})
                $("#spinner").spinner({
                    spin: function (event, ui) {
                        click_spinner();
                    }
                });
            });

            function test() {
//                printScript(winCalc);
//                update_script();
            }
        </script>
    </head>
    <body>
        <div id="north">         
            <input id="spinner" name="value">
            <button id="btnTest" style="width: 48px; margin-left: 40px;" onClick="test();">TEST</button>
        </div> 
        <div id = "context">
            <div id="midl" style="position: relative; margin-right: 400px; height: 100%;">
                <div id="centr">
                    <div id="scale-ver"></div>
                    <div id="scale-cnv">                    
                        <canvas id="cnv"></canvas>
                    </div>                     
                    <div id="scale-hor"></div> 
                </div>
                <div id="east" style="position: absolute; margin-top: 268px; width: 396px; top: 0; right: -400px; bottom: 0;">
                    <div id="east2" style="margin-top: -270px; height: 268px; background: #efeffb">

                        <div id="tabs-1" style="">  
                            <p class="pantitle">Основные размеры</p> 
                            <jst id="n11" type='txt' label='Ширина' width='80' width2="60"></jst><br>
                            <jst id="n12" type='txt' label='Высота' width='80' width2="60"></jst><br>
                            <p class="pantitle">Текстура изделия</p> 
                            <jst id="n14" type='btn' label='Основная' width='80' width2="260" click="product.color_to_windows('n14');"></jst><br>
                            <jst id="n15" type='btn' label='Внутренняя' width='80' width2="260" click="product.color_to_windows('n15');"></jst><br>
                            <jst id="n16" type='btn' label='Внещняя' width='80' width2="260" click="product.color_to_windows('n16');"></jst><br>
                        </div>
                        <div id="tabs-2" style="display: none;">   
                            <table id="table1"  class="ui-jqgrid-btable"></table>
                        </div>

                        <div id="tabs-3" style="display: none;">
                            <p class="pantitle">Сторона коробки</p> 
                            <jst id="n31" type='btn' label='Артикул' width='80' width2="260" click="product.sysprof_to_frame('n31');"></jst><br>
                            <jst id="n32" type='txt' label='Название' width='80' width2="288"></jst><br>
                            <p class="pantitle">Текстура изделия</p>  
                            <jst id="n33" type='btn' label='Основная' width='80' width2="260" click="product.color_to_element('n33');"></jst><br>                          
                            <jst id="n34" type='btn' label='Внутренняя' width='80' width2="260" click="product.color_to_element('n34');"></jst><br>                          
                            <jst id="n35" type='btn' label='Внещняя' width='80' width2="260" click="product.color_to_element('n35');"></jst><br>                          
                        </div>

                        <div id="tabs-4" style="display: none;">
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

                        <div id="tabs-5" style="display: none;">
                            <p class="pantitle">Заполнение</p> 
                            <jst id="n51" type='btn' label='Артикул' width='80' width2="260" click="product.artikl_to_glass('n51');"></jst><br>
                            <jst id="n52" type='txt' label='Название' width='80' width2="288"></jst><br>
                            <jst id="n53" type='btn' label='Цвет' width='80' width2="260" click="product.color_to_element('n53');"></jst><br>
                        </div>
                    </div>

                    <div id="east3" style="overflow-y: auto; height: 100%; background: #efeffb">
                        <div id="tree-winc"></div>
                    </div>                
                </div>
            </div> 
            <div id="south">
                Итого:              
            </div> 
        </div> 
    </body>
</html>
