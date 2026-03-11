import {UCom} from '../../common/uCom.js';
import {Type, Layout, PKjson} from '../../enums/enums.js';
import {FurnitureDet} from '../param/FurnitureDet.js';
import {UColor} from './uColor.js';
import {TRecord} from './TRecord.js';

export class TFurniture {

    winc = null;
    //furnitureVar = null;
    furnitureDet = null;
    shortPass = true;
    artLevel = [9, 11, 12]; //замок, ручка, петля 
    //max_size_message = true;

    constructor(winc) {
        this.winc = winc;
        //this.furnitureVar = new FurnitureVar(winc);
        this.furnitureDet = new FurnitureDet(winc);
    }

    furn() {
        let stvorkaList = this.winc.listArea.filter(rec => rec.type === Type.STVORKA);
        try {
            //Подбор фурнитуры по параметрам
            let sysfurnList = eSysfurn.list.filter(rec => rec[eSysfurn.systree_id] === this.winc.nuni); //список фурнитур в системе
            if (sysfurnList.length > 0) {

                //Цикл по створкам      
                for (let areaStv of stvorkaList) {

                    //Найдём из списка сист.фурн. фурнитуру которая установлена в створку                 
                    let sysfurnRec = sysfurnList.find(rec => rec[eSysfurn.id] === areaStv.sysfurnRec[eSysfurn.id]);
                    if (sysfurnRec === undefined) {
                        sysfurnRec = sysfurnList[0]; //значение по умолчанию, первая SYSFURN в списке системы
                    }
                    let furnityreRec = eFurniture.list.find(rec => rec[eFurniture.id] === sysfurnRec[eSysfurn.furniture_id]);
                    this.variant(areaStv, furnityreRec); //основная фурнитура
                }
            }
        } catch (e) {
            errorLog('Error: TFurniture.furn() ' + e.message);
        }
    }

    variant(areaStv, furnitureRec) {
        try {
            let furndetList1 = eFurndet.list.filter(rec => rec[eFurndet.furniture_id1] === furnitureRec[eFurniture.id]); //детализация первый уровень
            let furndetList2 = furndetList1.filter(rec => rec[eFurndet.id] !== rec[eFurndet.furndet_id]); //детализация второй уровень

            //Цикл по детализации (первый уровень)        
            for (let furndetRec1 of furndetList1) {
                if (furndetRec1[eFurndet.furndet_id] === furndetRec1[eFurndet.id]) {
                    if (this.detail(areaStv, furndetRec1) === true) {

                        //Цикл по детализации (второй уровень)
                        for (let furndetRec2 of furndetList2) {
                            if (furndetRec2[eFurndet.furndet_id] === furndetRec1[eFurndet.id]) {
                                if (this.detail(areaStv, furndetRec2) === true) {

                                    //Цикл по детализации (третий уровень)
                                    for (let furndetRec3 of furndetList2) {
                                        if (furndetRec3[eFurndet.furndet_id] === furndetRec2[eFurndet.id]) {
                                            this.detail(areaStv, furndetRec3);
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
        
        //if (furndetRec[eFurndet.id] === 644) debugger;
        //if (furndetRec[eFurndet.id] === 5512) debugger;
        try {
            let artiklRec = eArtikl.list.find(rec => rec[eArtikl.id] === furndetRec[eFurndet.artikl_id]);
            let mapParam = new Map(); //тут накапливаются параметры element и specific

            //ФИЛЬТР сделано для убыстрения поиска ручки, 
            //подвеса, замка при конструировании окна
            if(artiklRec === undefined && furndetRec[eFurndet.furniture_id2] === null) {
                return true; //поле не заполнено, пропускаю
            }
            if (this.shortPass === true) {
                if (furndetRec[eFurndet.furndet_id] === furndetRec[eFurndet.id] && furndetRec[eFurndet.furniture_id2] === null) {
                    if (artiklRec[eArtikl.level1] !== 2
                            || (artiklRec[eArtikl.level1] === 2 && this.artLevel.includes(artiklRec[eArtikl.level2]) === false)) {
                        return false;  //т.к. ручки, подвеса, замка на этом уровне нет
                    }
                }
            }
            //ФИЛЬТР параметров детализации 
            if (this.furnitureDet.filter(mapParam, areaStv, furndetRec) === false) {
                return false;
            }

            //Не НАБОР (элемент из мат. ценности)
            if (furndetRec[eFurndet.furniture_id2] === null) {
                if (artiklRec[eArtikl.id] !== -1) { //артикул есть

                    //let sideStv = this.determOfSide(mapParam, areaStv);
                    let spcAdd = new TRecord("ФУРН", furndetRec, artiklRec);
                    
                    //if (furndetRec[eFurndet.id] === 5512) debugger;   
            
                    //Ловим ручку, петлю, замок и присваиваем 
                    //артикул и цвет в spcAdd и в свойства створки
                    //если level2 = 13 идет только в тарификацию 
                    if (this.shortPass === true && artiklRec[eArtikl.level1] === 2 && this.artLevel.includes(artiklRec[eArtikl.level2]) === true) {
                        this.settingStvAndSpc(areaStv, spcAdd);
                    } else {
                        UColor.findFromArtOrSeri(spcAdd);
                    }
                }

                //Это НАБОР 
            } else {
                let furnitureRec2 = eFurniture.list.find(ret => ret[eFurniture.id] === furndetRec[eFurndet.furniture_id2]);               
                this.variant(areaStv, furnitureRec2); //рекурсия обработки наборов
            }
            return true;

        } catch (e) {
            errorLog('Error: TFurniture.detail() ' + e.message);
        }
    }

    //Ловим ручку, подвес, замок и 
    //присваиваем знач. в створку    
    settingStvAndSpc(areaStv, spcAdd) {
        try {
            if (spcAdd.artiklRec[eArtikl.level1] === 2) {

                //РУЧКА
                if (spcAdd.artiklRec[eArtikl.level2] === 11) {

                    //Артикл
                    if (UCom.isFinite(areaStv.gson.param, PKjson.artiklHand)) { //если есть параметр то устан. вручную
                        spcAdd.artiklRec(areaStv.handRec[0]); //выбр. вручную
                    } else {
                        areaStv.handRec[1] = spcAdd.artiklRec; //из детализации подбор
                    }
                    //Цвет
                    spcAdd.color(areaStv.handColor[0], -3, -3);  //перв. запись в текстуре артикулов или выбр. вручную
                    if (UCom.isFinite(areaStv.gson.param, PKjson.colorHand) === false) { //если нет параметра то подбор
                        if (UColor.findFromArtOrSeri(spcAdd) == true) { //подбор по цвету
                            areaStv.handColor[1] = spcAdd.colorID1; //из детализации подбор
                        }
                    }
                    //ПОДВЕС
                } else if (spcAdd.artiklRec[eArtikl.level2] == 12) {

                    //Артикл
                    if (UCom.isFinite(areaStv.gson.param, PKjson.artiklLoop)) { //если есть параметр то устан. вручную
                        spcAdd.artiklRec(areaStv.loopRec[0]); //выбр. вручную
                    } else {
                        areaStv.loopRec[10] = spcAdd.artiklRec; //из детализации подбор
                    }
                    //Цвет
                    spcAdd.color(areaStv.loopColor[0], -3, -3);  //перв. запись в текстуре артикулов или выбр. вручную
                    if (UCom.isFinite(areaStv.gson.param, PKjson.colorLoop) === false) { //если нет параметра то подбор
                        if (UColor.findFromArtOrSeri(spcAdd) == true) { //подбор по цвету
                            areaStv.loopColor[1] = spcAdd.colorID1; //из детализации подбор
                        }
                    }
                    //ЗАМОК 
                } else if (spcAdd.artiklRec[eArtikl.level2] === 9) {

                    //Артикл
                    if (UCom.isFinite(areaStv.gson.param, PKjson.artiklLock)) {
                        spcAdd.artiklRec(areaStv.lockRec[0]); //выбр. вручную
                    } else {
                        areaStv.lockRec[1] = spcAdd.artiklRec; //из детализации подбор
                    }
                    //Цвет
                    spcAdd.color(areaStv.lockColor[0], -3, -3);  //перв. запись в текстуре артикулов или выбр. вручную
                    if (UCom.isFinite(areaStv.gson.param, PKjson.colorLock) == false) { //если нет параметра то подбор
                        if (UColor.findFromArtOrSeri(spcAdd) == true) { //подбор по цвету
                            areaStv.lockColor[1] = spcAdd.colorID1; //из детализации подбор
                        }
                    }
                }
            }
        } catch (e) {
            errorLog('Error: TFurniture.settingStvAndSpc() ' + e.message);
        }
    }
}


