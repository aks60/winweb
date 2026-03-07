
import {Par5s} from './Par5s.js'

export class FurnitureDet extends Par5s {

    constructor() {
    }
    
   filter(mapParam, furndetRec) {

        let tableList = eFurnpar2.list.filter(rec => rec[eFurnpar2.furndet_id] == furndetRec[eFurndet.id]);
        if (this.filterParamDef(tableList) === false) {
            return false; //параметры по умолчанию
        }
        return true;
    }    
}


