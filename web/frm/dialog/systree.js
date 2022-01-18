//------------------------------------------------------------------------------
systree.init_dialog = function (dialog) {

    dialog.dialog({
        title: "Конструкции систем профилей",
        width: 600,
        height: 500,
        modal: false,
        buttons: {
            "Выбрать": function () {
//                let table2 = document.getElementById('tab-sysprod');
//                let j = 1;
//                let rc = table2.rows.length;
//                for (let i = j; i < rc; i++) {
//                    table2.deleteRow(j);
//                }
                systree.resize();
            },
            "Закрыть": function () {
                $(this).dialog("close");
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
            let j = 1;
            let rc = table2.rows.length;
            for (let i = j; i < rc; i++) {
                table2.deleteRow(j);
            }
            let systreeRec = table1.jqGrid('getRowData', rowid);
            if (systreeRec.isLeaf == 'true') {
                for (let i = 0; i < dbset.sysprodList.length; i++) {
                    let sysprodRec = dbset.sysprodList[i];
                    
                    if (sysprodRec != undefined && systreeRec.id == sysprodRec[SYSPROD.systree_id]) {
                        systree.clone_sysprodRec(table2, sysprodRec);
                    }
                }
            }
            $('#tab-sysprod tr > *:nth-child(1)').hide();
            systree.resize();
        }
    });
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
systree.clone_sysprodRec = function (table, sysprodRec) {
//debugger;
    let id = document.createTextNode(sysprodRec[SYSPROD.id]);
    let name = document.createTextNode(sysprodRec[SYSPROD.name]);
    let script = sysprodRec[SYSPROD.script];

    let canvas = document.createElement("canvas");
    canvas.class = "cnv";
    canvas.id = 'cnv' + sysprodRec[SYSPROD.id];
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
    winc.build(canvas, script);    
}
//------------------------------------------------------------------------------
systree.get_parentTag = function (node, tag) {
    if (node)
        return (node.tagName == tag) ? node : systree.get_parentTag(node.parentElement, tag);
    return null;
}
//------------------------------------------------------------------------------
systree.event_clicked = function (e) {
    var row = systree.get_parentTag(e.target, 'TR');
    if (row) {
        let table = this, idx = table.getAttribute('activeRowIndex');
        table.rows[idx].classList.remove('activeRow');
        row.classList.add('activeRow');
        table.setAttribute('activeRowIndex', row.rowIndex);
        systree.sysprodID = row.cells[0].innerHTML;
        alert('info = ' + systree.sysprodID);
    }
}
//------------------------------------------------------------------------------
