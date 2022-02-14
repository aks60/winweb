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

        this.sysfurnRec = dbset.sysfurnList.virtualRec; //фурнитура створки
        this.handleRec = dbset.artiklList.virtualRec;   //ручка       
        this.loopRec = dbset.artiklList.virtualRec;     //подвес (петли)
        this.lockRec = dbset.artiklList.virtualRec;     //замок
        this.handleColor = -3;
        this.loopColor = -3;
        this.lockColor = -3;
        this.typeOpen = 0;

        this.init_constructiv();
    }

    init_constructiv() {
        //Фурнитура створки
        if (this.obj.param != undefined && this.obj.param.sysfurnID != undefined) {
            this.sysfurnRec = dbset.sysfurnList.find(rec => this.obj.param.sysfurnID == rec[SYSFURN.id]);
        }
        if (this.sysfurnRec == undefined) {
            this.sysfurnRec = dbset.sysfurnList.find(rec => rec[SYSFURN.systree_id] == this.winc.nuni); //ищем первую в системе
        }
        //Ручка
        if (this.obj.param != undefined && this.obj.param.artiklHandl != undefined) {
            this.handleRec = this.obj.param.artiklHandl;
            //Ручка по умолчанию
        } else if (this.sysfurnRec != undefined) {
            this.handleRec = dbset.artiklList.find(rec => this.sysfurnRec[SYSFURN.artikl_id1] == rec[ARTIKL.id]);
        }
        //Текстура ручки
        if (this.obj.param != undefined && this.obj.param.colorHandl != undefined) {
            this.handleColor = this.obj.param.colorHandl;
        } else if (this.handleRec != undefined) {
            let colorRec = dbset.find(this.handleRec[ARTIKL.id], dbset.artdetList);
            this.handleColor = colorRec[ARTDET.color_fk];
            if (this.handleColor < 0) {
                this.handleColor = dbset.find(-1 * this.handleColor, dbset.colorList)[0]; //первый цвет в группе
            }
        }
        //Подвес (петли)
        if (this.obj.param != undefined && this.obj.param.artiklLoop != undefined) {
            this.loopRec = dbset.find(this.obj.param.artiklLoop, dbset.artiklList);
        }
        //Текстура подвеса
        if (this.obj.param != undefined && this.obj.param.colorLoop != undefined) {
            this.loopColor = this.obj.param.colorLoop;
        }
        //Замок
        if (this.obj.param != undefined && this.obj.param.artiklLock != undefined) {
            this.lockRec = this.obj.param.artiklLock;
        }
        //Текстура замка
        if (this.obj.param != undefined && this.obj.param.colorLock != undefined) {
            this.lockColor = this.obj.param.colorLock;
        }
        //Сторона открывания
        if (this.obj.param != undefined && this.obj.param.typeOpen != undefined) {
            this.typeOpen = this.obj.param.typeOpen;
        } else if (this.sysfurnRec != undefined) {
            this.typeOpen = (this.sysfurnRec[SYSFURN.side_open] == 1) ? 1 : 2;
        }
        //Положение или высота ручки на створке
        if (this.obj.param != undefined && this.obj.param.positionHandl != undefined) {
            let position = this.obj.param.positionHandl;
            if (position == 3) { //VARIAT.id
                this.handleLayout = 'VARIAT';
                this.handleHeight = this.obj.param.heightHandl;
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
        this.layout = (owner.layout == 'VERT') ? 'HORIZ' : 'VERT';

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

        this.init_constructiv();
    }

    init_constructiv() {

        if (this.obj.param != undefined && this.obj.param.sysprofID != undefined) {
            this.sysprofRec = dbset.find(this.obj.param.sysprofID, dbset.sysprofList);

        }
        if (this.sysprofRec == undefined) {
            if ("VERT" == this.layout) { //сверху вниз
                this.sysprofRec = this.find_first(this.winc.nuni, Type[this.type][1], UseSide.HORIZ[0]);

            } else if ("HORIZ" == this.layout) { //слева направо
                this.sysprofRec = this.find_first(this.winc.nuni, Type[this.type][1], UseSide.VERT[0]);
            }
        }
        this.artiklRec = dbset.find(this.sysprofRec[SYSPROF.artikl_id], dbset.artiklList);
        this.artiklAn = dbset.find(this.artiklRec[ARTIKL.analog_id], dbset.artiklList);
        if (this.artiklAn == undefined) {
            this.artiklAn = this.artiklRec;
        }
    }

    find_first(nuni, typ, us1) {
        let record = dbset.sysprofList.find(rec => nuni == rec[SYSPROF.systree_id]
                    && rec[SYSPROF.use_type] == typ && UseSide.MANUAL[0] != rec[SYSPROF.use_side]
                    && (us1 == rec[SYSPROF.use_side] || UseSide.ANY[0] == rec[SYSPROF.use_side]));
        if (nuni == -3 || record == undefined) {
            return [-3, 0, typ, -1, -3, -3];
        }
        return record;
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

        this.init_constructiv();
    }

    init_constructiv() {


        if (this.type == "STVORKA_SIDE") {
            let sideLayout = ["", "stvorkaBottom", "stvorkaRight", "stvorkaTop", "stvorkaLeft"][Layout[this.layout][0]];
            if (this.obj.param != undefined && this.obj.param[sideLayout] != undefined
                    && this.obj.param[sideLayout]['sysprofID'] != undefined) {
                this.sysprofRec = this.obj.param[sideLayout]['sysprofID'];
            }
        } else {
            if (this.obj.param != undefined && this.obj.param.sysprofID != undefined) {
                this.sysprofRec = dbset.find(this.obj.param.sysprofID, dbset.sysprofList);
            }            
        }
        if (this.sysprofRec == undefined) {
            if ('BOTT' == this.layout) {
                this.sysprofRec = this.find_first(this.winc.nuni, Type[this.type][1], UseSide['BOT'][0], UseSide['HORIZ'][0]);
            } else if ('RIGHT' == this.layout) {
                this.sysprofRec = this.find_first(this.winc.nuni, Type[this.type][1], UseSide['RIGHT'][0], UseSide['VERT'][0]);
            } else if ('TOP' == this.layout) {
                this.sysprofRec = this.find_first(this.winc.nuni, Type[this.type][1], UseSide['TOP'][0], UseSide['HORIZ'][0]);
            } else if ('LEFT' == this.layout) {
                this.sysprofRec = this.find_first(this.winc.nuni, Type[this.type][1], UseSide['LEFT'][0], UseSide['VERT'][0]);
            }
        }
        this.artiklRec = dbset.artiklList.find(el => el[ARTIKL.id] == this.sysprofRec[SYSPROF.artikl_id]);
        this.artiklAn = dbset.artiklList.find(el => el[ARTIKL.id] == this.artiklRec[ARTIKL.analog_id]);
        if (this.artiklAn == undefined) {
            this.artiklAn = this.artiklRec;
        }
    }

    find_first(nuni, typ, us1, us2) {
        let record = dbset.sysprofList.find(rec => nuni == rec[SYSPROF.systree_id] && typ == rec[SYSPROF.use_type] && 0 != rec[SYSPROF.use_side]
                    && (us1 == rec[SYSPROF.use_side] || us2 == rec[SYSPROF.use_side] || UseSide.ANY[0] == rec[SYSPROF.use_side]));
        if (nuni == -3 || record == undefined) {
            return [-3, 0, typ, -1, -3, -3];
        }
        return record;
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
            this.artiklRec = dbset.artiklList.find(rec => obj.param.artglasID == rec[ARTIKL.id]);
        }
        if (this.artiklRec == undefined) {
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

