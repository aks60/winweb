
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

            arr.push({'id': -1, 'parent': '#', 'text': 'Параметры по умолчанию', 'icon': 'lib-img/tool/leaf.gif'});
            arr.push({'id': root.id, 'parent': '#', 'text': 'Коробка', 'icon': 'lib-img/tool/folder.gif'});
            elements(root, arr); //вход в рекурсию    

            $(product.table2).jstree({'core': {'data': arr}})
                    .bind("loaded.jstree", function (event, data) {
                        $(this).jstree('select_node', 0.0);
                    })
                    .bind("select_node.jstree", function (evt, data) {                        
                        let com5t = (data.node.id === '-1') ? {type: Type.PARAM} : (data.node.id === '0')
                                ? product.winCalc.root : product.winCalc.listAll.find(it => it.id === Number(data.node.id));
                                
                        product.clickNode = data.node;  //выбранный tree узел      
                        product.clickNodeElem = com5t;  //выбранный компонент в узле
                        
                        tree_to_tabs(com5t);
                        
                    });
        }
    } catch (e) {
        console.error(e.message);
    }
}

//Рекурсия элементов
export function elements(com, arr) {
    try {
        //Створки
        if (com.type === Type.STVORKA) {
            arr.push({'id': com.id, 'parent': '#', 'text': com.type[2], 'icon': 'lib-img/tool/folder.gif'});
        }
        //Рамы
        for (let el of com.frames) {
            arr.push({'id': el.id, 'parent': com.id, 'text': el.type[2] + ', ' + el.layout[1], 'icon': 'lib-img/tool/leaf.gif'});
        }
        for (let el of com.childs) {

            //Контейнер
            if ([Type.AREA, Type.STVORKA].includes(el.type, 0)) {
                elements(el, arr);
                //Элемент
            } else {
                arr.push({'id': el.id, 'parent': com.id, 'text': el.type[2] + ', ' + el.layout[1], 'icon': 'lib-img/tool/leaf.gif'});
            }
        }
    } catch (e) {
        console.error(e.message);
    }
}

//Загрузка тегов страницы
export function tree_to_tabs(com5t) {
    try {
        $("#tabs-1, #tabs-2, #tabs-3, #tabs-4, #tabs-41, #tabs-42, #tabs-43, #tabs-5").hide();
        let winc = product.winCalc;        

        //Коробка
        if ([Type.RECTANGL, Type.TRAPEZE, Type.TRIANGL, Type.ARCH, Type.DOOR].includes(com5t.type, 0)) {
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
        } else if (com5t.type === Type.PARAM) {
            load_table1($('#table1'));
            $("#tabs-2").show();

            //Сторона коробки, створки
        } else if ([Type.BOX_SIDE, Type.STV_SIDE, Type.IMPOST, Type.SHTULP, Type.STOIKA].includes(com5t.type, 0)) {
            if (com5t.type === Type.BOX_SIDE) {
                $("#tabs-3 :nth-child(1)").text('Сторона коробки ' + com5t.layout[1]);
            } else if (com5t.type === Type.STV_SIDE) {
                $("#tabs-3 :nth-child(1)").text('Сторона створки ' + com5t.layout[1]);
            } else {
                $("#tabs-3 :nth-child(1)").text('Импост ' + com5t.layout[1]);
            }
            let color1Rec = eColor.list.find(rec => rec[eColor.id] === com5t.colorID1);
            let color2Rec = eColor.list.find(rec => rec[eColor.id] === com5t.colorID2);
            let color3Rec = eColor.list.find(rec => rec[eColor.id] === com5t.colorID3);
            loadingTab({
                n31: com5t.artiklRec[eArtikl.code],
                n32: com5t.artiklRec[eArtikl.name],
                n36: (com5t.artiklRec[eArtikl.analog_id] === null) ? '' : com5t.artiklRecAn[eArtikl.code],
                n33: color1Rec[eColor.name],
                n34: color2Rec[eColor.name],
                n35: color3Rec[eColor.name]
            });
            $("#tabs-3").show();

            //Створка
        } else if (com5t.type === Type.STVORKA) {
            let furnitureRec = eFurniture.list.find(rec => com5t.sysfurnRec[eSysfurn.furniture_id] === rec[eFurniture.id]);
            let env = com5t.area.getGeometryN(0).getEnvelopeInternal();
            loadingTab({
                n41: Math.round(env.getWidth()),
                n42: Math.round(env.getHeight()),
                n43: furnitureRec[eFurniture.name],
                n44: com5t.typeOpen[2],
                n45: com5t.handRec[0][eArtikl.code],
                n4D: com5t.handRec[0][eArtikl.name],
                n46: findef(com5t.handColor[0], eColor.id, eColor)[eColor.name],
                n47: com5t.handLayout[1],
                n48: com5t.handHeight,
                n49: com5t.loopRec[0][eArtikl.code] + ' / ' + com5t.loopRec[0][eArtikl.name],
                n4A: findef(com5t.loopColor[0], eColor.id, eColor)[eColor.name],
                n4B: com5t.lockRec[0][eArtikl.code] + ' / ' + com5t.lockRec[0][eArtikl.name],
                n4C: findef(com5t.lockColor[0], eColor.id, eColor)[eColor.name],
            });
            $("#tabs-4").show();
            btn_to_tabs('btnProdStv');

            //Стеклопакет
        } else if (com5t.type === Type.GLASS) {
            let color1Rec = eColor.list.seek(eColor.vrec, rec => rec[eColor.id] === com5t.colorID1);
            loadingTab({
                n51: com5t.artiklRec[eArtikl.code],
                n52: com5t.artiklRec[eArtikl.name],
                n53: color1Rec[eColor.name]
            });
            $("#tabs-5").show();
        }
//        }
    } catch (e) {
        console.error(e.message);
    }
}

export function btn_to_tabs(btnTaq) {
    $("#tabs-41, #tabs-42,  #tabs-43").hide();
    if (btnTaq === 'btnProdStv') {
        $("#tabs-41").show();
    } else if (btnTaq === 'btnProdFurn') {
        $("#tabs-42").show();
    } else if (btnTaq === 'btnProdAdd') {
        $("#tabs-43").show();
    }
}

