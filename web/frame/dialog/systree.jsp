<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SYSTREE</title>

        <style>
            #tab2-tree  {
                border-collapse: collapse;
            }
            #tab2-tree tr {
                height: 68px;
            }
            #tab2-tree td {
                border: 1px solid #79b7e7;
            }
            #tab2-tree tr:hover {
                background:#E2EEFF;
            }
            #tab2-tree .activeRow, #tab2-tree .activeRow:hover {
                background:#6598C7;
                color:#fff;
            }
            #tab2-tree tr > *:nth-child(1) {
                display: none !important;
            }
            #tab2-tree tr > *:nth-child(2) {
                width: 390px !important;
            }
            #tab2-tree tr > *:nth-child(3) {
                width: 68px !important;
            }
            #tab2-tree tr > *:nth-child(4) {
                display: none !important;
            }
        </style>  

        <script type="module">
            import {Wincalc} from './build/Wincalc.js';
            import {Test2} from './frame/main.js';
//            import {add_prjprodRec} from '../order.js';

            var sysprodID = -1;
            var tab1Tree = document.getElementById('tab1-tree');
            var tab2Tree = document.getElementById('tab2-tree');

            tab2Tree.setAttribute('activeRowIndex', 0);
            tab2Tree.addEventListener('click', event_clicked);
            init_dialog($("#dialog-dic"));
            init_table();
            load_table1();
            resize();

            $("#dialog-dic").unbind().bind("dialogresize", function (event, ui) {
                resize();
            });

            function resize() {
                $("#tab1-ree").jqGrid('setGridWidth', $("#dialog-dic #midl #pan1-systree").width());
                $("#tab1-tree").jqGrid('setGridHeight', $("#dialog-dic #midl #pan1-systree").height() - 26);
            }

            function init_dialog(dialogTaq) {

                dialogTaq.dialog({
                    title: "Конструкции систем профилей",
                    width: 600,
                    height: 500,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            let orderRow = getSelectedRow($(tab1Tree));
                            let sysprodRec = eSysprod.list.find(rec => sysprodID == rec[eSysprod.id]);
                            if (sysprodRec != undefined) {

                                $.ajax({//Запишем скрипт в серверную базу данных
                                    url: 'dbset?action=insertPrjprod',
                                    data: {param: JSON.stringify({name: sysprodRec[eSysprod.name], script: sysprodRec[eSysprod.script],
                                            projectID: orderRow.id, systreeID: sysprodRec[eSysprod.systree_id]})},
                                    success: (data) => {
                                        if (data.result == 'ok') {
                                            let record = ['SEL', data.id, 0, sysprodRec[eSysprod.name],
                                                sysprodRec[eSysprod.script], orderRow.id, sysprodRec[eSysprod.systree_id]];
                                            ePrjprod.list.push(record);
                                            add_prjprod(tab2Tree, orderRow.id);

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

            function init_table() {

                $(tab1Tree).jqGrid({
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
                        load_table2(rowid);
                    }
                });
            }

            function load_table1() {

                $(tab1Tree).jqGrid('clearGridData', true);
                $.ajax({
                    url: 'systree?action=sysTree',
                    success: function (data) {
                        $(tab1Tree)[0].addJSONData({
                            total: 1,
                            page: 1,
                            records: data.sysTree.length,
                            rows: data.sysTree
                        });
                        $(tab1Tree).jqGrid("setSelection", 1);
                    }
                });
            }

            function load_table2(rowid) {
                //Очистим таблицу конструкций
                let rs = tab2Tree.rows.length;
                for (let i = 1; i < rs; i++) {
                    tab2Tree.deleteRow(1);
                }
                //Заполним табл. конструкций 
                let systreeRec = $(tab1Tree).jqGrid('getRowData', rowid);
                if (systreeRec.isLeaf === 'true') {
                    let sysprodList = eSysprod.list.filter(rec => systreeRec.id == rec[eSysprod.systree_id]);
                    if (sysprodList.length > 0) {
                        let prjprodID = null;

                        for (let rec of sysprodList) {
                            add_clone(rec); //новая запись в таблице конструкций                                    
                            if (prjprodID === null) {
                                prjprodID = rec[eSysprod.id]; //первая конструкция
                            }
                        }
                        document.getElementById('cnv' + prjprodID).click(); //программный клик на первой записи (конструкции)
                    }
                }
                $('#tab2-systree tr > *:nth-child(1)').hide();
            }

            function add_clone(sysprodRec) {

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
                tab2Tree.appendChild(tr);
                Wincalc.new(canvas, canvas.offsetWidth, canvas.offsetHeight, script);
            }

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

            function parentTag(node, tag) {
                if (node)
                    return (node.tagName == tag) ? node : parentTag(node.parentElement, tag);
                return null;
            }


            //document.getElementById('btnTest1k').addEventListener('click', () => alert('ok'));
        </script> 

    </head> 
    <body>                      
        <!--<button id="btnTest1k" style="width: 128px;">TEST</button>-->                                
        <div id="midl" style="position: relative; height: 99.6%; margin-right: 300px;">

            <div id="pan1-systree" style="height: 99.6%; width: 99%;">
                <table id="tab1-tree"  class="ui-jqgrid-btable"></table> 
            </div>

            <div id="pan2-systree" style="position: absolute; overflow-y: auto;  height: 99.6%; width: 290px; top: 0; right: -300px;">
                <table id="tab2-tree">
                    <tr style="height: 22px; background-color: #e7f4f9">
                        <th></th><th>Наименование</th><th>Изображение</th></tr>
                </table>            
            </div>

            <div id="dialog-mes" title="Сообщение"></div>
        </div>                   
    </body> 
</html> 

