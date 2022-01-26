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
            }
        </script>
    </head>
    <body>
        <div id="north">
            <button id="btnIns" onClick="test();">Кнопка1</button>
            <button onClick="$('#tabs-1, #tabs-2, #tabs-3, #tabs-4, #tabs-5').hide();">Кнопка2</button>
        </div> 
        <div id = "context">
            <div id="midl" style="position: relative; margin-right: 480px; height: 100%;">
                <div id="centr" style="height: 100%; width: 100%;">
                    <canvas id="cnv2" style="border:2px solid black;"></canvas>
                </div>
                <div id="east" style="position: absolute; margin-top: 300px; width: 476px; top: 0; right: -480px; bottom: 0">
                    <div id="east2" style="margin-top: -302px; height: 300px;">
                        <div id="tabs-1" style="padding: 0px;">  
                            <p class="pantitle">Основные размеры</p> 
                            <div2 class='tag2' type='txt' label='Ширина' name2="name11" width='80' wid1h="60"></div2><br>
                            <div2 class='tag2' type='txt' label='Высота1' name2="name12" width='80' wid1h="60"></div2><br>
                            <div2 class='tag2' type='txt' label='Высота2' name2="name13" width='80' wid1h="60"></div2><br>  
                            <p class="pantitle">Текстура изделия</p> 
                            <div2 class='tag2' type='btn' label='Основная' name2="name14" width='80' wid1h="240" click=""></div2><br>
                            <div2 class='tag2' type='btn' label='Внутренняя' name2="name15" width='80' wid1h="260" click=""></div2><br>
                            <div2 class='tag2' type='btn' label='Внещняя' name2="name16" width='80' wid1h="260" click=""></div2><br>
                        </div>
                        <div id="tabs-2" style="padding: 0px; display: none;">  
                            <p class="pantitle">Параметры изделия</p> 
                        </div>
                        <div id="tabs-3" style="padding: 0px; display: none;">
                            <p class="pantitle">Сторона рамы</p> 
                            <div2 class='tag2' type='btn' label='Артикул' name2="name31" width='80' wid1h="260" click=""></div2><br>
                            <div2 class='tag2' type='txt' label='Название' name2="name32" width='80' wid1h="288"></div2><br>
                            <p class="pantitle">Текстура изделия</p>  
                            <div2 class='tag2' type='btn' label='Основная' name2="name33" width='80' wid1h="260" click=""></div2><br>                          
                            <div2 class='tag2' type='btn' label='Внутренняя' name2="name34" width='80' wid1h="260" click=""></div2><br>                          
                            <div2 class='tag2' type='btn' label='Внещняя' name2="name35" width='80' wid1h="260" click=""></div2><br>                          
                        </div>
                        <div id="tabs-4" style="padding: 0px; display: none;">
                            <p class="pantitle">Створка</p> 
                            <div2 class='tag2' type='txt' label='Ширина' name2="name41" width='60' wid1h="60"></div2> &nbsp; &nbsp;
                            <div2 class='tag2' type='txt' label='Высота' name2="name42" width='60' wid1h="60"></div2><br>                        
                            <div2 class='tag2' type='btn' label='Фурнитура' name2="name43" width='120' wid1h="220" click=""></div2><br>                          
                            <div2 class='tag2' type='btn' label='Напр. открывания' name2="name44" width='120' wid1h="220" click=""></div2><br>                          
                            <div2 class='tag2' type='btn' label='Высота ручки' name2="name45" width='120' wid1h="220" click=""></div2><br>                          

                        </div>
                        <div id="tabs-5" style="padding: 0px; display: none;">
                            <div2 class='tag2' type='btn' label='Артикул' name2="name51" width='80' wid1h="260" click=""></div2><br>
                            <div2 class='tag2' type='txt' label='Название' name2="name52" width='80' wid1h="288"></div2><br>                         
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
