<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
        <script type="text/javascript" src="jss/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="text/javascript" src="frm/product.js"></script>
        <!--<script type="text/javascript" src="frm/dialog/artikl2.js"></script>-->
        <title>Product</title>

        <script type="text/javascript">

            product.resize = function () {

                var height = window.innerHeight;
                $("#context").css("height", height - 80);
                let cvs = document.querySelector("#cnv2");
                if (cvs != undefined) {
                    cvs.width = $("#centr").width() - 4;
                    cvs.height = $("#centr").height() - 4;
                    win.build(cvs, order.rec_table2[PROPROD.script]);
                }
                let winWidth = $('#east').width() - 24;
                $("div .field2[dx]").each(function (index) {
                    var width = $(this).attr('dx');
                    $(this).width(winWidth - width);
                });
                $("#table1").jqGrid('setGridWidth', $("#east2").width() - 4);
                $("#table1").jqGrid('setGridHeight', $("#east2").height() - 24);
            }
            $(document).ready(function () {

                taq_deploy(['#tabs-1', '#tabs-2', '#tabs-3', '#tabs-4', '#tabs-5']);

                $(window).bind('resize', function () {
                    product.resize();
                }).trigger('resize');

                product.init_table($('#table1'));
                product.load_tree($('#tree-winc'));
                prepareToolBar();
                
            });

            function artikl_dialog() {
                $.getScript('frm/dialog/artikl.js', function () {
                    artikl.init_dialog();
                    artikl.init_table();
                    artikl.load_table();
                });
            }
            function sysprof_dialog() {
                $.getScript('frm/dialog/sysprof.js', function () {
                    sysprof.init_dialog();
                    sysprof.init_table();
                    sysprof.load_table();
                });
            }
        </script>
    </head>
    <body>
        <div id="north">
            <button id="btnReport" onClick="">Test1</button>
            <button id="btnUpdate" onClick="">Test2</button>
            <button id="btnIns" onClick="">Test3</button>

            <button id="btn1" onClick="$('#dialog-dic').load('frm/dialog/sysprof.jsp');">Sysprof</button> 
            <button id="btn2" onClick="artikl_dialog();">Artikl</button>
            <button id="btn3" onClick="$('#dialog-dic').load('frm/dialog/color.jsp');">Color</button>
            <button id="btn4" onClick="$('#dialog-dic').load('frm/dialog/systree.jsp');">Systree</button>
        </div> 
        <div id = "context">
            <div id="midl" style="position: relative; margin-right: 400px; height: 100%;">
                <div id="centr" style="height: 100%; width: 100%;">
                    <canvas id="cnv2" style="border:2px solid black;"></canvas>
                </div>
                <div id="east" style="position: absolute; margin-top: 268px; width: 396px; top: 0; right: -400px; bottom: 0;">
                    <div id="east2" style="margin-top: -270px; height: 268px; background: #efeffb">
                        <div id="tabs-1" style="padding: 0px;">  
                            <p id="a123" class="pantitle">Основные размеры*</p> 
                            <jst type='txt' label='Ширина' name="n11" width='80' wid1h="60"></jst><br>
                            <jst type='txt' label='Высота1' name="n12" width='80' wid1h="60"></jst><br>
                            <jst type='txt' label='Высота2' name="n13" width='80' wid1h="60"></jst><br>  
                            <p class="pantitle">Текстура изделия</p> 
                            <jst type='btn' label='Основная' name="n14" width='80' wid1h="260" click="color_to_windows(1);"></jst><br>
                            <jst type='btn' label='Внутренняя' name="n15" width='80' wid1h="260" click="color_to_windows(2);"></jst><br>
                            <jst type='btn' label='Внещняя' name="n16" width='80' wid1h="260" click="color_to_windows(3);"></jst><br>
                        </div>
                        <div id="tabs-2" style="padding: 0px; display: none;">   
                            <table id="table1"  class="ui-jqgrid-btable"></table> 
                        </div>
                        <div id="tabs-3" style="padding: 0px; display: none;">
                            <p class="pantitle">Сторона коробки</p> 
                            <jst type='btn' label='Артикул' name="n31" width='80' wid1h="260" click="sysprof_to_frame($(this).prev())"></jst><br>
                            <jst type='txt' label='Название' name="n32" width='80' wid1h="288"></jst><br>
                            <p class="pantitle">Текстура изделия</p>  
                            <jst type='btn' label='Основная' name="n33" width='80' wid1h="260" click="color_to_frame(1);"></jst><br>                          
                            <jst type='btn' label='Внутренняя' name="n34" width='80' wid1h="260" click="color_to_frame(2);"></jst><br>                          
                            <jst type='btn' label='Внещняя' name="n35" width='80' wid1h="260" click="color_to_frame(3);"></jst><br>                          
                        </div>
                        <div id="tabs-4" style="padding: 0px; display: none;">
                            <p class="pantitle">Створка</p> 
                            <jst type='txt' label='Ширина' name="n41" width='60' wid1h="60"></jst> &nbsp; &nbsp;
                            <jst type='txt' label='Высота' name="n42" width='60' wid1h="60"></jst><br>                        
                            <jst type='btn' label='Фурнитура' name="n43" width='120' wid1h="220" click=""></jst><br>                          
                            <jst type='btn' label='Сторона открывания' name="n44" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Ручка (арт/наименов)' name="n45" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Текстура ручки' name="n46" width='120' wid1h="220" click=""></jst><br>                            
                            <jst type='txt' label='Высота ручки' name="n47" width='120' wid1h="153"></jst>
                            <jst type='btn' label='' name="n48" width='0' wid1h="47" click=""></jst><br>                            
                            <jst type='btn' label='Подвес (арт/наименов)' name="n49" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Текстура подвеса' name="n4A" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Замок (арт/наименов)' name="n4B" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Текстура замка' name="n4C" width='120' wid1h="220" click=""></jst><br>
                        </div>
                        <div id="tabs-5" style="padding: 0px; display: none;">
                            <p class="pantitle">Заполнение</p> 
                            <jst type='btn' label='Артикул' name="n51" width='80' wid1h="260" click="artikl_to_glass(1);"></jst><br>
                            <jst type='txt' label='Название' name="n52" width='80' wid1h="288"></jst><br>
                            <jst type='btn' label='Цвет' name="n53" width='80' wid1h="260" click=""></jst><br>
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
    </body>
</html>
