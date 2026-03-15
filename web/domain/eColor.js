import {virtualRec} from './domain.js';
eColor = {
    up: 0, //Описание текстур
    id: 1, //Идентификатор
    code: 2, //Код
    name: 3, //Название
    name2: 4, //Название у поставщика
    rgb: 5, //Цвет отображения
    coef1: 6, //Ценовой коэф.основной
    coef2: 7, //Ценовой коэф.внутренний
    coef3: 8, //Ценовой коэф.внешний
    is_prod: 9, //Для изделий
    orient: 10, //Ориентация
    pain: 11, //Покраска
    groups_id: 12, //Группа
    vrec: virtualRec(13, {1: -3, 3: 'virtual', 4: -3, 5: 'ffffff', 14: -3}),
    find(ID) {
        try {
            return this.list.seek(this.vrec, el => el[1] === ID);
        } catch (e) {
            console.error(e.message);
        }
    },
    find3(colorFK) {
        try {
            if (colorFK === -3) {
                return this.vrec;
            }
            if (colorFK < 0) {
                return this.list.seek(this.vrec, rec => rec[this.groups_id] === colorFK * -1);
            } else {
                return this.list.seek(this.vrec, rec => rec[this.id] === colorFK);
            }
        } catch (e) {
            console.error(e.message);
        }
    }
};