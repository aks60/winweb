import {virtualRec} from './domain.js';
eSyspar1 = {
    up: 0, //Парамметры системы профилей
    id: 1, //Идентификатор
    text: 2, //Значения параметра
    groups_id: 3, //Название параметра
    systree_id: 4, //Система
    fixed: 5, //Закреплено
    vrec: virtualRec(6),
    filter(_nuni) {
        try {
            return list.filter(rec => rec[systree_id] == _nuni);
        } catch (e) {
            errorLog('Error: eSyspar1.filter() ' + e.message);
        }
    }
};