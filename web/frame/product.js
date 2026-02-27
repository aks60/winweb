
import {Type, TypeOpen1, Layout, LayoutHand} from '../enums/enums.js';
import {project, get_winc} from './project.js';
import {UGeo} from '../build/model/uGeo.js';
import {Wincalc} from '../build/Wincalc.js';
import LineString from '../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineString.js';

export let product = {};

//export function listener() {
//    product.winCalc.onMove = () => {
//        $('#n11').val(product.winCalc.width);
//        $('#n12').val(product.winCalc.height);
//    };
//}
//Создание конструкции
export function wincalcNew() {
    if (project.prjprodRec != null) {
        let cnv = document.getElementById("cnv");
        let script = project.prjprodRec[ePrjprod.script];        
        product.winCalc = Wincalc.new(cnv, cnv.offsetWidth, cnv.offsetHeight,  script);
    }
}

//Масштабирование
export function resize() {
    let winc = product.winCalc;
    let cnv = document.getElementById("cnv");

    winc.resize(); //(cnv.offsetWidth, cnv.offsetHeight, winc.gson);

    //Прорисовка полей
    let winWidth = $('#east').width() - 24;
    $("div .field2[dx]").each(function (index) {
        var width = $(this).attr('dx');
        $(this).width(winWidth - width);
    });
    $("#table1").jqGrid('setGridWidth', $("#east1").width() - 8);
    $("#table1").jqGrid('setGridHeight', $("#east1").height() - 24);
}

//Инициализация таблицы
export function init_table() {
    try {
        $(product.table1).jqGrid({
            datatype: "local",
            gridview: true,
            rownumbers: true,
            height: 246,
            shrinkToFit: false,
            scroll: "true",
            colNames: ['id', 'Параметр', 'Знач.по умолч...', 'Закреплено'],
            colModel: [
                {name: 'id', hidden: true, key: true},
                {name: 'text', width: 190, sorttype: "text", edittype: "button"},
                {name: 'val', width: 120, sorttype: "text"},
                {name: 'fixed', width: 20, sorttype: "text"}

            ], ondblClickRow: function (rowid) {
                $('#dialog-dic').load('frame/dialog/param.jsp');
            }, onSelectRow: function (rowid) {
                let syspar1Row = $(product.table1).jqGrid('getRowData', rowid);
                product.groupParam = findef(syspar1Row.id, SYSPAR1.id, eSyspar1)[eSyspar1.params_id];
            }
        });
    } catch (e) {
        errorLog("Error: product.init_table() " + e.message);
    }
}

//Загрузка данных в таблицу
export function load_table1() {
    try {
        let syspar1List = [];
        $(product.table1).jqGrid('clearGridData', true);
        let winc = get_winc();
        for (let syspar1Rec of winc.mapPardef.values()) {
            syspar1List.push(syspar1Rec);
        }
        syspar1List.sort((a, b) => b[eSyspar1.params_id] - a[eSyspar1.params_id]);
        for (let i = 0; i < syspar1List.length; i++) {
            let tr = syspar1List[i];

            let groupsRec = eGroups.list.find(rec => rec[eGroups.id] === tr[eSyspar1.groups_id])
            $(product.table1).jqGrid('addRowData', i + 1, {
                id: tr[eSyspar1.id],
                text: groupsRec[eGroups.name],
                val: tr[eSyspar1.text],
                fixed: tr[eSyspar1.fixed]
            });
        }
        $(product.table1).jqGrid("setSelection", 1);
    } catch (e) {
        errorLog("Error: product.load_table1() " + e.message);
    }
}

//Загрузка данных в tree
export function load_table2(tabtree) {
    debugger;
    try {
        if (project.prjprodRec != null) {
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
                arr.push({'id': el.id, 'parent': -2, 'text': el.type[2] + ', ' + el.layout[1], 'icon': 'lib-img/tool/leaf.gif'});
            }

            elements(root, arr); //вход в рекурсию    

            $(product.table2).jstree({'core': {'data': arr}})
                    .bind("loaded.jstree", function (event, data) {
                        $(this).jstree('open_node', $('#0'));
                        $(this).jstree('select_node', 0.0);
                    })
                    .bind("select_node.jstree", function (evt, data) {
                        let node = $(product.table2).jstree("get_selected")[0];
                        tree_to_tabs(node);
                    });
        }
    } catch (e) {
        errorLog("Error: product.load_table2() " + e.message);
    }
}

//Рекурсия элементов
export function elements(com, arr) {
    try {
        if (com.type === Type.STVORKA) {
            arr.push({'id': com.id, 'parent': 0, 'text': 'Створка', 'icon': 'lib-img/tool/folder.gif'});

            //Рамы створок
            for (let el of com.frames) {
                arr.push({'id': el.id, 'parent': com.id, 'text': el.type[2] + ', ' + el.layout[1], 'icon': 'lib-img/tool/leaf.gif'});
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
                if ([Type.AREA, Type.STVORKA].includes(el.type, 0)) {
                    elements(el, arr);
                } else {
                    //Импост, штульп...
                    if ([Type.IMPOST, Type.SHTULP, Type.STOIKA].includes(el.type, 0)) {
                        arr.push({'id': el.id, 'parent': -2, 'text': el.type[2] + ', ' + el.layout[1], 'icon': 'lib-img/tool/leaf.gif'});

                        //Стеклопакет
                    } else if (el.type === Type.GLASS) {
                        arr.push({'id': el.id, 'parent': -2, 'text': el.type[2], 'icon': "lib-img/tool/leaf.gif"});
                    }
                }
            }
        }
    } catch (e) {
        errorLog("Error: product.elements() " + e.message);
    }
}

//Загрузка тегов страницы
export function tree_to_tabs(nodeID) {
    try {
        $("#tabs-1, #tabs-2, #tabs-3, #tabs-4, #tabs-5").hide();
        if (nodeID !== '-2') {
            let prgprodID = project.prjprodRec[ePrjprod.id];
            let winc = project.wincalcMap.get(prgprodID);
            let elem = (nodeID === '-1') ? {type: Type.PARAM} : (nodeID === '0')
                    ? winc.root : winc.listAll.find(it => it.id === Number(nodeID));

            //Коробка
            if ([Type.RECTANGL, Type.TRAPEZE, Type.TRIANGL, Type.ARCH, Type.DOOR].includes(elem.type, 0)) {
                $("#tabs-1 :nth-child(1)").text(winc.root.type[2]);
                load_tabs({
                    n11: winc.width,
                    n12: winc.height,
                    n14: eColor.find(winc.colorID1)[eColor.name],
                    n15: eColor.find(winc.colorID2)[eColor.name],
                    n16: eColor.find(winc.colorID3)[eColor.name]
                });
                $("#tabs-1").show();

                //Парам. по умолчанию
            } else if (elem.type === Type.PARAM) {
                load_table1($('#table1'));
                $("#tabs-2").show();

                //Сторона коробки, створки
            } else if ([Type.BOX_SIDE, Type.STV_SIDE, Type.IMPOST, Type.SHTULP, Type.STOIKA].includes(elem.type, 0)) {
                if (elem.type === Type.BOX_SIDE) {
                    $("#tabs-3 :nth-child(1)").text('Сторона коробки ' + elem.layout[1]);
                } else if (elem.type === Type.STV_SIDE) {
                    $("#tabs-3 :nth-child(1)").text('Сторона створки ' + elem.layout[1]);
                } else {
                    $("#tabs-3 :nth-child(1)").text('Импост ' + elem.layout[1]);
                }
                let color1Rec = eColor.list.find(rec => rec[eColor.id] === elem.colorID1),
                        color2Rec = eColor.list.find(rec => rec[eColor.id] === elem.colorID2),
                        color3Rec = eColor.list.find(rec => rec[eColor.id] === elem.colorID3);
                load_tabs({
                    n31: elem.artiklRecAn[eArtikl.code],
                    n32: elem.artiklRecAn[eArtikl.name],
                    n33: color1Rec[eColor.name],
                    n34: color2Rec[eColor.name],
                    n35: color3Rec[eColor.name]
                });
                $("#tabs-3").show();

                //Створка
            } else if (elem.type === Type.STVORKA) {
                let furnitureRec = eFurniture.list.find(rec => elem.sysfurnRec[eSysfurn.furniture_id] === rec[eFurniture.id]);
                let env = elem.area.getGeometryN(0).getEnvelopeInternal();
                load_tabs({
                    n41: env.getWidth(),
                    n42: env.getHeight(),
                    n43: furnitureRec[eFurniture.name],
                    n44: elem.typeOpen[2],
                    n45: elem.handRec[eArtikl.code] + ' ÷ ' + elem.handRec[eArtikl.name],
                    n46: findef(elem.handColor, eColor.id, eColor)[eColor.name],
                    n47: elem.handLayout[1],
                    n48: elem.handHeight,
                    n49: elem.loopRec[eArtikl.code] + ' ÷ ' + elem.loopRec[eArtikl.name],
                    n4A: findef(elem.loopColor, eColor.id, eColor)[eColor.name],
                    n4B: elem.lockRec[eArtikl.code] + ' ÷ ' + elem.lockRec[eArtikl.name],
                    n4C: findef(elem.lockColor, eColor.id, eColor)[eColor.name],
                });
                $("#tabs-4").show();

                //Стеклопакет
            } else if (elem.type === Type.GLASS) {
                let color1Rec = eColor.list.find(rec => rec[eColor.id] === elem.colorID1);
                load_tabs({
                    n51: elem.artiklRec[eArtikl.code],
                    n52: elem.artiklRec[eArtikl.name],
                    n53: color1Rec[eColor.name]
                });
                $("#tabs-5").show();
            }
        }
    } catch (e) {
        errorLog('Error: product.tree_to_fields() ' + e.message);
    }
}

//Текстура изделия
export function color_to_windows(btnSrc) {
    try {
        let winc = project.wincalcMap.get(project.prjprodRec[ePrjprod.id]);
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

    } catch (e) {
        errorLog('Error: product.color_to_windows() ' + e.message);
    }
}

export function sysprof_to_frame(btnSrc) {
    try {
        let nodeID = $(product.table2).jstree("get_selected")[0];
        let prjprodID = project.prjprodRec[ePrjprod.id];
        let winc = project.wincalcMap.get(prjprodID);
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
        let nodeID = $(product.table2).jstree("get_selected")[0];
        let prjprodID = project.prjprodRec[ePrjprod.id];
        let winc = project.wincalcMap.get(prjprodID);
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
        let nodeID = $(product.table2).jstree("get_selected")[0];
        let prjprodID = project.prjprodRec[ePrjprod.id];
        let winc = project.wincalcMap.get(prjprodID);
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

//Изменение скрипта
export function update_script() {
    let prjprodID = project.prjprodRec[ePrjprod.id]; //id prjprod заказа
    let winc = project.wincalcMap.get(prjprodID);

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

export function test1() {
    let winc = product.winCalc;
    let frm = winc.root.frames[1];
    let x = 0;//frm.y1 + 8;
    frm.y2 = frm.y2 - 8;
    winc.resize();
}

export function test2() {
    let winc = product.winCalc;
    winc.ctx.clearRect(0, 0, winc.cnv.offsetWidth/winc.scale, winc.cnv.offsetHeight/winc.scale);
}

export function test3() {
    let winc = product.winCalc;
    winc.resize();
}

