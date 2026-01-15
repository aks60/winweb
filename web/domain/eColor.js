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
    vrec: virtualRec(13, {1: -3, 2: 'Авторасчёт', 4: -3, 5: '000000', 14: -3}),
    find(ID) {
        try {
            if (ID === -3) {
                return this.vrec;
            }
            let colorRec = this.list.find(el => el[1] === ID);
            return (colorRec === undefined) ? this.vrec : colorRec;
        } catch (e) {
            errorLog('Error: eColor.find() ' + e.message);
        }
    },
    find3(colorFK) {
        try {
            if (colorFK === -3) {
                return this.vrec;
            }
            if (colorFK < 0) {
                let colorRec = this.list.find(rec => rec[this.groups_id] === colorFK * -1);
                return (colorRec === undefined) ? this.vrec : colorRec;

            } else {
                let colorRec = this.list.find(rec => rec[this.id] === colorFK);
                return (colorRec === undefined) ? this.vrec : colorRec;
            }
        } catch (e) {
            errorLog('Error: eColor.find() ' + e.message);
        }
    }
};