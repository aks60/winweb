import {Layout} from './Layout.js';
export const TypeOpen1 = {
    EMPTY: [0, "empty", "Глухая створка (не открывается)"],
    LEFT: [1, "Левое", "Левая поворотная (открывается справа-налево, ручка справа)"],
    RIGH: [2, "Правое", "Правая поворотная (открывается слева-направо, ручка слева)"],
    LEFTUP: [3, "Левое", "Левая поворотно-откидная"],
    RIGHUP: [4, "Правое", "Правая поворотно-откидная"],
    UPPER: [5, "Откидная", "Откидная (открывается сверху)"],
    LEFMOV: [11, "Левое", "Раздвижная влево (открывается справа-налево, защелка справа"],
    RIGMOV: [12, "Правое", "Раздвижная вправо (открывается слева-направо, защелка слева"],
    REQUEST: [16, "Запрос", "Не определено"],
    getHand(areaStv, typeOpen) {
        if ([this.LEFT, this.LEFTUP, this.LEFMOV].includes(typeOpen)) {
            for(let e of areaStv.frames) {
                let o1 = e.layout;
                let o2 = 0;
            }
            return areaStv.frames.find(e => e.layout === Layout.RIG);
        } else if ([this.RIGH, this.RIGHUP, this.RIGMOV].includes(typeOpen)) {
            return areaStv.frames.find(e => e.layout === Layout.LEF);
        } else if (this.UPPER === typeOpen) {
            return areaStv.frames.find(e => e.layout === Layout.TOP);
        } else {
            return areaStv.frames.find(e => e.layout === Layout.LEF);
        }
    }
};