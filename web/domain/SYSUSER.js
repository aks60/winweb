import {virtualRec} from './domain.js';
SYSUSER = {
    up: 0, //Пользователи системы
    id: 1, //Идентификатор
    role: 2, //Роль
    login: 3, //Пользователь
    fio: 4, //ФИО пользователя
    phone: 5, //Телефон
    email: 6, //Почта
    desc: 7, //Описание
    openkey: 8, //Открытый ключ
    vrec: virtualRec(9)
};