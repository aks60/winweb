import {Type, Layout} from '../../enums/enums.js';
export class TFurniture {

    winc = null;
    //furnitureVar = null;
    furnitureDet = null;    
    artLevel = [9, 11, 12]; //замок, ручка, петля 
    //max_size_message = true;

    constructor(winc) {
        this.winc = winc;
        //this.furnitureVar = new FurnitureVar(winc);
        this.furnitureDet = new FurnitureDet(winc);
    }

    furn() {
        let stvorkaList = winc.listArea.filter(rec => rec.type == Type.STVORKA);
        try {
            //Подбор фурнитуры по параметрам
            let sysfurnList = eSysfurn.list.filter(rec => rec[eSysfurn.systree_id] == winc.nuni); //список фурнитур в системе
            if (sysfurnList.length > 0) {

                //Цикл по створкам      
                for (let areaStv of stvorkaList) {

                    //Найдём из списка сист.фурн. фурнитуру которая установлена в створку                 
                    let sysfurnRec = sysfurnList.filter(rec => rec[eSysfurn.id] == areaStv.sysfurnRec[eSysfurn.id]);
                    if (sysfurnRec.length === 0) {
                        sysfurnRec = sysfurnList[0]; //значение по умолчанию, первая SYSFURN в списке системы
                    }
                    let furnityreRec = eFurniture.list.find(rec => rec[eFurniture.id] == sysfurnRec[eSysfurn.furniture_id]);
                    variant(areaStv, furnityreRec); //основная фурнитура
                }
            }
        } catch (e) {
            errorLog('Error: TFurniture.furn() ' + e.message);
        }
    }

    variant(areaStv, furnitureRec) {
        try {
            let furndetList1 = eFurndet.list.filter(rec => rec[eFurndet.furniture_id1] == furnitureRec[eFurniture.id]); //детализация первый уровень
            let furndetList2 = furndetList1.filter(rec => rec[eFurndet.id] != rec[eFurndet.furndet_id]); //детализация второй уровень

            //Цикл по детализации (первый уровень)        
            for (let furndetRec1 of furndetList1) {
                if (furndetRec1[eFurndet.furndet_id] === furndetRec1[eFurndet.id]) {
                    if (detail(areaStv, furndetRec1) === true) {

                        //Цикл по детализации (второй уровень)
                        for (let furndetRec2 of furndetList2) {
                            if (furndetRec2[eFurndet.furndet_id] === furndetRec1[eFurndet.id]) {
                                if (detail(areaStv, furndetRec2) === true) {

                                    //Цикл по детализации (третий уровень)
                                    for (let furndetRec3 of furndetList2) {
                                        if (furndetRec3[eFurndet.furndet_id] === furndetRec2[eFurndet.id]) {
                                            detail(areaStv, furndetRec3);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            errorLog('Error: TFurniture.variant() ' + e.message);
        }
    }

    detail(areaStv, furndetRec) {
        try {
            let artiklRec = eArtikllist.find(furndetRec[eFurndet.artikl_id]);
            if (artiklRec[eArtikl.level1] == 2 && artLevel.includes(artiklRec[eArtikl.level2]) === false) {

                let mapParam = new Map(); //тут накапливаются параметры element и specific

                this.furnitureDet.detailRec = furndetRec; //текущий элемент детализации

                //ФИЛЬТР параметров детализации 
                if (this.furnitureDet.filter(mapParam, areaStv, furndetRec) == false) {
                    return false;
                }

                //Не НАБОР (элемент из мат. ценности)
                if (furndetRec[eFurndet.furniture_id2] == null) {
                    if (artiklRec[eArtikl.id] != -1) { //артикул есть

                        //Ловим ручку, петлю, замок и 
                        //присваиваем знач. в свойства створки
                        if (artiklRec[eArtikl.level1] == 2 && artLevel.includes(artiklRec[eArtikl.level2]) == true) {
                            setPropertyStv(areaStv, spcAdd);
                        } else {
                            UColor.colorFromElemOrSeri(spcAdd);
                        }
                    }

                    //Это НАБОР 
                } else {
                    let furnitureRec2 = eFurniture.list.find(ret => ret[eFurniture.id] == furndetRec[eFurndet.furniture_id2]);

                    variant(areaStv, furnitureRec2); //рекурсия обработки наборов
                }
            }
            return true;

        } catch (e) {
            errorLog('Error: TFurniture.detail() ' + e.message);
        }
    }
}


