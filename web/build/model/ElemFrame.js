
import {UGeo} from './uGeo.js';
import {UseSideTo} from '../../enums/UseSideTo.js';
import {Type} from '../../enums/Type.js';
import {UCom} from '../../common/uCom.js';
import {ElemSimple} from './ElemSimple.js';

export class ElemFrame extends ElemSimple {

    constructor(winc, gson, owner) {
        try {
            super(winc, gson, owner);

        } catch (e) {
            errorLog('Error:ElemFrame.constructor() ' + e.message);
        }
    }

    initArtikle() {
        //debugger;
        try {
            this.colorID1 = UCom.isValidJson(this.gson.param, 'colorID1', this.winc.colorID1);
            this.colorID2 = UCom.isValidJson(this.gson.param, 'colorID2', this.winc.colorID2);
            this.colorID3 = UCom.isValidJson(this.gson.param, 'colorID3', this.winc.colorID3);

            this.sysprofRec = UCom.isValidJson(this.gson.param, 'sysprofID', null);
            if (this.owner.sysprofRec !== undefined)
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
            errorLog('Error:ElemFrame.initArtikle() ' + e.message);
        }
    }

    setLocation() {
        try {
            consoleLog('Exec:ElemFrame.setLocation()');
        } catch (e) {
            errorLog('Error:ElemFrame.setLocation() ' + e.message);
        }
    }

    paint() {
        try {
            //alert('Exec:ElemFrame.paint()');
            consoleLog('Exec:ElemFrame.paint()');
        } catch (e) {
            errorLog('Error:AreaSimple.paint() ' + e.message);
        }
        /*
         let dh = win.dh_frm;
         let dh0 = win.dh_frm; //см. winapp
         let dh1 = win.dh_frm; //см. winapp
         let dz = 4
         if (this.owner.typeForm() == "ARCH") {
         let Y1 = this.winc.height1 - this.winc.height2;
         let r = this.winc.root.radiusArch;
         
         if ("BOTT" == this.layout) {
         draw_stroke_polygon(this.winc, this.x1 + dh0, this.x2 - dh1, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.color2Rec);
         
         } else if ("RIGHT" == this.layout) {
         let ang2 = 90 - Math.toDegrees(Math.asin((this.winc.width() - 2 * dh) / ((r - dh) * 2)));
         let a = (r - dh) * Math.sin(Math.toRadians(ang2));
         draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, (r - a), this.y1, this.y2, this.y2 - dh0, this.color2Rec);
         
         } else if ("TOP" == this.layout) {
         let r2 = r - win.dh_frm;
         let ang1 = Math.PI + Math.acos(this.winc.width() / (r * 2));
         let ang2 = 2 * Math.PI - Math.acos(this.winc.width() / (r * 2));
         draw_full_arc(this.winc, this.winc.width() / 2, r, r - win.dh_frm / 2, ang1, ang2, win.dh_frm, this.color2Rec);
         draw_full_arc(this.winc, this.winc.width() / 2, r, r, ang1, ang2, 5);
         draw_full_arc(this.winc, this.winc.width() / 2, r, r - win.dh_frm, ang1, ang2, 5);
         } else if ("LEFT" == this.layout) {
         let ang2 = 90 - Math.toDegrees(Math.asin((this.winc.width() - 2 * dh) / ((r - dh) * 2)));
         let a = (r - dh) * Math.sin(Math.toRadians(ang2));
         draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, (r - a), this.y2 - dh1, this.y2, this.color2Rec);
         
         }
         //draw_line(this.winc, this.owner.x1 + dz, this.owner.y1 + dz, this.owner.x1 + dh, this.owner.y1 + dh, this.color2Rec);
         //draw_line(this.winc, this.owner.x2 - dz, this.owner.y1 + dz, this.owner.x2 - dh, this.owner.y1 + dh, this.color2Rec);
         //draw_line(this.winc, this.owner.x2 - dz, this.owner.y2 - dz, this.owner.x2 - dh, this.owner.y2 - dh, this.color2Rec);
         //draw_line(this.winc, this.owner.x1 + dz, this.owner.y2 - dz, this.owner.x1 + dh, this.owner.y2 - dh, this.color2Rec);
         
         
         } else if (this.owner.typeForm() == 'TRAPEZE') {
         if ('BOTT' == this.layout) {
         draw_stroke_polygon(this.winc, this.x1 + dh0, this.x2 - dh1, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.color2Rec);
         
         } else if ('RIGHT' == this.layout) {
         let angl = (this.winc.form == 'RIGHT') ? Math.toRadians(90 - this.anglCut[1]) : Math.toRadians(90 - this.anglCut[0]);
         let dh2 = dh * Math.tan(angl);
         draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1 + dh2, this.y1, this.y2, this.y2 - dh0, this.color2Rec);
         
         } else if ('TOP' == this.layout) {
         let anglHoriz = (180 - Math.toDegrees(Math.atan((this.winc.height1 - this.winc.height2) / this.winc.width())));
         let dy = (win.dh_frm / Math.sin(Math.toRadians(anglHoriz - 90)));
         draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y2, this.y2 + dy, this.y1 + dy, this.color2Rec);
         
         } else if ('LEFT' == this.layout) {
         let angl = Math.toRadians(90 - this.anglCut[0]);
         let dh2 = dh * Math.tan(angl);
         draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1 + dh2, this.y2 - dh1, this.y2, this.color2Rec);
         }
         
         } else {
         if ("BOTT" == this.layout) {
         draw_stroke_polygon(this.winc, this.x1 + dh0, this.x2 - dh1, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.color2Rec);
         } else if ("RIGHT" == this.layout) {
         draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1 + dh1, this.y1, this.y2, this.y2 - dh0, this.color2Rec);
         } else if ("TOP" == this.layout) {
         draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2 - dh0, this.x1 + dh1, this.y1, this.y1, this.y2, this.y2, this.color2Rec);
         } else if ("LEFT" == this.layout) {
         draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1 + dh0, this.y2 - dh1, this.y2, this.color2Rec);
         }
         draw_line(this.winc, this.owner.x1 + dz, this.owner.y1 + dz, this.owner.x1 + dh, this.owner.y1 + dh, this.color2Rec);
         draw_line(this.winc, this.owner.x2 - dz, this.owner.y1 + dz, this.owner.x2 - dh, this.owner.y1 + dh, this.color2Rec);
         draw_line(this.winc, this.owner.x2 - dz, this.owner.y2 - dz, this.owner.x2 - dh, this.owner.y2 - dh, this.color2Rec);
         draw_line(this.winc, this.owner.x1 + dz, this.owner.y2 - dz, this.owner.x1 + dh, this.owner.y2 - dh, this.color2Rec);
         }*/
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


