
import {UGeo} from './uGeo.js';
import {Com5t} from './Com5t.js';
import {UseSideTo} from '../../enums/UseSideTo.js';
import {Type} from '../../enums/Type.js';
import {Layout} from '../../enums/Layout.js';
import {UCom} from '../../common/uCom.js';
import {ElemSimple} from './ElemSimple.js';

export class ElemCross  extends ElemSimple {

    constructor(winc, gson, owner) {
        //debugger;
        try {
            super(winc, gson, owner);
            this.addListenerEvents();

            this.layout = (owner.layout == Layout.VERT) ? Layout.HORIZ : Layout.VERT;
            this.anglCut = [90, 90]; //угол реза            
        } catch (e) {
            errorLog('Error:ElemCross.constructor() ' + e.message);
        }
    }

    initArtikle() {
        try {
            this.colorID1 = UCom.isValidJson(this.gson.param, 'colorID1', this.winc.colorID1);
            this.colorID2 = UCom.isValidJson(this.gson.param, 'colorID2', this.winc.colorID2);
            this.colorID3 = UCom.isValidJson(this.gson.param, 'colorID3', this.winc.colorID3);

            //Профиль поперечины
            this.sysprofRec = UCom.isValidJson(this.gson.param, 'sysprofID', null);
            if (this.owner.sysprofRec !== null)
                this.sysprofRec = this.owner.sysprofRec;
            else {
                this.sysprofRec = dbset.sysprof.find(this.winc.nuni, this.type[1], UseSideTo.ANY[0], UseSideTo.ANY[0]);
            }
            this.artiklRec = dbset.artikl.find(this.sysprofRec[SYSPROF.artikl_id], false); //артикул
            this.artiklRecAn = dbset.artikl.find(this.sysprofRec[SYSPROF.artikl_id], true); //аналог     

            //Сделано для коррекции ширины импостов
            if (this.artiklRecAn[ARTIKL.id] == -3) {
                this.artiklRec[ARTIKL.height] = this.artiklRec[ARTIKL.height] + 16;
                this.artiklRecAn[ARTIKL.height] = this.artiklRec[ARTIKL.height] + 16;
            }

            //Если импост виртуальный
            if (this.artiklRec[ARTIKL.id] == -3) {
                this.artiklRec[ARTIKL.size_centr] = 40;
                this.artiklRecAn[ARTIKL.size_centr] = 40;
            }
        } catch (e) {
            errorLog('Error: ElemCross.initArtikle() ' + e.message);
        }
    }

    setLocation() { //gson, owner, winc) {
        try {
            const geoShell = this.owner.area.getGeometryN(0);
            const geoFalz = this.owner.area.getGeometryN(2);

            //Пилим полигон импостом
            const geoSplit = UGeo.splitPolygon(geoShell.copy(), this.segment());
            this.owner.childs.get(0).area = geoSplit[1];
            this.owner.childs.get(2).area = geoSplit[2];

            //Левый и правый сегмент вдоль импоста
            const delta = this.artiklRec[eArtikl.height] - this.artiklRec[eArtikl.size_centr]; //ширина
            const baseSegm = new jsts.geom.LineSegment(new jsts.geom.Coordinate(this.x1()
                    , this.y1()), new jsts.geom.Coordinate(this.x2(), this.y2()));
            const offsetSegment = [baseSegm.offset(+delta), baseSegm.offset(-delta)];

            //Точки пересечения канвы сегментами импоста
            const areaCanvas = UGeo.newPolygon(0, 0, 0, 10000, 10000, 10000, 10000, 0);
            const C1 = UGeo.geoCross(areaCanvas, offsetSegment[0]);
            const C2 = UGeo.geoCross(areaCanvas, offsetSegment[1]);

            //Ареа импоста, обрезаем areaPadding 
            const areaEnvelope = UGeo.newPolygon(C2[0].x, C2[0].y, C1[0].x, C1[0].y, C1[1].x, C1[1].y, C2[1].x, C2[1].y);
            this.area = areaEnvelope.intersection(geoFalz); //полигон элемента конструкции

        } catch (e) {
            errorLog("Error: ElemCross.setLocation " + e);
        }
    }

    paint() {
        try {
            if (this.area !== null && this.winc.sceleton === false) {
                const geoInne = this.owner.area.getGeometryN(1);
                this.winc.paint(geoInne);
            }
        } catch (e) {
            errorLog('Error: ElemFrame.paint() ' + e.message);
        }
    }

    /* find_first(nuni, typ, us1) {
     let record = dbset.sysprofList.find(rec => nuni == rec.list[SYSPROF.systree_id]
     && rec.list[SYSPROF.use_type] == typ && UseSide.MANUAL[0] != rec.list[SYSPROF.use_side]
     && (us1 == rec.list[SYSPROF.use_side] || UseSide.ANY[0] == rec.list[SYSPROF.use_side]));
     if (nuni == -3 || record == undefined) {
     return dbset.sysprofVirt; //[-3, 0, typ, -1, -3, -3];
     }
     return record;
     } */
}
