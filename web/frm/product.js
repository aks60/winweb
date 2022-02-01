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
        winc = {type: 'DEF_PARAM'};
    }

    $("#tabs-1, #tabs-2, #tabs-3, #tabs-4, #tabs-5").hide();
    let elem = winc.elemList.find(it => it.id == proprodID);
    let artikl = elem.artikl;

    if (["RECTANGL", "TRAPEZE", "TRIANGL", "ARCH", "DOOR"].includes(elem.type, 0)) {
        let typ = {RECTANGL: 'Окно четырёхугольное', TRAPEZE: 'Окно трапециидальное', TRIANGL: 'Окно треугольное', ARCH: 'Окно арочное', DOOR: 'Дверь'};
        $("#tabs-1 :nth-child(1)").text(typ[winc.root.type]);
        load_fields('tabs-1', {
            n11: winc.width, n12: winc.height, n13: winc.heightAdd,
            n14: winc.rgb1[COLOR.name], n15: winc.rgb2[COLOR.name], n16: winc.rgb3[COLOR.name]
        }, ['n11', 'n12', 'n13', 'n14', 'n15', 'n16']);
        $("#tabs-1").show();

    } else if (winc.root.type == "DEF_PARAM") {
        $("#tabs-2").show();

    } else if (["FRAME_SIDE", "STVORKA_SIDE", "IMPOST", "SHTULP", "STOIKA"].includes(elem.type, 0)) {
        let lay = {BOTT: 'нижняя', RIGHT: 'правая', TOP: 'верхняя', LEFT: 'левая', VERT: 'вертикальный', HORIZ: 'горизонтальный'};
        if (elem.type == "FRAME_SIDE") {
            $("#tabs-3 :nth-child(1)").text('Сторона коробки ' + lay[elem.layout]);
        } else if (elem.type == "STVORKA_SIDE") {
            $("#tabs-3 :nth-child(1)").text('Сторона створки ' + lay[elem.layout]);
        } else {
            $("#tabs-3 :nth-child(1)").text('Импост ' + lay[elem.layout]);
        }
        load_fields('tabs-3', {
            n31: elem.artiklAn[ARTIKL.code], n32: elem.artiklAn[ARTIKL.name],
            n33: elem.rgb1[COLOR.name], n34: elem.rgb2[COLOR.name], n35: elem.rgb3[COLOR.name]
        }, ['n31', 'n32', 'n33', 'n34', 'n35']);
        $("#tabs-3").show();

    } else if (elem.type == "STVORKA") {
        let furnitureRec = dbset.furnitureList.find(rec => elem.sysfurnRec[SYSFURN.furniture_id] == rec[FURNITURE.id]);
        //Сторона открывания
        let side_open = "откидная";
        if ([1, 3, 11].includes(elem.typeOpen, 0)) {
            side_open = "левая";
        } else if ([2, 4, 12].includes(elem.typeOpen, 0)) {
            side_open = "правая";
        }
        //Положение или высота ручки на створке
        let obj = {MIDL: 'По середине', CONST: 'Константная', VARIAT: 'Установлена'};
        load_fields('tabs-4', {
            n41: elem.width(), n42: elem.height(), n43: furnitureRec[FURNITURE.name],
            n44: side_open, n45: obj[elem.handleLayout], n46: elem.handleHeight, 
            n47: elem.handleRec[ARTIKL.code] + ' ÷ ' + elem.handleRec[ARTIKL.name],
            n48: dbset.colorList.find(rec => elem.handleColor == rec[COLOR.id])[COLOR.name]
        }, ['n41', 'n42', 'n43', 'n44', 'n45', 'n46', 'n47', 'n48']);
        $("#tabs-4").show();

    } else if (elem.type == "GLASS") {
        load_fields('tabs-5', {
            n51: elem.artiklRec[ARTIKL.code], n52: elem.artiklRec[ARTIKL.name], n53: elem.rgb1[COLOR.name]
        }, ['n51', 'n52', 'n53']);
        $("#tabs-5").show();

    }
}
//------------------------------------------------------------------------------

