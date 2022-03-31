<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
        <script type="text/javascript" src="jss/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="text/javascript" src="frm/product.js"></script>
        <title>PRODUCT</title>
        <style>
            #scale1-hor, #scale2-hor, #scale1-ver, #scale-cnv {
                display: inline-block;
                border: 0;
                /*border: 1px solid #00f;*/
            }
            #scale1-hor {
                width: calc(100% - 2px);
                height: 24px;
            }
            #scale2-hor {
                width: calc(100% - 2px);
                height: 24px;
            }
            #scale1-ver {
                width: 24px;
                height: calc(100% - 57px);
            }
            #scale-cnv {
                width: calc(100% - 60px);
                height: calc(100% - 57px);
            }
            #scale2-hor input, #scale1-ver input  {
                text-align: center;
                font-weight: bold;
                font-size: 16px;
                border: 0;
                border-right: 4px solid #00f;
                height: 12px;
                margin-top: 8px;
            }
            #scale1-ver input[type="text"] {
                transform: rotate(-90deg);
                transform-origin: left 0;
                position: absolute;
                bottom: 18px;
            }
            .btn {
                font-weight: bold;
                font-size: 16px;
                width: 26px;
            }
        </style> 
        <script type="text/javascript">

            var winCalc = null; //выбранная конструкция

            product.server_to_fields();

            product.resize = function () {
                var height = window.innerHeight;
                $("#context").css("height", height - 80);
                
                //Прорисовка конструкции
                let cvs = document.querySelector("#cnv");
                if (cvs != undefined) {
                    cvs.width = $("#scale-cnv").width();
                    cvs.height = $("#scale-cnv").height();                 
                    if (order.prjprodRec != null)
                        winCalc = win.build(cvs, order.prjprodRec[PRJPROD.script]);
                }                                                                

                //Прорисовка горизонтальных размеров
                $('#scale2-hor input').each((i, el) => el.remove());
                let elemScaleHor = winCalc.root.lineArea(winCalc, 'HORIZ');
                elemScaleHor.forEach((el, i) => {
                    let inpt = document.createElement('input');
                    $(inpt).val(el.width());
                    $(inpt).width(el.width() * winCalc.scale - 8);
                    $('#scale2-hor').append(inpt);
                });

                //Прорисовка вертикальных размеров
                $('#scale1-ver input').each((i, el) => el.remove());
//                let elemScaleVer = winCalc.root.lineArea(winCalc, 'VERT');
//                elemScaleVer.forEach((el, i) => {
//                    let w = el.height() * winCalc.scale - 8;
//                    let s = document.getElementById("scale1-ver");
//                    s.innerHTML += "<input value='" + el.height() + "'  type='text' size='2'' style='width: " + w + "px'>";
//                });

                let winWidth = $('#east').width() - 24;
                $("div .field2[dx]").each(function (index) {
                    var width = $(this).attr('dx');
                    $(this).width(winWidth - width);
                });
                $("#table1").jqGrid('setGridWidth', $("#east2").width() - 4);
                $("#table1").jqGrid('setGridHeight', $("#east2").height() - 24);
            }

            $(document).ready(function () {
                taqDeploy(['#tabs-1', '#tabs-2', '#tabs-3', '#tabs-4', '#tabs-5']);
                $(window).bind('resize', () => product.resize()).trigger('resize');
                product.init_table($('#table1'));
                product.load_tree($('#tree-winc'));
                prepareToolBar();

            });

            function test() {
                var sc = document.getElementById("scale1-ver");
                sc.innerHTML = "<input value='888'  type='text' size='2'' style='width: 682px'>";
            }
        </script>
    </head>
    <body>
        <div id="north">
            <button id="btnProd3" style="width: 128px" onClick="test();">TEST</button>
        </div> 
        <div id = "context">
            <div id="midl" style="position: relative; margin-right: 400px; height: 100%;">
                <div id="centr" style="height: 100%; width: 100%; margin-top: 2px;">
                    <!--=====================================================-->
                    <div id="scale1-hor"> 
                        <button class="btn">+</button>
                    </div>                    
                    <div id="scale1-ver">
                        <input value='888'  type='text' size='2'" style="width: 682px">
                    </div> 
                    <div id="scale-cnv">                    
                        <canvas id="cnv"></canvas>
                    </div>                     
                    <div id="scale2-hor"">
                        <button class="btn" style="float: left">-</button>
                        <input value='800'  type='text'" size="2" style="width: 381px;">
                        <input value='800'  type='text'" size="2" style="width: 382px;">
                        <button class="btn" style="float: right">+</button>
                    </div> 
                    <!--=====================================================-->
                </div>
                <div id="east" style="position: absolute; margin-top: 268px; width: 396px; top: 0; right: -400px; bottom: 0;">
                    <div id="east2" style="margin-top: -270px; height: 268px; background: #efeffb">

                        <div id="tabs-1" style="padding: 0px;">  
                            <p class="pantitle">Основные размеры*</p> 
                            <jst id="n11" type='txt' label='Ширина' width='80' width2="60"></jst><br>
                            <jst id="n12" type='txt' label='Высота1' width='80' width2="60"></jst><br>
                            <jst id="n13" type='txt' label='Высота2' width='80' width2="60"></jst><br>  
                            <p class="pantitle">Текстура изделия</p> 
                            <jst id="n14" type='btn' label='Основная' width='80' width2="260" click="product.color_to_windows('n14');"></jst><br>
                            <jst id="n15" type='btn' label='Внутренняя' width='80' width2="260" click="product.color_to_windows('n15');"></jst><br>
                            <jst id="n16" type='btn' label='Внещняя' width='80' width2="260" click="product.color_to_windows('n16');"></jst><br>
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
