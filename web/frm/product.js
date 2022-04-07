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
            $('#dialog-dic').load('frm/dialog/param.jsp');
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

        let syspar1Rec = syspar1List2[i];
        let paramsRec = dbset.paramsList.find(tr => syspar1Rec[SYSPAR1.params_id] == tr[PARAMS.id]);
        table1.jqGrid('addRowData', i + 1, {

            id: syspar1Rec[SYSPAR1.id],
            text: paramsRec[PARAMS.text],
            val: syspar1Rec[SYSPAR1.text],
            fixed: syspar1Rec[SYSPAR1.fixed]
        });
    }
    table1.jqGrid("setSelection", 1);
    product.resize();
}
//------------------------------------------------------------------------------
product.load_tree = function (tabtree) {
    if (order.prjprodRec != null) {
        let arr = new Array();
        let winc = order.get_winc();
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
        product.resize();
    }
}
product.elements = function (com, arr) {

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
                product.elements(com2, arr);
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
//Масштабирование
product.resize = function () {
    var height = window.innerHeight;
    $("#context").css("height", height - 80);

    //Прорисовка конструкции
    let cnv = document.querySelector("#cnv");
    cnv.width = $("#scale-cnv").width();
    cnv.height = $("#scale-cnv").height();
   
    if (order.prjprodRec != null)
        winCalc = win.build(cnv, order.prjprodRec[PRJPROD.script]);
    $('#scale-ver').width(winCalc.height * winCalc.scale);
    
    //Прорисовка размерных линий
    product.scale_to_line('HORIZ', [winCalc.root]);
    product.scale_to_line('VERT', [winCalc.root]);

    //Прорисовка полей
    let winWidth = $('#east').width() - 24;
    $("div .field2[dx]").each(function (index) {
        var width = $(this).attr('dx');
        $(this).width(winWidth - width);
    });
    $("#table1").jqGrid('setGridWidth', $("#east2").width() - 4);
    $("#table1").jqGrid('setGridHeight', $("#east2").height() - 24);
}
//------------------------------------------------------------------------------
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
                            if (el.type == 'STVORKA') {
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
                            if (elem.type == 'STVORKA') {
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
    } else if (elem.type == "DEF_PARAM") {
        product.load_table($('#table1'));
        $("#tabs-2").show();

        //Сторона коробки, створки
    } else if (["FRAME_SIDE", "STVORKA_SIDE", "IMPOST", "SHTULP", "STOIKA"].includes(elem.type, 0)) {
        let lay = {BOTT: 'нижняя', RIGHT: 'правая', TOP: 'верхняя', LEFT: 'левая', VERT: 'вертикальный', HORIZ: 'горизонтальный'};
        if (elem.type == "FRAME_SIDE") {
            $("#tabs-3 :nth-child(1)").text('Сторона коробки ' + lay[elem.layout]);
        } else if (elem.type == "STVORKA_SIDE") {
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
    } else if (elem.type == "STVORKA") {
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
    } else if (elem.type == "GLASS") {
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
    $('#dialog-dic').load('frm/dialog/color.jsp');

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
        $('#dialog-dic').load('frm/dialog/sysprof.jsp');

    } catch (e) {
        console.error("Ошибка: product.sysprof_to_frame() " + e.message);
    }
}
//------------------------------------------------------------------------------
//Фурнитура стеклопакета
product.furniture_to_stvorka = function (btnSrc) {
    product.buttonSrc = btnSrc;
    $('#dialog-dic').load('frm/dialog/furniture.jsp');
}
//------------------------------------------------------------------------------
//Сторона открывания
product.sideopen_to_stvorka = function (btnSrc) {
    product.buttonSrc = btnSrc;
    $('#dialog-dic').load('frm/dialog/sideopen.jsp');
}
//------------------------------------------------------------------------------
//Артикл ручки, подвеса, замка
product.artikl_to_stvorka = function (btnSrc) {
    product.buttonSrc = btnSrc;
    $('#dialog-dic').load('frm/dialog/artikl.jsp');
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
        $('#dialog-dic').load('frm/dialog/color.jsp');

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
            $('#dialog-dic').load('frm/dialog/artikl.jsp');

        }
    } catch (e) {
        console.error("Ошибка: product.artikl_to_glass() " + e.message);
    }
}
//------------------------------------------------------------------------------
//Изменить размер
product.click_winc_resiz = function (btn) {

    //По горизонтали
    let listInc = new Array(), listDec = new Array();
    $('#scale-hor input').each((index, inpt) => {

        let lineArea = winCalc.root.lineArea(winCalc, 'HORIZ');
        let area = lineArea.find(el => el.id == $(inpt).attr('areaID'));
        if ($(inpt).css('color') == 'rgb(0, 155, 0)') {
            listInc.push(area);
        } else if ($(inpt).css('color') == 'rgb(255, 0, 0)') {
            listDec.push(area);
        }
    });
    product.winc_to_redraw(1, listInc, 'HORIZ');
    product.winc_to_redraw(-1, listDec, 'HORIZ');

    //По вертикали
    listInc.length = 0, listDec.length = 0;
    $('#scale-ver input').each((index, inpt) => {

        let lineArea = winCalc.root.lineArea(winCalc, 'VERT');
        let area = lineArea.find(el => el.id == $(inpt).attr('areaID'));
        if ($(inpt).css('color') == 'rgb(0, 155, 0)') {
            listInc.push(area);
        } else if ($(inpt).css('color') == 'rgb(255, 0, 0)') {
            listDec.push(area);
        }
    });
    product.winc_to_redraw(1, listInc, 'VERT');
    product.winc_to_redraw(-1, listDec, 'VERT');
}
//------------------------------------------------------------------------------
//Перерисовать новый размер
product.winc_to_redraw = function (dz, list, dir) {

    winCalc.root.resizElem(dz, list, dir);

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
product.scale_to_line = function (layout, lineArea) {

    
    //Прорисовка горизонтальных размеров 
    if (layout == "VERT") {
        $('#scale-hor input').each((i, el) => el.remove());
        lineArea.forEach((el, i) => {
            let inpt = document.createElement('input');
            $(inpt).val(el.lengthX.toFixed(1));
            $(inpt).attr('areaID', el.id);
            $(inpt).width(el.lengthX * winCalc.scale - 8);
            inpt.addEventListener('dblclick', () => product.dblclick_scale_color(inpt, 'HORIZ'));
            inpt.addEventListener('click', () => product.click_scale_index(inpt, 'HORIZ'));
            if (i === 0) {
                $(inpt).css('border-left', '4px solid #00f');
                $(inpt).css('margin-left', '28px');
            }
            $('#scale-hor').append(inpt);
        });


        //Прорисовка вертикальных размеров   
    } else if (layout == "HORIZ") {
        let length = winCalc.obj.height * winCalc.scale;
        $('#scale-ver').css('left', -1 * length); //влево после разворота на -90 градусов 
        $('#scale-ver input').each((i, el) => el.remove());
        lineArea.forEach((el, i) => {
            let inpt = document.createElement('input');
            $(inpt).val(el.lengthY.toFixed(1));
            $(inpt).attr('areaID', el.id);
            $(inpt).width(el.lengthY * winCalc.scale - 8);
            inpt.addEventListener('dblclick', () => product.dblclick_scale_color(inpt, 'VERT'));
            inpt.addEventListener('click', () => product.click_scale_index(inpt, 'VERT'));
            if (i === 0) {
                $(inpt).css('border-left', '4px solid #00f');
                $(inpt).css('border-right', '4px solid #00f');
            }
            $('#scale-ver').append(inpt);
        });
    }
}
//------------------------------------------------------------------------------
product.dblclick_scale_color = function (inpt, dir) {

    if (dir == "HORIZ") {
        $('#scale-ver input').each((i, el) => $(el).css('color', 'rgb(0, 0, 0)'));
    } else if (dir == 'VERT') {
        $('#scale-hor input').each((i, el) => $(el).css('color', 'rgb(0, 0, 0)'));
    }

    if ($(inpt).css('color') == 'rgb(0, 0, 0)') {
        $(inpt).css('color', 'rgb(0, 155, 0)');

    } else if ($(inpt).css('color') == 'rgb(0, 155, 0)') {
        $(inpt).css('color', 'rgb(255, 0, 0)');

    } else if ($(inpt).css('color') == 'rgb(255, 0, 0)') {
        $(inpt).css('color', 'rgb(0, 0, 0)');
    }
    $('#btnResiz').focus();
}
//------------------------------------------------------------------------------
product.click_canvas_color = function () {
    $('#scale-hor input').css('color', 'rgb(0, 0, 0)');
    $('#scale-ver input').css('color', 'rgb(0, 0, 0)');
}
//------------------------------------------------------------------------------
product.click_canvas_xy = function (canvas, event) {

    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / winCalc.scale;
    const y = (event.clientY - rect.top) / winCalc.scale;
    winCalc.elemList.forEach((e, i) => {
        if (e.type == 'IMPOST' || e.type == 'SHTULP' || e.type == 'STOIKA') {
            if (e.inside(x, y)) {
                product.scale_to_line(e.layout, [winCalc.root]);
            }
        }
    });
}
//------------------------------------------------------------------------------
product.click_scale_index = function (inpt, dir) {

    if (dir == 'HORIZ') {
        $('#scale-hor input').each((i, el) => {
            if (el == inpt && lineAreaVer.find(el => el.level_scale == i) != undefined)
                levelScaleVer = i;
        });
    } else {
        $('#scale-ver input').each((i, el) => {
            if (el == inpt && lineAreaHor.find(el => el.level_scale == i) != undefined)
                levelScaleHor = i;
        });
    }
    product.resize();
}
//------------------------------------------------------------------------------
