
import {Com5t} from './Com5t.js';

export class ElemGlass extends Com5t {

    constructor(gson, owner, winc) {
        super(gson, owner, winc);
        this.dimension(owner.x1, owner.y1, owner.x2, owner.y2);
        this.init_constructiv();
    }

    init_constructiv() {

        //Артикул стекла
        if (this.gson.param !== undefined && this.gson.param.artglasID !== undefined)
            this.artiklRec = eArtikl.list.find(rec => this.gson.param.artglasID === rec.list[eArtikl.id]);
        else {
            let systreeRec = eSystree.list.find(rec => this.winc.nuni === rec.list[eSystree.id]); //по умолчанию стеклопакет
            this.artiklRec = eArtikl.list.find(rec => systreeRec[eSystree.glas] === rec.list[eArtikl.code]);
        }
        //Цвет стекла
        if (this.gson.param !== undefined && this.gson.param.colorGlass !== undefined)
            this.color1Rec = findef(this.gson.param.colorGlass, eColor.id, eColor);
        else {
            let color_fk = findef(this.artiklRec[eArtikl.id], eArtdet.artikl_id, eArtdet).list[eArtdet.color_fk];
            this.color1Rec = findef(color_fk, eColor.id, eColor);
        }
    }

    paint() {
        if (this.owner.typeForm() === "ARCH") {
            let r = this.winc.root.radiusArch;
            let ang1 = Math.PI + Math.acos(this.winc.width() / (r * 2));
            let ang2 = 2 * Math.PI - Math.acos(this.winc.width() / (r * 2));
            draw_full_arc(this.winc, this.winc.width() / 2, r, r, ang1, ang2, 0, null, this.color1Rec, true);

        } else if (this.owner.typeForm() === "TRAPEZE") {

//            let insideLeft = this.winc.root.frames().get(Layout.LEFT),
//                    insideTop = this.winc.root.frames().get(Layout.TOP),
//                    insideBott = this.winc.root.frames().get(Layout.BOTT),
//                    insideRight = this.winc.root.frames().get(Layout.RIGHT);

            if (this.winc.form === 'RIGHT') {
                draw_full_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.winc.height1 - this.winc.height2, this.y2, this.y2, this.color1Rec);

            } else if (this.winc.form === 'LEFT') {
                draw_full_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.winc.height1 - this.winc.height2, this.y1, this.y2, this.y2, this.color1Rec);
            }
        } else {
            draw_full_polygon(this.winc, this.x1, this.x2, this.x2,
                    this.x1, this.y1, this.y1, this.y2, this.y2, this.color1Rec);
        }
    }
}


