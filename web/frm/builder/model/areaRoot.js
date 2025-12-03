
import {AreaSimple} from './frm/buildr/model/areaSimple.js';

export class AreaRoot extends AreaSimple {

    constructor(obj, owner, winc) {
        super(obj, owner, winc);
        this.frames = new Map(); //рамы конструкции 
        this.pardefMap = new Map(); //параметры по умолчанию   

        //Радиус
        if (this.typeForm() == "ARCH") {
            let dh = win.dh_frm;
            let h = winc.height1 - winc.height2;
            let w = winc.width();
            this.radiusArch = (Math.pow(w / 2, 2) + Math.pow(h, 2)) / (2 * h);  //R = (L2 + H2) / 2H - радиус арки        
        }

        //Параметр
        for (let syspar1Rec of dbset.syspar1List) {
            if (winc.nuni == syspar1Rec[SYSPAR1.systree_id]) {
                this.pardefMap.set(syspar1Rec[SYSPAR1.params_id], syspar1Rec);
            }
        }
        this.init_pardef_map();
    }

    //Параметр
    init_pardef_map() {
        if (this.obj.param != undefined) {
            if (this.obj.param.ioknaParam != undefined) {
                //Накладываем к параметрам системы конструкции параметры конкретной конструкции
                let groupArr = this.obj.param.ioknaParam;
                for (let group of groupArr) {
                    let paramsRec = dbset.paramsList.find(rec => group == rec[PARAMS.id]);
                    let syspar1Rec = this.pardefMap.get(paramsRec[PARAMS.params_id]);
                    syspar1Rec[SYSPAR1.text] = paramsRec[PARAMS.text];
                }
            }
        }
    }
}



