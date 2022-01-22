//------------------------------------------------------------------------------
import {Root, Area, Stvorka, Cross, Frame, Glass, Com5t} from './builder/model.js';
//------------------------------------------------------------------------------
export function init_table(table1) {
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
export function load_table(table1) {

    table1.jqGrid('clearGridData', true);
    let arr = new Array();
    let winс = order.wincalcMap.get(order.rec_table2[PROPROD.id]);

    if (winс.root.type == 'RECTANGL')
        arr.push({id: -1, parent: 0, level: 0, name: 'Окно четырёхугольное', isLeaf: false});
    else if (winс.root.type == 'TRAPEZE')
        arr.push({id: -1, parent: 0, level: 0, name: 'Окно трапеция', isLeaf: false});
    else if (winс.root.type == 'TRIANGL')
        arr.push({id: -1, parent: 0, level: 0, name: 'Треугольное окно', isLeaf: false});
    else if (winс.root.type == 'ARCH')
        arr.push({id: -1, parent: 0, level: 0, name: 'Арочное окно', isLeaf: false});

    arr.push({id: -2, parent: 0, level: 1, name: 'Параметры по умолчанию', isLeaf: true});
    arr.push({id: -3, parent: 0, level: 1, name: 'Коробка', isLeaf: false});

    winс.root.frames.forEach((frm, key, map) => {
        if (frm.layout == 'BOTT')
            arr.push({id: frm.id, parent: -3, level: 2, name: 'Рама нижняя', isLeaf: true});
        else if (frm.layout == 'RIGHT')
            arr.push({id: frm.id, parent: -3, level: 2, name: 'Рама правая', isLeaf: true});
        else if (frm.layout == 'TOP')
            arr.push({id: frm.id, parent: -3, level: 2, name: 'Рама верхняя', isLeaf: true});
        else if (frm.layout == 'LEFT')
            arr.push({id: frm.id, parent: -3, level: 2, name: 'Рама левая', isLeaf: true});
    });

    table1[0].addJSONData({
        total: 1, page: 1,
        records: arr.length,
        rows: arr
    });
    product.resize();
}
//------------------------------------------------------------------------------
export function load_tree() {
    $('#tree-iwin').jstree({'core': {
            'data': [
                {"id": "1", "parent": "#", "text": "Окно четырёхугольное"},
                {"id": "2", "parent": "1", "text": "Параметры конструкции"},
                {"id": "3", "parent": "1", "text": "Коробка"},
                {"id": "4", "parent": "3", "text": "Сторона коробки"},
                {"id": "5", "parent": "3", "text": "Сторона коробки"},
                {"id": "6", "parent": "3", "text": "Сторона коробки"},
                {"id": "7", "parent": "3", "text": "Сторона коробки"},
                {"id": "8", "parent": "1", "text": "Створка"},
                {"id": "9", "parent": "1", "text": "Створка"},
            ]
        }});
}
product.load_tree2 = function (owner, arr, lev) {

    if (owner instanceof Root) {
        if (owner.type == 'RECTANGL')
            arr.push({id: owner.id, parent: null, level: lev, name: 'Окно четырёхугольное', isLeaf: false});
        else if (owner.type == 'TRAPEZE')
            arr.push({id: owner.id, parent: null, level: lev, name: 'Окно трапеция', isLeaf: false});
        else if (owner.type == 'TRIANGL')
            arr.push({id: owner.id, parent: null, level: lev, name: 'Треугольное окно', isLeaf: false});
        else if (owner.type == 'ARCH')
            arr.push({id: owner.id, parent: null, level: lev, name: 'Арочное окно', isLeaf: false});

        arr.push({id: -1, parent: owner.id, level: lev, name: 'Параметры по умолчанию', isLeaf: true});
    }
    if (owner instanceof Root || owner instanceof Stvorka) {

        let name = (owner instanceof Root) ? 'Коробка' : 'Створка';
        arr.push({id: owner.id, parent: null, level: ++lev, name: name, isLeaf: false});

        arr.push({id: owner.frames.get('BOTT').id, parent: owner.id, level: lev, name: 'Рама нижняя', isLeaf: true});
        arr.push({id: owner.frames.get('RIGHT').id, parent: owner.id, level: lev, name: 'Рама правая', isLeaf: true});
        arr.push({id: owner.frames.get('TOP').id, parent: owner.id, level: lev, name: 'Рама верхняя', isLeaf: true});
        arr.push({id: owner.frames.get('LEFT').id, parent: owner.id, level: lev, name: 'Рама левая', isLeaf: true});
    }
    for (let com of owner.childs) {
        if (com instanceof Area) {
            product.load_tree(com, arr, ++lev);
        } else {
            if (com instanceof Cross) {
                let lay = (com.layout == "VERT") ? ' {вертикальная)' : ' (горизонтальная)'
                arr.push({id: com.id, parent: owner.id, level: lev, name: 'Ригель, импост, стойка' + lay, isLeaf: true});
            } else if (com instanceof Glass) {
                arr.push({id: com.id, parent: owner.id, level: lev, name: 'Заполнение (Стеклопакет, стекло)', isLeaf: true});
            }
        }
    }
}

