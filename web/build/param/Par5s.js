

export class Par5s {

    GRUP = 3;   //Ключ параметра
    TEXT = 2;   //Текст 
 
    constructor() {
    }
    
    //Фильтр параметров по умолчанию + выбранных клиентом
     filterParamDef(paramList) {

        for (let paramRec of paramList) {
            if (paramRec[this.GRUP] < 0) {
                let syspar1Rec = winc.mapPardef.get(paramRec[this.GRUP]);
                if (syspar1Rec === null) {
                    return false; //если группы нет
                }
                if (paramRec[this.TEXT] == syspar1Rec[eSyspar1.text] === false) {
                    return false; //если группа есть, а параметр не совпал
                }
            }
        }
        return true;
    }    
}
