
import {Par5s} from './Par5s.js'

export class FurnitureDet extends Par5s {

    constructor(winc) {
        super(winc);
    }

    filter(mapParam, areaStv, furndetRec) {

        let tableList = eFurnpar2.list.filter(rec => rec[eFurnpar2.furndet_id] == furndetRec[eFurndet.id]);
        if (this.filterParamDef(tableList) === false) {
            return false; //параметры по умолчанию
        }
        //Цикл по параметрам фурнитуры
        for (let rec of tableList) {
            if (this.check(mapParam, areaStv, rec) === false) {
                return false;
            }
        }
        return true;
    } 

    check(mapParam, elemStv, rec) {
        let grup = rec[this.GRUP];
        try {
            switch (grup) {

                case 24001: //Форма контура 
                case 25001: //Форма контура 
                {
                    //"Прямоугольное", "Не прямоугольное", "Не арочное", "Арочное" (TypeElem.AREA - глухарь)
                    if ("прямоугольная" === rec[TEXT] && (Type.RECTANGL === areaStv.type) === false
                            && (Type.AREA === areaStv.type) === false && (Type.STVORKA === areaStv.type) === false) {
                        return false;
                    } else if ("трапециевидная" === rec[TEXT] && (Type.TRAPEZE === areaStv.type) === false) {
                        return false;
                    } else if ("арочная" === rec[TEXT] && (Type.ARCH === areaStv.type) === false) {
                        return false;
                    } else if ("не арочная" === rec[TEXT] &&  (Type.ARCH === areaStv.type) === true) {
                        return false;
                    }
                    break;
                }
                case 24002:  //Если артикул створки 
                case 25002:  //Если артикул створки 
                    if (areaStv.frames.stream().filter(el -> el.artiklRec[eArtikl.code] === rec[TEXT]).findFirst().orElse(null) === null) {
                        return false;
                    }
                    break;
                case 24003:  //Если артикул цоколя 
                case 25003:  //Если артикул цоколя 
                    message(rec.[GRUP]);
                    break;
                case 24004: //Если створка прилегает к артикулу 
                    if (areaStv.frames.stream().filter(el -> UCom.elem(winc.listJoin, el, 2).artiklRec[eArtikl.code] === rec[TEXT]).findFirst().orElse(null) === null) {
                        return false;
                    }
                    break;
                case 24005:  //Коды текстуры створки 
                case 25005:  //Коды текстуры створки 
                    if (areaStv.frames.stream().filter(el -> UCom.containsColor(rec[TEXT], el.colorID1) === true).findFirst().orElse(null) === null) {
                        return false;
                    }
                    break;
                case 24006:  //Установить текстуру
                    if ("по текстуре ручки" === rec[TEXT]) {
                        if (elemStv.handColor[0] != detailRec[eFurndet.color_fk]) {
                            return false;
                        }
                    } else if ("по текстуре подвеса" === rec[TEXT]) {
                        if (elemStv.loopColor[0] != detailRec[eFurndet.color_fk]) {
                            return false;
                        }
                    } else if ("по текстуре замка" === rec[TEXT]) {
                        if (elemStv.lockColor[0] != detailRec[eFurndet.color_fk]) {
                            return false;
                        }
                    }
                    break;
                case 24007: //Коды текстуры ручки 
                case 25007: //Коды текстуры ручки                  
                {
                    let name = eColor.find(areaStv.handColor[0][eColor.name];
                    if ((name === rec[TEXT]) === false) {
                        return false;
                    }
                }
                break;
                case 24008: //Если серия створки 
                case 25008: //Если серия створки   
                {
                    int series_id = UCom.layout(areaStv.frames, Layout.BOT).artiklRec[eArtikl.groups4_id];
                    let name = eGroups.list.find(rec => rec[eGroups.id] === series_id)[eGroups.name];
                    if ((name === rec[TEXT]) === false) {
                        return false;
                    }
                }
                break;
                case 24009:  //Коды текстуры подвеса 
                case 25009:  //Коды текстуры подвеса                   
                    for (let elem of areaStv.frames) {
                        for (let spc of elem.spcRec.spcList) {
                            if (spc.artiklRec[eArtikl.level1] === 2 && spc.artiklRec[eArtikl.level2] === 12) {
                                let name = eColor.find(spc.colorID1)[eColor.name];
                                if ((name === rec[TEXT]) === false) {
                                    return false;
                                }
                            }
                        }
                    }
                    break;
                case 24010:  //Номер стороны 
                case 25010:  //Номер стороны                   
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                case 24011:  //Расчет по общей арке 
                case 25011:  //Расчет по общей арке 
                    message(rec[GRUP]);
                    break;
                case 24012:  //Направление открывания
                    if (elemStv.typeOpen.name.equalsIgnoreCase(rec[TEXT]) === false) {
                        return false;
                    }
                    break;
                case 24013: //Выбран авто расчет подвеса 
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                case 24017:  //Код системы содержит строку 
                case 25017:  //Код системы содержит строку                    
                    if (UPar.is_13017_14017_24017_25017_31017_33017_34017_37017_38017(rec[TEXT], winc) === false) {
                        return false;
                    }
                    break;
                case 24030:  //Количество 
                case 25060:  //Количество     
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                case 24032:  //Правильная полуарка 
                case 25032:  //Правильная полуарка 
//                    if (winc.rootArea.type === Type.ARCH) {
//                        int k = (int) (winc.rootArea.width() / ((AreaArch) winc.rootArea).radiusArch);
//                        if (k != 2) {
//                            return false;
//                        }
//                    }
                    break;
                case 24033: //Фурнитура штульповая 
                case 25033: //Фурнитура штульповая 

                    if (rec[TEXT] === "Да") {
                        for (let entry of areaStv.owner.childs) {
                            if (entry.type === Type.SHTULP) {
                                return true;
                            }
                        }
                        return false;

                    } else if (rec[TEXT] === "Нет") {
                        for (let entry of areaStv.owner.childs) {
                            if (entry.type === Type.SHTULP) {
                                return false;
                            }
                        }
                    }
                    break;
                case 24036:  //Номер Стороны_X/Стороны_Y набора 
                case 25036:  //Номер Стороны_X/Стороны_Y набора 
                    message(rec[GRUP]);
                    break;
                case 24037:  //Номер стороны по параметру набора 
                case 25037:  //Номер стороны по параметру набора 
                    message(rec.getInt(GRUP));
                    break;
                case 24038:  //Проверять Cторону_(L))/Cторону_(W) 
                case 25038:  //Проверять Cторону_(L)/Cторону_(W)     
                    //TODO Параметры. Тут полные непонятки. Возможно сторона проверки назначается для всего набора
                    mapParamTmp.set(grup, rec[TEXT]);
                    //message(rec[GRUP]);
                    break;
                case 24039:  //Створка заднего плана 
                    message(rec[GRUP]);
                    break;
                case 24040:  //Порог расчета, мм 
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                case 24050:  //Шаг, мм 
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                case 24060:  //Количество на шаг 
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                case 24063: //Диапазон веса, кг 
                case 25063: //Диапазон веса, кг 
                {
                    Com5t glass = areaStv.childs.stream().filter(el -> el.type === Type.GLASS).findFirst().orElse(null);
                    if (glass != null) {
                        double weight = ((glass.width() * glass.height()) / 1000000) * glass.artiklRecAn.getDbl(eArtikl.density);
                        if (UCom.containsNumbExp(rec[TEXT], weight) === false) {
                            return false;
                        }
                    }
                }
                break;
                case 24064: //Ограничение высоты ручки, мм 
                case 25064: //Ограничение высоты ручки, мм 
                    if (elemStv.handHeight > rec[TEXT]) {
                        return false;
                    }
                    break;
                case 24065: //Максимальная высота ручки, мм 
                {
                    double handl_max = UCom.getDbl(rec[TEXT]);
                    if (handl_max < elemStv.handHeight) {
                        return false;
                    }
                }
                break;
                case 24067:  //Коды основной текстуры изделия 
                case 25067:  //Коды основной текстуры изделия 
                    if (UCom.containsColor(rec[TEXT], winc.root.colorID1) === false) {
                        return false;
                    }
                    break;
                case 24068:  //Коды внутр. текстуры изделия 
                case 25068:  //Коды внутр. текстуры изделия 
                    if (UCom.containsColor(rec[TEXT], winc.root.colorID2) === false) {
                        return false;
                    }
                    break;
                case 24069:  //Коды внешн. текстуры изделия 
                case 25069:  //Коды внешн. текстуры изделия     
                    if (UCom.containsColor(rec[TEXT], winc.root.colorID3) === false) {
                        return false;
                    }
                    break;
                case 24070: //Если высота ручки "по середине", "константная", "не константная", "установлена"
                case 25070: //Если высота ручки
                    if (LayoutHand.CONST != elemStv.handLayout && rec[TEXT] === "константная") {
                        return false;
                    } else if (LayoutHand.CONST === elemStv.handLayout && rec[TEXT] === "не константная") {
                        return false;
                    } else if (LayoutHand.MIDL != elemStv.handLayout && rec[TEXT] === "по середине") {
                        return false;
                    } else if (LayoutHand.VAR != elemStv.handLayout && rec[TEXT] === "установлена") {
                        return false;
                    }
                    break;
                case 24072:  //Ручка от низа створки, мм 
                case 25072:  //Ручка от низа створки, мм  
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                case 24073:  //Петля от низа створки, мм 
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                case 24074:  //Петля по центру стороны 
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                case 24075:  //Петля от верха створки, мм 
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                case 24077:  //Смещение замка от ручки, мм 
                    message(rec[GRUP]);
                    break;
                case 24078:  //Замок от края профиля, мм 
                    message(rec[GRUP]);
                    break;
                case 24095:  //Если признак системы конструкции 
                case 25095:  //Если признак системы конструкции 
                    message(rec[GRUP]);
                    break;
                case 24098:  //Бригада, участок) 
                case 25098:  //Бригада, участок) 
                    message(rec[GRUP]);
                    break;
                case 24099:  //Трудозатраты, ч/ч. 
                case 25099:  //Трудозатраты, ч/ч.                    
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                case 24800:  //Код основной обработки) 
                case 25800:  //Код основной обработки
                    message(rec[GRUP]);
                    break;
                case 24801:  //Доп.основная обработка
                case 25801:  //Доп.основная обработка
                    message(rec[GRUP]);
                    break;
                case 24802:  //Код симметр. обработки 
                case 25802:  //Код симметр. обработки 
                    message(rec[GRUP]);
                    break;
                case 24803:  //Доп.симметр. обработка
                case 25803:  //Доп.симметр. обработка
                    message(rec[GRUP]);
                    break;
                case 25013:  //Укорочение от 
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                case 25030:  //Укорочение, мм 
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                case 25035:  //[ * коэф-т ] 
                    message(rec[GRUP]);
                    break;
                case 25040:  //Длина, мм 
                    mapParam.set(rec[GRUP], rec[TEXT]);
                    break;
                default:
                    //assert !(grup > 0 && grup < 50000) : "Код " + grup + "  не обработан!!!";
            }
        } catch (e) {
            console.error(e.message);
        }
        return true;
        
//        switch (grup) {
//            case 24010:
//                mapParam.set(rec[this.GRUP], rec[this.TEXT]);
//                break;
//            case 25010:
//                mapParam.set(rec[this.GRUP], rec[this.TEXT]);
//                break;
//        }
    }
}


