
import {Par5s} from './Par5s.js'

export class FurnitureDet extends Par5s {

    constructor() {
        super();
    }

    filter(mapParam, areaStv, furndetRec) {

        let tableList = eFurnpar2.list.filter(rec => rec[eFurnpar2.furndet_id] == furndetRec[eFurndet.id]);
        if (this.filterParamDef(tableList) === false) {
            return false; //параметры по умолчанию
        }
        //Цикл по параметрам фурнитуры
        for (let rec of tableList) {
            if (this.check(mapParam, areaStv, rec) == false) {
                return false;
            }
        }
        return true;
    } 

    check(mapParam, elemStv, rec) {
        let grup = rec[this.GRUP];
        switch (grup) {
            case 24010:
                mapParam.set(rec[this.GRUP], rec[this.TEXT]);
                break;
            case 25010:
                mapParam.set(rec[this.GRUP], rec[this.TEXT]);
                break;
        }
    }
}


