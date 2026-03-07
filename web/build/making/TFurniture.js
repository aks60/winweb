import {Type, Layout} from '../../enums/enums.js';
export class TFurniture {

    winc = null;
    list = [9, 11, 12]; //замок, ручка, петля 
    max_size_message = true;

    constructor(winc) {
        this.winc = winc;
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

                    //Проверка с предупреждением на max высоту, ширину, периметр
                    let env = areaStv.area.getEnvelopeInternal();
                    let stv_width = env.getWidth();
                    let stv_height = env.getHeight();
                    let p2_max = (furnityreRec[eFurniture.max_p2] < (stv_width * 2 + stv_height * 2) / 2);
                    if (p2_max || furnityreRec[eFurniture.max_height] < stv_height
                            || furnityreRec[eFurniture.max_width] < stv_width) {
                        if (this.max_size_message === true) {
                            $("#dialog-mes").html("<p><span class='ui-icon ui-icon-alert'>\n\</span> Размер створки превышает максимальный размер фурнитуры.");
                        }
                        this.max_size_message = false;
                    }
                    variant(areaStv, furnityreRec, 1); //основная фурнитура
                }
            }
        } catch (e) {
            errorLog('Error: TFurniture.furn() ' + e.message);
        }
    }

    variant(areaStv, furnitureRec, count) {
        try {
            let furndetList1 = eFurndet.list.filter(rec => rec[eFurndet.furniture_id1] == furnitureRec[eFurniture.id]); //детализация первый уровень
            let furndetList2 = furndetList1.filter(rec => rec[eFurndet.id] != rec[eFurndet.furndet_id]); //детализация второй уровень

            //Цикл по описанию сторон фурнитуры
            /*let furnsidetList = eFurnside1.list.filter(rec => rec[eFurnside1.furniture_id] == furnitureRec[eFurniture.id]); //список описания сторон
            for (let furnside1Rec of furnsidetList) {
                let layout = Layout.ANY.find(furnside1Rec[eFurnside1.side_num]);
                let elemFrame = areaStv.frames.stream().filter(e => e.layout() == layout).findFirst().get();

                //ФИЛЬТР вариантов с учётом стороны
                if (furnitureVar.filter(elemFrame, furnside1Rec) == false) {
                    return;
                }
            }*/

            //Цикл по детализации (первый уровень)        
            for (let furndetRec1 of furndetList1) {
                if (furndetRec1[eFurndet.furndet_id] === furndetRec1[eFurndet.id]) {
                    if (detail(areaStv, furndetRec1, count) === true) {

                        //Цикл по детализации (второй уровень)
                        for (let furndetRec2 of furndetList2) {
                            if (furndetRec2[eFurndet.furndet_id] === furndetRec1[eFurndet.id]) {
                                if (detail(areaStv, furndetRec2, count) === true) {

                                    //Цикл по детализации (третий уровень)
                                    for (let furndetRec3 of furndetList2) {
                                        if (furndetRec3[eFurndet.furndet_id] === furndetRec2[eFurndet.id]) {
                                            detail(areaStv, furndetRec3, count);
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

    detail(areaStv, furndetRec, countKit) {
        try {
            let artiklRec = eArtikllist.find(furndetRec[eFurndet.artikl_id]);
            HashMap<Integer, String> mapParam = new HashMap<Integer, String>(); //тут накапливаются параметры element и specific

            //Сделано для убыстрения поиска ручки, 
            //подвеса, замка при конструировании окна
            if (shortPass == true) {
                if (furndetRec.getInt(eFurndet.furndet_id) == furndetRec.getInt(eFurndet.id) && furndetRec.get(eFurndet.furniture_id2) == null) {
                    if ((artiklRec.getInt(eArtikl.level1) == 2 && list.contains(artiklRec.getInt(eArtikl.level2)) == false)
                            || artiklRec.getInt(eArtikl.level1) != 2) { //т.к. ручки, подвеса, замка на этом уровне нет
                        return false;
                    }
                }
            }
            furnitureDet.detailRec = furndetRec; //текущий элемент детализации

            //ФИЛЬТР параметров детализации 
            if (furnitureDet.filter(mapParam, areaStv, furndetRec) == false) {
                return false;
            }

            //Проверка по ограничению сторон
            //Цикл по ограничению сторон фурнитуры
            List<Record> furnside2List = eFurnside2.filter(furndetRec.getInt(eFurndet.id));
            for (Record furnside2Rec : furnside2List) {
                ElemSimple el;
                double length = 0;
                int side = furnside2Rec.getInt(eFurnside2.side_num);

                if (side < 0) {
                    String txt = (furnitureDet.mapParamTmp.getOrDefault(24038, null) == null)
                            ? furnitureDet.mapParamTmp.getOrDefault(25038, "*/*")
                            : furnitureDet.mapParamTmp.getOrDefault(24038, "*/*");
                    String[] par = txt.split("/");
                    if (side == -1) {
                        side = (par[0].equals("*") == true) ? 99 : Integer.valueOf(par[0]);
                    } else if (side == -2) {
                        side = (par[1].equals("*") == true) ? 99 : Integer.valueOf(par[1]);
                    }
                }
                if (side == 1) {
                    el = UCom.layout(areaStv.frames, Layout.BOT);
                    length = el.length() - 2 * el.artiklRec.getDbl(eArtikl.size_falz);
                } else if (side == 2) {
                    el = UCom.layout(areaStv.frames, Layout.RIG);
                    length = el.length() - 2 * el.artiklRec.getDbl(eArtikl.size_falz);
                } else if (side == 3) {
                    el = UCom.layout(areaStv.frames, Layout.TOP);
                    length = el.length() - 2 * el.artiklRec.getDbl(eArtikl.size_falz);
                } else if (side == 4) {
                    el = UCom.layout(areaStv.frames, Layout.LEF);
                    length = el.length() - 2 * el.artiklRec.getDbl(eArtikl.size_falz);
                }
                if (length >= furnside2Rec.getDbl(eFurnside2.len_max) || (length < furnside2Rec.getDbl(eFurnside2.len_min))) {

                    return false; //не прошли ограничение сторон
                }
            }

            //Не НАБОР (элемент из мат. ценности)
            if (furndetRec.get(eFurndet.furniture_id2) == null) {
                if (artiklRec.getInt(eArtikl.id) != -1) { //артикул есть

                    ElemSimple sideStv = determOfSide(mapParam, areaStv);
                    TRecord spcAdd = new TRecord("ФУРН", furndetRec, artiklRec, sideStv, mapParam);

                    //Ловим ручку, петлю, замок и 
                    //присваиваем знач. в свойства створки
                    if (spcAdd.artiklRec.getInt(eArtikl.level1) == 2
                            && list.contains(spcAdd.artiklRec.getInt(eArtikl.level2)) == true) {
                        setPropertyStv(areaStv, spcAdd);
                    } else {
                        UColor.colorFromElemOrSeri(spcAdd);
                    }
                    //Добавим спецификацию в элемент
                    if (shortPass == false) {
                        spcAdd.count = UCom.getDbl(spcAdd.getParam(spcAdd.count, 24030));
                        spcAdd.count = spcAdd.count * countKit; //умножаю на количество комплектов
                        sideStv.addSpecific(spcAdd);
                    }
                }

                //Это НАБОР 
            } else {
                int countKi2 = (mapParam.get(24030) == null) ? 1 : Integer.valueOf((mapParam.get(24030)));
                Record furnitureRec2 = eFurniture.find(furndetRec.getInt(eFurndet.furniture_id2));

                variant(areaStv, furnitureRec2, countKi2); //рекурсия обработки наборов
            }
            return true;
            
        } catch (e) {
            errorLog('Error: TFurniture.detail() ' + e.message);
        }
    }
}


