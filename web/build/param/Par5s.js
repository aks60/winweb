

export class Par5s {

    GRUP = 3;   //Ключ параметра
    TEXT = 2;   //Текст 
    winc = null;
 
    constructor(winc) {
        this.winc = winc;
    }
    
    //Фильтр параметров по умолчанию + выбранных клиентом
     filterParamDef(paramList) {

        for (let paramRec of paramList) {
            if (paramRec[this.GRUP] < 0) {
                let syspar1Rec = this.winc.mapPardef.get(paramRec[this.GRUP]);
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
    
    //Необработанные параметры
    message(code) {
        if (code >= 0) {
            //if (ParamList.find(code).pass() != 0) {
            //String str = ParamList.find(code).text();
            alert("Параметр не обработан. код  " + code);
            //}
        }
    }    
}
