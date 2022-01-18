//------------------------------------------------------------------------------
product.init_table1 = function (table) {
        table.jqGrid({
            datatype: "local",
            gridview: true,
            //rownumbers: true,
            autowidth: true,
            height: "auto",            
            colNames: ['id', 'Наименование', 'Рисунок', 'project_id', 'systree_id'],
            colModel: [
                {name: 'id', hidden: true, key: true},
                {name: 'name', width: 120, sorttype: "text"},
                {name: 'scripl', width: 120, sorttype: "text"},
                {name: 'project_id', hidden: true},
                {name: 'systree_id', hidden: true}
            ]
        });
}
//------------------------------------------------------------------------------
product.load_table1 = function (table) {
    for (let i = 0; i < order.prodList.length; i++) {
        let tr = order.prodList[i];
        table.jqGrid('addRowData', i + 1, {
            id: tr[0],
            name: tr[1],
            script: tr[2],
            project_id: tr[3],
            systree_id: tr[4]
        });
    }
    product.resize();
}
//------------------------------------------------------------------------------
order.create_table = function (tablearea, table) {
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

    tablearea.appendChild(table);
}
//------------------------------------------------------------------------------

