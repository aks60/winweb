//------------------------------------------------------------------------------
product.load_tree = function () {

    let arr = new Array();
    let win = order.wincalcMap.get(order.rec_table2[PROPROD.id]);
    let root = win.root;

    if (root.type == 'RECTANGL')
        arr.push({'id': root.id, 'parent': '#', 'text': 'Окно четырёхугольное', 'icon': 'img/tool/folder.gif'});
    else if (root.type == 'TRAPEZE')
        arr.push({'id': root.id, 'parent': '#', 'text': 'Окно трапеция', 'icon': 'img/tool/folder.gif'});
    else if (root.type == 'TRIANGL')
        arr.push({'id': root.id, 'parent': '#', 'text': 'Треугольное окно', 'icon': 'img/tool/folder.gif'});
    else if (root.type == 'ARCH')
        arr.push({'id': root.id, 'parent': '#', 'text': 'Арочное окно', 'icon': 'img/tool/folder.gif'});

    arr.push({'id': -1, 'parent': root.id, 'text': 'Параметры по умолчанию', 'icon': 'img/tool/leaf.gif'});
    arr.push({'id': -2, 'parent': root.id, 'text': 'Коробка', 'icon': 'img/tool/folder.gif'});

    arr.push({'id': root.frames.get('BOTT').id, 'parent': -2, 'text': 'Рама нижняя', 'icon': 'img/tool/leaf.gif'});
    arr.push({'id': root.frames.get('RIGHT').id, 'parent': -2, 'text': 'Рама правая', 'icon': 'img/tool/leaf.gif'});
    arr.push({'id': root.frames.get('TOP').id, 'parent': -2, 'text': 'Рама верхняя', 'icon': 'img/tool/leaf.gif'});
    arr.push({'id': root.frames.get('LEFT').id, 'parent': -2, 'text': 'Рама левая', 'icon': 'img/tool/leaf.gif'});

    elements(root, arr);  //вход в рекурсию    

    $('#tree-winc').jstree({'core': {
            'data': arr,
        }})
            .bind("loaded.jstree", function (event, data) {
                $(this).jstree('open_node', $('#0'));
                $(this).jstree('select_node', 0.0);
            })
            .bind("select_node.jstree", function (evt, data) {
                let id = $("#tree-winc").jstree("get_selected")[0];
                view_winc_property(id);
            });
}
//------------------------------------------------------------------------------
function elements(com, arr) {

    if (com.type == "STVORKA") {
        arr.push({'id': com.id, 'parent': 0, 'text': 'Створка', 'icon': 'img/tool/folder.gif'});
        arr.push({'id': com.frames.get('BOTT').id, 'parent': com.id, 'text': 'Рама нижняя', 'icon': 'img/tool/leaf.gif'});
        arr.push({'id': com.frames.get('RIGHT').id, 'parent': com.id, 'text': 'Рама правая', 'icon': 'img/tool/leaf.gif'});
        arr.push({'id': com.frames.get('TOP').id, 'parent': com.id, 'text': 'Рама верхняя', 'icon': 'img/tool/leaf.gif'});
        arr.push({'id': com.frames.get('LEFT').id, 'parent': com.id, 'text': 'Рама левая', 'icon': 'img/tool/leaf.gif'});
        for (let com2 of com.childs) {
            if (com2.type == "GLASS") {
                arr.push({'id': com2.id, 'parent': com.id, 'text': 'Заполнение (Стеклопакет, стекло)', 'icon': 'img/tool/leaf.gif'});
            }
        }
    } else {
        for (let com2 of com.childs) {
            if (['AREA', 'STVORKA'].includes(com2.type, 0)) {
                elements(com2, arr);
            } else {
                if (["IMPOST", "SHTULP", "STOIKA"].includes(com2.type, 0)) {
                    let lay = (com.layout == "VERT") ? ' (горизонтальная)' : ' {вертикальная)'
                    arr.push({'id': com2.id, 'parent': -2, 'text': 'Ригель, импост, стойка' + lay, 'icon': 'img/tool/leaf.gif'});

                } else if (com2.type == "GLASS") {
                    arr.push({'id': com2.id, 'parent': -2, 'text': 'Заполнение (Стеклопакет, стекло)', 'icon': "img/tool/leaf.gif"});
                }
            }
        }
    }
}
//------------------------------------------------------------------------------
function view_winc_property(proprodID) {

    let winc = null;
    let id = order.rec_table2[PROPROD.id];
    if (proprodID >= 0) {
        winc = order.wincalcMap.get(id);
    } else if (proprodID == -1) {
        winc = {'type': 'DEF_PARAM'};
    }

    $("#tabs-1, #tabs-2, #tabs-3, #tabs-4, #tabs-5").hide();
    let elem = winc.elemList.find(it => it.id == proprodID);
    let artikl = elem.artikl;

    if (["RECTANGL", "TRAPEZE", "TRIANGL", "ARCH", "DOOR"].includes(winc.root.type, 0)) {
        let typ = {"RECTANGL": 'Окно четырёхугольное', "TRAPEZE": 'Окно трапециидальное', "TRIANGL": 'Окно треугольное', "ARCH": 'Окно арочное', "DOOR": 'Дверь'};
        $("#tabs-1 :nth-child(1)").text(typ[winc.root.type]);
        load_fields('tabs-1', {
            'name11': winc.width, 'name12': winc.height, name13: winc.heightAdd,
            name14: winc.rgb1[COLOR.name], name15: winc.rgb2[COLOR.name], name16: winc.rgb3[COLOR.name]
        }, ['name11', 'name12', 'name13', 'name14', 'name15', 'name16']);
        $("#tabs-1").show();

    } else if (winc.root.type == "DEF_PARAM") {
        $("#tabs-2").show();

    } else if (["FRAME_SIDE", "STVORKA_SIDE", "IMPOST", "SHTULP", "STOIKA"].includes(elem.type, 0)) {
        debugger;
        let lay = {'BOTT': 'нижняя', 'RIGHT': 'правая', 'TOP': 'верхняя', 'LEFT': 'левая', 'VERT': 'вертикальный', 'HORIZ': 'горизонтальный'};
        if (elem.type == "FRAME_SIDE") {
            $("#tabs-3 :nth-child(1)").text('Сторона коробки ' + lay[elem.layout]);
        } else if (elem.type == "STVORKA_SIDE") {
            $("#tabs-3 :nth-child(1)").text('Сторона створки ' + +lay[elem.layout]);
        } else {
            $("#tabs-3 :nth-child(1)").text('Импост ' + +lay[elem.layout]);
        }
//        load_fields('tabs-3', {
//            'name11': winc.width, 'name12': winc.height, name13: winc.heightAdd,
//            name14: winc.rgb1[COLOR.name], name15: winc.rgb2[COLOR.name], name16: winc.rgb3[COLOR.name]
//        }, ['name11', 'name12', 'name13', 'name14', 'name15', 'name16']);
        $("#tabs-3").show();

    } else if (elem.type == "STVORKA") {
        $("#tabs-4").show();

    } else if (elem.type == "GLASS") {
        $("#tabs-5").show();

    }
}
//------------------------------------------------------------------------------

