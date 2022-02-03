<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
        <script type="text/javascript" src="jss/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="text/javascript" src="frm/product.js"></script>
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
            }
            $('button').button();
            $(document).ready(function () {

                taq_deploy(['#tabs-1', '#tabs-2', '#tabs-3', '#tabs-4', '#tabs-5']);

                $(window).bind('resize', function () {
                    product.resize();
                }).trigger('resize');

                product.load_tree($('#tree-winc'));
                prepareToolBar();
            });

            function test() {
                $("#tabs-1 .field[name = 'n11']").val('777');
                load_fields('tabs-1', {'n12': '888', 'n13': '999'}, ['n12', 'n13']);
            }
        </script>
    </head>
    <body>
        <div id="north">
            <button id="btnReport" onClick="test();">Test1</button>
            <button id="btnReport" onClick="$('#tabs-1 .login').val('asd');">Test2</button>
            <button id="btnReport" onClick="$('#tabs-1 input.field :nth-child(1)').val('asd');">Test3</button>
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
                            <jst type='btn' label='Основная' name="n14" width='80' wid1h="260" click=""></jst><br>
                            <jst type='btn' label='Внутренняя' name="n15" width='80' wid1h="260" click=""></jst><br>
                            <jst type='btn' label='Внещняя' name="n16" width='80' wid1h="260" click=""></jst><br>
                        </div>
                        <div id="tabs-2" style="padding: 0px; display: none;">  
                            <p class="pantitle">Параметры изделия</p> 
                        </div>
                        <div id="tabs-3" style="padding: 0px; display: none;">
                            <p class="pantitle">Сторона коробки</p> 
                            <jst type='btn' label='Артикул' name="n31" width='80' wid1h="260" click=""></jst><br>
                            <jst type='txt' label='Название' name="n32" width='80' wid1h="288"></jst><br>
                            <p class="pantitle">Текстура изделия</p>  
                            <jst type='btn' label='Основная' name="n33" width='80' wid1h="260" click=""></jst><br>                          
                            <jst type='btn' label='Внутренняя' name="n34" width='80' wid1h="260" click=""></jst><br>                          
                            <jst type='btn' label='Внещняя' name="n35" width='80' wid1h="260" click=""></jst><br>                          
                        </div>
                        <div id="tabs-4" style="padding: 0px; display: none;">
                            <p class="pantitle">Створка</p> 
                            <jst type='txt' label='Ширина' name="n41" width='60' wid1h="60"></jst> &nbsp; &nbsp;
                            <jst type='txt' label='Высота' name="n42" width='60' wid1h="60"></jst><br>                        
                            <jst type='btn' label='Фурнитура' name="n43" width='120' wid1h="220" click=""></jst><br>                          
                            <jst type='btn' label='Сторона открывания' name="n44" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Ручка (арт/цвет)' name="n45" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Текстура' name="n46" width='120' wid1h="220" click=""></jst><br>                            
                            <jst type='txt' label='Высота ручки' name="n47" width='120' wid1h="154"></jst>
                            <jst type='btn' label='' name="n48" width='0' wid1h="47" click=""></jst><br>                            
                            <jst type='btn' label='Подвес (арт/цвет)' name="n49" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Текстура' name="n4A" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Замок (арт/цвет)' name="n4B" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Текстура' name="n4C" width='120' wid1h="220" click=""></jst><br>
                        </div>
                        <div id="tabs-5" style="padding: 0px; display: none;">
                            <jst type='btn' label='Артикул' name="n51" width='80' wid1h="260" click=""></jst><br>
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
