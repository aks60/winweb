import {Type} from '../../enums/enums.js';

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
            if (sysfurnList !== undefined && sysfurnList.length > 0) {
                let sysfurnRec = sysfurnList[0]; //значение по умолчанию, первая SYSFURN в списке системы

                //Цикл по створкам      
                for (let areaStv of stvorkaList) {

                    //Найдём из списка сист.фурн. фурнитуру которая установлена в створку                 
                    sysfurnRec = sysfurnList.filter(rec => rec[eSysfurn.id] == areaStv.sysfurnRec[eSysfurn.id]);
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


