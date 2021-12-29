
import {draw_frame_bott, draw_frame_right, draw_frame_top, draw_frame_left} from './drawing.js';
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

    static naxl() {
        return (2 * winc.dh_frame + 2 * winc.naxl);
    }
}
//------------------------------------------------------------------------------
export class Area extends Com5t {

    childs = new Array(0); //список детей   

    constructor(id, owner, iwin, layout, type, width, height) {
        super(id, owner, iwin, layout, type);

        if (this.childs.length == 0) {
            if (owner.layout == "VERT") { //сверху вниз
                let Y2 = (owner.y1 + height > owner.y2) ? owner.y2 : owner.y1 + height;
                dimension(owner.x1, owner.y1, owner.x2, Y2);

            } else if (owner.layout == "HORIZ") { //слева направо
                let X2 = (owner.x1 + width > owner.x2) ? owner.x2 : owner.x1 + width;
                dimension(owner.x1, owner.y1, X2, owner.y2);
            }
        } else {
            for (let index = owner.childs.length - 1; index >= 0; --index) { //т.к. this area ёщё не создана начнём с конца
                if (owner.childs[ndex] instanceof Area) {
                    let prevArea = owner.childs[index];

                    if (owner.layout == "VERT") { //сверху вниз                            
                        let Y2 = (prevArea.y2 + height > owner.y2) ? owner.y2 : prevArea.y2 + height;
                        dimension(owner.x1, prevArea.y2, owner.x2, Y2);

                    } else if (owner.layout == "HORIZ") { //слева направо
                        let X2 = (prevArea.x2 + width > owner.x2) ? owner.x2 : prevArea.x2 + width;
                        dimension(prevArea.x2, owner.y1, X2, owner.y2);
                    }
                    break;
                }
            }
        }
    }

}
//------------------------------------------------------------------------------
export class Root extends Area {

    mapFrame = new Map(); //рамы конструкции  

    constructor(id, owner, iwin, layout, type, width, height) {
        super(id, owner, iwin, layout, type, width, height);
    }
}
//------------------------------------------------------------------------------
export class Stvorka extends Area {

    constructor(id, owner, iwin, layout, type, param) {
        super(id, owner, iwin, layout, type, owner.width - Com5t.naxl(), owner.height - Com5t.naxl());
    }

    draw() {
        let w = korobka[frame].parent.width;
        let h = korobka[frame].parent.height;
        let w2 = (korobka[frame].parent.width - 2 * h2) + 2 * n;
        let h2 = (korobka[frame].parent.height - 2 * h2) + 2 * n;
        draw_frame_bott(winc.dh_frame - winc.naxl, h - winc.dh_frame + winc.naxl, w, h);
        draw_frame_right(w - h2 + n, h, w, h);
        draw_frame_top(w - h2 + n, 0, w, h);
        draw_frame_left(h2 - n, 0, w, h);
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
                dimension(owner.x1, owner.y2 - winc.dh_frame, owner.x2, owner.y2);
            } else if ("RIGHT" == layout) {
                dimension(owner.x2 - winc.dh_frame, owner.y1, owner.x2, owner.y2);
            } else if ("TOP" == layout) {
                dimension(owner.x1, owner.y1, owner.x2, owner.y1 + winc.dh_frame);
            } else if ("LEFT" == layout) {
                dimension(owner.x1, owner.y1, owner.x1 + winc.dh_frame, owner.y2);
            }
        }
    }

    paint() {
        if (this.owner.type == "RECTANGL") {
            if ("BOTT" == this.layout) {
                draw_stroke_polygon(this.iwin, this.x1 + dh0, this.x2 - dh1, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.rgb1);
            } else if ("RIGHT" == this.layout) {
                draw_stroke_polygon(this.iwin, this.x1, this.x2, this.x2, this.x1, this.y1 + dh1, this.y1, this.y2, this.y2 - dh0, this.rgb1);
            } else if ("TOP" == this.layout) {
                draw_stroke_polygon(this.iwin, this.x1, this.x2, this.x2 - dh0, this.x1 + dh1, this.y1, this.y1, this.y2, this.y2, this.rgb1);
            } else if ("LEFT" == this.layout) {
                draw_stroke_polygon(this.iwin, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1 + dh0, this.y2 - dh1, this.y2, this.rgb1);
            }
        }
    }

    static draw(ctx, owner) {
        let w = owner.width;
        let h = owner.height;
        draw_frame_bott(ctx, 0, h, w, h);
        draw_frame_right(ctx, w, h, w, h);
        draw_frame_top(ctx, w, 0, w, h);
        draw_frame_left(ctx, 0, 0, w, h);
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

