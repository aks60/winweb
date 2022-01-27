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
                    winc.build(cvs, order.rec_table2[PROPROD.script]);
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

                product.load_tree($('#tree-iwin'));
                prepareToolBar();
            });

            function swich_page(type) {
                $("#tabs-1, #tabs-2, #tabs-3, #tabs-4, #tabs-5").hide();

                if (type == "RECTANGL" || type == "TRAPEZE" || type == "TRIANGL" || type == "ARCH" || type == "DOOR")
                    $("#tabs-1").show();
                else if (type == "DEF_PARAM")
                    $("#tabs-2").show();
                else if (type == "FRAME_SIDE" || type == "STVORKA_SIDE" || type == "IMPOST" || type == "SHTULP" || type == "STOIKA")
                    $("#tabs-3").show();
                else if (type == "STVORKA")
                    $("#tabs-4").show();
                else if (type == "GLASS")
                    $("#tabs-5").show();

            }

            function test() {
                $("#tabs-1 .field[name = 'name11']").val('777');
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
                <div id="east" style="position: absolute; margin-top: 268px; width: 396px; top: 0; right: -400px; bottom: 0">
                    <div id="east2" style="margin-top: -270px; height: 268px;">
                        <div id="tabs-1" style="padding: 0px;">  
                            <p class="pantitle">Основные размеры</p> 
                            <jst type='txt' label='Ширина' name="name11" width='80' wid1h="60"></jst><br>
                            <jst type='txt' label='Высота1' name="name12" width='80' wid1h="60"></jst><br>
                            <jst type='txt' label='Высота2' name="name13" width='80' wid1h="60"></jst><br>  
                            <p class="pantitle">Текстура изделия</p> 
                            <jst type='btn' label='Основная' name="name14" width='80' wid1h="260" click=""></jst><br>
                            <jst type='btn' label='Внутренняя' name="name15" width='80' wid1h="260" click=""></jst><br>
                            <jst type='btn' label='Внещняя' name="name16" width='80' wid1h="260" click=""></jst><br>
                        </div>
                        <div id="tabs-2" style="padding: 0px; display: none;">  
                            <p class="pantitle">Параметры изделия</p> 
                        </div>
                        <div id="tabs-3" style="padding: 0px; display: none;">
                            <p class="pantitle">Сторона рамы</p> 
                            <jst type='btn' label='Артикул' name="name31" width='80' wid1h="260" click=""></jst><br>
                            <jst type='txt' label='Название' name="name32" width='80' wid1h="288"></jst><br>
                            <p class="pantitle">Текстура изделия</p>  
                            <jst type='btn' label='Основная' name="name33" width='80' wid1h="260" click=""></jst><br>                          
                            <jst type='btn' label='Внутренняя' name="name34" width='80' wid1h="260" click=""></jst><br>                          
                            <jst type='btn' label='Внещняя' name="name35" width='80' wid1h="260" click=""></jst><br>                          
                        </div>
                        <div id="tabs-4" style="padding: 0px; display: none;">
                            <p class="pantitle">Створка</p> 
                            <jst type='txt' label='Ширина' name="name41" width='60' wid1h="60"></jst> &nbsp; &nbsp;
                            <jst type='txt' label='Высота' name="name42" width='60' wid1h="60"></jst><br>                        
                            <jst type='btn' label='Фурнитура' name="name43" width='120' wid1h="220" click=""></jst><br>                          
                            <jst type='btn' label='Напр. открывания' name="name44" width='120' wid1h="220" click=""></jst><br> 
                            <jst type='txt' label='Высота ручки' name="name45" width='120' wid1h="154"></jst>
                            <jst type='btn' label='' name="name46" width='0' wid1h="47" click=""></jst><br>                            
                            <jst type='btn' label='Ручка' name="name47" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Текстура' name="name48" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Подвес' name="name49" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Текстура' name="name410" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Замок' name="name411" width='120' wid1h="220" click=""></jst><br>
                            <jst type='btn' label='Текстура' name="name412" width='120' wid1h="220" click=""></jst><br>
                        </div>
                        <div id="tabs-5" style="padding: 0px; display: none;">
                            <jst type='btn' label='Артикул' name="name51" width='80' wid1h="260" click=""></jst><br>
                            <jst type='txt' label='Название' name="name52" width='80' wid1h="288"></jst><br>                         
                        </div>
                    </div>
                    <div id="east3" style="overflow-y: auto; height: 100%;">
                        <div id="tree-iwin"></div>
                    </div>                

                </div>
            </div> 
            <div id="south">
                Итого:
            </div> 
    </body>
</html>
