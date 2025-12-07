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
            $('#dialog-dic').load('frame/dialog/param.jsp');
        }, onSelectRow: function (rowid) {
            let syspar1Row = table1.jqGrid('getRowData', rowid);
            product.groupParam = findef(dbset.syspar1List.find(rec => syspar1Row.id == rec[SYSPAR1.id]), dbset.syspar1List)[SYSPAR1.params_id];
        }
    });
}
//------------------------------------------------------------------------------
product.load_table = function (table1) {
    let syspar1List2 = [];
    table1.jqGrid('clearGridData', true);
    let winc = order.get_winc();
    for (let val of winc.root.pardefMap.values()) {
        syspar1List2.push(val);
    }
    syspar1List2.sort((a, b) => b[SYSPAR1.params_id] - a[SYSPAR1.params_id]);
    for (let i = 0; i < syspar1List2.length; i++) {

        let tr = syspar1List2[i];
        let paramsRec = dbset.paramsList.find(tr => tr[SYSPAR1.params_id] == tr[PARAMS.id]);
        table1.jqGrid('addRowData', i + 1, {

            id: tr[SYSPAR1.id],
            text: paramsRec[PARAMS.text],
            val: tr[SYSPAR1.text],
            fixed: tr[SYSPAR1.fixed]
        });
    }
    table1.jqGrid("setSelection", 1);
}
//------------------------------------------------------------------------------
product.load_tree = function (tabtree) {
    if (order.prjprodRec != null) {
        let arr = new Array();
        let winc = order.get_winc();
        let root = winc.root;

        if (root.typeForm() == 'RECTANGL')
            arr.push({'id': root.id, 'parent': '#', 'text': 'Окно четырёхугольное', 'icon': 'img/tool/folder.gif'});
        else if (root.typeForm() == 'TRAPEZE')
            arr.push({'id': root.id, 'parent': '#', 'text': 'Окно трапеция', 'icon': 'img/tool/folder.gif'});
        else if (root.typeForm() == 'TRIANGL')
            arr.push({'id': root.id, 'parent': '#', 'text': 'Треугольное окно', 'icon': 'img/tool/folder.gif'});
        else if (root.typeForm() == 'ARCH')
            arr.push({'id': root.id, 'parent': '#', 'text': 'Арочное окно', 'icon': 'img/tool/folder.gif'});

        arr.push({'id': -1, 'parent': root.id, 'text': 'Параметры по умолчанию', 'icon': 'img/tool/leaf.gif'});
        arr.push({'id': -2, 'parent': root.id, 'text': 'Коробка', 'icon': 'img/tool/folder.gif'});
        arr.push({'id': root.frames.get('BOTT').id, 'parent': -2, 'text': 'Рама нижняя', 'icon': 'img/tool/leaf.gif'});
        arr.push({'id': root.frames.get('RIGHT').id, 'parent': -2, 'text': 'Рама правая', 'icon': 'img/tool/leaf.gif'});
        arr.push({'id': root.frames.get('TOP').id, 'parent': -2, 'text': 'Рама верхняя', 'icon': 'img/tool/leaf.gif'});
        arr.push({'id': root.frames.get('LEFT').id, 'parent': -2, 'text': 'Рама левая', 'icon': 'img/tool/leaf.gif'});

        product.elements(root, arr); //вход в рекурсию    

        tabtree.jstree({'core': {'data': arr}})
                .bind("loaded.jstree", function (event, data) {
                    $(this).jstree('open_node', $('#0'));
                    $(this).jstree('select_node', 0.0);
                })
                .bind("select_node.jstree", function (evt, data) {
                    let node = tabtree.jstree("get_selected")[0];
                    product.local_to_fields(node);
                });
    }
}
product.elements = function (com, arr) {

    if (com.typeForm() == "STVORKA") {
        arr.push({'id': com.id, 'parent': 0, 'text': 'Створка', 'icon': 'img/tool/folder.gif'});
        arr.push({'id': com.frames.get('BOTT').id, 'parent': com.id, 'text': 'Рама нижняя', 'icon': 'img/tool/leaf.gif'});
        arr.push({'id': com.frames.get('RIGHT').id, 'parent': com.id, 'text': 'Рама правая', 'icon': 'img/tool/leaf.gif'});
        arr.push({'id': com.frames.get('TOP').id, 'parent': com.id, 'text': 'Рама верхняя', 'icon': 'img/tool/leaf.gif'});
        arr.push({'id': com.frames.get('LEFT').id, 'parent': com.id, 'text': 'Рама левая', 'icon': 'img/tool/leaf.gif'});
        for (let com2 of com.childs) {
            if (com2.typeForm() == "GLASS") {
                arr.push({'id': com2.id, 'parent': com.id, 'text': 'Заполнение (Стеклопакет, стекло)', 'icon': 'img/tool/leaf.gif'});
            }
        }
    } else {
        for (let com2 of com.childs) {
            if (['AREA', 'STVORKA'].includes(com2.type, 0)) {
                product.elements(com2, arr);
            } else {
                if (["IMPOST", "SHTULP", "STOIKA"].includes(com2.type, 0)) {
                    let lay = (com.layout == "VERT") ? ' (горизонтальная)' : ' {вертикальная)'
                    arr.push({'id': com2.id, 'parent': -2, 'text': 'Ригель, импост, стойка' + lay, 'icon': 'img/tool/leaf.gif'});
                } else if (com2.typeForm() == "GLASS") {
                    arr.push({'id': com2.id, 'parent': -2, 'text': 'Заполнение (Стеклопакет, стекло)', 'icon': "img/tool/leaf.gif"});
                }
            }
        }
    }
}
//==============================================================================
//Загрузка свойств конструкции
product.server_to_fields = function () {
    try {
        if (order.prjprodRec != null) {
            let prjprodID = order.prjprodRec[PRJPROD.id];
            if (prjprodID != undefined) {
                $.ajax({
                    url: 'dbset?action=stvFields',
                    data: {'prjprodID': prjprodID},
                    success: function (data) {
                        product.stvFields = data.stvFields;
                        let id = order.prjprodRec[PRJPROD.id];
                        let winc = order.wincalcMap.get(id);
                        for (let el of winc.elemList) {
                            if (el.typeForm() == 'STVORKA') {
                                for (let fk in data.stvFields) {
                                    if (fk == el.id) {

                                        el.handleRec = data.stvFields[fk].handleRec;
                                        el.handleColor = data.stvFields[fk].handleColor;
                                        el.loopRec = data.stvFields[fk].loopRec;
                                        el.loopColor = data.stvFields[fk].loopColor;
                                        el.handleRec = data.stvFields[fk].handleRec;
                                        el.lockRec = data.stvFields[fk].lockRec;
                                    }
                                }
                            }
                        }
                        let tr = $("#tree-winc").jstree("get_selected")
                        if (tr != undefined) {
                            let nodeID = tr[0];
                            let elem = winc.elemList.find(it => it.id == nodeID);
                            if (elem.typeForm() == 'STVORKA') {
                                product.local_to_fields(nodeID);
                            }
                        }
                    }
                });
            }
        }
    } catch (e) {
        console.error("Ошибка: product.server_to_fields() " + e.message);
    }
}
//------------------------------------------------------------------------------
//Загрузка тегов страницы
product.local_to_fields = function (nodeID) {
    $("#tabs-1, #tabs-2, #tabs-3, #tabs-4, #tabs-5").hide();
    if (nodeID == -2) {
        return;
    }
    let elem = {};
    let id = order.prjprodRec[PRJPROD.id];
    let winc = order.wincalcMap.get(id);
    if (nodeID == -1) {
        elem = {type: 'DEF_PARAM'};
    } else {
        elem = winc.elemList.find(it => it.id == nodeID);
    }
    //Коробка
    if (["RECTANGL", "TRAPEZE", "TRIANGL", "ARCH", "DOOR"].includes(elem.type, 0)) {
        let typ = {RECTANGL: 'Окно четырёхугольное', TRAPEZE: 'Окно трапециидальное', TRIANGL: 'Окно треугольное', ARCH: 'Окно арочное', DOOR: 'Дверь'};
        $("#tabs-1 :nth-child(1)").text(typ[winc.root.type]);
        load_tabs('tabs-1', {
            n11: winc.width, n12: winc.height, n13: winc.heightAdd,
            n14: winc.color1Rec[COLOR.name], n15: winc.color2Rec[COLOR.name], n16: winc.color3Rec[COLOR.name]
        }, ['n11', 'n12', 'n13', 'n14', 'n15', 'n16']);
        $("#tabs-1").show();

        //Парам. по умолчанию
    } else if (elem.typeForm() == "DEF_PARAM") {
        product.load_table($('#table1'));
        $("#tabs-2").show();

        //Сторона коробки, створки
    } else if (["FRAME_SIDE", "STVORKA_SIDE", "IMPOST", "SHTULP", "STOIKA"].includes(elem.type, 0)) {
        let lay = {BOTT: 'нижняя', RIGHT: 'правая', TOP: 'верхняя', LEFT: 'левая', VERT: 'вертикальный', HORIZ: 'горизонтальный'};
        if (elem.typeForm() == "FRAME_SIDE") {
            $("#tabs-3 :nth-child(1)").text('Сторона коробки ' + lay[elem.layout]);
        } else if (elem.typeForm() == "STVORKA_SIDE") {
            $("#tabs-3 :nth-child(1)").text('Сторона створки ' + lay[elem.layout]);
        } else {
            $("#tabs-3 :nth-child(1)").text('Импост ' + lay[elem.layout]);
        }
        load_tabs('tabs-3', {
            n31: elem.artiklAn[ARTIKL.code], n32: elem.artiklAn[ARTIKL.name],
            n33: elem.color1Rec[COLOR.name], n34: elem.color2Rec[COLOR.name], n35: elem.color3Rec[COLOR.name]
        }, ['n31', 'n32', 'n33', 'n34', 'n35']);
        $("#tabs-3").show();

        //Створка
    } else if (elem.typeForm() == "STVORKA") {
        let furnitureRec = dbset.furnitureList.find(rec => elem.sysfurnRec[SYSFURN.furniture_id] == rec[FURNITURE.id]);
        let type_open = TypeOpen.INVALID[1]; //сторона открывания
        for (let k in TypeOpen) {
            if (TypeOpen[k][0] == elem.typeOpen) {
                type_open = TypeOpen[k][1];
            }
        }
        load_tabs('tabs-4', {
            n41: elem.width, n42: elem.height, n43: furnitureRec[FURNITURE.name], n44: type_open,
            n45: elem.handleRec[ARTIKL.code] + ' ÷ ' + elem.handleRec[ARTIKL.name],
            n46: findef(dbset.colorList.find(rec => elem.handleColor == rec[COLOR.id]), dbset.colorList)[COLOR.name],
            n47: {MIDL: 'По середине', CONST: 'Константная', VARIAT: 'Установлена'}[elem.handleLayout],
            n48: elem.handleHeight,
            n49: elem.loopRec[ARTIKL.code] + ' ÷ ' + elem.loopRec[ARTIKL.name],
            n4A: findef(dbset.colorList.find(rec => elem.loopColor == rec[COLOR.id]), dbset.colorList)[COLOR.name],
            n4B: elem.lockRec[ARTIKL.code] + ' ÷ ' + elem.lockRec[ARTIKL.name],
            n4C: findef(dbset.colorList.find(rec => elem.lockColor == rec[COLOR.id]), dbset.colorList)[COLOR.name],
        }, ['n41', 'n42', 'n43', 'n44', 'n45', 'n46', 'n47', 'n48', 'n49', 'n4A', 'n4B', 'n4C']);
        $("#tabs-4").show();

        //Стеклопакет
    } else if (elem.typeForm() == "GLASS") {
        load_tabs('tabs-5', {
            n51: elem.artiklRec[ARTIKL.code], n52: elem.artiklRec[ARTIKL.name], n53: elem.color1Rec[COLOR.name]
        }, ['n51', 'n52', 'n53']);
        $("#tabs-5").show();
    }
}
//------------------------------------------------------------------------------
//Текстура изделия
product.color_to_windows = function (btnSrc) {
    //try {
    let winc = order.wincalcMap.get(order.prjprodRec[PRJPROD.id]);
    let groupSet = new Set();
    let colorSet = new Set();

    let groupTxt = dbset.systreeList.find(rec => winc.nuni == rec[SYSTREE.id])[SYSTREE.cgrp];
    let groupArr = (groupTxt == null) ? null : parserInt(groupTxt);
    let colorTxt = (btnSrc == 'n14') ? dbset.systreeList.find(rec => winc.nuni == rec[SYSTREE.id])[SYSTREE.col1]
            : (btnSrc == 'n15') ? dbset.systreeList.find(rec => winc.nuni == rec[SYSTREE.id])[SYSTREE.col2]
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
    dbrec.parent = 'winc';
    product.groupSet = groupSet;
    product.colorArr = Array.from(colorSet);
    product.buttonSrc = btnSrc;
    $('#dialog-dic').load('frame/dialog/color.jsp');

    //} catch (e) {
    //    console.error("Ошибка: product.color_to_windows(): " + e.message);
    //}
}
//------------------------------------------------------------------------------
//Сторона коробки
product.sysprof_to_frame = function (btnSrc) {
    try {
        let nodeID = $("#tree-winc").jstree("get_selected")[0];
        let prjprodID = order.prjprodRec[PRJPROD.id];
        let winc = order.wincalcMap.get(prjprodID);
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
        $('#dialog-dic').load('frame/dialog/sysprof.jsp');

    } catch (e) {
        console.error("Ошибка: product.sysprof_to_frame() " + e.message);
    }
}
//------------------------------------------------------------------------------
//Фурнитура стеклопакета
product.furniture_to_stvorka = function (btnSrc) {
    product.buttonSrc = btnSrc;
    $('#dialog-dic').load('frame/dialog/furniture.jsp');
}
//------------------------------------------------------------------------------
//Сторона открывания
product.sideopen_to_stvorka = function (btnSrc) {
    product.buttonSrc = btnSrc;
    $('#dialog-dic').load('frame/dialog/sideopen.jsp');
}
//------------------------------------------------------------------------------
//Артикл ручки, подвеса, замка
product.artikl_to_stvorka = function (btnSrc) {
    product.buttonSrc = btnSrc;
    $('#dialog-dic').load('frame/dialog/artikl.jsp');
}
//------------------------------------------------------------------------------
//Заполнение
product.color_to_element = function (btnSrc) {
    try {
        let nodeID = $("#tree-winc").jstree("get_selected")[0];
        let prjprodID = order.prjprodRec[PRJPROD.id];
        let winc = order.wincalcMap.get(prjprodID);
        let elem = winc.elemList.find(it => it.id == nodeID);
        let groupSet = new Set();
        let colorSet = new Set();
        let artiklElem = null;

        if (btnSrc == 'n33')
            artiklElem = elem.artiklRec;
        else if (btnSrc == 'n34')
            artiklElem = elem.artiklRec;
        else if (btnSrc == 'n35')
            artiklElem = elem.artiklRec;
        else if (btnSrc == 'n46')
            artiklElem = elem.handleRec;
        else if (btnSrc == 'n4A')
            artiklElem = elem.loopRec;
        else if (btnSrc == 'n4C')
            artiklElem = elem.lockRec;
        else if (btnSrc == 'n53')
            artiklElem = elem.artiklRec;

        //Все текстуры артикула элемента конструкции
        for (let rec of dbset.artdetList) {
            if (rec[ARTDET.artikl_id] == artiklElem[ARTIKL.id]) {
                if (rec[ARTDET.color_fk] < 0) { //все текстуры групы color_fk

                    dbset.colorList.forEach(colorRec => {
                        if (colorRec[COLOR.colgrp_id] == Math.abs(rec[ARTDET.color_fk])) {

                            groupSet.add(Math.abs(colorRec[COLOR.colgrp_id]));
                            colorSet.add(colorRec);
                        }
                    });
                } else { //текстура color_fk 
                    let color2Rec = dbset.colorList.find(rec3 => rec[ARTDET.color_fk] == rec3[COLOR.id]);
                    groupSet.add(color2Rec[COLOR.colgrp_id]);
                    colorSet.add(color2Rec);
                }
            }
        }
        dbrec.parent = 'elem';
        product.groupSet = groupSet;
        product.colorArr = Array.from(colorSet);
        product.buttonSrc = btnSrc;
        $('#dialog-dic').load('frame/dialog/color.jsp');

    } catch (e) {
        console.error("Ошибка: product.color_to_element() " + e.message);
    }
}
//------------------------------------------------------------------------------
//Заполнение
product.artikl_to_glass = function (btnSrc) {
    try {
        let nodeID = $("#tree-winc").jstree("get_selected")[0];
        let prjprodID = order.prjprodRec[PRJPROD.id];
        let winc = order.wincalcMap.get(prjprodID);
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
            $('#dialog-dic').load('frame/dialog/artikl.jsp');

        }
    } catch (e) {
        console.error("Ошибка: product.artikl_to_glass() " + e.message);
    }
}
//==============================================================================
//Масштабирование
product.resize = function () {

    let cnv = document.querySelector("#cnv");
    if (cnv != null) {
        var height = window.innerHeight;
        $("#context").css("height", height - 82);

        //Изменение размера канвы
        cnv.width = $("#scale-cnv").width();
        cnv.height = $("#scale-cnv").height();
        if (order.prjprodRec != null) //Перерисовка конструкции на канве, после изменения размера канвы
            winCalc = win.build(cnv, order.prjprodRec[PRJPROD.script]);
        $('#scale-ver').width(winCalc.height * winCalc.scale); //длина шкалы перед разворотом на 90 градусов

        //Прорисовка горизонт. размерных линий, после изменения размера канвы
        let arrHor = ($('#scale-hor input').length == 0) ? [winCalc.root] : [];
        $('#scale-hor input').each((i, p) => arrHor.push(winCalc.areaList.find(e => e.id == $(p).attr('areaId'))));
        product.scale_new_input('HORIZ', arrHor);

        //Прорисовка вертик. размерных линий, после изменения размера конструкции
        let arrVer = ($('#scale-ver input').length == 0) ? [winCalc.root] : [];
        $('#scale-ver input').each((i, p) => arrVer.push(winCalc.areaList.find(e => e.id == $(p).attr('areaId'))));
        product.scale_new_input('VERT', arrVer);

        //Прорисовка полей
        let winWidth = $('#east').width() - 24;
        $("div .field2[dx]").each(function (index) {
            var width = $(this).attr('dx');
            $(this).width(winWidth - width);
        });
        $("#table1").jqGrid('setGridWidth', $("#east2").width() - 4);
        $("#table1").jqGrid('setGridHeight', $("#east2").height() - 24);
    }
}
//------------------------------------------------------------------------------
//Перерисовать при изменении размера (размер канвы тот-же)
product.redraw = function () {
    let prjprodID = order.prjprodRec[PRJPROD.id]; //id prjprod заказа
    let prjprodRec = dbset.prjprodList.find(rec => prjprodID == rec[PRJPROD.id]);
    let cvs = document.querySelector("#cnv");
    prjprodRec[PRJPROD.script] = JSON.stringify(winCalc.obj, (k, v) => isEmpty(v));

    winCalc = win.build(cvs, prjprodRec[PRJPROD.script]);

    order.wincalcMap.set(prjprodID, winCalc); //новый экз.  
    product.resize();
    product.local_to_fields("0");
}
//------------------------------------------------------------------------------
//Наполнение новыми инпутами шкалы горизонтальных и вертикальных размеров
product.scale_new_input = function (layout, lineArea) {
    let lineArr = [];

    //Прорисовка горизонтальных размеров 
    if (layout == "HORIZ") {
        lineArea.forEach((e, i) => {

            let inpt = document.createElement('input'); //create input
            if ($('#scale-hor input:eq(' + i + ')').length == 1) {
                $(inpt).css("color", $('#scale-hor input:eq(' + i + ')').css("color"));
            }
            $(inpt).val(e.lengthX.toFixed(1));
            $(inpt).attr('areaID', e.id);
            $(inpt).width(e.width * winCalc.scale - 8);
            inpt.addEventListener('dblclick', () => product.dblclick_scale_color(inpt, 'HORIZ'));
            inpt.addEventListener("keydown", (event) => product.keyup_btn_enter(inpt, event));
            if (i === 0) {
                $(inpt).css('margin-left', 30 + lineArea[i].x1 * winCalc.scale);
            }
            lineArr.push(inpt);
        });
        $('#scale-hor input').each((i, el) => el.remove());
        lineArr.forEach((el, i) => $('#scale-hor').append(el));

        //Прорисовка вертикальных размеров   
    } else if (layout == "VERT") {

        lineArr.length = 0;
        let length = winCalc.obj.height * winCalc.scale;
        $('#scale-ver').css('left', -1 * length); //влево после разворота на -90 градусов 
        lineArea.forEach((e, i) => {

            let inpt = document.createElement('input'); //create input           
            if ($('#scale-ver input:eq(' + i + ')').length == 1) {
                $(inpt).css("color", $('#scale-ver input:eq(' + i + ')').css("color"));
            }
            $(inpt).val(e.lengthY.toFixed(1));
            $(inpt).attr('areaID', e.id);
            $(inpt).width(e.lengthY * winCalc.scale - 10);
            inpt.addEventListener('dblclick', () => product.dblclick_scale_color(inpt, 'VERT'));
            inpt.addEventListener("keydown", (event) => product.keyup_btn_enter(inpt, event));
            if (i === 0) {
                $(inpt).css('margin-left', (winCalc.height - e.y2) * winCalc.scale);
            }
            lineArr.push(inpt);
        });
        $('#scale-ver input').each((i, el) => el.remove());
        lineArr.forEach((el, i) => $('#scale-ver').append(el));
    }
}
//------------------------------------------------------------------------------
//Установка цвета горизонтальных и вертикальных размеров
product.dblclick_scale_color = function (inpt, dir) {

    $('#scale-ver input').each((i, el) => $(el).css('color', 'rgb(0, 0, 0)'));
    $('#scale-hor input').each((i, el) => $(el).css('color', 'rgb(0, 0, 0)'));
    $(inpt).css('color', 'rgb(255, 0, 0)');
    $("#spinner").spinner("value", $(inpt).val());
//    $('#btnResiz').focus();
}
//------------------------------------------------------------------------------
//Click на импосте для расчёта шкал размеров
product.click_canvas_xy = function (canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / winCalc.scale;
    const y = (event.clientY - rect.top) / winCalc.scale;

    //Если клик не на конструкции
    if (winCalc.root.inside(x, y) == false) {
        product.scale_new_input('HORIZ', [winCalc.root]);
        product.scale_new_input('VERT', [winCalc.root]);
        $("#spinner").spinner("value", 0);
        $('#scale-hor input').css('color', 'rgb(0, 0, 0)');
        $('#scale-ver input').css('color', 'rgb(0, 0, 0)');

    } else { //На конструкции
        winCalc.elemList.forEach((e, i) => {
            if (e.typeForm() == 'IMPOST' || e.typeForm() == 'SHTULP' || e.typeForm() == 'STOIKA') {
                if (e.inside(x, y)) {
                    let m = winCalc.root.lineCross(e);
                    if (e.layout == 'HORIZ') {
                        product.scale_new_input('VERT', m.reverse());
                    } else {
                        product.scale_new_input('HORIZ', m);
                    }
                }
            }
        });
    }
}
//------------------------------------------------------------------------------
//Клик на кнопке масштабирования
product.click_btn_resiz = function () {
    let draw = 0;

    //По горизонтали  
    $('#scale-hor input').each((i, e) => {
        if ($(e).css('color') == 'rgb(255, 0, 0)') {
            ++draw;
            $('#scale-hor input').each((i, m) => {
                let area = winCalc.areaList.find(v => v.id == $(m).attr('areaID'));
                if ($(m).css('color') == 'rgb(255, 0, 0)') {
                    area.lengthX = area.lengthX + 1;
                } else {
                    area.lengthX = area.lengthX - 1;
                }
            });
        }
    });

    //По вертикали
    $('#scale-ver input').each((i, e) => {
        if ($(e).css('color') == 'rgb(255, 0, 0)') {
            ++draw;
            $('#scale-ver input').each((i, m) => {
                let area = winCalc.areaList.find(v => v.id == $(m).attr('areaID'));
                if ($(m).css('color') == 'rgb(255, 0, 0)') {
                    area.lengthY = area.lengthY + 1;
                } else {
                    area.lengthY = area.lengthY - 1;
                }
            });
        }
    });

    //Перерисовать при изменении размера
    if (draw > 0) {
        product.redraw();
    }
}
//------------------------------------------------------------------------------
//Клик на кнопке enter
product.keyup_btn_enter = function (inpt, event) {
    let dv = 0;
    if (event.key === "Enter") {
        let areas = winCalc.areaList.find(e => e.id == $(inpt).attr('areaID'));

        //По горизонтали
        if ($(inpt).parent().attr('id') == 'scale-hor') {
            dv = $(inpt).val() - areas.lengthX;
            $('#scale-hor input').each((i, m) => {
                let area = winCalc.areaList.find(v => v.id == $(m).attr('areaID'));
                if ($(inpt).attr('areaID') == $(m).attr('areaID')) { //ограничение размера
                    dv = (area.lengthX + dv < 200) ? 0 : dv;
                } else {
                    dv = (area.lengthX - dv < 200) ? 0 : dv;
                }
            });
            if (dv != 0)
                $('#scale-hor input').each((i, m) => {
                    let area = winCalc.areaList.find(v => v.id == $(m).attr('areaID'));
                    if ($(inpt).attr('areaID') == $(m).attr('areaID')) {
                        area.lengthX = area.lengthX + dv;
                    } else {
                        area.lengthX = area.lengthX - dv;
                    }
                });


        } else { //По вертикали           
            dv = $(inpt).val() - areas.lengthY;
            $('#scale-ver input').each((i, m) => {
                let area = winCalc.areaList.find(v => v.id == $(m).attr('areaID'));
                if ($(inpt).attr('areaID') == $(m).attr('areaID')) { //ограничение размера
                    dv = (area.lengthY + dv < 200) ? 0 : dv;
                } else {
                    dv = (area.lengthY - dv < 200) ? 0 : dv;
                }
            });
            if (dv != 0) {
                $('#scale-ver input').each((i, m) => {
                    let area = winCalc.areaList.find(v => v.id == $(m).attr('areaID'));
                    if ($(inpt).attr('areaID') == $(m).attr('areaID')) {
                        area.lengthY = area.lengthY + dv;
                    } else {
                        area.lengthY = area.lengthY - dv;
                    }
                });
            }
        }
        if (dv == 0) {
            alert('Внимание! Недопустимые размеры конструкции. (200мм)');

            if ($(inpt).parent().attr('id') == 'scale-hor')
                $(inpt).val(areas.lengthX.toFixed(1));
            else
                $(inpt).val(areas.lengthX.toFixed(1));
        } else
            product.redraw(); //перерисовать при изменении размера
    }
    //console.log("+++ " + winCalc.heightAdd);
}
//------------------------------------------------------------------------------
//Клик на кнопке масштабирования
product.click_spinner = function () {
    let draw = 0;

    //По горизонтали  
    $('#scale-hor input').each((i, e) => {
        if ($(e).css('color') == 'rgb(255, 0, 0)') {
            let areas = winCalc.areaList.find(v => v.id == $(e).attr('areaID'));
            let dv = $("#spinner").spinner("value") - areas.lengthX;
            ++draw;
            $('#scale-hor input').each((i, m) => {
                let area = winCalc.areaList.find(v => v.id == $(m).attr('areaID'));
                if ($(m).css('color') == 'rgb(255, 0, 0)') {
                    area.lengthX = area.lengthX + dv;
                } else {
                    area.lengthX = area.lengthX - dv;
                }
            });
        }
    });

    //По вертикали
    $('#scale-ver input').each((i, e) => {
        if ($(e).css('color') == 'rgb(255, 0, 0)') {
            let areas = winCalc.areaList.find(v => v.id == $(e).attr('areaID'));
            let dv = $("#spinner").spinner("value") - areas.lengthX;
            ++draw;
            $('#scale-ver input').each((i, m) => {
                let area = winCalc.areaList.find(v => v.id == $(m).attr('areaID'));
                if ($(m).css('color') == 'rgb(255, 0, 0)') {
                    area.lengthY = area.lengthY + dv;
                } else {
                    area.lengthY = area.lengthY - dv;
                }
            });
        }
    });

    //Перерисовать при изменении размера
    if (draw > 0) {
        product.redraw();
    }
}
//------------------------------------------------------------------------------
product.update_script = function () {
    let prjprodID = order.prjprodRec[PRJPROD.id]; //id prjprod заказа
    let winc = order.wincalcMap.get(prjprodID);

    $.ajax({//запишем профиль в серверную базу данных
        url: 'dbset?action=updateScript',
        data: {param: JSON.stringify({id: prjprodID, script: JSON.stringify(winc.obj)})},
        success: function (data) {
            if (data.result != 'ok')
                dialogMes('Сообщение', "<p>" + data.result);
        },
        error: function () {
            dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
        }
    });
}
//------------------------------------------------------------------------------
