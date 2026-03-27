import {UGeo} from './uGeo.js';
import {Type, Layout, PKjson} from '../../enums/enums.js';
import {UCom} from '../../common/uCom.js';
import {Com5t, ElemSimple} from './model.js';

export class ElemMosquit extends ElemSimple {

    anglHoriz = 0;

    constructor(winc, gson, owner) {
        try {
            super(winc, gson, owner);
        } catch (e) {
            console.error(e.message);
        }
    }

    initArtikle() {
        try {
            //Артикул
            if (UCom.isFinite(this.gson.param, PKjson.artiklID)) {
                this.artiklRec = eArtikl.find(this.gson.param[PKjson.artiklID], false);
            } else {
                this.artiklRec = eArtikl.vrec();
            }
            this.artiklRecAn = this.artiklRec;

            //Текстура
            if (UCom.isFinite(this.gson.param, PKjson.colorID1)) {
                this.colorID1 = Number(this.gson.param[PKjson.colorID1]);
            } else {
                let artdetRec = eArtdet.find(this.artiklRec[eArtikl.id]);
                let colorRec = eColor.find3(artdetRec[eArtdet.color_fk]);
                this.colorID1 = colorRec[eColor.id];
            }

            //Состав москитки. ВНИМАЕИЕ! elementID подменён на sysprofRec
            if (UCom.isFinite(this.gson.param, PKjson.elementID)) {
                this.sysprofRec = eElement.list.find(this.gson.param[PKjson.elementID]);
            } else {
                this.sysprofRec = eElement.vrec();
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    setLocation() {
        try {

        } catch (e) {
            console.error(e.message);
        }
    }

    paint() {
        try {

        } catch (e) {
            console.error(e.message);
        }
    }
}



