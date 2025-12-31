import {virtualRec} from './domain.js';

eSyssize = {
    up: 0, //Системные константы
    id: 1, //Идентификатор
    name: 2, //Система артикулов
    prip: 3, //Припуск на сварку
    naxl: 4, //Нахлест створки
    falz: 5, //T- Глубина до фальца, полка
    zax: 6, //Заход импоста
    vrec: virtualRec(7),
    find(artiklRec) {
        let id = artiklRec[eArtikl.syssize_id];
        if (id === -3) { //если арт. вирт. то return virtualRec();
            return vrec();
        }
        return this.list.find(rec => id === rec[this.id]);
    }
};

