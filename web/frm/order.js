//------------------------------------------------------------------------------
order.init_table = function (table1, table2) {
    table1.jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Номер заказа', 'Номер счёта', 'Дата от...', 'Дата до...', 'Контрагент', 'User'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'num_ord', width: 120, sorttype: "text"},
            {name: 'num_acc', width: 120, sorttype: "text"},
            {name: 'date4', width: 120, sorttype: "text"},
            {name: 'date6', width: 120, sorttype: "text"},
            {name: 'propart_id', width: 120, sorttype: "text"},
            {name: 'manager', width: 120, sorttype: "text"}
        ],
        onSelectRow: function (rowid) {

            order.wincalcMap.clear()
            let j = 1;
            let rc = table2.rows.length;
            for (let i = j; i < rc; i++) {
                table2.deleteRow(j);
            }
            let proprodID = null;
            let orderRec = table1.jqGrid('getRowData', rowid);
            for (let i = 0; i < dbset.proprodList.length; i++) {
                let proprodRec = dbset.proprodList[i];

                if (orderRec.id == proprodRec[PROPROD.project_id]) {
                    order.add_proprodClone(table2, proprodRec);
                    if (proprodID == null) {
                        proprodID = proprodRec[PROPROD.id];
                    }
                }
            }           
            if (proprodID != null && order.rec_table2 != undefined) {
                let id = 'cnv' + order.rec_table2[0];
                document.getElementById(id).click();

            } else if (proprodID != null) {
                let id = 'cnv' + proprodID;
                document.getElementById(id).click();
            }
            $('#table2 tr > *:nth-child(1)').hide();
            order.resize();
        }
    });
}
//------------------------------------------------------------------------------
order.load_table = function (table1, table2) {
    table1.jqGrid('clearGridData', true);
    $.ajax({
        url: 'order?action=orderList',
        success: function (data) {
            order.orderList = data.orderList;
            for (let i = 0; i < order.orderList.length; i++) {
                let tr = order.orderList[i];
                table1.jqGrid('addRowData', i + 1, {
                    id: tr[0],
                    num_ord: tr[1],
                    num_acc: tr[2],
                    date4: tr[3],
                    date6: tr[4],
                    propart_id: tr[5],
                    manager: tr[6]
                });
            }
            table1.jqGrid("setSelection", order.rowid_table1);
            order.resize();
        }
    });
}
//------------------------------------------------------------------------------
order.add_proprodClone = function (table, proprodRec) {

    let canvas = document.createElement("canvas");
    canvas.class = "cnv";
    canvas.id = 'cnv' + proprodRec[PROPROD.id];
    canvas.width = 68;
    canvas.height = 68;

    let id = document.createTextNode(proprodRec[PROPROD.id]);
    let name = document.createTextNode(proprodRec[PROPROD.name]);
    let script = proprodRec[PROPROD.script];
    let iwincalc = winc.build(canvas, script);

    //Массив объектов winc
    order.wincalcMap.set(proprodRec[PROPROD.id], iwincalc);

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

}
//------------------------------------------------------------------------------
order.taq_parent = function (node, tag) {
    if (node)
        return (node.tagName == tag) ? node : order.taq_parent(node.parentElement, tag);
    return null;
}
//------------------------------------------------------------------------------
order.event_clicked = function (e) {

    let row = order.taq_parent(e.target, 'TR');
    if (row) {
        let table = this, idx = table.getAttribute('activeRowIndex');
        table.rows[idx].classList.remove('activeRow');
        row.classList.add('activeRow');
        table.setAttribute('activeRowIndex', row.rowIndex);

        let proprodID = row.cells[0].innerHTML;
        order.rec_table2 = dbset.find_rec(proprodID, dbset.proprodList);
    }
}
//------------------------------------------------------------------------------


