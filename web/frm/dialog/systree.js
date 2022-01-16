//------------------------------------------------------------------------------
systree.init_dialog = function (dialog) {

    dialog.dialog({
        title: "Конструкции систем профилей",
        width: 600,
        height: 500,
        modal: false,
        buttons: {
            "Выбрать": function () {
//                winc.build(document.getElementById('cnv2'));

                let table = document.getElementById('tab-sysprod');
                let canvas = document.createElement("canvas");
                canvas.width = 68;
                canvas.height = 68;
                canvas.id = "cnv" + table.rows.length;;
                canvas.class = "cnv";                
                
                
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                let text1 = document.createTextNode('Text1');
                let text2 = document.createTextNode('Text2');
                let tr = document.createElement('tr');
                td1.appendChild(text1);
                td2.appendChild(canvas);
                tr.appendChild(td1);
                tr.appendChild(td2);
                table.appendChild(tr);

                systree.resize();
            },
            "Закрыть": function () {
                winc.build(document.getElementById('cnv3'));

                //$(this).dialog("close");
                //$("#tab-sysprod tbody tr").remove(); 
//                let j = 1;
//                let table = document.getElementById('tab-sysprod');
//                let rc = table.rows.length;
//                for (let i = j; i < rc; i++) {
//                    table.deleteRow(j);
//                }
            }
        }
    });
}
//------------------------------------------------------------------------------
systree.init_table = function (table1, table2) {

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
            //table2.jqGrid('clearGridData', true);
            let systreeRec = table1.jqGrid('getRowData', rowid);
            if (systreeRec.isLeaf == 'true') {
                for (i = 0; i < dbset.sysprodList.length; i++) {
                    let sysprodRec = dbset.sysprodList[i];
                    if (sysprodRec != undefined) {

                        let script = sysprodRec[SYSPROD.script];
                        if (sysprodRec[SYSPROD.systree_id] == systreeRec.id) {

                            /*table2.jqGrid('addRowData', i + 1, {                               
                             id: sysprodRec[SYSPROD.id],
                             name: sysprodRec[SYSPROD.name],
                             script: sysprodRec[SYSPROD.script],
                             systree_id: sysprodRec[SYSPROD.systree_id]
                             });*/
                        }
                    }
                }
                //table2.jqGrid("setSelection", 3);
            }
            systree.resize();
        }
    });
//    table2.jqGrid({
//        datatype: "local",
//        gridview: true,
//        rownumbers: true,
//        autowidth: true,
//        height: "auto",
//        colNames: ['id', 'Наименование', 'Рисунок', 'parent'],
//        colModel: [
//            {name: 'id', hidden: true, key: true},
//            {name: 'name', width: 80},
//            {name: 'script', width: 80},
//            {name: 'parent', hidden: true}]
//    });
}
//------------------------------------------------------------------------------
order.create_table = function (table_area, table) {
    //let tablearea = document.getElementById('tablearea');
    //let table = document.createElement('table');
    let tr = [];
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let text1 = document.createTextNode('Text1');
    let text2 = document.createTextNode('Text2');

    for (let i = 1; i < 4; i++) {
        tr[i] = document.createElement('tr');
        for (let j = 1; j < 4; j++) {
            td1.appendChild(text1);
            td2.appendChild(text2);
            tr[i].appendChild(td1);
            tr[i].appendChild(td2);
        }
        table.appendChild(tr[i]);
    }

    table_area.appendChild(table);
}
//------------------------------------------------------------------------------
systree.load_table = function (table1, table2) {

    table1.jqGrid('clearGridData', true);
    $.ajax({
        url: 'systree?action=sysTree',
        success: function (data) {
            systree.sysTree = data.sysTree;
            table1[0].addJSONData({
                total: 1,
                page: 1,
                records: systree.sysTree.length,
                rows: systree.sysTree
            });

            table1.jqGrid("setSelection", 1);
        }
    });
}
//------------------------------------------------------------------------------

