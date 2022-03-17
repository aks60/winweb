<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SIDEOPEN</title>

        <script type="text/javascript">
//------------------------------------------------------------------------------
            sideopen.resize = function () {
                $("#tab-sideopen").jqGrid('setGridWidth', $("#dialog-dic #pan-sideopen").width());
                $("#tab-sideopen").jqGrid('setGridHeight', $("#dialog-dic #pan-sideopen").height() - 24);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                    sideopen.resize();
                });
                sideopen.init_dialog($("#tab-sideopen"));
                sideopen.init_table($("#tab-sideopen"));
                sideopen.load_table($("#tab-sideopen"));
                sideopen.resize();
            });
//------------------------------------------------------------------------------
            sideopen.init_dialog = function (table) {
                $("#dialog-dic").dialog({
                    title: "Направление открывания",
                    width: 400,
                    height: 400,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            sideopen.rec_dialog_save(table);
                            $(this).dialog("close");
                        },

                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            sideopen.init_table = function (table) {
                table.jqGrid({
                    datatype: "local",
                    gridview: true,
                    autowidth: true,
                    height: "auto",
                    colNames: ['id', 'Наименование'],
                    colModel: [
                        {name: 'id', hidden: true, key: true},
                        {name: 'name', width: 400, sorttype: "text"}
                    ], ondblClickRow: function (rowid) {
                        sideopen.rec_dialog_save(table);
                        $("#dialog-dic").dialog("close");
                    }
                });
            }
//------------------------------------------------------------------------------
            sideopen.load_table = function (table) {

                let typeOpen = [TypeOpen.LEFT, TypeOpen.LEFTUP, TypeOpen.LEFTMOV,
                    TypeOpen.RIGHT, TypeOpen.RIGHTUP, TypeOpen.RIGHTMOV, TypeOpen.UPPER, TypeOpen.FIXED];
                table.jqGrid('clearGridData', true);
                for (let i = 0; i < typeOpen.length; i++) {
                    let elem = typeOpen[i];
                    table.jqGrid('addRowData', i + 1, {
                        id: elem[0],
                        name: elem[1]
                    });
                }
                table.jqGrid("setSelection", 1);
            }
//------------------------------------------------------------------------------
            sideopen.rec_dialog_save = function (table) {

                let rowid = table.jqGrid('getGridParam', "selrow"); //index профиля из справочника
                let tableRec = table.jqGrid('getRowData', rowid);  //record справочника
                let elemID = $("#tree-winc").jstree("get_selected")[0]; //id элемента из tree
                let proprodID = order.prorodRec[PROPROD.id]; //id proprod заказа

                let winc = order.wincalcMap.get(proprodID);
                let elem = winc.elemList.find(it => it.id == elemID);
                elem.obj.param = (elem.obj.param == undefined) ? {} : elem.obj.param;
                elem.obj.param.typeOpen = tableRec.id; //запишем тип открывания
                let proprodRec = dbset.proprodList.find(rec => proprodID == rec[PROPROD.id]);
                proprodRec[PROPROD.script] = JSON.stringify(winc.obj, (k, v) => isEmpty(v)); //запишем профиль в локальн. бд  
                let iwincalc = win.build(winc.cnv, JSON.stringify(winc.obj, (k, v) => isEmpty(v)));
                order.wincalcMap.set(proprodID, iwincalc); //новый экз.

                $.ajax({//запишем профиль в серверную базу данных
                    url: 'dbset?action=updateScript',
                    data: {param: JSON.stringify({id: proprodID, script: JSON.stringify(winc.obj)})},
                    success: function (data) {
                        if (data.result == 'ok') {
                            $("#n44").val(tableRec.name);
                        }
                    },
                    error: function () {
                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                    }
                });
            }
//------------------------------------------------------------------------------
        </script>        
    </head>
    <body>
        <div id="pan-sideopen" style="height: calc(100% - 4px); width: calc(100% - 4px);">
            <table id="tab-sideopen"  class="ui-jqgrid-btable"></table> 
        </div>
        <div id="dialog-mes" title="Сообщение"></div>
    </body>
</html>


