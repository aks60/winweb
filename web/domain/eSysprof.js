import {virtualRec} from './domain.js';
eSysprof = {
    up: 0, //Профили системы
    id: 1, //Идентификатор
    npp: 2, //Приоритет
    use_type: 3, //Тип использования
    use_side: 4, //Сторона использования
    artikl_id: 5, //Артикул
    systree_id: 6, //Система
    list: [],
    vrec: virtualRec(7, {1: -3, 2: 0, 3: 0, 4: -1, 5: -3, 6: -3}),
    find(nuni, typeId, us1, us2) {
        try {
            if (nuni === -3) {
                return virtualRec(typeId);
            }
            const arr = this.list.find(
                    rec => rec[this.systree_id] === nuni
                        && rec[this.use_type] === typeId
                        && rec[this.use_side] != UseSideTo.MANUAL[0]
                        && (rec[this.use_side] === us1
                                || rec[this.use_side] == us2
                                || rec[this.use_side] == UseSideTo.ANY[0])
            );
            if (arr !== undefined) {
                return arr;
            } else {
                return virtualRec(typeId);
            }

            virtualRec = (typeId) => {
                const virt = [...this.vrec];
                virt[this.id] = -3;
                virt[this.use_type] = typeId;
                virt[this.use_side] = -1;
                virt[this.systree_id] = -3;
                virt[this.artikl_id] = -3;
                return virt;
            };
        } catch (e) {
            errorLog('Error: eSysprof.find() ' + e.message);
        }
    },
    find3(_id) {
        let sysprof = this.list.find(rec => rec.id === _id);
        if (sysprof === undefined) {
            sysprof = this.vrec;
        }
        return sysprof;
    }
};