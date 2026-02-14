
import {ElemSimple} from './ElemSimple.js';
import {UCom} from '../../common/uCom.js';
import {PKjson} from '../../enums/enums.js';

export class ElemGlass extends ElemSimple {

    radius = 0; //радиус стекла
    gzazo = 0; //зазор между фальцем и стеклопакетом 
    axisMap = new Map(); //размер от оси до стеклопакета
    rascRec = eArtikl.vrec; //раскладка
    rascColor = -3; //цвет раскладки
    rascNumber = [2, 2]; //количество проёмов раскладки 

    constructor(winc, gson, owner) {
        try {
            super(winc, gson, owner);
        } catch (e) {
            errorLog('Error: ElemGlass.constructor() ' + e.message);
        }
    }

    initArtikle() {
        try {
            //Артикул стекла
            if (UCom.isFinite(this.gson.param, PKjson.artglasID)) {
                this.artiklRec = eArtikl.find(this.gson.param[PKjson.artglasID], false);
            } else {
                this.sysreeRec = eSystree.find(this.winc.nuni); //по умолчанию стеклопакет
                this.artiklRec = eArtikl.find2(this.sysreeRec[eSystree.glas]);
            }
            this.artiklRecAn = this.artiklRec;

            //Цвет стекла
            if (UCom.isFinite(this.gson.param, PKjson.colorGlass)) {
                this.colorID1 = this.gson.param[PKjson.colorGlass];
                this.colorID2 = this.colorID1;
                this.colorID3 = this.colorID1;
            } else {
                let artdetRec = eArtdet.find(this.artiklRec[eArtikl.id]);
                let colorRec = eColor.find3(artdetRec[eArtdet.color_fk]);
                this.colorID1 = colorRec[eColor.id];
                this.colorID2 = this.colorID1;
                this.colorID3 = this.colorID1;
            }

            //Раскладка
            if (UCom.isFinite(this.gson.param, PKjson.artiklRasc)) {
                this.rascRec = eArtikl.find(this.gson.param[PKjson.artiklRasc], false);
                //Текстура
                if (UCom.isFinite(this.gson.param, PKjson.colorRasc)) {
                    this.rascColor = eColor.find(this.gson.param[PKjson.colorRasc])[eColor.id];
                } else {
                    this.rascColor = eArtdet.find(this.rascRec[eArtikl.id])[eArtdet.color_fk]; //цвет по умолчанию
                }
                //Проёмы гориз.
                if (UCom.isFinite(this.gson.param, PKjson.horRasc)) {
                    this.rascNumber[0] = this.gson.param[PKjson.horRasc];
                }
                //Проёмы вертик.
                if (UCom.isFinite(this.gson.param, PKjson.verRasc)) {
                    this.rascNumber[1] = this.gson.param[PKjson.verRasc];
                }
            }
        } catch (e) {
            errorLog('Error: ElemGlass.initArtikl() ' + e.message);
        }
    }

    setLocation() {
        try {
            //Полигон по фальцу для прорисовки и рассчёта штапик...
            let geoFalz = this.owner.area.getGeometryN(2);

            let coo = geoFalz.getCoordinates();
            if (geoFalz.getEnvelopeInternal().getMaxY() <= coo[0].y) {
                coo[0].z = coo[1].z;
                coo[1].z = coo[coo.length - 2].z;
                coo[2].z = coo[coo.length - 2].z;
                coo[coo.length - 1].z = coo[1].z;
            }
        } catch (e) {
            errorLog('Error: ElemGlass.setLocation() ' + e.message);
        }
    }

    paint() {
        try {
            let geoFalz = this.owner.area.getGeometryN(2);
            if (geoFalz !== null && this.winc.sceleton === false) {

                this.winc.ctx.lineWidth = 4;
                this.winc.ctx.strokeStyle = '#000000';
                this.winc.ctx.fillStyle = '#' + eColor.find(this.colorID2)[eColor.rgb].toString(16);
                this.winc.paint(geoFalz);

            } else if (geoFalz !== null) {
                //
            }
        } catch (e) {
            errorLog('Error: ElemGlass.paint() ' + e.message);
        }
    }
}


