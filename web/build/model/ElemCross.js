
import {UGeo} from './uGeo.js';
import {UCom} from '../../common/uCom.js';
import {Layout, Type, UseSide} from '../../enums/enums.js';
import {Com5t, ElemSimple} from './model.js';
import LineSegment from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineSegment.js';
import LineString from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineString.js';
import Polygon from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Polygon.js';
import Coordinate from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Coordinate.js';
import OverlayOp from '../../lib-js/jsts-2.11.2/org/locationtech/jts/operation/overlay/OverlayOp.js'

import WKTWriter from '../../lib-js/jsts-2.11.2/org/locationtech/jts/io/WKTWriter.js'

export class ElemCross extends ElemSimple {

    constructor(winc, gson, owner) {
        try {
            super(winc, gson, owner);
            this.addListenerEvents();
            this.anglCut = [90, 90]; //угол реза            
        } catch (e) {
            errorLog('Error: ElemCross.constructor() ' + e.message);
        }
    }

    initArtikle() {
        try {
            this.colorID1 = UCom.isFinite(this.gson.param, 'color1') ? Number(this.gson.param.color1) : this.winc.colorID1;
            this.colorID2 = UCom.isFinite(this.gson.param, 'color2') ? Number(this.gson.param.color2) : this.winc.colorID2;
            this.colorID3 = UCom.isFinite(this.gson.param, 'color3') ? Number(this.gson.param.color3) : this.winc.colorID3;
            this.sysprofRec = UCom.isFinite(this.gson.param, 'sysprofID') ? Number(this.gson.param.sysprofID) : null;

            if (this.owner.sysprofRec !== null) {
                this.sysprofRec = this.owner.sysprofRec;
            } else {
                this.sysprofRec = eSysprof.find5(this.winc.nuni, this.type[1], UseSide.ANY[0], UseSide.ANY[0]);
            }
            this.artiklRec = eArtikl.find(this.sysprofRec[eSysprof.artikl_id], false); //артикул
            this.artiklRecAn = eArtikl.find(this.sysprofRec[eSysprof.artikl_id], true); //аналог     

            //Сделано для коррекции ширины импостов
            if (this.artiklRecAn[eArtikl.id] === -3) {
                this.artiklRec[eArtikl.height] = this.artiklRec[eArtikl.height] + 16;
                this.artiklRecAn[eArtikl.height] = this.artiklRec[eArtikl.height] + 16;
            }

            //Если импост виртуальный
            if (this.artiklRec[eArtikl.id] === -3) {
                this.artiklRec[eArtikl.size_centr] = 40;
                this.artiklRecAn[eArtikl.size_centr] = 40;
            }
        } catch (e) {
            errorLog('Error: ElemCross.initArtikle() ' + e.message);
        }
    }

    setLocation() {
        try {
            const geoShell = this.owner.area.getGeometryN(0);
            const geoFalz = this.owner.area.getGeometryN(2);

            //Пилим полигон импостом     
            let segmImp = UGeo.normalizeSegm(LineSegment.new([this.x1, this.y1, this.id], [this.x2, this.y2, this.id]));            
            const geoSplit = UGeo.splitPolygon(geoShell.copy(), segmImp);
            this.owner.childs[0].area = geoSplit[0];
            this.owner.childs[2].area = geoSplit[1];

            //Левый и правый сегмент вдоль импоста
            const delta = this.artiklRec[eArtikl.height] - this.artiklRec[eArtikl.size_centr]; //ширина
            const baseSegm = LineSegment.new([this.x1, this.y1], [this.x2, this.y2]);
            const offsetSegment = [UGeo.offsetSegm(baseSegm, +delta), UGeo.offsetSegm(baseSegm, -delta)];

            //Точки пересечения канвы сегментами импоста
            const areaCanvas = Polygon.new([[0, 0], [0, 10000], [10000, 10000], [10000, 0]]);
            const C1 = UGeo.crossGeoOfLine(areaCanvas, offsetSegment[0]);
            const C2 = UGeo.crossGeoOfLine(areaCanvas, offsetSegment[1]);

            //Ареа импоста, обрезаем areaPadding 
            const areaEnvelope = Polygon.new([[C2[0].x, C2[0].y], [C1[0].x, C1[0].y], [C1[1].x, C1[1].y], [C2[1].x, C2[1].y]]);
            this.area = OverlayOp.intersection(geoFalz, areaEnvelope); //полигон элемента конструкции

        } catch (e) {
            errorLog("Error: ElemCross.setLocation " + e);
        }
    }

    paint() {
        try {
            if (this.area !== null && this.winc.sceleton === false) {
                
                this.winc.ctx.lineWidth = 4;
                this.winc.ctx.strokeStyle = '#000000';
                this.winc.ctx.fillStyle = '#' + eColor.find(this.colorID2)[eColor.rgb].toString(16);
                const geoInne = this.owner.area.getGeometryN(1);
                let geoPaint = OverlayOp.intersection(this.area, geoInne);
                this.winc.paint(geoPaint);
            }
        } catch (e) {
            errorLog('Error: ElemCross.paint() ' + e.message);
        }
    }
}
