
import {UGeo} from './uGeo.js';
import {Com5t} from './Com5t.js';
import {UseSideTo} from '../../enums/UseSideTo.js';
import {Type} from '../../enums/Type.js';
import {UCom} from '../../common/uCom.js';
import {ElemSimple} from './ElemSimple.js';
import {Draw} from '../making/Draw.js';

export class ElemFrame extends ElemSimple {

    radiusArc = 0; //радиус арки
    lengthArc = 0; //длина арки  

    constructor(winc, gson, owner) {
        try {
            super(winc, gson, owner);
            this.addListenerEvents();

        } catch (e) {
            errorLog('Error:ElemFrame.constructor() ' + e.message);
        }
    }

    initArtikle() {
        try {
            this.colorID1 = UCom.isValidJson(this.gson.param, 'colorID1', this.winc.colorID1);
            this.colorID2 = UCom.isValidJson(this.gson.param, 'colorID2', this.winc.colorID2);
            this.colorID3 = UCom.isValidJson(this.gson.param, 'colorID3', this.winc.colorID3);

            this.sysprofRec = UCom.isValidJson(this.gson.param, 'sysprofID', null);
            if (this.owner.sysprofRec !== null)
                this.sysprofRec = this.owner.sysprofRec;
            else {
                if ('BOTT' === this.layout()) {
                    this.sysprofRec = dbset.sysprof.find(this.winc.nuni, this.type[1], UseSideTo.BOT[0], UseSideTo.HORIZ[0]);
                } else if ('RIGHT' === this.layout()) {
                    this.sysprofRec = dbset.sysprof.find(this.winc.nuni, this.type[1], UseSideTo.RIGHT[0], UseSideTo.VERT[0]);
                } else if ('TOP' === this.layout()) {
                    this.sysprofRec = dbset.sysprof.find(this.winc.nuni, this.type[1], UseSideTo.TOP[0], UseSideTo.HORIZ[0]);
                } else if ('LEFT' === this.layout()) {
                    this.sysprofRec = dbset.sysprof.find(this.winc.nuni, this.type[1], UseSideTo.LEFT[0], UseSideTo.VERT[0]);
                } else {
                    this.sysprofRec = dbset.sysprof.find(this.winc.nuni, this.type[1], UseSideTo.ANY[0], UseSideTo.ANY[0]);
                }
            }
            this.artiklRec = dbset.artikl.find(this.sysprofRec[SYSPROF.artikl_id], false); //артикул
            this.artiklRecAn = dbset.artikl.find(this.sysprofRec[SYSPROF.artikl_id], true); //аналог             

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
                            new jsts.geom.Coordinate(this.x1, this.y1),
                            new jsts.geom.Coordinate(this.x2, this.y2),
                            new jsts.geom.Coordinate(cooInner[i + 1].x, cooInner[i + 1].y),
                            new jsts.geom.Coordinate(cooInner[i].x, cooInner[i].y),
                            new jsts.geom.Coordinate(this.x1, this.y1)]);
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
                consoleLog('Exec: ElemFrame.paint()');
                Draw.polygon(this.winc, this.area);
                //super.paint();
                //this.winc.ctx.setColor(this.color());
                //shape = new jsts.awt.ShapeWriter().toShape(this.area.getGeometryN(0));
                //this.winc.ctx.fill(shape);

                //this.winc.ctx.setColor([0, 0, 0]);
                //this.winc.ctx.draw(shape);
            }
        } catch (e) {
            errorLog('Error: AreaSimple.paint() ' + e.message);
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


