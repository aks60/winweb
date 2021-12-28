import {draw_frame_bott, draw_frame_right, draw_frame_top, draw_frame_left} from './drawing.js';
//------------------------------------------------------------------------------
export class JsonElem {

    id = -1; //идентификатор
    owner = null; //владелец     
    childs = new Array(); //список детей
    layout = null; //сторона расположения эл. рамы
    type = null; //тип элемента
    param = null; //параметры элемента
    length = null; //ширина или высота добавляемой area (зависит от напрвления расположения) 

    constructor(id, layout, type, paramJson) {
        this.id = id;
        this.layout = layout;
        this.type = type;
        this.param = paramJson; //параметры элемента
    }
}
//------------------------------------------------------------------------------
export class JsonRoot extends JsonElem {

    name = "Конструкция";
    prj = 1; //PNUMB - номер тестируемого проекта, поле пока нужно только для тестов 
    ord = 1; //ONUMB - номер тестируемого заказа, поле пока нужно только для тестов 
    nuni = -3; //nuni профиля (PRO4_SYSPROF.NUNI)
    mapFrame = new Map(); //рамы конструкции
    width = null; //ширина area, мм
    height = null; //высота area, мм    
    heightAdd = 0; //дополнительная высота, мм.
    form = 0; // форма конструкции
    color1 = -3; //основная текстура
    color2 = -3; //внутренняя текстура
    color3 = -3; //внешняя текстура 

    constructor(id, prj, ord, nuni, name, layout, type, width, height, heightAdd, color1, color2, color3, paramJson) {
        super(id, type, paramJson);
        this.prj = prj;
        this.ord = ord;
        this.nuni = nuni;
        this.name = name;
        this.layout = layout;
        this.type = type;
        this.width = width;
        this.height = height;
        this.heightAdd = heightAdd;
        this.length = null;
        this.color1 = color1;
        this.color2 = color2;
        this.color3 = color3;
        this.param = paramJson;
    }
}
//------------------------------------------------------------------------------
export class Stvorka {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }
    draw() {
//                let w = korobka[frame].parent.width;
//                let h = korobka[frame].parent.height;
//                let w2 = (korobka[frame].parent.width - 2 * h2) + 2 * n;
//                let h2 = (korobka[frame].parent.height - 2 * h2) + 2 * n;
//                draw_frame_bott(winc.dh_frame - winc.naxl, h - winc.dh_frame + winc.naxl, w, h);
//                draw_frame_right(w - h2 + n, h, w, h);
//                draw_frame_top(w - h2 + n, 0, w, h);
//                draw_frame_left(h2 - n, 0, w, h);        
    }
}
//------------------------------------------------------------------------------
export class ElemCross {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }
}
//------------------------------------------------------------------------------
export class ElemFrame {

    owner = null;
    id = -1;
    layout = null;
    param = null;

    constructor(rootArea, id, layout, param) {
        this.owner = rootArea;
        this.id = id;
        this.layout = layout;
        this.param = param;
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
export class ElemGlass {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }
}
//------------------------------------------------------------------------------

