<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
        <script type="text/javascript" src="jss/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="text/javascript" src="frm/product.js"></script>
        <title>Product</title>

        <script type="text/javascript">

            get_stvorka_fields();

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

            function test() {
                debugger;
                let id = order.rec_table2[PROPROD.id];
                let winc = order.wincalcMap.get(id);
                winc.ctx.fillStyle = '#ffffff';
                winc.ctx.clearRect(0, 0, winc.cnv.width, winc.cnv.height);
            }
        </script>
    </head>
    <body>
        <div id="north">
            <button id="btnReport" onClick="test();">Test1</button>
            <button id="btnUpdate" onClick="">Test2</button>
            <button id="btnIns" onClick="">Test3</button>

            <button id="btn1" onClick="$('#dialog-dic').load('frm/dialog/sysprof.jsp');">Sysprof</button> 
            <button id="btn2" onClick="$('#dialog-dic').load('frm/dialog/furniture.jsp');">Фурнитура</button>
            <button id="btn3" onClick="$('#dialog-dic').load('frm/dialog/color.jsp');">Color</button>
            <button id="btn4" onClick="$('#dialog-dic').load('frm/dialog/systree.jsp');">Systree</button>
        </div> 
        <div id = "context">
            <div id="midl" style="position: relative; margin-right: 400px; height: 100%;">
                <div id="centr" style="height: 100%; width: 100%;">
                    <canvas id="cnv2"></canvas>
                </div>
                <div id="east" style="position: absolute; margin-top: 268px; width: 396px; top: 0; right: -400px; bottom: 0;">
                    <div id="east2" style="margin-top: -270px; height: 268px; background: #efeffb">
                        <div id="tabs-1" style="padding: 0px;">  
                            <p id="a123" class="pantitle">Основные размеры*</p> 
                            <jst id="n11" type='txt' label='Ширина' width='80' width2="60"></jst><br>
                            <jst id="n12" type='txt' label='Высота1' width='80' width2="60"></jst><br>
                            <jst id="n13" type='txt' label='Высота2' width='80' width2="60"></jst><br>  
                            <p class="pantitle">Текстура изделия</p> 
                            <jst id="n14" type='btn' label='Основная' width='80' width2="260" click="color_to_windows(1);"></jst><br>
                            <jst id="n15" type='btn' label='Внутренняя' width='80' width2="260" click="color_to_windows(2);"></jst><br>
                            <jst id="n16" type='btn' label='Внещняя' width='80' width2="260" click="color_to_windows(3);"></jst><br>
                        </div>
                        <div id="tabs-2" style="padding: 0px; display: none;">   
                            <table id="table1"  class="ui-jqgrid-btable"></table> 
                        </div>
                        <div id="tabs-3" style="padding: 0px; display: none;">
                            <p class="pantitle">Сторона коробки</p> 
                            <jst id="n31" type='btn' label='Артикул' width='80' width2="260" click="sysprof_to_frame(1)"></jst><br>
                            <jst id="n32" type='txt' label='Название' width='80' width2="288"></jst><br>
                            <p class="pantitle">Текстура изделия</p>  
                            <jst id="n33" type='btn' label='Основная' width='80' width2="260" click="color_to_frame(4);"></jst><br>                          
                            <jst id="n34" type='btn' label='Внутренняя' width='80' width2="260" click="color_to_frame(5);"></jst><br>                          
                            <jst id="n35" type='btn' label='Внещняя' width='80' width2="260" click="color_to_frame(6);"></jst><br>                          
                        </div>
                        <div id="tabs-4" style="padding: 0px; display: none;">
                            <p class="pantitle">Створка</p> 
                            <jst id="n41" type='txt' label='Ширина' width='60' width2="60"></jst> &nbsp; &nbsp;
                            <jst id="n42" type='txt' label='Высота' width='60' width2="60"></jst><br>                        
                            <jst id="n43" type='bid=tn' label='Фурнитура' width='120' width2="220" click=""></jst><br>                          
                            <jst id="n44" type='btn' label='Сторона открывания' width='120' width2="220" click=""></jst><br>
                            <jst id="n45" type='btn' label='Ручка (арт/наименов)' width='120' width2="220" click=""></jst><br>
                            <jst id="n46" type='btn' label='Текстура ручки' width='120' width2="220" click=""></jst><br>                            
                            <jst id="n47" type='txt' label='Высота ручки' width='120' width2="153"></jst>
                            <jst id="n48" type='btn' label='' width='0' width2="47" click=""></jst><br>                            
                            <jst id="n49" type='btn' label='Подвес (арт/наименов)' width='120' width2="220" click=""></jst><br>
                            <jst id="n4A" type='btn' label='Текстура подвеса' width='120' width2="220" click=""></jst><br>
                            <jst id="n4B" type='btn' label='Замок (арт/наименов)' width='120' width2="220" click=""></jst><br>
                            <jst id="n4C" type='btn' label='Текстура замка' width='120' width2="220" click=""></jst><br>
                        </div>
                        <div id="tabs-5" style="padding: 0px; display: none;">
                            <p class="pantitle">Заполнение</p> 
                            <jst id="n51" type='btn' label='Артикул' width='80' width2="260" click="artikl_to_glass();"></jst><br>
                            <jst id="n52" type='txt' label='Название' width='80' width2="288"></jst><br>
                            <jst id="n53" type='btn' label='Цвет' width='80' width2="260" click=""></jst><br>
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
