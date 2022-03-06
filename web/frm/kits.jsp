<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="frm/kits.js"></script> 
        <title>KITS</title>

        <script type="text/javascript">
            kits.resize = function () {
                var height = window.innerHeight;
                $("#context").css("height", height - 80);
                $("#table1").jqGrid('setGridWidth', $("#centr").width() - 4);
                $("#table1").jqGrid('setGridHeight', $("#centr").height() - 24);
            }

            $(document).ready(function () {
                $(window).bind('resize', function () {
                    kits.resize();
                }).trigger('resize');

                kits.init_table1($("#table1"));
                kits.load_table1($("#table1"));
            });
        </script>         
    </head>
    <body>
        <div id="north">   
            <button id="btnIns" onClick="">Добавить</button>
            <button id="btnUpdate" onClick="">Изменить</button>
            <button id="btnSave" onClick="">Сохранить</button>
            <button id="btnDelit" onClick="">Удалить</button>            
        </div> 
        <div id = "context">              
            <div id="centr" style="height: 100%">
                <table id="table1"  class="ui-jqgrid-btable"></table> 
            </div>          
        </div>
        <div id="south">
            Итого:
        </div>
    </body>
</html>
