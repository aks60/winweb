import {Type} from '../enums/enums.js';
import {project} from './project.js';
import {product} from './product.js';

export let tarif = {};

//Масштабирование
export function resize() {

    var height = window.innerHeight;
    $("#context").css("height", height - 80);
    $(tarif.table1).jqGrid('setGridWidth', $("#centr").width() - 4);
    $(tarif.table1).jqGrid('setGridHeight', $("#centr").height() - 30);
}

export function init_table() {
    $(tarif.table1).jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        rownumWidth: 20,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Артикул', 'Название', 'Текстура', 'Внутренняя', 'Внешняя',
            'Длина', 'Ширина', 'Масса', 'Угол реза1', 'Угол реза2', 'Угол гориз.',
            'Кол. единиц', 'Ед.изм', 'Процент отхода', 'Количество с отх.', 'Себестоимость',
            'Цена за единицу', 'Стоимость без скидки', 'Стоимость со скидкой'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'code', width: 60, sorttype: "text"}, //Артикул
            {name: 'name', width: 220, sorttype: "text"}, //Название
            {name: 'colorID1', width: 80, sorttype: "text"}, //Текстура
            {name: 'colorID2', width: 80, sorttype: "text"}, //Внутренняя
            {name: 'colorID3', width: 80, sorttype: "text"}, //Внешняя
            {name: 'width', width: 30, sorttype: "int"}, //Длина
            {name: 'height', width: 30, sorttype: "int"}, //Ширина
            {name: 'weight', width: 30, sorttype: "float"}, //Вес
            {name: 'anglCut0', width: 30, sorttype: "float"}, //Угол1
            {name: 'anglCut1', width: 30, sorttype: "float"}, //Угол2
            {name: 'anglHoriz', width: 30, sorttype: "float"}, //Угол к горизонту
            {name: 'numb', width: 30, sorttype: "int"}, //Кол. единиц
            {name: 'unit', width: 30, sorttype: "text"}, //Ед.изм  
            {name: 'waste', width: 30, sorttype: "float"}, //Процент отхода см. eArtikl.otx_norm   
            {name: 'quant2', width: 30, sorttype: "float"}, //Количество с отх.
            {name: 'costprice', width: 30, sorttype: "float"}, //Себестоимость  
            {name: 'price', width: 30, sorttype: "float"}, //Цена за единицу измерения 
            {name: 'cost1', width: 30, sorttype: "float"}, //Стоимость без технологической скидки
            {name: 'cost2', width: 30, sorttype: "float"} //Стоимость с технологической скидкой
        ]
    });
}


export function load_table() {
    
    if (product.winCalc !== undefined) {
        $.ajax({
            url: 'dbset?action=tarificList',
            data: {param: JSON.stringify(product.winCalc.gson)},
            success: function (data) {
                debugger;
                eTarif.list = data;
            },
            error: function () {
                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
            }
        });

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
}


