//------------------------------------------------------------------------------
product.load_tree = function () {

    let arr = new Array();
    let winc = order.wincalcMap.get(order.rec_table2[PROPROD.id]);
    let root = winc.root;

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

    $('#tree-iwin').jstree({'core': {
            'data': arr,
        }})
            .bind("loaded.jstree", function (event, data) {
                $(this).jstree("open_node", $("#0"));
            })
            .bind("select_node.jstree", function (evt, data) {
                let id = $("#tree-iwin").jstree("get_selected")[0];
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

    let id = order.rec_table2[PROPROD.id];
    if (proprodID >= 0) {
        let winc = order.wincalcMap.get(id);
        let elem = winc.elemList.find(it => it.id == proprodID);
        swich_page(elem);

    } else if (proprodID == -1) {
        swich_page({'type': 'DEF_PARAM'});

    }
}
//------------------------------------------------------------------------------
function swich_page(elem) {
    $("#tabs-1, #tabs-2, #tabs-3, #tabs-4, #tabs-5").hide();
    let tp = elem.type;
    let artikl = elem.artikl;
    if (tp == "RECTANGL" || tp == "TRAPEZE" || tp == "TRIANGL" || tp == "ARCH" || tp == "DOOR") {
        $("#tabs-1").show();

    } else if (tp == "DEF_PARAM") {
        $("#tabs-2").show();

    } else if (tp == "FRAME_SIDE" || tp == "STVORKA_SIDE" || tp == "IMPOST" || tp == "SHTULP" || tp == "STOIKA") {
        $("#tabs-3").show();

    } else if (tp == "STVORKA") {
        $("#tabs-4").show();

    } else if (tp == "GLASS") {
        $("#tabs-5").show();

    }
}

