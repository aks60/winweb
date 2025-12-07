
import {Com5t} from './Com5t.js';

export class ElemGlass extends Com5t {

    constructor(obj, owner, winc) {
        super(obj, owner, winc);
        this.dimension(owner.x1, owner.y1, owner.x2, owner.y2);
        this.init_constructiv();
    }

    init_constructiv() {

        //Артикул стекла
        if (this.obj.param != undefined && this.obj.param.artglasID != undefined)
            this.artiklRec = dbset.artiklList.find(rec => this.obj.param.artglasID == rec[ARTIKL.id]);
        else {
            let systreeRec = dbset.systreeList.find(rec => this.winc.nuni == rec[SYSTREE.id]); //по умолчанию стеклопакет
            this.artiklRec = dbset.artiklList.find(rec => systreeRec[SYSTREE.glas] == rec[ARTIKL.code]);
        }
        //Цвет стекла
        if (this.obj.param != undefined && this.obj.param.colorGlass != undefined)
            this.color1Rec = findef(dbset.colorList.find(rec => this.obj.param.colorGlass == rec[COLOR.id]), dbset.colorList);
        else {
            let color_fk = findef(dbset.artdetList.find(rec => this.artiklRec[ARTIKL.id] == rec[ARTDET.artikl_id]), dbset.artdetList)[ARTDET.color_fk];
            this.color1Rec = findef(dbset.colorList.find(rec => color_fk == rec[COLOR.id]), dbset.colorList);
        }
    }

    paint() {
        if (this.owner.typeForm() == "ARCH") {
            let r = this.winc.root.radiusArch;
            let ang1 = Math.PI + Math.acos(this.winc.width() / (r * 2));
            let ang2 = 2 * Math.PI - Math.acos(this.winc.width() / (r * 2));
            draw_full_arc(this.winc, this.winc.width() / 2, r, r, ang1, ang2, 0, null, this.color1Rec, true);

        } else if (this.owner.typeForm() == "TRAPEZE") {

//            let insideLeft = this.winc.root.frames().get(Layout.LEFT),
//                    insideTop = this.winc.root.frames().get(Layout.TOP),
//                    insideBott = this.winc.root.frames().get(Layout.BOTT),
//                    insideRight = this.winc.root.frames().get(Layout.RIGHT);

            if (this.winc.form == 'RIGHT') {
                draw_full_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.winc.height1 - this.winc.height2, this.y2, this.y2, this.color1Rec);

            } else if (this.winc.form == 'LEFT') {
                draw_full_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.winc.height1 - this.winc.height2, this.y1, this.y2, this.y2, this.color1Rec);
            }
        } else {
            draw_full_polygon(this.winc, this.x1, this.x2, this.x2,
                    this.x1, this.y1, this.y1, this.y2, this.y2, this.color1Rec);
        }
    }
}


