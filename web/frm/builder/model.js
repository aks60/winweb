
import {draw_stroke_polygon} from './drawing.js';
//------------------------------------------------------------------------------
export class Com5t {

    constructor(id, owner, iwin, layout, type) {
        this.id = id;//идентификатор 
        this.owner = owner;//владелец
        this.iwin = iwin;//главный класс калькуляции   
        this.layout = layout;//напрвление расположения
        this.type = type;//тип элемента

        this.rgb1 = 16767411;//основная текстура
        this.rgb2 = 16767411;//внутренняя текстура
        this.rgb3 = 16767411;//внешняя текстура  
    }

    color(rgb1, rgb2, rgb3) {
        this.rgb1 = rgb1;
        this.rgb2 = rgb2;
        this.rgb3 = rgb3;
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

    static naxl() {
        return (2 * winc.dh_frame + 2 * winc.naxl);
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
        super(id, owner, iwin, layout, type, owner.width - Com5t.naxl(), owner.height - Com5t.naxl());

        this.frames = new Map(); //рамы конструкции 

        this.frames.set("BOTT", new Frame(id + '.1', owner, iwin, "BOTT", "STVORKA_SIDE", param));
        this.frames.set("RIGHT", new Frame(id + '.2', owner, iwin, "RIGHT", "STVORKA_SIDE", param));
        this.frames.set("TOP", new Frame(id + '.3', owner, iwin, "TOP", "STVORKA_SIDE", param));
        this.frames.set("LEFT", new Frame(id + '.4', owner, iwin, "LEFT", "STVORKA_SIDE", param));
    }

    paint() {
        this.frames.get("TOP").paint();
        this.frames.get("BOTT").paint();
        this.frames.get("LEFT").paint();
        this.frames.get("RIGHT").paint();
    }
}
//------------------------------------------------------------------------------
export class Cross extends Com5t {

    constructor(id, owner, iwin, layout, type, param) {
        super(id, owner, iwin, layout, type);
    }

    static draw(ctx, owner) {

    }
}
//------------------------------------------------------------------------------
export class Frame extends Com5t {

    constructor(id, owner, iwin, layout, type, param) {
        super(id, owner, iwin, layout, type);

        if (owner.type == "RECTANGL") {
            if ("BOTT" == layout) {
                this.dimension(owner.x1, owner.y2 - winc.dh_frame, owner.x2, owner.y2);
            } else if ("RIGHT" == layout) {
                this.dimension(owner.x2 - winc.dh_frame, owner.y1, owner.x2, owner.y2);
            } else if ("TOP" == layout) {
                this.dimension(owner.x1, owner.y1, owner.x2, owner.y1 + winc.dh_frame);
            } else if ("LEFT" == layout) {
                this.dimension(owner.x1, owner.y1, owner.x1 + winc.dh_frame, owner.y2);
            }
        }
    }

    paint() {
        let dh = winc.dh_frame;
        if (this.owner.type == "RECTANGL") {
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
        color(16776432, 16776432, 16776432);
    }

    static draw(ctx, owner) {

    }
}
//------------------------------------------------------------------------------

