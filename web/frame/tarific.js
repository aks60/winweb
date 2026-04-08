import {Type} from '../enums/enums.js';
import {project} from './project.js';

export let tarif = {};

//Масштабирование
export function resize() {

    var height = window.innerHeight;
    $("#context").css("height", height - 80);
    $(tarif.table1).jqGrid('setGridWidth', $("#centr").width() - 4);
    $(tarif.table1).jqGrid('setGridHeight', $("#centr").height() - 30);
}

export function init_table() {
    $(kits.table1).jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        rownumWidth: 20,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Артикул', 'Название', 'Основная', 'Внутренняя', 'Внешняя', 'Длина', 'Ширина', 'Кол-во'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'code', width: 80, sorttype: "text"},
            {name: 'name', width: 260, sorttype: "text"},
            {name: 'color1', width: 80, sorttype: "text"},
            {name: 'color2', width: 80, sorttype: "text"},
            {name: 'color3', width: 80, sorttype: "text"},
            {name: 'width', width: 60, sorttype: "text"},
            {name: 'height', width: 60, sorttype: "text"},
            {name: 'numb', width: 30, sorttype: "text"}
        ]
    });
}


export function load_table() {
    $(tarif.table1).jqGrid('clearGridData', true);
//    if (project.mapWinc.size !== 0) {
//        let prjkitList = ePrjkit.list.filter(rec => project.prjprodRec[ePrjprod.id] === rec[ePrjkit.prjprod_id]);
//        for (let i = 0; i < prjkitList.length; i++) {
//            let prjkitRec = prjkitList[i];
//            let artiklRec = findef(prjkitRec[ePrjkit.artikl_id], eArtikl.id, eArtikl);
//            $(tarif.table1).jqGrid('addRowData', i + 1, {
//                id: prjkitRec[eKits.id],
//                code: artiklRec[eArtikl.code],
//                name: artiklRec[eArtikl.name],
//                color1: findef(prjkitRec[ePrjkit.color1_id], eColor.id, eColor)[eColor.name],
//                color2: findef(prjkitRec[ePrjkit.color2_id], eColor.id, eColor)[eColor.name],
//                color3: findef(prjkitRec[ePrjkit.color3_id], eColor.id, eColor)[eColor.name],
//                width: prjkitRec[ePrjkit.width],
//                height: prjkitRec[ePrjkit.height],
//                numb: prjkitRec[ePrjkit.numb]
//            });
//        }
//        $(tarif.table1).jqGrid("setSelection", 1);
//    }
}


