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

            $(document).ready(function () {

                taq_deploy(['#tabs-1', '#tabs-2', '#tabs-3', '#tabs-4', '#tabs-5']);

                $(window).bind('resize', function () {
                    product.resize();
                }).trigger('resize');

                product.load_tree($('#tree-iwin'));
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
        <div id="north" style=" height: 20px;">
            <button onClick="test();">Кнопка1</button>
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
                            <div2 class='tag2' type='txt' label='Полное1' name2="name1" width='200' wid1h="254"></div2><br>
                            <div2 class='tag2' type='btn' label='Органh' name2="name2" width='200' wid1h="226" click=""></div2><br>
                        </div>
                        <div id="tabs-2" style="padding: 0px; display: none;">                            
                            <div2 class='tag2' type='txt' label='Полное2' name2="name3" width='200' wid1h="254"></div2><br>
                            <div2 class='tag2' type='btn' label='Органh' name2="name4" width='200' wid1h="226" click=""></div2><br>
                        </div>
                        <div id="tabs-3" style="padding: 0px; display: none;">
                            <div2 class='tag2' type='txt' label='Полное3' name2="name5" width='200' wid1h="254"></div2><br>
                            <div2 class='tag2' type='btn' label='Органh' name2="name6" width='200' wid1h="226" click=""></div2><br>                          
                        </div>
                        <div id="tabs-4" style="padding: 0px; display: none;">
                            <div2 class='tag2' type='txt' label='Полное4' name2="name7" width='200' wid1h="254"></div2><br>
                            <div2 class='tag2' type='btn' label='Органh' name2="name8" width='200' wid1h="226" click=""></div2><br>                          
                        </div>
                        <div id="tabs-5" style="padding: 0px; display: none;">
                            <div2 class='tag2' type='txt' label='Полное5' name2="name9" width='200' wid1h="254"></div2><br>
                            <div2 class='tag2' type='btn' label='Органh' name2="name10" width='200' wid1h="226" click=""></div2><br>                          
                        </div>
                    </div>
                    <div id="east3" style="overflow-y: auto; height: 100%;">
                        <div id="tree-iwin"></div>
                    </div>                

                </div>
            </div> 
            <div id="south" style="height: 20px">
                SOUTH
            </div> 
    </body>
</html>
