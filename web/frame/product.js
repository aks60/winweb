
import {Type, TypeOpen1, Layout, LayoutHand} from '../enums/enums.js';
import {project} from './project.js';
import {UGeo} from '../build/model/uGeo.js';
import LineString from '../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineString.js';

export let product = {};

//Масштабирование
export function resize() {

    product.winCalc.resize(); 
    
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
            rownumWidth: 20,
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
                $('#dialog-jsp').load('frame/dialog/param.jsp');
            }, onSelectRow: function (rowid) {
                let syspar1Row = $(product.table1).jqGrid('getRowData', rowid);
                product.groupParam = findef(syspar1Row.id, SYSPAR1.id, eSyspar1)[eSyspar1.params_id];
            }
        });
    } catch (e) {
        console.error(e.message);
    }
}

//Загрузка данных в таблицу
export function load_table1() {
    try {
        let syspar1List = [];
        $(product.table1).jqGrid('clearGridData', true);
        for (let syspar1Rec of product.winCalc.mapPardef.values()) {
            syspar1List.push(syspar1Rec);
        }
        syspar1List.sort((a, b) => b[eSyspar1.params_id] - a[eSyspar1.params_id]);
        for (let i = 0; i < syspar1List.length; i++) {
            let tr = syspar1List[i];

            let groupsRec = eGroups.list.find(rec => rec[eGroups.id] === tr[eSyspar1.groups_id]);
            $(product.table1).jqGrid('addRowData', i + 1, {
                id: tr[eSyspar1.id],
                text: groupsRec[eGroups.name],
                val: tr[eSyspar1.text],
                fixed: tr[eSyspar1.fixed]
            });
        }
        $(product.table1).jqGrid("setSelection", 1);
    } catch (e) {
        console.error(e.message);
    }
}

//Загрузка данных в tree
export function load_table2(tabtree) {
    try {
        if (project.prjprodRec != null) {
            let arr = new Array();
            let root = product.winCalc.root;

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
                        //product.clickNode = data.node;
                        tree_to_tabs(data.node.id);
                    });
        }
    } catch (e) {
        console.error(e.message);
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
        console.error(e.message);
    }
}

//Загрузка тегов страницы
export function tree_to_tabs(nodeID) {
    try {
        $("#tabs-1, #tabs-2, #tabs-3, #tabs-4, #tabs-41, #tabs-42, #tabs-5").hide();
        if (nodeID !== '-2') {
            let winc = product.winCalc;
            let elem = (nodeID === '-1') ? {type: Type.PARAM} : (nodeID === '0')
                    ? winc.root : winc.listAll.find(it => it.id === Number(nodeID));
            product.clickNodeElem = elem;

            //Коробка
            if ([Type.RECTANGL, Type.TRAPEZE, Type.TRIANGL, Type.ARCH, Type.DOOR].includes(elem.type, 0)) {
                $("#tabs-1 :nth-child(1)").text(winc.root.type[2]);
                loadingTab({
                    n11: Math.round(winc.width),
                    n12: Math.round(winc.height),
                    n14: eColor.find(winc.root.colorID1)[eColor.name],
                    n15: eColor.find(winc.root.colorID2)[eColor.name],
                    n16: eColor.find(winc.root.colorID3)[eColor.name]
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
                loadingTab({
                    n31: elem.artiklRec[eArtikl.code],
                    n32: elem.artiklRec[eArtikl.name],
                    n36: (elem.artiklRec[eArtikl.analog_id] === null) ? '' : elem.artiklRecAn[eArtikl.code],
                    n33: color1Rec[eColor.name],
                    n34: color2Rec[eColor.name],
                    n35: color3Rec[eColor.name]
                });
                $("#tabs-3").show();

                //Створка
            } else if (elem.type === Type.STVORKA) {
                let furnitureRec = eFurniture.list.find(rec => elem.sysfurnRec[eSysfurn.furniture_id] === rec[eFurniture.id]);
                let env = elem.area.getGeometryN(0).getEnvelopeInternal();
                loadingTab({
                    n41: Math.round(env.getWidth()),
                    n42: Math.round(env.getHeight()),
                    n43: furnitureRec[eFurniture.name],
                    n44: elem.typeOpen[2],
                    n45: elem.handRec[0][eArtikl.code],
                    n4D: elem.handRec[0][eArtikl.name],
                    n46: findef(elem.handColor[0], eColor.id, eColor)[eColor.name],
                    n47: elem.handLayout[1],
                    n48: elem.handHeight,
                    n49: elem.loopRec[0][eArtikl.code] + ' / ' + elem.loopRec[0][eArtikl.name],
                    n4A: findef(elem.loopColor[0], eColor.id, eColor)[eColor.name],
                    n4B: elem.lockRec[0][eArtikl.code] + ' / ' + elem.lockRec[0][eArtikl.name],
                    n4C: findef(elem.lockColor[0], eColor.id, eColor)[eColor.name],
                });
                $("#tabs-4").show();
                $("#tabs-41").show();
                
                //Стеклопакет
            } else if (elem.type === Type.GLASS) {
                let color1Rec = eColor.list.seek(eColor.vrec, rec => rec[eColor.id] === elem.colorID1);
                loadingTab({
                    n51: elem.artiklRec[eArtikl.code],
                    n52: elem.artiklRec[eArtikl.name],
                    n53: color1Rec[eColor.name]
                });
                $("#tabs-5").show();
            }
        }
    } catch (e) {
        console.error(e.message);
    }
}

export function btn_to_tabs(btnTaq) {
    $("#tabs-41, #tabs-42").hide();
    if (btnTaq === 'btnProdStv') {
        $("#tabs-41").show();
    } else if (btnTaq === 'btnProdAdd') {
        $("#tabs-42").show();
    }
}

