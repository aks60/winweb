//------------------------------------------------------------------------------
product.init_table = function (table1) {

    table1.jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Параметр', 'Знач.по умолч...', 'Закреплено'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'text', width: 220, sorttype: "text", edittype: "button"},
            {name: 'val', width: 180, sorttype: "text"},
            {name: 'fixed', width: 60, sorttype: "text"}

        ], ondblClickRow: function (rowid) {
            $('#dialog-dic').load('frm/dialog/sysprof.jsp');
        }
    });
}
//------------------------------------------------------------------------------
product.load_table = function (table1) {

    table1.jqGrid('clearGridData', true);
    let winc = order.wincalcMap.get(order.rec_table2[PROPROD.id]);
    //for (let val of winc.pardefMap.values()) {
    //let syspar1List2 = dbset.syspar1List.filter(rec => winc.nuni == rec[SYSPAR1.systree_id]);
    for (let i = 0; i < syspar1List2.length; i++) {
        let syspar1Rec = syspar1List2[i];
        let paramsRec = dbset.paramsList.find(tr => syspar1Rec[SYSPAR1.params_id] == tr[PARAMS.id]);
        table1.jqGrid('addRowData', i + 1, {

            id: syspar1Rec[SYSPAR1.id],
            text: paramsRec[PARAMS.text],
            val: syspar1Rec[SYSPAR1.text],
            fixed: syspar1Rec[SYSPAR1.fixed]
        });
    }
    table1.jqGrid("setSelection", product.rowid_table1);
    setTimeout(function () {
        product.resize();
    }, 10);
}
//------------------------------------------------------------------------------
product.load_tree = function (tabtree) {

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
    
    elements(root, arr); //вход в рекурсию    

    tabtree.jstree({'core': {
            'data': arr,
        }})
            .bind("loaded.jstree", function (event, data) {
                $(this).jstree('open_node', $('#0'));
                $(this).jstree('select_node', 0.0);
            })
            .bind("select_node.jstree", function (evt, data) {
                let node = tabtree.jstree("get_selected")[0];
                view_winc_property(node);
            });
    setTimeout(function () {
        product.resize();
    }, 10);
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
function view_winc_property(nodeID) {

    nodeID = (nodeID == -2) ? 0 : nodeID;
    let elem = {};
    let id = order.rec_table2[PROPROD.id];
    let winc = order.wincalcMap.get(id);
    if (nodeID == -1) {
        elem = {type: 'DEF_PARAM'};
    } else {
        elem = winc.elemList.find(it => it.id == nodeID);
    }
    $("#tabs-1, #tabs-2, #tabs-3, #tabs-4, #tabs-5").hide();
    if (["RECTANGL", "TRAPEZE", "TRIANGL", "ARCH", "DOOR"].includes(elem.type, 0)) {
        let typ = {RECTANGL: 'Окно четырёхугольное', TRAPEZE: 'Окно трапециидальное', TRIANGL: 'Окно треугольное', ARCH: 'Окно арочное', DOOR: 'Дверь'};
        $("#tabs-1 :nth-child(1)").text(typ[winc.root.type]);
        load_fields('tabs-1', {
            n11: winc.width, n12: winc.height, n13: winc.heightAdd,
            n14: winc.color1Rec[COLOR.name], n15: winc.color2Rec[COLOR.name], n16: winc.color3Rec[COLOR.name]
        }, ['n11', 'n12', 'n13', 'n14', 'n15', 'n16']);
        $("#tabs-1").show();
    } else if (elem.type == "DEF_PARAM") {
        product.load_table($('#table1'));
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
            n33: elem.color1Rec[COLOR.name], n34: elem.color2Rec[COLOR.name], n35: elem.color3Rec[COLOR.name]
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
        load_fields('tabs-4', {
            n41: elem.width(), n42: elem.height(), n43: furnitureRec[FURNITURE.name], n44: side_open,
            n45: elem.handleRec[ARTIKL.code] + ' ÷ ' + elem.handleRec[ARTIKL.name],
            n46: dbset.find(elem.handleColor, dbset.colorList)[COLOR.name],
            n47: {MIDL: 'По середине', CONST: 'Константная', VARIAT: 'Установлена'}[elem.handleLayout],
            n48: elem.handleHeight,
            n49: elem.loopRec[ARTIKL.code] + ' ÷ ' + elem.loopRec[ARTIKL.name],
            n4A: dbset.find(elem.lockColor, dbset.colorList)[COLOR.name],
            n4B: elem.lockRec[ARTIKL.code] + ' ÷ ' + elem.lockRec[ARTIKL.name],
            n4C: dbset.find(elem.lockColor, dbset.colorList)[COLOR.name],
        }, ['n41', 'n42', 'n43', 'n44', 'n45', 'n46', 'n47', 'n48', 'n49', 'n4A', 'n4B', 'n4C']);
        $("#tabs-4").show();
    } else if (elem.type == "GLASS") {
        load_fields('tabs-5', {
            n51: elem.artiklRec[ARTIKL.code], n52: elem.artiklRec[ARTIKL.name], n53: elem.color1Rec[COLOR.name]
        }, ['n51', 'n52', 'n53']);
        $("#tabs-5").show();
    }
}
//------------------------------------------------------------------------------
function color_to_windows(btnSrc) {
    try {
        let winc = order.wincalcMap.get(order.rec_table2[PROPROD.id]);
        let groupSet = new Set();
        let colorSet = new Set();

        let groupTxt = dbset.systreeList.find(rec => winc.nuni == rec[SYSTREE.id])[SYSTREE.cgrp];
        let groupArr = (groupTxt == null) ? null : parserInt(groupTxt);
        let colorTxt = (btnSrc == 1) ? dbset.systreeList.find(rec => winc.nuni == rec[SYSTREE.id])[SYSTREE.col1]
                : (btnSrc == 2) ? dbset.systreeList.find(rec => winc.nuni == rec[SYSTREE.id])[SYSTREE.col2]
                : dbset.systreeList.find(rec => winc.nuni == rec[SYSTREE.id])[SYSTREE.col3];
        let colorArr = (colorTxt == null) ? null : parserInt(colorTxt);

        //Поле группы текстур заполнено
        if (groupArr != null) {
            for (let s1 of groupArr) { //группы
                let groupSet2 = new Set();
                let colorSet2 = new Set();
                let b = false;
                for (let rec of dbset.colorList) {
                    if (rec[COLOR.colgrp_id] == s1) {
                        groupSet2.add(rec[COLOR.colgrp_id]); //группы
                        colorSet2.add(rec); //текстуры
                        for (let i = 0; i < colorArr.length; i = i + 2) { //тестуры
                            if (rec[COLOR.id] >= colorArr[i] && rec[COLOR.id] <= colorArr[i + 1]) {
                                b = true;
                            }
                        }
                    }
                }
                if (b == false) { //если небыло пападаний то добавляем всю группу
                    groupSet.add(groupSet2);
                    colorSet.add(colorSet2);
                }
            }
        }
        //Поле текстур заполнено
        if (colorArr.length != 0) {
            for (let rec of dbset.colorList) {
                if (groupArr != null) {

                    for (let s1 of groupArr) { //группы
                        if (rec[COLOR.colgrp_id] == s1) {
                            for (let i = 0; i < colorArr.length; i = i + 2) { //текстуры
                                if (rec[COLOR.id] >= colorArr[i] && rec[COLOR.id] <= colorArr[i + 1]) {
                                    groupSet.add(rec[COLOR.colgrp_id]);
                                    colorSet.add(rec);
                                }
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < colorArr.length; i = i + 2) { //тестуры
                        if (rec[COLOR.id] >= colorArr[i] && rec[COLOR.id] <= colorArr[i + 1]) {
                            groupSet.add(rec[COLOR.colgrp_id]);
                            colorSet.add(rec);
                        }
                    }
                }
            }
        }
        product.groupSet = groupSet;
        product.colorArr = Array.from(colorSet);
        product.buttonSrc = btnSrc;
        $('#dialog-dic').load('frm/dialog/color.jsp');

    } catch (e) {
        console.error("Ошибка color_to_windows(): " + e.message);
    }
}
//------------------------------------------------------------------------------
function color_to_frame(btnSrc) {
    try {
        let nodeID = $("#tree-winc").jstree("get_selected")[0];
        let proprodID = order.rec_table2[PROPROD.id];
        let winc = order.wincalcMap.get(proprodID);
        let elem = winc.elemList.find(it => it.id == nodeID);
        let groupSet = new Set();
        let colorSet = new Set();

        //Все текстуры артикула элемента конструкции
        dbset.artdetList.forEach(artdetRec => {
            if (artdetRec[ARTDET.artikl_id] == elem.artiklRec[ARTIKL.id]) {
                if (artdetRec[ARTDET.color_fk] < 0) { //все текстуры групы color_fk

                    dbset.colorList.forEach(colorRec => {
                        if (colorRec[COLOR.colgrp_id] == Math.abs(artdetRec[ARTDET.color_fk])) {

                            groupSet.add(Math.abs(colorRec[COLOR.colgrp_id]));
                            colorSet.add(colorRec);
                        }
                    });
                } else { //текстура color_fk 
                    let color2Rec = dbset.colorList.find(rec3 => artdetRec[ARTDET.color_fk] == rec3[COLOR.id]);
                    groupSet.add(color2Rec[COLOR.colgrp_id]);
                    colorSet.add(color2Rec);
                }
            }
        });
        product.groupSet = groupSet;
        product.colorArr = Array.from(colorSet);
        product.buttonSrc = btnSrc;
        $('#dialog-dic').load('frm/dialog/color.jsp');

    } catch (e) {
        console.error("Ошибка: colorToFrame() " + e.message);
    }
}
//------------------------------------------------------------------------------
function sysprof_to_frame(btnSrc) {
    try {
        let nodeID = $("#tree-winc").jstree("get_selected")[0];
        let proprodID = order.rec_table2[PROPROD.id];
        let winc = order.wincalcMap.get(proprodID);
        let elem = winc.elemList.find(it => it.id == nodeID);
        let sysprofSet = new Set();

        //Цикл по профилям ветки 
        for (let sysprofRec of dbset.sysprofList) {
            //Отфильтруем подходящие по параметрам
            if (winc.nuni == sysprofRec[SYSPROF.systree_id] && Type[elem.type][1] == sysprofRec[SYSPROF.use_type]) {
                let use_side_ID = sysprofRec[SYSPROF.use_side];
                if (use_side_ID == Layout[elem.layout][0]
                        || ((elem.layout == 'BOTT' || elem.layout == 'TOP') && use_side_ID == UseSide.HORIZ[0])
                        || ((elem.layout == 'RIGHT' || elem.layout == 'LEFT') && use_side_ID == UseSide.VERT[0])
                        || use_side_ID == UseSide.ANY[0] || use_side_ID == UseSide.MANUAL[0]) {

                    sysprofSet.add(sysprofRec);
                }
            }
        }
        product.sysprofArr = Array.from(sysprofSet);
        product.buttonSrc = btnSrc;
        $('#dialog-dic').load('frm/dialog/sysprof.jsp');

    } catch (e) {
        console.error("Ошибка:sysprof_to_frame() " + e.message);
    }
}
//------------------------------------------------------------------------------
function artikl_to_glass(btnSrc) {
//        try {
    let nodeID = $("#tree-winc").jstree("get_selected")[0];
    let proprodID = order.rec_table2[PROPROD.id];
    let winc = order.wincalcMap.get(proprodID);
    let elem = winc.elemList.find(it => it.id == nodeID);

    //Список доступных толщин в ветке системы например 4;5;8
    let systreeRec = dbset.systreeList.find(rec => winc.nuni == rec[SYSTREE.id]);
    if (systreeRec != undefined) {
        let depth = systreeRec[SYSTREE.depth];
        depth = depth.replace(/;/g, ',');
        if (depth.charAt(depth.length - 1) == ',') {
            depth = depth.substring(0, depth.length - 1);
        }
        depth = depth.split(',');
        let artiklList = dbset.artiklList.filter(rec => rec[ARTIKL.depth] != undefined && 5 == rec[ARTIKL.level1]
                    && [1, 2, 3].includes(rec[ARTIKL.level2]) && depth.includes(rec[ARTIKL.depth].toString()));

        product.artiklArr = artiklList;
        product.buttonSrc = btnSrc;
        $('#dialog-dic').load('frm/dialog/artikl.jsp');

    }

    //Список стеклопакетов
    //depth = (depth != null && depth.isEmpty() == false) ? " and " + eArtikl.depth.name() + " in (" + depth + ")" : "";
    //Query qArtikl = new Query(eArtikl.values()).select(eArtikl.up,
    // "where", eArtikl.level1, "= 5 and", eArtikl.level2, "in (1,2,3)", depth);

//        } catch (e) {
//            console.error("Ошибка:sysprof_to_frame() " + e.message);
//        }
}
//------------------------------------------------------------------------------
