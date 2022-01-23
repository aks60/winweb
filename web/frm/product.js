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
    let winc = order.wincalcMap.get(order.rec_table2[PROPROD.id]);
    let root = winc.root;

    if (winc.root.type == 'RECTANGL')
        arr.push({'id': 0, 'parent': 0, 'level': 0, 'name': 'Окно четырёхугольное', 'isLeaf': false});
    else if (winc.root.type == 'TRAPEZE')
        arr.push({'id': 0, 'parent': 0, 'level': 0, 'name': 'Окно трапеция', 'isLeaf': false});
    else if (winc.root.type == 'TRIANGL')
        arr.push({'id': 0, 'parent': 0, 'level': 0, 'name': 'Треугольное окно', 'isLeaf': false});
    else if (winc.root.type == 'ARCH')
        arr.push({'id': 0, 'parent': 0, 'level': 0, 'name': 'Арочное окно', 'isLeaf': false});

    arr.push({'id': -2, 'parent': 0, 'level': 1, 'name': 'Параметры по умолчанию', 'isLeaf': true});
    arr.push({'id': -3, 'parent': 0, 'level': 1, 'name': 'Коробка', 'isLeaf': false});

    arr.push({'id': root.frames.get('BOTT').id, 'parent': -3, 'level': 3, 'name': 'Рама нижняя', 'isLeaf': true});
    arr.push({'id': root.frames.get('RIGHT').id, 'parent': -3, 'level': 3, 'name': 'Рама правая', 'isLeaf': true});
    arr.push({'id': root.frames.get('TOP').id, 'parent': -3, 'level': 3, 'name': 'Рама верхняя', 'isLeaf': true});
    arr.push({'id': root.frames.get('LEFT').id, 'parent': -3, 'level': 3, 'name': 'Рама левая', 'isLeaf': true});

    element(root, arr);  //вход в рекурсию    
//debugger;
    table1[0].addJSONData({
        total: 1, page: 1,
        records: arr.length,
        rows: arr
    });
    product.resize();
}
function element(com, arr) {

    if (com instanceof Stvorka) {
        arr.push({'id': com.id, 'parent': 0, 'level': 1, 'name': 'Створка', 'isLeaf': false});

        arr.push({'id': com.frames.get('BOTT').id, 'parent': com.id, 'level': 2, 'name': 'Рама нижняя', 'isLeaf': true});
        arr.push({'id': com.frames.get('RIGHT').id, 'parent': com.id, 'level': 2, 'name': 'Рама правая', 'isLeaf': true});
        arr.push({'id': com.frames.get('TOP').id, 'parent': com.id, 'level': 2, 'name': 'Рама верхняя', 'isLeaf': true});
        arr.push({'id': com.frames.get('LEFT').id, 'parent': com.id, 'level': 2, 'name': 'Рама левая', 'isLeaf': true});

        for (let com2 of com.childs) {
            if (com2 instanceof Glass) {
                arr.push({'id': com2.id, 'parent': com.id, 'level': 2, 'name': 'Заполнение (Стеклопакет, стекло)', 'isLeaf': true});
            }
        }
    } else {
        for (let com2 of com.childs) {

            if (com2 instanceof Area) {
                element(com2, arr);
            } else {
                if (com2 instanceof Cross) {
                    let lay = (com.layout == "VERT") ? ' (горизонтальная)' : ' {вертикальная)'
                    arr.push({'id': com2.id, 'parent': -3, 'level': 3, 'name': 'Ригель, импост, стойка' + lay, 'isLeaf': true});

                } else if (com2 instanceof Glass) {
                    arr.push({'id': com2.id, 'parent': -3, 'level': 3, 'name': 'Заполнение (Стеклопакет, стекло)', 'isLeaf': true});
                }
            }
        }
    }
}
//------------------------------------------------------------------------------
export function load_tree() {
    let arr = new Array();
    let winc = order.wincalcMap.get(order.rec_table2[PROPROD.id]);
    let root = winc.root;

    if (root.type == 'RECTANGL')
        arr.push({'id': root.id, 'parent': '#', 'text': 'Окно четырёхугольное', 'icon': 'img/tool/open.gif'});
    else if (root.type == 'TRAPEZE')
        arr.push({'id': root.id, 'parent': '#', 'text': 'Окно трапеция', 'icon': 'img/tool/open.gif'});
    else if (root.type == 'TRIANGL')
        arr.push({'id': root.id, 'parent': '#', 'text': 'Треугольное окно', 'icon': 'img/tool/open.gif'});
    else if (root.type == 'ARCH')
        arr.push({'id': root.id, 'parent': '#', 'text': 'Арочное окно', 'icon': 'img/tool/open.gif'});

    arr.push({'id': -1, 'parent': root.id, 'text': 'Параметры по умолчанию', 'icon': 'img/tool/leaf.gif'});
    arr.push({'id': -2, 'parent': root.id, 'text': 'Коробка', 'icon': 'img/tool/open.gif'});

    arr.push({'id': root.frames.get('BOTT').id, 'parent': -2, 'text': 'Рама нижняя', 'icon': 'img/tool/leaf.gif'});
    arr.push({'id': root.frames.get('RIGHT').id, 'parent': -2, 'text': 'Рама правая', 'icon': 'img/tool/leaf.gif'});
    arr.push({'id': root.frames.get('TOP').id, 'parent': -2, 'text': 'Рама верхняя', 'icon': 'img/tool/leaf.gif'});
    arr.push({'id': root.frames.get('LEFT').id, 'parent': -2, 'text': 'Рама левая', 'icon': 'img/tool/leaf.gif'});

    elements(root, arr);  //вход в рекурсию    

    $('#tree-iwin').jstree({'core': {
            'data': arr,
        }}).jstree("set_theme", "default").bind("loaded.jstree", function (event, data) {
        $(this).jstree("open_node", $("#0"));
    });
}

function elements(com, arr) {

    if (com instanceof Stvorka) {
        arr.push({'id': com.id, 'parent': 0, 'text': 'Створка'});
        arr.push({'id': com.frames.get('BOTT').id, 'parent': com.id, 'text': 'Рама нижняя', 'icon': 'img/tool/leaf.gif'});
        arr.push({'id': com.frames.get('RIGHT').id, 'parent': com.id, 'text': 'Рама правая', 'icon': 'img/tool/leaf.gif'});
        arr.push({'id': com.frames.get('TOP').id, 'parent': com.id, 'text': 'Рама верхняя', 'icon': 'img/tool/leaf.gif'});
        arr.push({'id': com.frames.get('LEFT').id, 'parent': com.id, 'text': 'Рама левая', 'icon': 'img/tool/leaf.gif'});
        for (let com2 of com.childs) {
            if (com2 instanceof Glass) {
                arr.push({'id': com2.id, 'parent': com.id, 'text': 'Заполнение (Стеклопакет, стекло)', 'icon': 'img/tool/leaf.gif'});
            }
        }
    } else {
        for (let com2 of com.childs) {

            if (com2 instanceof Area) {
                elements(com2, arr);
            } else {
                if (com2 instanceof Cross) {
                    let lay = (com.layout == "VERT") ? ' (горизонтальная)' : ' {вертикальная)'
                    arr.push({'id': com2.id, 'parent': -2, 'text': 'Ригель, импост, стойка' + lay, 'icon': 'img/tool/leaf.gif'});

                } else if (com2 instanceof Glass) {
                    arr.push({'id': com2.id, 'parent': -2, 'text': 'Заполнение (Стеклопакет, стекло)', 'icon': "img/tool/leaf.gif"});
                }
            }
        }
    }
}

