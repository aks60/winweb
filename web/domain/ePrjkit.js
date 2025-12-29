import {virtualRec} from './domain.js';
ePrjkit = {
    up: 0, //Комплекты изделия
    id: 1, //Идентификатор
    numb: 2, //Количество
    width: 3, //Длина
    height: 4, //Ширина
    color1_id: 5, //Текстура
    color2_id: 6, //Текстура
    color3_id: 7, //Текстура
    angl1: 8, //Угол
    angl2: 9, //Угол
    flag: 10, //Флаг осн-го элем. комплекта
    artikl_id: 11, //Артикул
    prjprod_id: 12, //Изделие
    project_id: 13, //Проект
    list: [],
    vrec: virtualRec(14)
};