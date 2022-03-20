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

                kits.init_table($("#table1"));
                kits.load_table($("#table1"));
                $("button").button();
                taq_deploy(['#dialog-card']);
                prepareToolBar();
            });
        </script>         
    </head>
    <body>
        <div id="north">   
            <button id="btnKit1" style="width: 160px" onClick="$('#dialog-dic').load('frm/dialog/kitcard.jsp');">Добавить комплект</button>
            <button id="btnKit2" style="width: 160px" onClick="">Добавить артикул</button>
            <button id="btnKit3" style="width: 160px" onClick="kits.update_table1('#dialog-card');">Изменить артикул</button>
            <button id="btnKit4" style="width: 160px" onClick="kits.delete_record($('#table1'));">Удалить запись</button>            
        </div> 
        <div id = "context">               
            <div id="title" style="height: 40px">               
            </div>
            <div id="dialog-card" card_width="416" card_height="230" style="display: none;">
                <jst id="n21" type='txt' label='Номер заказа' width='80' width2="120"></jst><br>
                <jst id="n22" type='txt' label='Номер счёта' width='80' width2="120"></jst><br>
                <jst id="n23" type='txt' label='Дата от...' width='80' width2="80"></jst><br>
                <jst id="n24" type='txt' label='Дата до...' width='80' width2="80"></jst><br>
                <jst id="n25" type='btn' label='Контрагент' width='80' width2="260" fk="-3" click="$('#dialog-dic').load('frm/dialog/dealer.jsp');"></jst><br>
            </div>            
            <div id="centr" style="height: calc(100% - 40px)">
                <table id="table1"  class="ui-jqgrid-btable"></table> 
            </div>          
        </div>
        <div id="south">
            Итого:
        </div>
    </body>
</html>