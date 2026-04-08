<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
        <script type="module" src="frame/product.js"></script>
        <title>PRODUCT</title>
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
                height: 300px;
                right: 0px;
            }

            #east2 {
                background: #efeffb;
                overflow-y: auto;
                width: 388px;
                height: calc(100% - 300px);
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
            import {project} from './frame/project.js';
            import {Wincalc} from './build/Wincalc.js';
            import {product, resize, init_table, load_table2, btn_to_tabs} from './frame/product.js';

            deployTaq(['#tabs-1', '#tabs-2', '#tabs-3', '#tabs-4', '#tabs-5']);
            $(window).bind('resize', resize); //.trigger('resize');

            //Создание конструкции
            let cnv = document.getElementById("cnv");
            let script = project.prjprodRec[ePrjprod.script];
            product.winCalc = Wincalc.new(cnv, cnv.offsetWidth, cnv.offsetHeight, script, true);

            product.table1 = document.getElementById('table1');
            product.table2 = document.getElementById('table2');
            init_table();
            load_table2();

            prepareTool('product');           
            document.getElementById('btnProdStv').addEventListener('click', () => btn_to_tabs('btnProdStv'));
            document.getElementById('btnProdFurn').addEventListener('click', () => btn_to_tabs('btnProdFurn'));
            document.getElementById('btnProdAdd').addEventListener('click', () => btn_to_tabs('btnProdAdd'));
            document.getElementById('btnTest3').addEventListener('click', test1);
            document.getElementById('btnTest4').addEventListener('click', test2);

            function test1() {
                console.log(JSON.stringify(product.winCalc.gson));
            }
            function test2() {
            }
        </script>  
    </head>
    <body>
        <div id="north">
            <button id="btnTest3" style="width: 54px; margin-left: 40px;">TEST3</button>
            <button id="btnTest4" style="width: 54px; margin-left: 40px;">TEST4</button>
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
            <div id='west2' class='abs' style='border: 0;'>
                <canvas id="cnv"  tabindex="-1"  style='width: 100%; height: 100%; border: 0 solid #ccc;'></canvas>  
            </div> 
            
            <div id='east1' class='abs' style=''>
                
                <!--//КОРОБКА-->
                <div id="tabs-1" style="padding: 0px;">  
                    <p class="pantitle" style='text-align: center'> Основные размеры</p> 
                    <jst id="n11" type='txt' label='Ширина' width='80' width2="60" nul='r'></jst><br>
                    <jst id="n12" type='txt' label='Высота' width='80' width2="60" nul='r'></jst><br>
                    <jst id="n55" type='btn' label='Артикул' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/sysprof.jsp?param=n55')"></jst><br>
                    <jst id="n56" type='txt' label='Название' width='80' width2="288"></jst><br> 
                    <jst id="n66" type='txt' label='Аналог' width='80' width2="288"></jst><br>
                    <p class="pantitle"> Текстура</p> 
                    <jst id="n14" type='btn' label='Основная' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n14')"></jst><br>
                    <jst id="n15" type='btn' label='Внутренняя' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n15')"></jst><br>
                    <jst id="n16" type='btn' label='Внещняя' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n16')"></jst><br>
                </div>
                
                <!--//ПАРАМЕТРЫ-->
                <div id="tabs-2" style="padding: 0px; display: none;"> 
                    <p class="pantitle" style="margin-bottom: 4px"> Параметры системы</p> 
                    <table id="table1"  class="ui-jqgrid-btable"></table>
                </div>
                
                <!--//СТОРОНА КОРОБКИ-->
                <div id="tabs-3" style="padding: 0px; display: none;">
                    <p class="pantitle"style='text-align: center'> Сторона коробки</p> 
                    <jst id="n31" type='btn' label='Артикул' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/sysprof.jsp?param=n31')"></jst><br>
                    <jst id="n32" type='txt' label='Название' width='80' width2="288"></jst><br>
                    <jst id="n36" type='txt' label='Аналог' width='80' width2="288"></jst><br>
                    <p class="pantitle"> Текстура</p>  
                    <jst id="n33" type='btn' label='Основная' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n33')"></jst><br>                          
                    <jst id="n34" type='btn' label='Внутренняя' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n34')"></jst><br>                          
                    <jst id="n35" type='btn' label='Внещняя' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n35')"></jst><br>                          
                </div>
                
                <!--//СТВОРКА-->
                <div id="tabs-4" style="padding: 0px; display: none;">
                    <p class="pantitle" style='text-align: center'> Створка</p> 
                    <div id="tabs-41">
                        <jst id="n41" type='txt' label='Ширина' width='60' width2="60"></jst> &nbsp; &nbsp;
                        <jst id="n42" type='txt' label='Высота' width='60' width2="60"></jst><br>                          
                        <jst id="n57" type='btn' label='Артикул' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/sysprof.jsp?param=n57')"></jst><br>
                        <jst id="n58" type='txt' label='Название' width='80' width2="288"></jst><br>
                        <jst id="n59" type='txt' label='Аналог' width='80' width2="288"></jst><br>
                        <p class="pantitle"> Текстура</p>  
                        <jst id="n60" type='btn' label='Основная' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n60')"></jst><br>                          
                        <jst id="n61" type='btn' label='Внутренняя' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n61')"></jst><br>                          
                        <jst id="n62" type='btn' label='Внещняя' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n62')"></jst><br>                          
                    </div>
                    <div id="tabs-42" style="display: none;">
                        <jst id="n43" type='btn' label='Фурнитура' width='120' width2="220" click="$('#dialog-jsp').load('frame/dialog/furniture.jsp?param=n43')"></jst><br>                          
                        <jst id="n44" type='btn' label='Сторона открыв.' width='120' width2="220" click="$('#dialog-jsp').load('frame/dialog/sideopen.jsp?param=n44')"></jst><br>                        
                        <jst id="n45" type='btn' label='Ручка артикул' width='120' width2="220" click="$('#dialog-jsp').load('frame/dialog/artikl.jsp?param=n45')"></jst><br>
                        <jst id="n4D" type='txt' label='Название' width='120' width2="250"></jst><br>
                        <jst id="n46" type='btn' label='Текстура ручки' width='120' width2="220" click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n46')"></jst><br>                                                                          
                        <jst id="n47" type='txt' label='Высота ручки' width='120' width2="153"></jst>
                        <jst id="n48" type='btn' label='' width='0' width2="47" click=""></jst><br>                            
                        <jst id="n49" type='btn' label='Петля' width='120' width2="220" click="$('#dialog-jsp').load('frame/dialog/artikl.jsp?param=n49')"></jst><br>
                        <jst id="n4E" type='txt' label='Название' width='120' width2="250"></jst><br>
                        <jst id="n4A" type='btn' label='Текстура подвеса' width='120' width2="220" click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n4A')"></jst><br>
                    </div>
                    <div id="tabs-43" style="display: none;">
                        <jst id="n4B" type='btn' label='Замок' width='120' width2="220" click="$('#dialog-jsp').load('frame/dialog/artikl.jsp?param=n4B')"></jst><br>
                        <jst id="n4G" type='txt' label='Название' width='120' width2="250"></jst><br>
                        <jst id="n4C" type='btn' label='Текстура замка' width='120' width2="220" click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n4C')"></jst><br>    
                        <jst id="n63" type='btn' label='*Моск.сетка' width='120' width2="220"></jst><br>
                        <jst id="n64" type='txt' label='*Название' width='120' width2="250"></jst><br>
                        <jst id="n65" type='btn' label='Текстура сетки' width='120' width2="220"  click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n65')"></jst><br>                           
                    </div>                    
                    <div id='south' class='abs' style='height: 22px'>
                        <button id="btnProdStv" style="width: 96px; height: 18px; padding: 0; margin: 3px 0 2px 16px;">Створка</button>
                        <button id="btnProdFurn" style="width: 116px; height: 18px; padding: 0; margin: 3px 0 2px 8px;">Фурнитура</button>
                        <button id="btnProdAdd" style="width: 116px; height: 18px; padding: 0; margin: 3px 0 2px 8px;">Дополн.</button>
                    </div>                      
                </div>
                
                <!--//ЗАПОЛНЕНИЕ-->
                <div id="tabs-5" style="padding: 0px; display: none;">
                    <p class="pantitle" style='text-align: center'> Заполнение</p> 
                    <jst id="n51" type='btn' label='Артикул' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/artikl.jsp?param=n51')"></jst><br>
                    <jst id="n52" type='txt' label='Название' width='80' width2="288"></jst><br>
                    <jst id="n53" type='btn' label='Цвет' width='80' width2="260" click="$('#dialog-jsp').load('frame/dialog/color.jsp?param=n53')"></jst><br>                   
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