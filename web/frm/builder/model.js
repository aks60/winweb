//==============================================================================
import {draw_line, draw_stroke_polygon, draw_full_polygon} from './drawing.js';
//============================  BASE  ==========================================
export class Com5t {

    constructor(obj, owner, winc) {
        this.obj = obj;
        this.id = obj.id;//идентификатор 
        this.owner = owner;//владелец
        this.winc = winc;//главный класс калькуляции   
        this.layout = obj.layout;//напрвление расположения
        this.type = obj.type;//тип элемента
        this.rgb = winc.RGB;
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

    //Точка попадает в контур элемента
    inside(X, Y) {
        if ((this.x2 | this.y2) < 0) {
            return false;
        }
        if (X < this.x1 || Y < this.y1) {
            return false;
        }
        return ((this.x2 >= X) && (this.y2 >= Y));
    }
}
//=================================  AREA  =====================================
export class Area extends Com5t {

    constructor(obj, owner, winc) {
        super(obj, owner, winc);
        this.childs = new Array(0); //список детей 

        if (obj.length == undefined && (owner == null || owner == winc.root)) {
            this.dimension(0, 0, winc.width, winc.height);

        } else {
            let height = (owner.layout == "VERT") ? obj.length : owner.height();
            let width = (owner.layout == "HORIZ") ? obj.length : owner.width();

            if (owner.childs.length == 0) {
                if (owner.layout == "VERT") { //сверху вниз
                    let Y2 = (owner.y1 + height > owner.y2) ? owner.y2 : owner.y1 + height;
                    this.dimension(owner.x1, owner.y1, owner.x2, Y2);

                } else if (owner.layout == "HORIZ") { //слева направо
                    let X2 = (owner.x1 + width > owner.x2) ? owner.x2 : owner.x1 + width;
                    this.dimension(owner.x1, owner.y1, X2, owner.y2);
                }
            } else {
                for (let index = owner.childs.length - 1; index >= 0; --index) { //т.к. this area ёщё не создана начнём с конца
                    if (owner.childs[index] instanceof Area) {
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
//==============================  ROOT  ========================================
export class Root extends Area {

    constructor(obj, owner, winc) {
        super(obj, owner, winc);

        this.frames = new Map(); //рамы конструкции 
    }
}
//==============================  STVORKA  =====================================
export class Stvorka extends Area {

    constructor(obj, owner, winc) {
        super(obj, owner, winc);
        this.frames = new Map(); //рамы конструкции 

        //Коррекция area створки с учётом ширины рамы и нахлёста
        this.dimension(owner.x1 + (this.margin("LEFT") - win.naxl), owner.y1 + (this.margin("TOP") - win.naxl),
                owner.x2 - (this.margin("RIGHT") - win.naxl), owner.y2 - (this.margin("TOP") - win.naxl));

        this.frames.set("BOTT", new Frame(obj, this, winc, this.id + '.1', "BOTT", "STVORKA_SIDE"));
        this.frames.set("RIGHT", new Frame(obj, this, winc, this.id + '.2', "RIGHT", "STVORKA_SIDE"));
        this.frames.set("TOP", new Frame(obj, this, winc, this.id + '.3', "TOP", "STVORKA_SIDE"));
        this.frames.set("LEFT", new Frame(obj, this, winc, this.id + '.4', "LEFT", "STVORKA_SIDE"));

        //Фурнитура створки, ручка, подвес
        if (obj.param != undefined && obj.param.sysfurnID != undefined) {
            this.sysfurn = dbset.find_rec(obj.param.sysfurnID, dbset.sysfurnList);
        } else {
            this.sysfurn = dbset.find2_rec(SYSFUR.systree_id, winc.nuni, dbset.sysfurnList);
        }
        //Сторона открывания
        if (obj.param != undefined && obj.param.typeOpen != undefined) {
            this.typeOpen = obj.param.typeOpen;
        } else {
            this.typeOpen = (this.sysfurn[SYSFUR.side_open] == 1) ? 1 : 2;
        }
    }

    //Отступ створки
    margin(side) {
        if ("BOTT" == side)
            return (this.winc.root.y2 - this.y2 > 200) ? win.dh_crss / 2 : win.dh_frm;
        else if ("RIGHT" == side)
            return (this.winc.root.x2 - this.x2 > 200) ? win.dh_crss / 2 : win.dh_frm;
        else if ("TOP" == side)
            return (this.y1 - this.winc.root.y1 > 200) ? win.dh_crss / 2 : win.dh_frm;
        else if ("LEFT" == side)
            return (this.x1 - this.winc.root.x1 > 200) ? win.dh_crss / 2 : win.dh_frm;
    }

    paint() {
        let DX = 20, DY = 60, X1 = 0, Y1 = 0;
        let elemB = this.frames.get("BOTT");
        let elemR = this.frames.get("RIGHT");
        let elemT = this.frames.get("TOP");
        let elemL = this.frames.get("LEFT");
        elemB.paint();
        elemR.paint();
        elemT.paint();
        elemL.paint();

        if (this.typeOpen == 1 || this.typeOpen == 3) {
            X1 = elemR.x1 + (elemR.x2 - elemR.x1) / 2;
            Y1 = elemR.y1 + (elemR.y2 - elemR.y1) / 2;
            draw_line(this.winc, elemL.x1, elemL.y1, elemR.x2, elemR.y1 + (elemR.y2 - elemR.y1) / 2);
            draw_line(this.winc, elemL.x1, elemL.y2, elemR.x2, elemR.y1 + (elemR.y2 - elemR.y1) / 2);

        } else if (this.typeOpen == 2 || this.typeOpen == 4) {
            X1 = elemL.x1 + (elemL.x2 - elemL.x1) / 2;
            Y1 = elemL.y1 + (elemL.y2 - elemL.y1) / 2;
            draw_line(this.winc, elemR.x2, elemR.y1, elemL.x1, elemL.y1 + (elemL.y2 - elemL.y1) / 2);
            draw_line(this.winc, elemR.x2, elemR.y2, elemL.x1, elemL.y1 + (elemL.y2 - elemL.y1) / 2);
        }

        if (this.winc.root.type == "DOOR") {

        } else {
            draw_stroke_polygon(this.winc, X1 - DX, X1 + DX, X1 + DX, X1 - DX, Y1 - DY, Y1 - DY, Y1 + DY, Y1 + DY, "#FFFFFFFF");
            DX = DX - 12;
            Y1 = Y1 + 20;
        }
    }
}
//==================================  CROSS  ===================================
export class Cross extends Com5t {

    constructor(obj, owner, winc) {
        super(obj, owner, winc);

        if ("ARCH" == owner.type && owner.childs.length == 1) {

        } else if ("TRAPEZE" == owner.type && owner.childs.length == 1) {

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

    paint() {
        if ("VERT" == this.owner.layout) {
            draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.rgb);

        } else if ("HORIZ" == this.owner.layout) {
            draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.rgb);
        }
    }
}
//================================  FRAME  =====================================
export class Frame extends Com5t {

    constructor(obj, owner, winc, id, layout, type) {
        super(obj, owner, winc);
        if (id != undefined) {
            this.id = id;
            this.layout = layout;
            this.type = type;
        }

        if (owner.type == "ARCH") {
            if ("TOP" == this.layout) {
                //this.dimension(owner.x1, owner.y1, owner.x2, owner.y1 + win.dh_frm);            
            } else if ("BOTT" == this.layout) {
                this.dimension(owner.x1, owner.y2 - win.dh_frm, owner.x2, owner.y2);
            } else if ("RIGHT" == this.layout) {
                this.dimension(owner.x2 - win.dh_frm, owner.y1, owner.x2, owner.y2);
            } else if ("LEFT" == this.layout) {
                this.dimension(owner.x1, owner.y1, owner.x1 + win.dh_frm, owner.y2);
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

        if (obj.param != undefined && obj.param.sysprofID != undefined) {
//            let sysprofRec = dbset.find_rec(obj.param.sysprofID, dbset.sysprofList);
//            this.typeOpen = obj.param.typeOpen;
        } else {
//            let sideID = -1;
//            if ("BOTT" == this.layout)
//                sideID = 1;
//            else if ("RIGHT" == this.layout)
//                sideID = 2;
//            else if ("TOP" == this.layout)
//                sideID = 3;
//            else if ("LEFT" == this.layout)
//                sideID = 4;
//
//            let sysprofList = dbset.find_list(this.winc.nuni, dbset.sysprofList, SYSPROF.systree_id);
//            let sysprofList2 = dbset.sysprofList.filter(rec => rec[SYSPROF.systree_id] == this.winc.nuni &&
//                        rec[SYSPROF.use_type] == 1 && (rec[SYSPROF.use_side] == -1 || rec[SYSPROF.use_side] == sideID));
//            sysprofList2.sort();
            //this.typeOpen = (this.sysfurn[SYSFUR.side_open] == 1) ? 1 : 2;
        }
    }

    paint() {
        let dh = win.dh_frm;
        if (this.owner.type == "ARCH") {
            let Y1 = this.winc.height - this.winc.heightAdd;
            if ("TOP" == this.layout) {
                //draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2 - dh, this.x1 + dh, this.y1, this.y1, this.y2, this.y2, this.rgb);
            } else if ("BOTT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1 + dh, this.x2 - dh, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.rgb);
            } else if ("RIGHT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, Y1, Y1, this.y2, this.y2 - dh, this.rgb);
            } else if ("LEFT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, Y1, Y1, this.y2 - dh, this.y2, this.rgb);
            }
        } else {
            if ("BOTT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1 + dh, this.x2 - dh, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.rgb);
            } else if ("RIGHT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1 + dh, this.y1, this.y2, this.y2 - dh, this.rgb);
            } else if ("TOP" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2 - dh, this.x1 + dh, this.y1, this.y1, this.y2, this.y2, this.rgb);
            } else if ("LEFT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1 + dh, this.y2 - dh, this.y2, this.rgb);
            }
        }
    }
}
//================================  GLASS  =====================================
export class Glass extends Com5t {

    constructor(obj, owner, winc) {
        super(obj, owner, winc);
        this.dimension(owner.x1, owner.y1, owner.x2, owner.y2);

        let artdetRec = null;
        if (obj.param != undefined && obj.param.artglasID != undefined) {
            artdetRec = find2_rec(ARTDET.artikl_id, obj.param.artglasID, dbset.artdetList);
        } else {
            let treeRec = dbset.find_rec(winc.nuni, dbset.systreeList); //по умолчанию стеклопакет
            for (let i = 0; i < dbset.artiklList.length; i++) {
                if (treeRec[SYSTREE.glas] == dbset.artiklList[i][ARTIKL.code]) {
                    let artiklRec = dbset.artiklList[i];
                    artdetRec = dbset.find2_rec(ARTDET.artikl_id, artiklRec[ARTIKL.id], dbset.artdetList);
                    break;
                }
            }
        }
        let color_fk = artdetRec[ARTDET.color_fk];
        let colorRec = dbset.find_rec(color_fk, dbset.colorList);
        this.rgb = '#' + colorRec[COLOR.rgb].toString(16);
    }

    paint() {
        if (this.owner.type == "ARCH") {

        } else {
            draw_full_polygon(this.winc, this.owner.x1, this.owner.x2, this.owner.x2,
                    this.owner.x1, this.owner.y1, this.owner.y1, this.owner.y2, this.owner.y2, this.rgb);
        }
    }
}
//==============================================================================

