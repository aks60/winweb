
import {UseColor} from '../../enums/UseColor.js';
import {TRecord} from './TRecord.js';

export class UColor {

    static COLOR_US = 2;
    static COLOR_FK = 3;
    static ARTIKL_ID = 4;

    constructor() {
    }

    static findFromArtOrSeri(spcAdd) {  //см. http://help.profsegment.ru/?id=1107 

        //if (spcAdd.detailRec[eFurndet.id] === 5512) debugger;  

        //let spcClon = new TRecord(spcAdd);
        let spcClon = spcAdd;
        let typesUS = spcClon.detailRec[this.COLOR_US];

        //Серия артикулов
        if (UseColor.isSeries(typesUS)) {

            let artseriList = eArtikl.list.filter(rec => rec[eArtikl.groups4_id] === spcClon.artiklRec[eArtikl.groups4_id]);
            for (let artseriRec of artseriList) {
                spcClon.artiklRec(artseriRec);
                if (UColor.colorFromSetting(spcClon, 1, true)
                        && UColor.colorFromSetting(spcClon, 2, true)
                        && UColor.colorFromSetting(spcClon, 3, true)) {
                    //spcAdd.copy(spcClon);
                    return true;
                }
            }
            spcClon.colorID1 = UColor.getID_colorUS(spcClon, typesUS & 0x0000000f);
            spcClon.colorID2 = UColor.getID_colorUS(spcClon, (typesUS & 0x000000f0) >> 4);
            spcClon.colorID3 = UColor.getID_colorUS(spcClon, (typesUS & 0x00000f00) >> 8);


            //Не серия артикулов
        } else {
            if (UColor.colorFromSetting(spcAdd, 1, false)
                    && UColor.colorFromSetting(spcAdd, 2, false)
                    && UColor.colorFromSetting(spcAdd, 3, false)) {
                return true;
            }
        }
        return false;
    }

    /**
     * ВРУЧНУЮ, АВТОПОДБОР, ПАРАМЕТР
     *
     * @param spcAdd - строка спецификации
     * @param side - сторона
     * @param seri - серия
     * @return - false/true
     */
    static colorFromSetting(spcAdd, side, seri) {        

        let srcNumberUS = spcAdd.detailRec[this.COLOR_US];
        let srcColorFk = spcAdd.detailRec[this.COLOR_FK];

        if (srcColorFk === -1) {
            colorFromMes(spcAdd);
            return false; //нет данных для поиска
        }
        let resultColorID = -1;
        try {
            let srcColorUS = (side === 1) ? srcNumberUS & 0x0000000f : (side === 2)
                    ? (srcNumberUS & 0x000000f0) >> 4 : (srcNumberUS & 0x00000f00) >> 8; //тип подбора                
            let elemArtID = spcAdd.artiklRec[eArtikl.id];

            //Цвет элемента по которому подбираю из варианта подбора
            let originColorID = UColor.getID_colorUS(spcAdd, srcColorUS);


            ////= ВРУЧНУЮ =////
            if (srcColorFk > 0 && srcColorFk !== 100000) {

                //Явное указание текстуры
                if (srcColorUS === UseColor.MANUAL) {
                    if (seri == true) {
                        resultColorID = -1; //нельзя назначать на серию
                    } else {
                        resultColorID = this.scanFromProfSide(elemArtID, srcColorFk, side); //теоритически это должно железно работать!!!
                        if (resultColorID === -1) {
                            if (spcAdd.artiklRec[eArtikl.level1] === 2 && (spcAdd.artiklRec[eArtikl.level2] === 11 || spcAdd.artiklRec[eArtikl.level2] === 13)) {
                                return false;
                            }
                            resultColorID = this.scanFromColorFirst(spcAdd); //первая в списке и это неправильно
                        }
                    }

                    //Подбор по текстуре профиля и текстуре сторон профиля
                } else if ([UseColor.PROF, UseColor.GLAS, UseColor.COL1, UseColor.COL2,
                    UseColor.COL3, UseColor.C1SER, UseColor.C2SER, UseColor.C3SER].includes(srcColorUS)) {

                    resultColorID = this.scanFromProfSide(elemArtID, originColorID, side);
                    if (resultColorID === -1 && seri === false) {
                        resultColorID = srcColorFk;
                    }
                }


                ////= АВТОПОДБОР =////
            } else if (srcColorFk === 0 || srcColorFk === 100000) {
                //Для точн.подбора в спецификпцию не попадёт. См. HELP "Конструктив=>Подбор текстур"

                //Подбор по текстуре профиля и заполн.
                if ([UseColor.PROF, UseColor.GLAS].includes(srcColorUS)) {
                    resultColorID = scanFromProfile(elemArtID, originColorID, side);
                    if (resultColorID === -1 && srcColorFk === 0) {
                        resultColorID = scanFromColorFirst(spcAdd); //если неудача подбора то первая в списке запись цвета
                    }

                    //Подбор по текстуре сторон профиля
                } else if ([UseColor.COL1, UseColor.COL2, UseColor.COL3,
                    UseColor.C1SER, UseColor.C2SER, UseColor.C3SER].includes(srcColorUS)) {
                    resultColorID = scanFromProfSide(elemArtID, originColorID, side);
                    if (resultColorID === -1 && srcColorFk === 0) {
                        resultColorID = this.scanFromColorFirst(spcAdd); //первая в списке запись цвета
                    }
                }


                ////= ПАРАМЕТР =////
            } else if (srcColorFk < 0) {  //если artdetColorFK == -1 в спецификпцию не попадёт. См. HELP "Конструктив=>Подбор текстур" 
                let syspar1Rec = spcAdd.elem5e.winc.mapPardef.get(srcColorFk);

                //Подбор по текстуре профиля и заполн.
                if (srcColorUS === UseColor.PROF || srcColorUS === UseColor.GLAS) {
                    resultColorID = this.scanFromParams(elemArtID, syspar1Rec, originColorID, side);

                    //Подбор по текстуре сторон профиля
                } else if ([UseColor.COL1, UseColor.COL2, UseColor.COL3,
                    UseColor.C1SER, UseColor.C2SER, UseColor.C3SER].includes(srcColorUS)) {
                    resultColorID = this.scanFromParamSide(elemArtID, syspar1Rec, originColorID, side);

                    //Подбор по текстурному параметру
                } else if ([UseColor.PARAM, UseColor.PARSER].includes(srcColorUS)) {
                    let parmapRec = eParmap.find3(syspar1Rec[eSyspar1.text], syspar1Rec[eSyspar1.groups_id]);
                    originColorID = parmapRec[eParmap.color_id1];
                    resultColorID = this.scanFromProfSide(elemArtID, originColorID, side);
                }
            }
            if (resultColorID !== -1) {
                if (side === 1) {
                    spcAdd.colorID1 = resultColorID;
                } else if (side === 2) {
                    spcAdd.colorID2 = resultColorID;
                } else if (side === 3) {
                    spcAdd.colorID3 = resultColorID;
                }

            } else { //в спецификпцию не попадёт. См. HELP "Конструктив=>Подбор текстур" 
                return false;
            }
        } catch (e) {
            errorLog("Error: UColor.colorFromSetting3) " + e);
        }
        return true;
    }

    //Текстура профиля или текстура заполнения изделия (неокрашенные)
    static findColorFromArtdet(artiklID) {
        try {
            let artdetList = eArtdet.list.filter(rec => rec[eArtdet.artikl_id] === artiklID);
            //Цикл по ARTDET определённого артикула
            for (let artdetRec of artdetList) {
                if (artdetRec[eArtdet.color_fk] >= 0) {
                    if (1 === artdetRec[eArtdet.mark_c1]) {
                        return artdetRec[eArtdet.color_fk];
                    }
                }
            }
            return -3;

        } catch (e) {
            errorLog('Error: UColor.findColorFromArtdet() ' + e.message);
        }
    }

    //Первая запись цвета
    static  scanFromColorFirst(spc) {

        let artdetRec = eArtdet.list.find(rec => rec[eArtdet.artikl_id] === spc.detailRec[this.ARTIKL_ID]);
        if (artdetRec[1] !== -1) {
            let colorFK2 = artdetRec[eArtdet.color_fk];

            if (colorFK2 < 0 && colorFK2 !== -1) { //это группа
                let colorList = eColor.list.filter(rec => rec[eColor.groups_id] === colorFK2);
                if (colorList.length !== 0) {
                    return colorList[0][eColor.id];
                }
            } else { //если это не группа цветов                               
                return colorFK2;

            }
        }

        dialogMes('Ошибка', 'Для артикула  ' + spc.artikl + ' не определена цена.');
        return 1; //такого случая не должно быть

    }

    //Выдает цвет в соответствии с заданным вариантом подбора текстуры   
    static getID_colorUS(spcAdd, srcColorUS) {
        try {
            switch (srcColorUS) {
                case 0:
                    return spcAdd.detailRec[this.COLOR_FK];  //указана вручную
                case 11: //По текстуре профиля
                    let firstElem = spcAdd.elem5e.root.frames[0];
                    let artiklID = firstElem.artiklRec[eArtikl.id];
                    return eArtdet.list.filter(rec =>
                        rec[eArtdet.mark_c1] === 1
                                && rec[eArtdet.mark_c2] === 1
                                && rec[eArtdet.mark_c3] === 1
                                && rec[eArtdet.artikl_id] === artiklID
                                && rec[eArtdet.color_fk] > 0)[eArtdet.color_fk];
                case 15: //По текстуре заполнения
                    if (spcAdd.elem5e.artiklRecAn[eArtikl.level1] === 5) {
                        return spcAdd.elem5e.colorID1;
                    }
                case 1: //По основе профиля
                    return spcAdd.elem5e.root.colorID1;
                case 2: //По внутр.профиля
                    return spcAdd.elem5e.root.colorID2;
                case 3: //По внешн.профиля
                    return spcAdd.elem5e.root.colorID3;
                case 6: //По основе профиля в серии
                    return spcAdd.elem5e.root.colorID1;
                case 7: //По внутр.профиля в серии
                    return spcAdd.elem5e.root.colorID2;
                case 8: //По внешн.профиля в серии
                    return spcAdd.elem5e.root.colorID3;
                default:
                    return -1;
            }
        } catch (e) {
            errorLog("Error: UColor.getID_colorUS() " + e);
            return -1;
        }
    }

    /**
     * Авто сторон профиля
     *
     * @param detailArtiklID - артикул элемента детализации состава
     * @param originColorID - текстура стороны профиля
     * @param side - сторона элемента детализации состава
     */
    static scanFromProfSide(detailArtiklID, originColorID, side) {
        try {
            let artdetList = eArtdet.list.filter(rec => rec[eArtdet.artikl_id] === detailArtiklID);
            //Цикл по ARTDET определённого артикула
            for (let artdetRec of artdetList) {
                //Сторона подлежит рассмотрению?
                if ((side === 1 && 1 === artdetRec[eArtdet.mark_c1]) //cторона подлежит рассмотрению?
                        || (side === 2 && (1 === artdetRec[eArtdet.mark_c2] || 1 === artdetRec[eArtdet.mark_c1]))
                        || (side === 3 && (1 === artdetRec[eArtdet.mark_c3]) || 1 === artdetRec[eArtdet.mark_c1])) {

                    //Группа текстур
                    if (artdetRec[eArtdet.color_fk] < 0) {
                        let colorList = eColor.list.filter(rec => rec[eColor.groups_id] === artdetRec[eArtdet.color_fk]); //фильтр списка определённой группы
                        //Цикл по COLOR определённой группы
                        for (let colorRec of colorList) {
                            if (colorRec[eColor.id] === originColorID) {
                                return originColorID;
                            }
                        }

                        //Одна текстура
                    } else {
                        if (artdetRec[eArtdet.color_fk] === originColorID) { //если есть такая текстура в ARTDET
                            return originColorID;
                        }
                    }
                }
            }
            return -1;

        } catch (e) {
            errorLog("Error: UColor.scanFromProfSide() " + e);
            return -1;
        }
    }
}
