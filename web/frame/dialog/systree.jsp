<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SYSTREE</title>

        <style>
            #tab2-systree tr:hover {
                background:#E2EEFF;
            }
            #tab2-systree .activeRow, #tab2-systree .activeRow:hover {
                background:#6598C7;
                color:#fff;
            }
            #tab2-systree tr {
                height: 68px;
            }
            #tab2-systree tr > *:nth-child(1) {
                display: none !important;
            }
            #tab2-systree tr > *:nth-child(2) {
                width: 390px !important;
            }
            #tab2-systree tr > *:nth-child(3) {
                width: 68px !important;
            }
            #tab2-systree tr > *:nth-child(4) {
                display: none !important;
            }
        </style> 

        <script type="text/javascript">
//------------------------------------------------------------------------------
            var sysprodID = -1;
//------------------------------------------------------------------------------            
            function resize() {
                $("#tab1-systree").jqGrid('setGridWidth', $("#dialog-dic #midl #pan1-systree").width());
                $("#tab1-systree").jqGrid('setGridHeight', $("#dialog-dic #midl #pan1-systree").height() - 26);
            }
//------------------------------------------------------------------------------
            $(document).ready(function () {
                $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                    resize();
                });
                let tab_sysprod = document.getElementById('tab2-systree');
                tab_sysprod.setAttribute('activeRowIndex', 0);
                tab_sysprod.addEventListener('click', event_clicked);
                init_dialog($("#dialog-dic"));
                init_table($("#tab1-systree"), tab_sysprod);
                load_table($("#tab1-systree"), tab_sysprod);
                resize();
            });
//------------------------------------------------------------------------------
            function init_dialog(dialogTaq) {

                dialogTaq.dialog({
                    title: "Конструкции систем профилей",
                    width: 600,
                    height: 500,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            let orderRow = getSelectedRow($("#table1"));
                            let sysprodRec = dbset.sysprodList.find(rec => sysprodID == rec.list[eSysprod.id]);
                            if (sysprodRec != undefined) {

                                $.ajax({//Запишем скрипт в серверную базу данных
                                    url: 'dbset?action=insertPrjprod',
                                    data: {param: JSON.stringify({name: sysprodRec[eSysprod.name], script: sysprodRec[eSysprod.script],
                                            projectID: orderRow.id, systreeID: sysprodRec[eSysprod.systree_id]})},
                                    success: (data) => {
                                        if (data.result == 'ok') {
                                            let record = ['SEL', data.id, 0, sysprodRec[eSysprod.name],
                                                sysprodRec[eSysprod.script], orderRow.id, sysprodRec[eSysprod.systree_id]];
                                            dbset.prjprodList.push(record);
                                            order.add_prjprod(document.getElementById('table2'), record);

                                        } else
                                            dialogMes('Сообщение', "<p>" + data.result);
                                    },
                                    error: () => {
                                        dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
                                    }
                                });
                            }
                            $(this).dialog("close");
                        },
                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
//------------------------------------------------------------------------------
            function init_table(table1, table2) {

                table1.jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Категория'],
                    colModel: [
                        {name: 'id', index: 'id', width: 1, hidden: true, key: true},
                        {name: 'name', index: 'cname', width: 180}
                    ],
                    treeIcons: {plus: 'ui-icon-folder-collapsed', minus: 'ui-icon-folder-open', leaf: 'ui-icon-document'},
                    autowidth: true,
                    height: "auto",
                    sortname: 'id',
                    treeGrid: true,
                    treeGridModel: 'adjacency',
                    ExpandColumn: 'name',
                    ExpandColClick: true,
                    onSelectRow: function (rowid) {
                        //Очистим таблицу конструкций
                        let j = 1;
                        let rc = table2.rows.length;
                        for (let i = j; i < rc; i++) {
                            table2.deleteRow(j);
                        }
                        //Заполним табл. конструкций 
                        let systreeRec = table1.jqGrid('getRowData', rowid);
                        if (systreeRec.isLeaf == 'true') {
                            let sysprodList = dbset.sysprodList.filter(rec => systreeRec.id == rec.list[eSysprod.systree_id]);
                            if (sysprodList.length > 0) {
                                prjprodID = null;
                                for (let rec of sysprodList) {

                                    //Новая запись в таблице конструкций
                                    add_clone(table2, rec);
                                    //Первая конструкция
                                    if (prjprodID == null) {
                                        prjprodID = rec.list[eSysprod.id];
                                    }
                                }
                                //Программный клик на первой конструкции
                                document.getElementById('cnv' + prjprodID).click();
                            }
                        }
                        $('#tab2-systree tr > *:nth-child(1)').hide();
                    }
                });
            }
//------------------------------------------------------------------------------
            function load_table(table1, table2) {

                table1.jqGrid('clearGridData', true);
                $.ajax({
                    url: 'systree?action=sysTree',
                    success: function (data) {
                        table1[0].addJSONData({
                            total: 1,
                            page: 1,
                            records: data.sysTree.length,
                            rows: data.sysTree
                        });
                        table1.jqGrid("setSelection", 1);
                    }
                });
            }
//------------------------------------------------------------------------------
            function add_clone(table, sysprodRec) {

                let id = document.createTextNode(sysprodRec[eSysprod.id]);
                let name = document.createTextNode(sysprodRec[eSysprod.name]);
                let script = sysprodRec[eSysprod.script];

                let canvas = document.createElement("canvas");
                canvas.class = "cnv";
                canvas.id = 'cnv' + sysprodRec[eSysprod.id];
                canvas.width = 68;
                canvas.height = 68;

                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                let td3 = document.createElement('td');
                let tr = document.createElement('tr');

                td1.appendChild(id);
                td2.appendChild(name);
                td3.appendChild(canvas);

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                table.appendChild(tr);
                win.build(canvas, script);
            }
//------------------------------------------------------------------------------
            function event_clicked(e) {
                let row = parentTag(e.target, 'TR');
                if (row) {
                    let table = this, idx = table.getAttribute('activeRowIndex');
                    table.rows[idx].classList.remove('activeRow');
                    row.classList.add('activeRow');
                    table.setAttribute('activeRowIndex', row.rowIndex);
                    sysprodID = row.cells[0].innerHTML;
                }
            }
//------------------------------------------------------------------------------
            function parentTag(node, tag) {
                if (node)
                    return (node.tagName == tag) ? node : parentTag(node.parentElement, tag);
                return null;
            }
//------------------------------------------------------------------------------
        </script> 
    </head> 
    <body> 
        <div id="midl" style="position: relative; height: 99.6%; margin-right: 300px;">

            <div id="pan1-systree" style="height: 99.6%; width: 99%;">
                <table id="tab1-systree"  class="ui-jqgrid-btable"></table> 
            </div>

            <div id="pan2-systree" style="position: absolute; overflow-y: auto;  height: 99.6%; width: 290px; top: 0; right: -300px;">
                <table id="tab2-systree" border="1" cellspacing="0" cellpadding="0" bordercolor='#79b7e7'>
                    <tr style="height: 22px; background-color: #e7f4f9">
                        <th></th><th>Наименование</th><th>Изображение</th></tr>
                </table>            
            </div>

            <div id="dialog-mes" title="Сообщение"></div>
        </div>                   
    </body> 
</html> 

