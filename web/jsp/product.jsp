<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
        <script type="text/javascript" src="js/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="text/javascript" src="js/product.js"></script>
        <title>Product</title>

        <script type="text/javascript">
            product.resize = function () {
                var height = window.innerHeight;
                $("#context").css("height", height - 102);
                $("#table1").jqGrid('setGridWidth', $("#east3").width() - 4);
                $("#table1").jqGrid('setGridHeight', $("#east3").height() - 28);
            }

            function loadTable(id) {
                for (i = 0; i < 3; i++) {
                    $("#table1").jqGrid('addRowData', i + 1, {
                    });
                }
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    product.resize();
                }).trigger('resize');
            });
        </script>
    </head>
    <body>
        <div id = "context">
            <div id="midl" style="position: relative; margin-right: 480px; height: calc(100% - 24px)">
                <div id="centr" style="height: 100%; width: 100%;">
                    CENTER
                </div>
                <div id="east" style="position: absolute; margin-top: 300px; width: 476px; top: 0; right: -480px; bottom: 0">
                    <div id="east2" style="margin-top: -302px; height: 300px;">
                        EAST2
                    </div>
                    <div id="east3" style="height: 100%; width: 100%;">
                        <table id="table1"  class="ui-jqgrid-btable"></table> 
                        <script type="text/javascript">
                            product.init_table1($("#table1"));
                            product.load_table1($("#table1"));
                        </script> 
                    </div>                
                </div>
            </div>
            <div id="south" style="height: 20px">
                SOUTH
            </div> 
        </div> 
    </body>
</html>
