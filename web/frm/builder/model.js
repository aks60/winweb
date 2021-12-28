
import {draw_frame_bott, draw_frame_right, draw_frame_top, draw_frame_left} from './drawing.js';
//------------------------------------------------------------------------------
export class Com5t {
    
    constructor(id, owner, iwin, layout, type, color1, color2, color3) {
        this.id = id;//идентификатор 
        this.owner = owner;//владелец
        this.iwin = iwin;//главный класс калькуляции   
        this.layout = layout;//напрвление расположения
        this.type = type;//тип элемента
        this.color1 = color1;//основная текстура
        this.color2 = color2;//внутренняя текстура
        this.color3 = color3;//внешняя текстура  
    }
}
//------------------------------------------------------------------------------
export class Area extends Com5t {

    childs = new Array(); //список детей   

    constructor(id, owner, iwin, layout, type, color1, color2, color3, width, height) {
        super(id, owner, iwin, layout, type, color1, color2, color3);       
        this.width = width;//ширина area, мм
        this.height = height;//высота area, мм 
    }
}
//------------------------------------------------------------------------------
export class Root extends Area {

    mapFrame = new Map(); //рамы конструкции  

    constructor(id, owner, iwin, layout, type, color1, color2, color3, width, height) {
        super(id, owner, iwin, layout, type, color1, color2, color3, width, height);
    }
}
//------------------------------------------------------------------------------
export class Stvorka extends Area {

    constructor(id, owner, iwin, layout, type, color1, color2, color3, width, height) {
        super(id, owner, iwin, layout, type, color1, color2, color3, width, height);
    }

    draw() {
//     let w = korobka[frame].parent.width;
//     let h = korobka[frame].parent.height;
//     let w2 = (korobka[frame].parent.width - 2 * h2) + 2 * n;
//     let h2 = (korobka[frame].parent.height - 2 * h2) + 2 * n;
//     draw_frame_bott(winc.dh_frame - winc.naxl, h - winc.dh_frame + winc.naxl, w, h);
//     draw_frame_right(w - h2 + n, h, w, h);
//     draw_frame_top(w - h2 + n, 0, w, h);
//     draw_frame_left(h2 - n, 0, w, h);        
    }
}
//------------------------------------------------------------------------------
export class Cross extends Com5t {

    constructor(id, owner, iwin, layout, type, color1, color2, color3) {
        super(id, owner, iwin, layout, type, color1, color2, color3);
    }

    static draw(ctx, owner) {

    }
}
//------------------------------------------------------------------------------
export class Frame extends Com5t {

    constructor(id, owner, iwin, layout, type, color1, color2, color3) {
        super(id, owner, iwin, layout, type, color1, color2, color3);
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

    constructor(id, owner, iwin, layout, type, color1, color2, color3) {
        super(id, owner, iwin, layout, type, color1, color2, color3);
    }

    static draw(ctx, owner) {

    }
}
//------------------------------------------------------------------------------

