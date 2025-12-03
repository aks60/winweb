
import {Com5t} from './frm/builder/model/com5t.js';

export class Frame extends Com5t {

    constructor(obj, owner, winc, param, id, layout, type) {
        super(obj, owner, winc);
        this.anglCut = [45, 45]; //угол реза
        if (id != undefined) { //если сторона створки
            this.id = id;      //дополнительные параметры
            this.layout = layout;
            this.type = type;
        }

        this.init_constructiv(param);
        this.set_location(obj, owner, winc, param, id, layout, type);
    }

    init_constructiv(param) {
        this.color1Rec = (param != undefined && param.colorID1 != undefined) ? findef(dbset.colorList.find(rec => param.colorID1 == rec[COLOR.id]), dbset.colorList) : this.winc.color1Rec;
        this.color2Rec = (param != undefined && param.colorID2 != undefined) ? findef(dbset.colorList.find(rec => param.colorID2 == rec[COLOR.id]), dbset.colorList) : this.winc.color2Rec;
        this.color3Rec = (param != undefined && param.colorID3 != undefined) ? findef(dbset.colorList.find(rec => param.colorID3 == rec[COLOR.id]), dbset.colorList) : this.winc.color3Rec;

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
        this.sysprofRec = findef(dbset.sysprofList.find(rec => this.sysprofID == rec[SYSPROF.id]), dbset.sysprofList);
        this.artiklRec = findef(dbset.artiklList.find(rec => this.sysprofRec[SYSPROF.artikl_id] == rec[ARTIKL.id]), dbset.artiklList);
        this.artiklAn = findef(dbset.artiklList.find(el => el[ARTIKL.id] == this.artiklRec[ARTIKL.analog_id]), dbset.artiklList);
        if (this.artiklAn == undefined) {
            this.artiklAn = this.artiklRec;
        }
    }

    set_location(obj, owner, winc) {

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
        let record = dbset.sysprofList.find(rec => nuni == rec[SYSPROF.systree_id] && typ == rec[SYSPROF.use_type] && 0 != rec[SYSPROF.use_side]
                    && (us1 == rec[SYSPROF.use_side] || us2 == rec[SYSPROF.use_side] || UseSide.ANY[0] == rec[SYSPROF.use_side]));
        if (nuni == -3 || record == undefined) {
            dbset.sysprofVirt; //[-3, 0, typ, -1, -3, -3];
        }
        return record;
    }

    paint() {
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
        }
    }
}


