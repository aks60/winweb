//------------------------------------------------------------------------------
product.init_table = function (table1) {
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
        ExpandColClick: true
    });
}
//------------------------------------------------------------------------------
product.load_table = function (table1) {

    table1.jqGrid('clearGridData', true);
    let winс = order.wincalcMap.get(order.rec_table2[PROPROD.id]);

    let arr = new Array();
    arr.push({parent: 0, level: 0, name: 'Окно четырёхугольное', id: 0, isLeaf: false});
    arr.push({parent: 0, level: 1, name: 'Параметры по умолчанию', id: 1, isLeaf: true});
    arr.push({parent: 0, level: 1, name: 'Коробка', id: 2, isLeaf: false});
    arr.push({parent: 2, level: 2, name: 'Рама нижняя', id: 3, isLeaf: true});
    arr.push({parent: 2, level: 2, name: 'Рама правая', id: 4, isLeaf: true});

    table1[0].addJSONData({
        total: 1, page: 1,
        records: arr.length,
        rows: arr
    });
    product.resize();
}
//------------------------------------------------------------------------------






//product.create_table = function (tablearea, table) {
//    //let tablearea = document.getElementById('tablearea');
//    //let table = document.createElement('table');
//    let tr = [];
//    let td1 = document.createElement('td');
//    let td2 = document.createElement('td');
//    let text1 = document.createTextNode('Text1');
//    let text2 = document.createTextNode('Text2');
//
//    for (let i = 1; i < 4; i++) {
//        tr[i] = document.createElement('tr');
//        for (let j = 1; j < 4; j++) {
//            td1.appendChild(text1);
//            td2.appendChild(text2);
//            tr[i].appendChild(td1);
//            tr[i].appendChild(td2);
//        }
//        table.appendChild(tr[i]);
//    }
//
//    tablearea.appendChild(table);
//}
////------------------------------------------------------------------------------
//product.create_tree_iwin = function () {
//    $('#tree-iwin').jstree({'core': {
//            'data': [
//                {"id": "1", "parent": "#", "text": "Окно четырёхугольное"},
//                {"id": "2", "parent": "1", "text": "Параметры конструкции"},
//                {"id": "3", "parent": "1", "text": "Коробка"},
//                {"id": "4", "parent": "3", "text": "Сторона коробки"},
//                {"id": "5", "parent": "3", "text": "Сторона коробки"},
//                {"id": "6", "parent": "3", "text": "Сторона коробки"},
//                {"id": "7", "parent": "3", "text": "Сторона коробки"},
//                {"id": "8", "parent": "1", "text": "Створка"},
//                {"id": "9", "parent": "1", "text": "Створка"},
//            ]
//        }});
//}

