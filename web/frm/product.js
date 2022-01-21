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
    let arr = new Array();
    let winс = order.wincalcMap.get(order.rec_table2[PROPROD.id]);

    if (winс.root.type == 'RECTANGL')
        arr.push({parent: 0, level: 0, name: 'Окно четырёхугольное', id: -1, isLeaf: false});
    else if (winс.root.type == 'TRAPEZE')
        arr.push({parent: 0, level: 0, name: 'Окно трапеция', id: -1, isLeaf: false});
    else if (winс.root.type == 'TRIANGL')
        arr.push({parent: 0, level: 0, name: 'Треугольное окно', id: -1, isLeaf: false});
    else if (winс.root.type == 'ARCH')
        arr.push({parent: 0, level: 0, name: 'Арочное окно', id: -1, isLeaf: false});

    arr.push({parent: 0, level: 1, name: 'Параметры по умолчанию', id: -2, isLeaf: true});
    arr.push({parent: 0, level: 1, name: 'Коробка', id: -3, isLeaf: false});

    winс.root.frames.forEach((frm, key, map) => {
        if (frm.layout == 'BOTT')
            arr.push({parent: -3, level: 2, name: 'Рама нижняя', id: frm.id, isLeaf: true});
        else if (frm.layout == 'RIGHT')
            arr.push({parent: -3, level: 2, name: 'Рама правая', id: frm.id, isLeaf: true});
        else if (frm.layout == 'TOP')
            arr.push({parent: -3, level: 2, name: 'Рама верхняя', id: frm.id, isLeaf: true});
        else if (frm.layout == 'LEFT')
            arr.push({parent: -3, level: 2, name: 'Рама левая', id: frm.id, isLeaf: true});
    });

    table1[0].addJSONData({
        total: 1, page: 1,
        records: arr.length,
        rows: arr
    });
    product.resize();
}
//------------------------------------------------------------------------------

