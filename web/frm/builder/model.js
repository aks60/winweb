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
        this.rgb1 = winc.rgb1;
        this.rgb2 = winc.rgb2;
        this.rgb3 = winc.rgb3;
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

        //Фурнитура створки
        if (obj.param != undefined && obj.param.sysfurnID != undefined) {
            this.sysfurnRec = dbset.sysfurnList.find(rec => obj.param.sysfurnID == rec[SYSFURN.id]);
        } else {
            this.sysfurnRec = dbset.sysfurnList.find(rec => rec[SYSFURN.systree_id] == winc.nuni); //ищем первую в системе
        }
        //Ручка
        if (obj.param != undefined && obj.param.artiklHandl != undefined) {
            this.handleRec = obj.param.artiklHandl;
            //Ручка по умолчанию
        } else  if(this.sysfurnRec != undefined) {
            this.handleRec = dbset.artiklList.find(rec => this.sysfurnRec[SYSFURN.artikl_id1] == rec[ARTIKL.id]);
        }
        //Текстура ручки
        if (obj.param != undefined && obj.param.colorHandl != undefined) {
            this.handleColor = obj.param.colorHandl;
        } else if(this.handleRec != undefined) {
            let colorRec = dbset.artdetList.find(rec => this.handleRec[ARTIKL.id] == rec[ARTDET.artikl_id]);
            this.handleColor = colorRec[ARTDET.color_fk];
            if (this.handleColor < 0) {
                this.handleColor = dbset.colorList.find(rec => -1 * colorFK == rec[COLOR.colgrp_id])[0]; //первый цвет в группе
            }
        }
        //Подвес (петли)
        if (obj.param != undefined && obj.param.artiklLoop != undefined) {
            //this.loopRec = obj.param.artiklLoop;
            loopRec = dbset.artiklList.find(rec  => obj.param.artiklLoop == rec[ARTIKL.id]);
        }
        //Текстура подвеса
        if (obj.param != undefined && obj.param.colorLoop != undefined) {
            this.loopColor = obj.param.colorLoop;
        }
        //Замок
        if (obj.param != undefined && obj.param.artiklLock != undefined) {
            this.lockRec = obj.param.artiklLock;
        }
        //Текстура замка
        if (obj.param != undefined && obj.param.colorLock != undefined) {
            this.lockColor = obj.param.colorLock;
        }
        //Сторона открывания
        if (obj.param != undefined && obj.param.typeOpen != undefined) {
            this.typeOpen = obj.param.typeOpen;
        } else if (this.sysfurnRec != undefined) {
            this.typeOpen = (this.sysfurnRec[SYSFURN.side_open] == 1) ? 1 : 2;
        }
        //Положение или высота ручки на створке
        if (obj.param != undefined && obj.param.positionHandl != undefined) {
            let position = obj.param.positionHandl;
            if (position == 3) { //VARIAT.id
                this.handleLayout = 'VARIAT';
                this.handleHeight = obj.param.heightHandl;
            } else {
                this.handleLayout = (this.position == 'MIDL') ? 'MIDL' : 'CONST';
                this.handleHeight = this.frames.get("LEFT").height() / 2;

            }
        } else if (this.sysfurnRec != undefined && this.sysfurnRec[SYSFURN.hand_pos] == 1) {  //MIDL.id
            this.handleLayout = 'MIDL';
            this.handleHeight = this.frames.get("LEFT").height() / 2;
        } else if (this.sysfurnRec != undefined && this.sysfurnRec[SYSFURN.hand_pos] == 2) {    //CONST.id) {
            this.handleLayout = 'CONST';
            this.handleHeight = this.frames.get("LEFT").height() / 2;
        } else if (this.sysfurnRec != undefined && this.sysfurnRec[SYSFURN.hand_pos] == 3) {    //VARIAT.id) {
            this.handleLayout = 'VARIAT';
            this.handleHeight = this.frames.get("LEFT").height() / 2;
        } else {
            this.handleLayout = 'MIDL'; //по умолчанию
            this.handleHeight = this.frames.get("LEFT").height() / 2;
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
        let DX = 16, DY = 60, X1 = 0, Y1 = 0;
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
            draw_stroke_polygon(this.winc, X1 - DX, X1 + DX, X1 + DX, X1 - DX, Y1 - DY, Y1 - DY, Y1 + DY, Y1 + DY, this.rgb2);
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

        if (obj.param != undefined && obj.param.sysprofID != undefined) {
            let sysprofRec = dbset.find_rec(obj.param.sysprofID, dbset.sysprofList);
            this.artiklRec = dbset.artiklList.find(el => el[ARTIKL.id] == sysprofRec[SYSPROF.artikl_id]);

        } else {
            let sideID = -1;
            if ("HORIZ" == this.layout) {
                sideID = -2;
            } else if ("VERT" == this.layout) {
                sideID = -3;
            }
            let sysprofList = dbset.sysprofList.filter(rec => rec[SYSPROF.systree_id] == this.winc.nuni &&
                        rec[SYSPROF.use_type] == 1 && (rec[SYSPROF.use_side] == -1 || rec[SYSPROF.use_side] == sideID));
            sysprofList.sort((a, b) => a[SYSPROF.prio] - b[SYSPROF.prio]);
            let sysprofRec = sysprofList[0];
            this.artiklRec = dbset.artiklList.find(el => el[ARTIKL.id] == sysprofRec[SYSPROF.artikl_id]);
        }
    }

    paint() {
        if ("VERT" == this.owner.layout) {
            draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.rgb2);

        } else if ("HORIZ" == this.owner.layout) {
            draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.rgb2);
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
            let sysprofRec = dbset.find_rec(obj.param.sysprofID, dbset.sysprofList);
            this.artiklRec = dbset.artiklList.find(el => el[ARTIKL.id] == sysprofRec[SYSPROF.artikl_id]);
            this.artiklAn = dbset.artiklList.find(el => el[ARTIKL.id] == this.artiklRec[ARTIKL.analog_id]);
            if (this.artiklAn == undefined) {
                this.artiklAn = this.artiklRec;
            }

        } else {
            let sideID = -1;
            if ("BOTT" == this.layout) {
                sideID = 1;
            } else if ("RIGHT" == this.layout) {
                sideID = 2;
            } else if ("TOP" == this.layout) {
                sideID = 3;
            } else if ("LEFT" == this.layout) {
                sideID = 4;
            }
            let sysprofList = dbset.sysprofList.filter(rec => rec[SYSPROF.systree_id] == this.winc.nuni &&
                        rec[SYSPROF.use_type] == 1 && (rec[SYSPROF.use_side] == -1 || rec[SYSPROF.use_side] == sideID));
            sysprofList.sort((a, b) => a[SYSPROF.prio] - b[SYSPROF.prio]);
            let sysprofRec = sysprofList[0];
            this.artiklRec = dbset.artiklList.find(el => el[ARTIKL.id] == sysprofRec[SYSPROF.artikl_id]);
            this.artiklAn = dbset.artiklList.find(el => el[ARTIKL.id] == this.artiklRec[ARTIKL.analog_id]);
            if (this.artiklAn == undefined) {
                this.artiklAn = this.artiklRec;
            }
        }
    }

    paint() {
        let dh = win.dh_frm;
        if (this.owner.type == "ARCH") {
            let Y1 = this.winc.height - this.winc.heightAdd;
            if ("TOP" == this.layout) {
                //draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2 - dh, this.x1 + dh, this.y1, this.y1, this.y2, this.y2, this.rgb2);
            } else if ("BOTT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1 + dh, this.x2 - dh, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.rgb2);
            } else if ("RIGHT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, Y1, Y1, this.y2, this.y2 - dh, this.rgb2);
            } else if ("LEFT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, Y1, Y1, this.y2 - dh, this.y2, this.rgb2);
            }
        } else {
            if ("BOTT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1 + dh, this.x2 - dh, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.rgb2);
            } else if ("RIGHT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1 + dh, this.y1, this.y2, this.y2 - dh, this.rgb2);
            } else if ("TOP" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2 - dh, this.x1 + dh, this.y1, this.y1, this.y2, this.y2, this.rgb2);
            } else if ("LEFT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1 + dh, this.y2 - dh, this.y2, this.rgb2);
            }
        }
    }
}
//================================  GLASS  =====================================
export class Glass extends Com5t {

    constructor(obj, owner, winc) {
        super(obj, owner, winc);
        this.dimension(owner.x1, owner.y1, owner.x2, owner.y2);


        if (obj.param != undefined && obj.param.artglasID != undefined) {
            this.artiklRec = dbset.artiklList.find(rec => obj.param.artglasID == rec[ARTIKL.code]);
        } else {
            let systreeRec = dbset.systreeList.find(rec => winc.nuni == rec[SYSTREE.id]); //по умолчанию стеклопакет
            this.artiklRec = dbset.artiklList.find(rec => systreeRec[SYSTREE.glas] == rec[ARTIKL.code]);
        }
        let artdetRec = dbset.artdetList.find(rec => this.artiklRec[ARTIKL.id] == rec[ARTDET.artikl_id]);
        let color_fk = artdetRec[ARTDET.color_fk];
        this.rgb1 = dbset.colorList.find(rec => color_fk == rec[COLOR.id]);
    }

    paint() {
        if (this.owner.type == "ARCH") {

        } else {
            draw_full_polygon(this.winc, this.owner.x1, this.owner.x2, this.owner.x2,
                    this.owner.x1, this.owner.y1, this.owner.y1, this.owner.y2, this.owner.y2, this.rgb1);
        }
    }
}
//==============================================================================

