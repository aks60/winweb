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
            }

            $(document).ready(function () {
              $(window).bind('resize', function () {
                product.resize();
              }).trigger('resize');

              product.load_tree($('#tree-iwin'));
            });
       
         function test() {
           let node = $("#tree-iwin").jstree("get_selected"); 
           alert($("#tree-iwin").jstree("get_selected")[0]);
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
                        <div2 class='tag2' type='txt' label='Полное наименование' name2="name1" width='200' dx="200"/><br>
                        <div2 class='tag2' type='txt' label='Сокращённое наименование' name2="name2" width='200' dx="200"/><br> 
                    </div>
                    <div id="east3" style="overflow-y: auto; height: 100%; width: 100%;">
                        <div id="tree-iwin"></div>
                    </div>                
                </div>
            </div>
        </div> 
        <div id="south" style="height: 20px">
            SOUTH
        </div> 
    </body>
</html>
