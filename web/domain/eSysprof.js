import {virtualRec} from './domain.js';
import {UseSide} from '../enums/UseSide.js';

eSysprof = {
    up: 0, //Профили системы
    id: 1, //Идентификатор
    npp: 2, //Приоритет
    use_type: 3, //Тип использования
    use_side: 4, //Сторона использования
    artikl_id: 5, //Артикул
    systree_id: 6, //Система
    vrec: virtualRec(7, {0: 'SEL', 1: -3, 2: 0, 3: 0, 4: UseSide.ANY[1], 5: -3, 6: -3}),
    vrecCust: (useTypeID, useSideID) => {
        const virt = [...this.vrec];
        virt[this.id] = -3;
        virt[this.use_type] = useTypeID;
        virt[this.use_side] = useSideID;
        virt[this.systree_id] = -3;
        virt[this.artikl_id] = -3;
        return virt;
    },

    find(nuni, useTypeID, useSide1ID, useSide2ID) {
        try {
            if (nuni === -3) {
                return vrecCust(useTypeID, UseSide.ANY[1]);
            }
            const arr = this.list.find(
                    rec => rec[this.systree_id] === nuni
                        && rec[this.use_type] === useTypeID
                        && rec[this.use_side] !== UseSide.MANUAL[0]
                        && (rec[this.use_side] === useSide1ID
                                || rec[this.use_side] === useSide2ID
                                || rec[this.use_side] === UseSide.ANY[0])
            );
            if (arr !== undefined) {
                return arr;
            } else {
                return vrecCust(useTypeID, -1);
            }

        } catch (e) {
            errorLog('Error: eSysprof.find() ' + e.message);
        }
    },

    find2(nuni, useTypeID) {
        if (nuni === -3) {
            return vrecCust(useTypeID, UseSide.ANY[1]);
        }
        let mapPrio = new Map();
        this.list.filter(rec => rec[this.systree_id] === nuni && rec[this.use_type] === useTypeID)
                .forEach(rec => mapPrio.set(rec[this.npp], rec));
        let minLevel = 32767;
        for (let entry of mapPrio) {

            if (entry[0] === 0) { //если нулевой приоритет
                return entry[1];
            }
            if (minLevel > entry[0]) { //поднимаемся вверх по приоритету
                minLevel = entry[0];
            }
        }
        if (mapPrio.size === 0) {
            return this.vrec;
        }
        return mapPrio[minLevel];
    },

    find3(ID) {
        let sysprof = this.list.find(rec => rec.id === ID);
        if (sysprof === undefined) {
            sysprof = this.vrec;
        }
        return sysprof;
    }
};