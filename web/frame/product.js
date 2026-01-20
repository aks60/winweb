
import {Type} from '../enums/enums.js';
import {get_winc} from './order.js';

//Масштабирование
export function resize() {
    let cnv = document.querySelector("#cnv");
    if (cnv != null) {
        var height = window.innerHeight;
        $("#context").css("height", height - 82);

        //Изменение размера канвы
        cnv.width = $("#scale-cnv").width();
        cnv.height = $("#scale-cnv").height();
        if (order.prjprodRec != null) //Перерисовка конструкции на канве, после изменения размера канвы
            product.winCalc = win.build(cnv, order.prjprodRec[ePrjprod.script]);
        $('#scale-ver').width(product.winCalc.height * product.winCalc.scale); //длина шкалы перед разворотом на 90 градусов

//        //Прорисовка горизонт. размерных линий, после изменения размера канвы
//        let arrHor = ($('#scale-hor input').length === 0) ? [product.winCalc.root] : [];
//        $('#scale-hor input').each((i, p) => arrHor.push(product.winCalc.listArea.find(e => e.id === $(p).attr('areaId'))));
//        product.scale_new_input('HORIZ', arrHor);
//
//        //Прорисовка вертик. размерных линий, после изменения размера конструкции
//        let arrVer = ($('#scale-ver input').length == 0) ? [product.winCalc.root] : [];
//        $('#scale-ver input').each((i, p) => arrVer.push(product.winCalc.listArea.find(e => e.id === $(p).attr('areaId'))));
//        product.scale_new_input('VERT', arrVer);

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

//Инициализация таблицы
export function init_table() {

    $(product.table1).jqGrid({
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
            let syspar1Row = $(product.table1).jqGrid('getRowData', rowid);
            product.groupParam = findef(syspar1Row.id, SYSPAR1.id, eSyspar1)[eSyspar1.params_id];
        }
    });
}

//Загрузка данных в таблицу
export function load_table() {
    let syspar1List2 = [];
    $(product.table1).jqGrid('clearGridData', true);
    let winc = get_winc();
    for (let val of winc.root.pardefMap.values()) {
        syspar1List2.push(val);
    }
    syspar1List2.sort((a, b) => b[eSyspar1.params_id] - a[eSyspar1.params_id]);
    for (let i = 0; i < syspar1List2.length; i++) {

        let tr = syspar1List2[i];
        let paramsRec = eParams.list.find(tr => tr[eSyspar1.params_id] === tr[eParams.id]);
        $(product.table1).jqGrid('addRowData', i + 1, {

            id: tr[eSyspar1.id],
            text: paramsRec[eParams.text],
            val: tr[eSyspar1.text],
            fixed: tr[eSyspar1.fixed]
        });
    }
    $(product.table1).jqGrid("setSelection", 1);
}

//Загрузка данных в tree
export function load_tree(tabtree) {
    debugger;
    if (order.prjprodRec != null) {
        let arr = new Array();
        let winc = get_winc();
        let root = winc.root;

        if (root.type === Type.RECTANGL)
            arr.push({'id': root.id, 'parent': '#', 'text': 'Окно четырёхугольное', 'icon': 'lib-img/tool/folder.gif'});
        else if (root.type === Type.TRAPEZE)
            arr.push({'id': root.id, 'parent': '#', 'text': 'Окно трапеция', 'icon': 'lib-img/tool/folder.gif'});
        else if (root.type === Type.TRIANGL)
            arr.push({'id': root.id, 'parent': '#', 'text': 'Окно треугольное', 'icon': 'lib-img/tool/folder.gif'});
        else if (root.type === Type.ARCH)
            arr.push({'id': root.id, 'parent': '#', 'text': 'Окно арочное', 'icon': 'lib-img/tool/folder.gif'});

        arr.push({'id': -1, 'parent': root.id, 'text': 'Параметры по умолчанию', 'icon': 'lib-img/tool/leaf.gif'});
        arr.push({'id': -2, 'parent': root.id, 'text': 'Коробка', 'icon': 'lib-img/tool/folder.gif'});
        
        //Рамы
        for (let el of root.frames) {
            arr.push({'id': el.id, 'parent': -2, 'text': el.type[2], 'icon': 'lib-img/tool/leaf.gif'});
        }

        elements(root, arr); //вход в рекурсию    

        $(product.tabtree).jstree({'core': {'data': arr}})
                .bind("loaded.jstree", function (event, data) {
                    $(this).jstree('open_node', $('#0'));
                    $(this).jstree('select_node', 0.0);
                })
                .bind("select_node.jstree", function (evt, data) {
                    let node = $(product.tabtree).jstree("get_selected")[0];
                    local_to_fields(node);
                });
    }
}

//Рекурсия элементов
export function elements(com, arr) {

    if (com.type === Type.STVORKA) {
        arr.push({'id': com.id, 'parent': 0, 'text': 'Створка', 'icon': 'lib-img/img/tool/folder.gif'});
       
       //Рамы
        for (let el of com.frames) {  
            arr.push({'id': el.id, 'parent': com.id, 'text': el.type[2], 'icon': 'lib-img/tool/leaf.gif'});
        }
        //Заполнения
        for (let el of com.childs) { 
            if (el.type === Type.GLASS) {
                arr.push({'id': el.id, 'parent': com.id, 'text': 'Заполнение (Стеклопакет, стекло)', 'icon': 'lib-img/tool/leaf.gif'});
            }
        }
    } else {
        for (let el of com.childs) {
            
            //Контейнер
            if (['AREA', 'STVORKA'].includes(el.type, 0)) {
                elements(el, arr);
                
            } else {                
                //Импост, штульп...
                if (["IMPOST", "SHTULP", "STOIKA"].includes(el.type, 0)) {
                    let lay = (com.layout === "VERT") ? ' (горизонтальная)' : ' {вертикальная)'
                    arr.push({'id': el.id, 'parent': -2, 'text': 'Ригель, импост, стойка' + lay, 'icon': 'lib-img/tool/leaf.gif'});
                } else if (el.type === Type.GLASS) {
                    arr.push({'id': el.id, 'parent': -2, 'text': 'Заполнение (Стеклопакет, стекло)', 'icon': "lib-img/tool/leaf.gif"});
                }
            }
        }
    }
}

//Загрузка свойств конструкции
export function server_to_fields() {
//    try {
//        if (order.prjprodRec !== null) {
//            let prjprodID = order.prjprodRec[ePrjprod.id];
//            if (prjprodID !== undefined) {
//                $.ajax({
//                    url: 'dbset?action=stvFields',
//                    data: {'prjprodID': prjprodID},
//                    success: function (data) {
//                        product.stvFields = data.stvFields;
//                        let id = order.prjprodRec[ePrjprod.id];
//                        let winc = order.wincalcMap.get(id);
//                        for (let el of winc.listElem) {
//                            if (el.typeForm() === 'STVORKA') {
//                                for (let fk in data.stvFields) {
//                                    if (fk === el.id) {
//
//                                        el.handleRec = data.stvFields[fk].handleRec;
//                                        el.handleColor = data.stvFields[fk].handleColor;
//                                        el.loopRec = data.stvFields[fk].loopRec;
//                                        el.loopColor = data.stvFields[fk].loopColor;
//                                        el.handleRec = data.stvFields[fk].handleRec;
//                                        el.lockRec = data.stvFields[fk].lockRec;
//                                    }
//                                }
//                            }
//                        }
//                        let tr = $("#tree-winc").jstree("get_selected")
//                        if (tr != undefined) {
//                            let nodeID = tr[0];
//                            let elem = winc.listElem.find(it => it.id === nodeID);
//                            if (elem.typeForm() === 'STVORKA') {
//                                product.local_to_fields(nodeID);
//                            }
//                        }
//                    }
//                });
//            }
//        }
//    } catch (e) {
//        console.error('Error: product.server_to_fields() ' + e.message);
//    }
}

//Загрузка тегов страницы
export function local_to_fields(nodeID) {
    
//    $("#tabs-1, #tabs-2, #tabs-3, #tabs-4, #tabs-5").hide();
//    if (nodeID === -2) {
//        return;
//    }
//    let elem = {};
//    let id = order.prjprodRec[ePrjprod.id];
//    let winc = order.wincalcMap.get(id);
//    if (nodeID === -1) {
//        elem = {type: 'DEF_PARAM'};
//    } else {
//        elem = winc.listElem.find(it => it.id === nodeID);
//    }
//    debugger;
//    //Коробка
//    if (["RECTANGL", "TRAPEZE", "TRIANGL", "ARCH", "DOOR"].includes(elem.type, 0)) {
//        let typ = {RECTANGL: 'Окно четырёхугольное', TRAPEZE: 'Окно трапециидальное', TRIANGL: 'Окно треугольное', ARCH: 'Окно арочное', DOOR: 'Дверь'};
//        $("#tabs-1 :nth-child(1)").text(typ[winc.root.type]);
//        load_tabs('tabs-1', {
//            n11: winc.width, n12: winc.height, n13: winc.heightAdd,
//            n14: winc.color1Rec[eColor.name], n15: winc.color2Rec[eColor.name], n16: winc.color3Rec[eColor.name]
//        }, ['n11', 'n12', 'n13', 'n14', 'n15', 'n16']);
//        $("#tabs-1").show();
//
//        //Парам. по умолчанию
//    } else if (elem.typeForm() === "DEF_PARAM") {
//        product.load_table($('#table1'));
//        $("#tabs-2").show();
//
//        //Сторона коробки, створки
//    } else if (["BOX_SIDE", "STVORKA_SIDE", "IMPOST", "SHTULP", "STOIKA"].includes(elem.type, 0)) {
//        let lay = {BOTT: 'нижняя', RIGHT: 'правая', TOP: 'верхняя', LEFT: 'левая', VERT: 'вертикальный', HORIZ: 'горизонтальный'};
//        if (elem.typeForm() === "BOX_SIDE") {
//            $("#tabs-3 :nth-child(1)").text('Сторона коробки ' + lay[elem.layout]);
//        } else if (elem.typeForm() === "STVORKA_SIDE") {
//            $("#tabs-3 :nth-child(1)").text('Сторона створки ' + lay[elem.layout]);
//        } else {
//            $("#tabs-3 :nth-child(1)").text('Импост ' + lay[elem.layout]);
//        }
//        load_tabs('tabs-3', {
//            n31: elem.artiklAn[eArtikl.code], n32: elem.artiklAn[eArtikl.name],
//            n33: elem.color1Rec[eColor.name], n34: elem.color2Rec[eColor.name], n35: elem.color3Rec[eColor.name]
//        }, ['n31', 'n32', 'n33', 'n34', 'n35']);
//        $("#tabs-3").show();
//
//        //Створка
//    } else if (elem.typeForm() === "STVORKA") {
//        let furnitureRec = eFurniture.list.find(rec => elem.sysfurnRec[eSysfurn.furniture_id] === rec.list[eFurnituire.id]);
//        let type_open = TypeOpen1.INVALID[1]; //сторона открывания
//        for (let k in TypeOpen1) {
//            if (TypeOpen1[k][0] === elem.typeOpen) {
//                type_open = TypeOpen1[k][1];
//            }
//        }
//        load_tabs('tabs-4', {
//            n41: elem.width, n42: elem.height, n43: furnitureRec[eFurnituire.name], n44: type_open,
//            n45: elem.handleRec[eArtikl.code] + ' ÷ ' + elem.handleRec[eArtikl.name],
//            n46: findef(elem.handleColor, eColor.id, eColor)[eColor.name],
//            n47: {MIDL: 'По середине', CONST: 'Константная', VARIAT: 'Установлена'}[elem.handleLayout],
//            n48: elem.handleHeight,
//            n49: elem.loopRec[eArtikl.code] + ' ÷ ' + elem.loopRec[eArtikl.name],
//            n4A: findef(elem.loopColor, eColor.id, eColor)[eColor.name],
//            n4B: elem.lockRec[eArtikl.code] + ' ÷ ' + elem.lockRec[eArtikl.name],
//            n4C: findef(elem.lockColor, eColor.id, eColor)[eColor.name],
//        }, ['n41', 'n42', 'n43', 'n44', 'n45', 'n46', 'n47', 'n48', 'n49', 'n4A', 'n4B', 'n4C']);
//        $("#tabs-4").show();
//
//        //Стеклопакет
//    } else if (elem.typeForm() === "GLASS") {
//        load_tabs('tabs-5', {
//            n51: elem.artiklRec[eArtikl.code], n52: elem.artiklRec[eArtikl.name], n53: elem.color1Rec[eColor.name]
//        }, ['n51', 'n52', 'n53']);
//        $("#tabs-5").show();
//    }
}

//Текстура изделия
export function color_to_windows(btnSrc) {
    //try {
    let winc = order.wincalcMap.get(order.prjprodRec[ePrjprod.id]);
    let groupSet = new Set();
    let colorSet = new Set();

    let groupTxt = eSystree.list.find(rec => winc.nuni === rec.list[eSystree.id])[eSystree.cgrp];
    let groupArr = (groupTxt === null) ? null : parserInt(groupTxt);
    let colorTxt = (btnSrc == 'n14') ? eSystree.list.find(rec => winc.nuni === rec.list[eSystree.id])[eSystree.col1]
            : (btnSrc === 'n15') ? eSystree.list.find(rec => winc.nuni === rec.list[eSystree.id])[eSystree.col2]
            : eSystree.list.find(rec => winc.nuni === rec.list[eSystree.id])[eSystree.col3];
    let colorArr = (colorTxt === null) ? null : parserInt(colorTxt);

    //Поле группы текстур заполнено
    if (groupArr != null) {
        for (let s1 of groupArr) { //группы
            let groupSet2 = new Set();
            let colorSet2 = new Set();
            let b = false;
            for (let rec of eColor.list) {
                if (rec[eColor.colgrp_id] === s1) {
                    groupSet2.add(rec[eColor.colgrp_id]); //группы
                    colorSet2.add(rec); //текстуры
                    for (let i = 0; i < colorArr.length; i = i + 2) { //тестуры
                        if (rec[eColor.id] >= colorArr[i] && rec[eColor.id] <= colorArr[i + 1]) {
                            b = true;
                        }
                    }
                }
            }
            if (b === false) { //если небыло пападаний то добавляем всю группу
                groupSet.add(groupSet2);
                colorSet.add(colorSet2);
            }
        }
    }
    //Поле текстур заполнено
    if (colorArr.length != 0) {
        for (let rec of eColor.list) {
            if (groupArr != null) {

                for (let s1 of groupArr) { //группы
                    if (rec[eColor.colgrp_id] === s1) {
                        for (let i = 0; i < colorArr.length; i = i + 2) { //текстуры
                            if (rec[eColor.id] >= colorArr[i] && rec[eColor.id] <= colorArr[i + 1]) {
                                groupSet.add(rec[eColor.colgrp_id]);
                                colorSet.add(rec);
                            }
                        }
                    }
                }
            } else {
                for (let i = 0; i < colorArr.length; i = i + 2) { //тестуры
                    if (rec[eColor.id] >= colorArr[i] && rec[eColor.id] <= colorArr[i + 1]) {
                        groupSet.add(rec[eColor.colgrp_id]);
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
    //    console.error('Error:product.color_to_windows() ' + e.message);
    //}
}

export function sysprof_to_frame(btnSrc) {
    try {
        let nodeID = $("#tree-winc").jstree("get_selected")[0];
        let prjprodID = order.prjprodRec[ePrjprod.id];
        let winc = order.wincalcMap.get(prjprodID);
        let elem = winc.listElem.find(it => it.id === nodeID);
        let sysprofSet = new Set();

        //Цикл по профилям ветки 
        for (let sysprofRec of eSysprof.list) {
            //Отфильтруем подходящие по параметрам
            if (winc.nuni === sysprofRec[eSysprof.systree_id] && Type[elem.type][1] === sysprofRec[eSysprof.use_type]) {
                let use_side_ID = sysprofRec[eSysprof.use_side];
                if (use_side_ID === Layout[elem.layout][0]
                        || ((elem.layout === 'BOTT' || elem.layout === 'TOP') && use_side_ID === UseSide.HORIZ[0])
                        || ((elem.layout === 'RIGHT' || elem.layout === 'LEFT') && use_side_ID === UseSide.VERT[0])
                        || use_side_ID === UseSide.ANY[0] || use_side_ID === UseSide.MANUAL[0]) {

                    sysprofSet.add(sysprofRec);
                }
            }
        }
        product.sysprofArr = Array.from(sysprofSet);
        product.buttonSrc = btnSrc;
        $('#dialog-dic').load('frame/dialog/sysprof.jsp');

    } catch (e) {
        console.error('Error: product.sysprof_to_frame() ' + e.message);
    }
}

//Фурнитура стеклопакета
export function furniture_to_stvorka(btnSrc) {
    product.buttonSrc = btnSrc;
    $('#dialog-dic').load('frame/dialog/furniture.jsp');
}

//Сторона открывания
export function sideopen_to_stvorka(btnSrc) {
    product.buttonSrc = btnSrc;
    $('#dialog-dic').load('frame/dialog/sideopen.jsp');
}

//Артикл ручки, подвеса, замка
export function artikl_to_stvork(btnSrc) {
    product.buttonSrc = btnSrc;
    $('#dialog-dic').load('frame/dialog/artikl.jsp');
}

//Заполнение
export function color_to_element(btnSrc) {
    try {
        let nodeID = $("#tree-winc").jstree("get_selected")[0];
        let prjprodID = order.prjprodRec[ePrjprod.id];
        let winc = order.wincalcMap.get(prjprodID);
        let elem = winc.listElem.find(it => it.id == nodeID);
        let groupSet = new Set();
        let colorSet = new Set();
        let artiklElem = null;

        if (btnSrc === 'n33')
            artiklElem = elem.artiklRec;
        else if (btnSrc === 'n34')
            artiklElem = elem.artiklRec;
        else if (btnSrc === 'n35')
            artiklElem = elem.artiklRec;
        else if (btnSrc === 'n46')
            artiklElem = elem.handleRec;
        else if (btnSrc === 'n4A')
            artiklElem = elem.loopRec;
        else if (btnSrc === 'n4C')
            artiklElem = elem.lockRec;
        else if (btnSrc === 'n53')
            artiklElem = elem.artiklRec;

        //Все текстуры артикула элемента конструкции
        for (let rec of eArtdet.list) {
            if (rec.list[eArtdet.artikl_id] === artiklElem[eArtikl.id]) {
                if (rec.list[eArtdet.color_fk] < 0) { //все текстуры групы color_fk

                    eColor.ist.forEach(colorRec => {
                        if (colorRec[eColor.colgrp_id] === Math.abs(rec.list[eArtdet.color_fk])) {

                            groupSet.add(Math.abs(colorRec[eColor.colgrp_id]));
                            colorSet.add(colorRec);
                        }
                    });
                } else { //текстура color_fk 
                    let color2Rec = eColor.list.find(rec3 => rec.list[eArtdet.color_fk] === rec3[eColor.id]);
                    groupSet.add(color2Rec[eColor.colgrp_id]);
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
        console.error('Error: product.color_to_element() ' + e.message);
    }
}

//Заполнение
export function artikl_to_glass(btnSrc) {
    try {
        let nodeID = $("#tree-winc").jstree("get_selected")[0];
        let prjprodID = order.prjprodRec[ePrjprod.id];
        let winc = order.wincalcMap.get(prjprodID);
        let elem = winc.listElem.find(it => it.id === nodeID);

        //Список доступных толщин в ветке системы например 4;5;8
        let systreeRec = eSystree.list.find(rec => winc.nuni === rec.list[eSystree.id]);
        if (systreeRec != undefined) {
            let depth = systreeRec[eSystree.depth];
            depth = depth.replace(/;/g, ',');
            if (depth.charAt(depth.length - 1) === ',') {
                depth = depth.substring(0, depth.length - 1);
            }
            depth = depth.split(',');
            let artiklList = eArtikl.list.filter(rec => rec.list[eArtikl.depth] != undefined && 5 == rec.list[eArtikl.level1]
                        && [1, 2, 3].includes(rec.list[eArtikl.level2]) && depth.includes(rec.list[eArtikl.depth].toString()));

            product.artiklArr = artiklList;
            product.buttonSrc = btnSrc;
            $('#dialog-dic').load('frame/dialog/artikl.jsp');

        }
    } catch (e) {
        console.error('Error: product.artikl_to_glass() ' + e.message);
    }
}

//Перерисовать при изменении размера (размер канвы тот-же)
export function redraw() {
    let prjprodID = order.prjprodRec[ePrjprod.id]; //id prjprod заказа
    let prjprodRec = ePrjprod.list.find(rec => prjprodID === rec.list[ePrjprod.id]);
    let cvs = document.querySelector("#cnv");
    prjprodRec[ePrjprod.script] = JSON.stringify(product.winCalc.gson, (k, v) => isEmpty(v));

    product.winCalc = win.build(cvs, prjprodRec[ePrjprod.script]);

    order.wincalcMap.set(prjprodID, product.winCalc); //новый экз.  
    resize();
    local_to_fields("0");
}

//Наполнение новыми инпутами шкалы горизонтальных и вертикальных размеров
export function scale_new_input(layout, lineArea) {
    let lineArr = [];

    //Прорисовка горизонтальных размеров 
    if (layout === "HORIZ") {
        lineArea.forEach((e, i) => {

            let inpt = document.createElement('input'); //create input
            if ($('#scale-hor input:eq(' + i + ')').length === 1) {
                $(inpt).css("color", $('#scale-hor input:eq(' + i + ')').css("color"));
            }
            $(inpt).val(e.lengthX.toFixed(1));
            $(inpt).attr('areaID', e.id);
            $(inpt).width(e.width * product.winCalc.scale - 8);
            inpt.addEventListener('dblclick', () => product.dblclick_scale_color(inpt, 'HORIZ'));
            inpt.addEventListener("keydown", (event) => product.keyup_btn_enter(inpt, event));
            if (i === 0) {
                $(inpt).css('margin-left', 30 + lineArea[i].x1 * product.winCalc.scale);
            }
            lineArr.push(inpt);
        });
        $('#scale-hor input').each((i, el) => el.remove());
        lineArr.forEach((el, i) => $('#scale-hor').append(el));

        //Прорисовка вертикальных размеров   
    } else if (layout === "VERT") {

        lineArr.length = 0;
        let length = product.winCalc.gson.height * product.winCalc.scale;
        $('#scale-ver').css('left', -1 * length); //влево после разворота на -90 градусов 
        lineArea.forEach((e, i) => {

            let inpt = document.createElement('input'); //create input           
            if ($('#scale-ver input:eq(' + i + ')').length === 1) {
                $(inpt).css("color", $('#scale-ver input:eq(' + i + ')').css("color"));
            }
            $(inpt).val(e.lengthY.toFixed(1));
            $(inpt).attr('areaID', e.id);
            $(inpt).width(e.lengthY * product.winCalc.scale - 10);
            inpt.addEventListener('dblclick', () => product.dblclick_scale_color(inpt, 'VERT'));
            inpt.addEventListener("keydown", (event) => product.keyup_btn_enter(inpt, event));
            if (i === 0) {
                $(inpt).css('margin-left', (product.winCalc.height - e.y2) * product.winCalc.scale);
            }
            lineArr.push(inpt);
        });
        $('#scale-ver input').each((i, el) => el.remove());
        lineArr.forEach((el, i) => $('#scale-ver').append(el));
    }
}

//Установка цвета горизонтальных и вертикальных размеров
export function dblclick_scale_color(inpt, dir) {

    $('#scale-ver input').each((i, el) => $(el).css('color', 'rgb(0, 0, 0)'));
    $('#scale-hor input').each((i, el) => $(el).css('color', 'rgb(0, 0, 0)'));
    $(inpt).css('color', 'rgb(255, 0, 0)');
    $("#spinner").spinner("value", $(inpt).val());
//    $('#btnResiz').focus();
}

//Click на импосте для расчёта шкал размеров
export function click_canvas_xy(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / product.winCalc.scale;
    const y = (event.clientY - rect.top) / product.winCalc.scale;

    //Если клик не на конструкции
    if (product.winCalc.root.inside(x, y) === false) {
//        product.scale_new_input('HORIZ', [product.winCalc.root]);
//        product.scale_new_input('VERT', [product.winCalc.root]);
//        $("#spinner").spinner("value", 0);
//        $('#scale-hor input').css('color', 'rgb(0, 0, 0)');
//        $('#scale-ver input').css('color', 'rgb(0, 0, 0)');

    } else { //На конструкции
//        product.winCalc.listElem.forEach((e, i) => {
//            if (e.typeForm() === 'IMPOST' || e.typeForm() === 'SHTULP' || e.typeForm() === 'STOIKA') {
//                if (e.inside(x, y)) {
//                    let m = product.winCalc.root.lineCross(e);
//                    if (e.layout === 'HORIZ') {
//                        product.scale_new_input('VERT', m.reverse());
//                    } else {
//                        product.scale_new_input('HORIZ', m);
//                    }
//                }
//            }
//        });
    }
}

//Клик на кнопке масштабирования
export function click_btn_resiz() {
    let draw = 0;

    //По горизонтали  
    $('#scale-hor input').each((i, e) => {
        if ($(e).css('color') === 'rgb(255, 0, 0)') {
            ++draw;
            $('#scale-hor input').each((i, m) => {
                let area = product.winCalc.listArea.find(v => v.id === $(m).attr('areaID'));
                if ($(m).css('color') === 'rgb(255, 0, 0)') {
                    area.lengthX = area.lengthX + 1;
                } else {
                    area.lengthX = area.lengthX - 1;
                }
            });
        }
    });

    //По вертикали
    $('#scale-ver input').each((i, e) => {
        if ($(e).css('color') === 'rgb(255, 0, 0)') {
            ++draw;
            $('#scale-ver input').each((i, m) => {
                let area = product.winCalc.listArea.find(v => v.id === $(m).attr('areaID'));
                if ($(m).css('color') === 'rgb(255, 0, 0)') {
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

//Клик на кнопке enter
export function keyup_btn_enter(inpt, event) {
    let dv = 0;
    if (event.key === "Enter") {
        let areas = product.winCalc.listArea.find(e => e.id === $(inpt).attr('areaID'));

        //По горизонтали
        if ($(inpt).parent().attr('id') === 'scale-hor') {
            dv = $(inpt).val() - areas.lengthX;
            $('#scale-hor input').each((i, m) => {
                let area = product.winCalc.listArea.find(v => v.id === $(m).attr('areaID'));
                if ($(inpt).attr('areaID') === $(m).attr('areaID')) { //ограничение размера
                    dv = (area.lengthX + dv < 200) ? 0 : dv;
                } else {
                    dv = (area.lengthX - dv < 200) ? 0 : dv;
                }
            });
            if (dv != 0)
                $('#scale-hor input').each((i, m) => {
                    let area = product.winCalc.listArea.find(v => v.id === $(m).attr('areaID'));
                    if ($(inpt).attr('areaID') === $(m).attr('areaID')) {
                        area.lengthX = area.lengthX + dv;
                    } else {
                        area.lengthX = area.lengthX - dv;
                    }
                });


        } else { //По вертикали           
            dv = $(inpt).val() - areas.lengthY;
            $('#scale-ver input').each((i, m) => {
                let area = product.winCalc.listArea.find(v => v.id === $(m).attr('areaID'));
                if ($(inpt).attr('areaID') === $(m).attr('areaID')) { //ограничение размера
                    dv = (area.lengthY + dv < 200) ? 0 : dv;
                } else {
                    dv = (area.lengthY - dv < 200) ? 0 : dv;
                }
            });
            if (dv != 0) {
                $('#scale-ver input').each((i, m) => {
                    let area = product.winCalc.listArea.find(v => v.id === $(m).attr('areaID'));
                    if ($(inpt).attr('areaID') === $(m).attr('areaID')) {
                        area.lengthY = area.lengthY + dv;
                    } else {
                        area.lengthY = area.lengthY - dv;
                    }
                });
            }
        }
        if (dv === 0) {
            alert('Внимание! Недопустимые размеры конструкции. (200мм)');

            if ($(inpt).parent().attr('id') === 'scale-hor')
                $(inpt).val(areas.lengthX.toFixed(1));
            else
                $(inpt).val(areas.lengthX.toFixed(1));
        } else
            product.redraw(); //перерисовать при изменении размера
    }
    //console.log("+++ " + product.winCalc.heightAdd);
}

//Клик на кнопке масштабирования
export function click_spinner() {
    let draw = 0;

    //По горизонтали  
    $('#scale-hor input').each((i, e) => {
        if ($(e).css('color') === 'rgb(255, 0, 0)') {
            let areas = product.winCalc.listArea.find(v => v.id === $(e).attr('areaID'));
            let dv = $("#spinner").spinner("value") - areas.lengthX;
            ++draw;
            $('#scale-hor input').each((i, m) => {
                let area = product.winCalc.listArea.find(v => v.id === $(m).attr('areaID'));
                if ($(m).css('color') === 'rgb(255, 0, 0)') {
                    area.lengthX = area.lengthX + dv;
                } else {
                    area.lengthX = area.lengthX - dv;
                }
            });
        }
    });

    //По вертикали
    $('#scale-ver input').each((i, e) => {
        if ($(e).css('color') === 'rgb(255, 0, 0)') {
            let areas = product.winCalc.listArea.find(v => v.id === $(e).attr('areaID'));
            let dv = $("#spinner").spinner("value") - areas.lengthX;
            ++draw;
            $('#scale-ver input').each((i, m) => {
                let area = product.winCalc.listArea.find(v => v.id === $(m).attr('areaID'));
                if ($(m).css('color') === 'rgb(255, 0, 0)') {
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

//Изменение скрипта
export function update_script() {
    let prjprodID = order.prjprodRec[ePrjprod.id]; //id prjprod заказа
    let winc = order.wincalcMap.get(prjprodID);

    $.ajax({//запишем профиль в серверную базу данных
        url: 'dbset?action=updateScript',
        data: {param: JSON.stringify({id: prjprodID, script: JSON.stringify(winc.gson)})},
        success: function (data) {
            if (data.result != 'ok')
                dialogMes('Сообщение', "<p>" + data.result);
        },
        error: function () {
            dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
        }
    });
}

