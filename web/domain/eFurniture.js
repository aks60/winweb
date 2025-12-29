import {virtualRec} from './domain.js';
eFurniture = {
    up: 0, //Фурнитура
    id: 1, //Идентификатор
    name: 2, //Название
    max_p2: 3, //Макс. P/2, мм
    max_height: 4, //Макс.выс., мм
    max_width: 5, //Макс.шир., мм
    max_weight: 6, //Макс.вес, кг
    hand_set1: 7, //По середине
    hand_set2: 8, //Константная
    hand_set3: 9, //Вариационная
    hand_side: 10, //Сторона ручки
    types: 11, //Тип фурнитуры
    ways_use: 12, //Использовать створку как...
    view_open: 13, //Вид открывания
    pars: 14, //Использ. параметры
    coord_lim: 15, //Координаты ограничений
    list: [],
    vrec: virtualRec(16)
};


