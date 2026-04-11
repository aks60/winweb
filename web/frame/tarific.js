import {UseUnit} from '../enums/enums.js';
import {project} from './project.js';
import {product} from './product.js';

export let tarif = {};

//Масштабирование
export function resize() {

    var height = window.innerHeight;
    $("#context").css("height", height - 80);
    $(tarif.table1).jqGrid('setGridWidth', $("#centr").width() - 4);
    $(tarif.table1).jqGrid('setGridHeight', $("#centr").height() - 34);
}

export function init_table() {
    $(tarif.table1).jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        rownumWidth: 20,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Расположение', 'Артикул', 'Название', 'Текстура', 'Внутренняя', 'Внешняя',
            'Длина', 'Ширина', 'Масса', 'Угол реза1', 'Угол реза2', 'Угол гориз.',
            'Кол. единиц', 'Ед.изм', 'Процент отхода', 'Количество с отх.', 'Себестоимость',
            'Цена за единицу', 'Стоимость без скидки', 'Стоимость со скидкой'],
        colModel: [
            {name: 'ID', hidden: true},
            {name: 'place', width: 60, sorttype: "text"}, //Место размешения
            {name: 'code', width: 60, sorttype: "text"}, //Артикул
            {name: 'name', width: 220, sorttype: "text"}, //Название
            {name: 'colorID1', width: 80, sorttype: "text"}, //Текстура
            {name: 'colorID2', width: 80, sorttype: "text"}, //Внутренняя
            {name: 'colorID3', width: 80, sorttype: "text"}, //Внешняя
            {name: 'width', width: 30, sorttype: "int"}, //Длина
            {name: 'height', width: 30, sorttype: "int"}, //Ширина
            {name: 'weight', width: 30, sorttype: "float"}, //Вес
            {name: 'anglCut0', width: 25, sorttype: "float"}, //Угол1
            {name: 'anglCut1', width: 25, sorttype: "float"}, //Угол2
            {name: 'anglHoriz', width: 25, sorttype: "float"}, //Угол к горизонту
            {name: 'count', width: 25, sorttype: "int"}, //Кол. единиц
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
                eTarif.list = data;
                $(tarif.table1).jqGrid('clearGridData', true);
                for (let i = 0; i < eTarif.list.length; i++) {
                    let tarifRec = eTarif.list[i];
                    $(tarif.table1).jqGrid('addRowData', i + 1, {
                        ID: tarifRec[eTarif.id],
                        place: tarifRec[eTarif.place],
                        code: tarifRec[eTarif.code],
                        name: tarifRec[eTarif.name],
                        colorID1: eColor.find(tarifRec[eTarif.colorID1])[eColor.name],
                        colorID2: eColor.find(tarifRec[eTarif.colorID2])[eColor.name],
                        colorID3: eColor.find(tarifRec[eTarif.colorID3])[eColor.name],
                        width: Math.round(tarifRec[eTarif.width]),
                        height: Math.round(tarifRec[eTarif.height]),
                        weight: Math.round(tarifRec[eTarif.weight] * 10) / 10,
                        anglCut0: Math.round(tarifRec[eTarif.anglCut0] * 100) / 100,
                        anglCut1: Math.round(tarifRec[eTarif.anglCut1] * 100) / 100,
                        anglHoriz: Math.round(tarifRec[eTarif.anglHoriz] * 100) / 100,
                        count: tarifRec[eTarif.count],
                        unit: UseUnit.name(tarifRec[eTarif.unit]),
                        waste: Math.round(tarifRec[eTarif.waste] * 100) / 100,
                        quant1: Math.round(tarifRec[eTarif.quant1] * 100) / 100,
                        quant2: Math.round(tarifRec[eTarif.quant2] * 100) / 100,
                        costprice: Math.round(tarifRec[eTarif.costprice] * 100) / 100,
                        price: Math.round(tarifRec[eTarif.price] * 100) / 100,
                        cost1: Math.round(tarifRec[eTarif.cost1] * 100) / 100,
                        cost2: Math.round(tarifRec[eTarif.cost2] * 100) / 100
                    });
                }
                $(tarif.table1).jqGrid("setSelection", 1);
                progres();
            },
            error: function () {
                dialogMes('Сообщение', "<p>Ошибка при сохранении данных на сервере");
            }
        });
    }
}


