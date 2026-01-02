import {virtualRec} from './domain.js';
eArtdet = {
    up: 0, //Тариф.мат.ценности
    id: 1, //Идентификатор
    cost_unit: 2, //Тариф единицы измерения
    cost_c1: 3, //Тариф основной текстуры
    cost_c2: 4, //Тариф внутренний текстуры
    cost_c3: 5, //Тариф внешний текстуры
    cost_c4: 6, //Тариф двухсторонний текстуры
    mark_c1: 7, //Галочка основной текстуры
    mark_c2: 8, //Галочка внутренний текстуры
    mark_c3: 9, //Галочка внешний текстуры
    coef: 10, //Kоэф. накл.расходов
    cost_min: 11, //Минимальный тариф
    artikl1: 12, //Артикул склада
    artikl2: 13, //Артикул 1С
    color_fk: 14, //Текстура на id_Группы или id_Текстуры
    artikl_id: 15, //Артикул
    vrec: virtualRec(16, {1: -3, 14: -3, 15: -3}),
    find(ID) {
        if (ID === -3) {
            return this.vrec();
        }
        let rec = this.list.find(rec => rec[this.artikl_id] === ID);
        if(rec === undefined) {
            return this.vrec;
        }
        return rec;
    }    
};

