
import {isValidColor} from './UGeo.js';
import {ElemSimple} from './ElemSimple.js';

export class ElemFrame extends ElemSimple {

    constructor(winc, id, ownerId) {
        try {
            super(winc, id, ownerId);
            this.initArtikle();
            this.setLocation();
            
        } catch (e) {
            errorLog('Error:ElemFrame.constructor() ' + e.message);
        }
    }

    initArtikle() {
        try {      
            this.colorID1 = isValidColor(this.gson.param, 'colorID1', this.winc.colorID1);
            this.colorID2 = isValidColor(this.gson.param, 'colorID2', this.winc.colorID2);
            this.colorID3 = isValidColor(this.gson.param, 'colorID3', this.winc.colorID3);

            this.sysprofRec = this.gson.param['sysprofID'];
            //if(this.sysprofRec === undefined) this.sysprofRec = this.owner.sysprofRec;  
            
            
            consoleLog('Exec:ElemFrame.initArtikle()');
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

    /*    initArtikle(param) {
     this.color1Rec = (param != undefined && param.colorID1 != undefined) ? findef(param.colorID1, COLOR.id, dbset.colorList) : this.winc.color1Rec;
     this.color2Rec = (param != undefined && param.colorID2 != undefined) ? findef(param.colorID2, COLOR.id, dbset.colorList) : this.winc.color2Rec;
     this.color3Rec = (param != undefined && param.colorID3 != undefined) ? findef(param.colorID3, COLOR.id, dbset.colorList) : this.winc.color3Rec;
     
     if (param != undefined && param.sysprofID != undefined)
     this.sysprofID = param.sysprofID; //сист.профиль
     
     else { //профиль по умолчанию
     if ('BOTT' == this.layout)
     this.sysprofID = this.find_first(this.winc.nuni, Type[this.type][1], UseSide['BOTT'][0], UseSide['HORIZ'][0])[SYSPROF.id];
     else if ('RIGHT' == this.layout)
     this.sysprofID = this.find_first(this.winc.nuni, Type[this.type][1], UseSide['RIGHT'][0], UseSide['VERT'][0])[SYSPROF.id];
     else if ('TOP' == this.layout)
     this.sysprofID = this.find_first(this.winc.nuni, Type[this.type][1], UseSide['TOP'][0], UseSide['HORIZ'][0])[SYSPROF.id];
     else if ('LEFT' == this.layout)
     this.sysprofID = this.find_first(this.winc.nuni, Type[this.type][1], UseSide['LEFT'][0], UseSide['VERT'][0])[SYSPROF.id];
     
     }
     this.sysprofRec = findef(this.sysprofID, SYSPROF.id, dbset.sysprofList);
     this.artiklRec = findef(this.sysprofRec[SYSPROF.artikl_id], ARTIKL.id, dbset.artiklList);
     this.artiklAn = findef(this.artiklRec[ARTIKL.analog_id], ARTIKL.id, dbset.artiklList);
     if (this.artiklAn == undefined) {
     this.artiklAn = this.artiklRec;
     }
     }
     
     setLocation(gson, owner, winc) {
     
     if (owner.typeForm() == "ARCH") {
     if ("BOTT" == this.layout) {
     this.dimension(owner.x1, owner.y2 - win.dh_frm, owner.x2, owner.y2);
     } else if ("RIGHT" == this.layout) {
     this.dimension(owner.x2 - win.dh_frm, owner.y2 - this.winc.height2, owner.x2, owner.y2);
     } else if ("TOP" == this.layout) {
     //this.dimension(owner.x1, owner.y1, owner.x2, owner.y1 + win.dh_frm);                 
     } else if ("LEFT" == this.layout) {
     this.dimension(owner.x1, owner.y2 - this.winc.height2, owner.x1 + win.dh_frm, owner.y2);
     }
     
     } else if (owner.typeForm() == "TRAPEZE") {
     let H = winc.height1 - winc.height2;
     let W = winc.width();
     
     if ('BOTT' == this.layout) {
     this.dimension(owner.x1, owner.y2 - win.dh_frm, owner.x2, owner.y2);
     
     } else if ('RIGHT' == this.layout) {
     if (winc.form == 'RIGHT') {
     this.dimension(owner.x2 - win.dh_frm, owner.y2 - winc.height2, owner.x2, owner.y2);
     this.anglCut[1] = (180 - Math.toDegrees(Math.atan(W / H))) / 2;
     } else {
     this.dimension(owner.x2 - win.dh_frm, owner.y1, owner.x2, owner.y2);
     this.anglCut[0] = Math.toDegrees(Math.atan(W / H)) / 2;
     }
     } else if ('TOP' == this.layout) {
     if (winc.form == 'RIGHT') {
     this.dimension(owner.x1, owner.y1, owner.x2, winc.height1 - winc.height2);
     this.anglCut[0] = (180 - Math.toDegrees(Math.atan(W / H))) / 2;
     this.anglCut[1] = Math.toDegrees(Math.atan(W / H)) / 2;
     } else {
     this.dimension(owner.x1, winc.height2 - winc.height1, owner.x2, owner.y1);
     this.anglCut[1] = (180 - Math.toDegrees(Math.atan(W / H))) / 2;
     this.anglCut[0] = Math.toDegrees(Math.atan(W / H)) / 2;
     }
     } else if ('LEFT' == this.layout) {
     if (winc.form == 'RIGHT') {
     this.dimension(owner.x1, owner.y1, owner.x1 + win.dh_frm, owner.y2);
     this.anglCut[0] = (Math.toDegrees(Math.atan(W / H))) / 2;
     } else {
     this.dimension(owner.x1, owner.y2 - winc.height1, owner.x1 + win.dh_frm, owner.y2);
     this.anglCut[0] = (180 - Math.toDegrees(Math.atan(W / H))) / 2;
     }
     }
     } else {
     if ("BOTT" == this.layout) {
     this.dimension(owner.x1, owner.y2 - win.dh_frm, owner.x2, owner.y2);
     } else if ("RIGHT" == this.layout) {
     this.dimension(owner.x2 - win.dh_frm, owner.y1, owner.x2, owner.y2);
     } else if ("TOP" == this.layout) {
     this.dimension(owner.x1, owner.y1, owner.x2, owner.y1 + win.dh_frm);
     } else if ("LEFT" == this.layout) {
     this.dimension(owner.x1, owner.y1, owner.x1 + win.dh_frm, owner.y2);
     }
     }
     }
     
     find_first(nuni, typ, us1, us2) {
     let record = dbset.sysprofList.find(rec => nuni == rec.list[SYSPROF.systree_id] && typ == rec.list[SYSPROF.use_type] && 0 != rec.list[SYSPROF.use_side]
     && (us1 == rec.list[SYSPROF.use_side] || us2 == rec.list[SYSPROF.use_side] || UseSide.ANY[0] == rec.list[SYSPROF.use_side]));
     if (nuni == -3 || record == undefined) {
     dbset.sysprofVirt; //[-3, 0, typ, -1, -3, -3];
     }
     return record;
     }
     */

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
}


