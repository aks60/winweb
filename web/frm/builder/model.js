
import {draw_stroke_polygon, draw_full_polygon} from './drawing.js';
import {SYS, CGR, COL, ART, ADET, PROD} from './dbset.js';
//------------------------------------------------------------------------------
export class Com5t {

    constructor(id, owner, iwin, layout, type) {
        this.id = id;//идентификатор 
        this.owner = owner;//владелец
        this.iwin = iwin;//главный класс калькуляции   
        this.layout = layout;//напрвление расположения
        this.type = type;//тип элемента

        this.rgb = iwin.RGB;//основная текстура 
    }

    dimension(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    width() {
        return (this.x2 > this.x1) ? this.x2 - this.x1 : this.x1 - this.x2;
    }

    height() {
        return (this.y2 > this.y1) ? this.y2 - this.y1 : this.y1 - this.y2;
    }
}
//------------------------------------------------------------------------------
export class Area extends Com5t {

    constructor(id, owner, iwin, layout, type, width, height) {
        super(id, owner, iwin, layout, type);

        this.childs = new Array(0); //список детей 

        if (owner == null) {
            this.dimension(0, 0, width, height);
        } else {
            if (this.childs.length == 0) {
                if (owner.layout == "VERT") { //сверху вниз
                    let Y2 = (owner.y1 + height > owner.y2) ? owner.y2 : owner.y1 + height;
                    this.dimension(owner.x1, owner.y1, owner.x2, Y2);

                } else if (owner.layout == "HORIZ") { //слева направо
                    let X2 = (owner.x1 + width > owner.x2) ? owner.x2 : owner.x1 + width;
                    this.dimension(owner.x1, owner.y1, X2, owner.y2);
                }
            } else {
                for (let index = owner.childs.length - 1; index >= 0; --index) { //т.к. this area ёщё не создана начнём с конца
                    if (owner.childs[ndex] instanceof Area) {
                        let prevArea = owner.childs[index];

                        if (owner.layout == "VERT") { //сверху вниз                            
                            let Y2 = (prevArea.y2 + height > owner.y2) ? owner.y2 : prevArea.y2 + height;
                            this.dimension(owner.x1, prevArea.y2, owner.x2, Y2);

                        } else if (owner.layout == "HORIZ") { //слева направо
                            let X2 = (prevArea.x2 + width > owner.x2) ? owner.x2 : prevArea.x2 + width;
                            this.dimension(prevArea.x2, owner.y1, X2, owner.y2);
                        }
                        break;
                    }
                }
            }
        }
    }

}
//------------------------------------------------------------------------------
export class Root extends Area {

    constructor(id, owner, iwin, layout, type, width, height) {
        super(id, owner, iwin, layout, type, width, height);

        this.frames = new Map(); //рамы конструкции 
    }
}
//------------------------------------------------------------------------------
export class Stvorka extends Area {

    constructor(id, owner, iwin, layout, type, param) {
        super(id, owner, iwin, layout, type, owner.width(), owner.height());

        this.frames = new Map(); //рамы конструкции 

        this.frames.set("BOTT", new Frame(id + '.1', this, iwin, "BOTT", "STVORKA_SIDE", param));
        this.frames.set("RIGHT", new Frame(id + '.2', this, iwin, "RIGHT", "STVORKA_SIDE", param));
        this.frames.set("TOP", new Frame(id + '.3', this, iwin, "TOP", "STVORKA_SIDE", param));
        this.frames.set("LEFT", new Frame(id + '.4', this, iwin, "LEFT", "STVORKA_SIDE", param));
    }

    paint() {
        this.frames.get("BOTT").paint();
        this.frames.get("RIGHT").paint();
        this.frames.get("TOP").paint();
        this.frames.get("LEFT").paint();
    }
}
//------------------------------------------------------------------------------
export class Cross extends Com5t {

    constructor(id, owner, iwin, layout, type, param) {
        super(id, owner, iwin, layout, type);
    }

    paint() {

    }
}
//------------------------------------------------------------------------------
export class Frame extends Com5t {

    constructor(id, owner, iwin, layout, type, param) {
        super(id, owner, iwin, layout, type);

        let x1 = (owner.type != "STVORKA") ? owner.x1 : (owner.x1 + winc.dh_frame) - winc.naxl;
        let y1 = (owner.type != "STVORKA") ? owner.y1 : (owner.y1 + winc.dh_frame) - winc.naxl;
        let x2 = (owner.type != "STVORKA") ? owner.x2 : (owner.x2 - winc.dh_frame) + winc.naxl;
        let y2 = (owner.type != "STVORKA") ? owner.y2 : (owner.y2 - winc.dh_frame) + winc.naxl;

        if (iwin.root.type == "RECTANGL") {
            if ("BOTT" == layout) {
                this.dimension(x1, y2 - winc.dh_frame, x2, y2);
            } else if ("RIGHT" == layout) {
                this.dimension(x2 - winc.dh_frame, y1, x2, y2);
            } else if ("TOP" == layout) {
                this.dimension(x1, y1, x2, y1 + winc.dh_frame);
            } else if ("LEFT" == layout) {
                this.dimension(x1, y1, x1 + winc.dh_frame, y2);
            }
        }
    }

    paint() {
        let dh = winc.dh_frame;
        if (this.iwin.root.type == "RECTANGL") {
            if ("BOTT" == this.layout) {
                draw_stroke_polygon(this.iwin, this.x1 + dh, this.x2 - dh, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.rgb1);
            } else if ("RIGHT" == this.layout) {
                draw_stroke_polygon(this.iwin, this.x1, this.x2, this.x2, this.x1, this.y1 + dh, this.y1, this.y2, this.y2 - dh, this.rgb1);
            } else if ("TOP" == this.layout) {
                draw_stroke_polygon(this.iwin, this.x1, this.x2, this.x2 - dh, this.x1 + dh, this.y1, this.y1, this.y2, this.y2, this.rgb1);
            } else if ("LEFT" == this.layout) {
                draw_stroke_polygon(this.iwin, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1 + dh, this.y2 - dh, this.y2, this.rgb1);
            }
        }
    }
}
//------------------------------------------------------------------------------
export class Glass extends Com5t {

    constructor(id, owner, iwin, layout, type, param) {
        super(id, owner, iwin, layout, type);
        let artdetRec = null;
  debugger;
        if (param != undefined && param.artglasID != undefined) {
            artdetRec = find2_rec(ADET.artikl_id, param.artglasID, dbset.artdetList);
        } else {
            let treeRec = dbset.find_rec(iwin.nuni, dbset.treeList); //по умолчанию стеклопакет
            for (let i = 0; i < dbset.artiklList.length; i++) {
                if (treeRec[SYS.glas] == dbset.artiklList[i][ART.code]) {
                    artiklRec = dbset.artiklList[i];
                    artdetRec = find2_rec(ADET.artikl_id, artiklRec[ART.id], dbset.artdetList);
                    break;
                }
            }
        }
        let color_fk = artdetRec[ADET.color_fk];
        let colorRec = dbset.find_rec(color_fk, dbset.colorList);
        this.rgb = colorRec[COL.rgb]; 
        let hexString = this.rgb.toString(16);
    }

    paint() {
        if (this.iwin.root.type == "RECTANGL") {
            draw_full_polygon(this.iwin, this.owner.x1, this.owner.x2, this.owner.x2,
                    this.owner.x1, this.owner.y1, this.owner.y1, this.owner.y2, this.owner.y2, this.rgb);
        }
    }
}
//------------------------------------------------------------------------------

