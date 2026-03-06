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
            let furnsidetList = eFurnside1.list.filter(rec => rec[eFurnside1.furniture_id] == furnitureRec[eFurniture.id]); //список описания сторон
            for (let furnside1Rec of furnsidetList) {
                let layout = Layout.ANY.find(furnside1Rec[eFurnside1.side_num]);
                let elemFrame = areaStv.frames.stream().filter(e => e.layout() == layout).findFirst().get();

                //ФИЛЬТР вариантов с учётом стороны
                if (furnitureVar.filter(elemFrame, furnside1Rec) == false) {
                    return;
                }
            }
//
//            //Цикл по детализации (первый уровень)        
//            for (Record furndetRec1 : furndetList1) {
//                if (furndetRec1.getInt(eFurndet.furndet_id) == furndetRec1.getInt(eFurndet.id)) {
//                    if (detail(areaStv, furndetRec1, count) == true) {
//
//                        //Цикл по детализации (второй уровень)
//                        for (Record furndetRec2 : furndetList2) {
//                            if (furndetRec2.getInt(eFurndet.furndet_id) == furndetRec1.getInt(eFurndet.id)) {
//                                if (detail(areaStv, furndetRec2, count) == true) {
//
//                                    //Цикл по детализации (третий уровень)
//                                    for (Record furndetRec3 : furndetList2) {
//                                        if (furndetRec3.getInt(eFurndet.furndet_id) == furndetRec2.getInt(eFurndet.id)) {
//                                            detail(areaStv, furndetRec3, count);
//                                        }
//                                    }
//                                }
//                            }
//                        }
//                    }
//                }
//            }
        } catch (e) {
            errorLog('Error: TFurniture.variant() ' + e.message);
        }
    }

    detail(areaStv, furndetRec, countKit) {
        try {

        } catch (e) {
            errorLog('Error: TFurniture.detail() ' + e.message);
        }
    }
}


