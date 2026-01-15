
import {UGeo} from './uGeo.js';
import {UseSide, Type, Layout} from '../../enums/enums.js';
import {UCom} from '../../common/uCom.js';
import {Com5t, ElemSimple} from './model.js';
import Coordinate from '../../lib-js/jsts-2.12.1/org/locationtech/jts/geom/Coordinate.js';

export class ElemFrame extends ElemSimple {

    radiusArc = 0; //радиус арки
    lengthArc = 0; //длина арки  

    constructor(winc, gson, owner) {
        try {
            super(winc, gson, owner);
            this.addListenerEvents();
        } catch (e) {
            errorLog('Error: ElemFrame.constructor() ' + e.message);
        }
    }

    initArtikle() {
        try {
            this.colorID1 = (UCom.isFinite(this.gson.param, 'color1')) ? Number(this.gson.param.color1) : this.winc.colorID1;
            this.colorID2 = (UCom.isFinite(this.gson.param, 'color2')) ? Number(this.gson.param.color2) : this.winc.colorID2;
            this.colorID3 = (UCom.isFinite(this.gson.param, 'color3')) ? Number(this.gson.param.color3) : this.winc.colorID3;
            this.sysprofRec = UCom.isFinite(this.gson.param, 'sysprofID') ? Number(this.gson.param.sysprofID) : null;

            if (this.owner.sysprofRec !== null)
                this.sysprofRec = this.owner.sysprofRec;
            else {
                if (Layout.BOT === this.layout()) {
                    this.sysprofRec = eSysprof.find5(this.winc.nuni, this.type[1], UseSide.BOT[0], UseSide.HORIZ[0]);
                } else if (Layout.RIG === this.layout()) {
                    this.sysprofRec = eSysprof.find5(this.winc.nuni, this.type[1], UseSide.RIGHT[0], UseSide.VERT[0]);
                } else if (Layout.TOP === this.layout()) {
                    this.sysprofRec = eSysprof.find5(this.winc.nuni, this.type[1], UseSide.TOP[0], UseSide.HORIZ[0]);
                } else if (Layout.LEF === this.layout()) {
                    this.sysprofRec = eSysprof.find5(this.winc.nuni, this.type[1], UseSide.LEFT[0], UseSide.VERT[0]);
                } else {
                    this.sysprofRec = eSysprof.find5(this.winc.nuni, this.type[1], UseSide.ANY[0], UseSide.ANY[0]);
                }
            }
            this.artiklRec = eArtikl.find(this.sysprofRec[eSysprof.artikl_id], false); //артикул
            this.artiklRecAn = eArtikl.find(this.sysprofRec[eSysprof.artikl_id], true); //аналог             

        } catch (e) {
            errorLog('Error: ElemFrame.initArtikle() ' + e.message);
        }
    }

    setLocation() {
        try {
            let geoShell = this.owner.area.getGeometryN(0), geoInner = this.owner.area.getGeometryN(1); //внешн. и внутр. ареа арки.
            let cooShell = geoShell.getCoordinates(), cooInner = geoInner.getCoordinates();
            for (let i = 0; i < cooShell.length; i++) {
                if (cooShell[i].z === this.id) {
                    if (this.gson.h !== undefined) { //полигон арки

                        this.area = UGeo.polyCurve(geoShell, geoInner, this.id);
                    } else { //полигон рамы  
                        this.area = Com5t.gf.createPolygon([
                            Coordinate.new(this.x1, this.y1),
                            Coordinate.new(this.x2, this.y2),
                            Coordinate.new(cooInner[i + 1].x, cooInner[i + 1].y),
                            Coordinate.new(cooInner[i].x, cooInner[i].y),
                            Coordinate.new(this.x1, this.y1)]);
                    }
                    break;
                }
            }
        } catch (e) {
            errorLog('Error: ElemFrame.setLocation() ' + e.message);
        }
    }

    paint() {
        try {
            if (this.area !== null && this.winc.sceleton === false) {
                
                this.winc.ctx.lineWidth = 8;
                this.winc.ctx.strokeStyle = '#000000';
                this.winc.paint(this.area);
            }
        } catch (e) {
            errorLog('Error: ElemFrame.paint() ' + e.message);
        }
    }

    get x2() {
        for (let i = 0; i < this.owner.frames.length; i++) {
            if (this.owner.frames[i].x1 === this.x1 && this.owner.frames[i].y1 === this.y1) {
                return this.owner.frames[(i === this.owner.frames.length - 1) ? 0 : i + 1].x1;
            }
        }
        return null;
    }

    get y2() {
        for (let i = 0; i < this.owner.frames.length; i++) {
            if (this.owner.frames[i].x1 === this.x1 && this.owner.frames[i].y1 === this.y1) {
                return this.owner.frames[(i === this.owner.frames.length - 1) ? 0 : i + 1].y1;
            }
        }
        return null;
    }
}


