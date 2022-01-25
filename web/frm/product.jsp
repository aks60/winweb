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

                taq_deploy(['#tabs-1', '#tabs-2', '#tabs-3']);

                $(window).bind('resize', function () {
                    product.resize();
                }).trigger('resize');

                product.load_tree($('#tree-iwin'));
            });

            function on_page(val) {
                $("#tabs-1, #tabs-2, #tabs-3").hide();
                $("#tabs-" + val).show();
            }

            function test() {
                //debugger;
                let id = order.rec_table2[PROPROD.id];
                let winc = order.wincalcMap.get(id);
                winc.elemList.find(function(el, index, array) {
                    console.log(el);
                });
                let e = winc.elemList.find(el => el.id == id);
                alert(e);
            }
        </script>
    </head>
    <body>
        <div id="north" style=" height: 20px;">
            <button onClick="test();">Кнопка1</button>
        </div> 
        <div id = "context">
            <div id="midl" style="position: relative; margin-right: 480px; height: 100%;">
                <div id="centr" style="height: 100%; width: 100%;">
                    <canvas id="cnv2" style="border:2px solid black;"></canvas>
                </div>
                <div id="east" style="position: absolute; margin-top: 300px; width: 476px; top: 0; right: -480px; bottom: 0">
                    <div id="east2" style="margin-top: -302px; height: 300px;">
                        <div id="tabs-1" style="padding: 0px;">                                                            
                            <div2 class='tag2' type='txt' label='Полное' name2="name1" width='200' wid1h="254"></div2><br>
                            <div2 class='tag2' type='btn' label='Органh' name2="name2" width='200' wid1h="226" click=""></div2><br>
                        </div>
                        <div id="tabs-2" style="padding: 0px; display: none;">                            
                            <div2 class='tag2' type='txt' label='Полное' name2="name3" width='200' wid1h="254"></div2><br>
                            <div2 class='tag2' type='btn' label='Органh' name2="name4" width='200' wid1h="226" click=""></div2><br>>
                        </div>
                        <div id="tabs-3" style="padding: 0px; display: none;">
                            <div2 class='tag2' type='txt' label='Полное' name2="name5" width='200' wid1h="254"></div2><br>
                            <div2 class='tag2' type='btn' label='Органh' name2="name6" width='200' wid1h="226" click=""></div2><br>>                           
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
