import {virtualRec} from './domain.js';

eFurnside1 = {
    up: 0, //Описание сторон фурнитуры
    id: 1, //Идентификатор
    side_num: 2, //Сторона
    side_use: 3, //Назначение 1-сторона, 2-ось поворота, 3-крепление петель
    furniture_id: 4, //Фурнитура
    vrec: virtualRec(5, {1: -3, 4: -3})
};

