
import {Com5t} from './Com5t.js';

export class ElemCross extends Com5t {

    constructor(obj, owner, winc) {
        super(obj, owner, winc);
        this.layout = (owner.layout == 'VERT') ? 'HORIZ' : 'VERT';
        this.anglCut = [90, 90]; //угол реза

        this.init_constructiv(this.obj.param);
        this.set_location(obj, owner, winc);
    }

    init_constructiv(param) {
        this.color1Rec = (param != undefined && param.colorID1 != undefined) ? findef(dbset.colorList.find(rec => param.colorID1 == rec[COLOR.id]), dbset.colorList) : this.winc.color1Rec;
        this.color2Rec = (param != undefined && param.colorID2 != undefined) ? findef(dbset.colorList.find(rec => param.colorID2 == rec[COLOR.id]), dbset.colorList) : this.winc.color2Rec;
        this.color3Rec = (param != undefined && param.colorID3 != undefined) ? findef(dbset.colorList.find(rec => param.colorID3 == rec[COLOR.id]), dbset.colorList) : this.winc.color3Rec;

        //Профиль поперечины
        if (this.obj.param != undefined && this.obj.param.sysprofID != undefined)
            this.sysprofRec = this.obj.param.sysprofID;

        else {
            if ("VERT" == this.layout) { //сверху вниз
                this.sysprofRec = this.find_first(this.winc.nuni, Type[this.type][1], UseSide.HORIZ[0]);

            } else if ("HORIZ" == this.layout) { //слева направо
                this.sysprofRec = this.find_first(this.winc.nuni, Type[this.type][1], UseSide.VERT[0]);
            }
        }
        this.artiklRec = findef(dbset.artiklList.find(rec => this.sysprofRec[SYSPROF.artikl_id] == rec[ARTIKL.id]), dbset.artiklList);
        this.artiklAn = findef(dbset.artiklList.find(rec => this.artiklRec[ARTIKL.analog_id] == rec[ARTIKL.id]), dbset.artiklList);
        if (this.artiklAn == undefined) {
            this.artiklAn = this.artiklRec;
        }
    }

    set_location(obj, owner, winc) {

        //Коррекция положения импоста арки (подкдадка ареа над импостом)
        if ("ARCH" == owner.typeForm()) {
            let prevArea = owner.childs[0];
            prevArea.y2 = prevArea.y2 + win.dh_crss / 2;

        } else if ("TRAPEZE" == owner.typeForm()) {
            let prevArea = owner.childs[0];
            if (winc.form == 'RIGHT') {
                let angl = winc.root.frames.get('RIGHT').anglCut[1];
                var dy = win.dh_frm * Math.tan(Math.toRadians(90 - angl));
            }
            prevArea.dimension(prevArea.x1, prevArea.y1, prevArea.x2, prevArea.y2 + (win.dh_crss / 2) + dy);
        }
        for (let index = owner.childs.length - 1; index >= 0; --index) {
            if (owner.childs[index] instanceof Area) {
                let prevArea = owner.childs[index]; //index указывает на предыдущий элемент

                if ("VERT" == owner.layout) { //сверху вниз
                    this.dimension(prevArea.x1, prevArea.y2 - win.dh_crss / 2, prevArea.x2, prevArea.y2 + win.dh_crss / 2);

                } else if ("HORIZ" == owner.layout) { //слева направо
                    this.dimension(prevArea.x2 - win.dh_crss / 2, prevArea.y1, prevArea.x2 + win.dh_crss / 2, prevArea.y2);
                }
                break;
            }
        }
    }

    find_first(nuni, typ, us1) {
        let record = dbset.sysprofList.find(rec => nuni == rec[SYSPROF.systree_id]
                    && rec[SYSPROF.use_type] == typ && UseSide.MANUAL[0] != rec[SYSPROF.use_side]
                    && (us1 == rec[SYSPROF.use_side] || UseSide.ANY[0] == rec[SYSPROF.use_side]));
        if (nuni == -3 || record == undefined) {
            return dbset.sysprofVirt; //[-3, 0, typ, -1, -3, -3];
        }
        return record;
    }

    paint() {
        if ("VERT" == this.owner.layout) {
            draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.color2Rec);

        } else if ("HORIZ" == this.owner.layout) {
            draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.color2Rec);
        }
    }
}
