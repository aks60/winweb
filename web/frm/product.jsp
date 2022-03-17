<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
        <script type="text/javascript" src="jss/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="text/javascript" src="frm/product.js"></script>
        <title>Product</title>

        <script type="text/javascript">

            product.server_to_fields();

            product.resize = function () {
                var height = window.innerHeight;
                $("#context").css("height", height - 80);
                let cvs = document.querySelector("#cnv2");
                if (cvs != undefined) {
                    cvs.width = $("#centr").width() - 4;
                    cvs.height = $("#centr").height() - 4;
                    if (dbrec.prorodRec != undefined)
                        win.build(cvs, dbrec.prorodRec[PROPROD.script]);
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
                if (dbrec.prorodRec != undefined)
                    product.load_tree($('#tree-winc'));
                $("button").button();
                prepareToolBar();

            });
            function test() {
                for (let rec of dbset.artiklList) {
                    if (rec[1] == -3)
                        alert(rec);
                }
            }
        </script>
    </head>
    <body>
        <div id="north"></div> 
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
    </body>
</html>
