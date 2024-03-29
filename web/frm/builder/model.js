//------------------------------------------------------------------------------
import {draw_line, draw_stroke_polygon, draw_full_polygon, draw_full_arc} from './drawing.js';
//------------------------------------------------------------------------------
export class Com5t {

    constructor(obj, owner, winc) {
        this.obj = obj;
        this.id = obj.id;//идентификатор 
        this.owner = owner;//владелец
        this.winc = winc;//главный класс калькуляции   
        this.layout = obj.layout;//напрвление расположения
        this.type = obj.type;//тип элемента
        this.color1Rec = winc.color1Rec;
        this.color2Rec = winc.color2Rec;
        this.color3Rec = winc.color3Rec;
    }

    dimension(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    //Форма компонента
    typeForm() {
        return this.type;
    }

    get width() {
        return (this.x2 > this.x1) ? this.x2 - this.x1 : this.x1 - this.x2;
    }

    get height() {
        return (this.y2 > this.y1) ? this.y2 - this.y1 : this.y1 - this.y2;
    }

    get lengthX() {
        return (this.id === 0) ? this.winc.width(obj) : this.obj.length;
    }

    get lengthY() {
        return (this.id === 0) ? this.obj.height : this.obj.length;
    }

    //Изменение размера
    set lengthX(v) {

        if (this.id == 0) {
            var k = v / this.obj.width; //коэффициент
            this.obj.width = v;
            this.winc.areaList.forEach(e => {
                if (e.layout == 'HORIZ') {
                    e.childs.forEach(e2 => { //изменение всех по ширине
                        e2.obj.length = k * e2.obj.length;
                    });
                }
            });
        } else {
            let k = v / this.obj.length; //коэффициент
            this.obj.length = v;
            this.childs.forEach(e => {
                if (e.owner.layout == 'HORIZ' && (e.typeForm() == 'AREA' || e.typeForm() == 'STVORKA')) {
                    e.lengthX = k * e.lengthX; //рекурсия изменение детей

                } else if (e.childs != null) {
                    e.childs.forEach(e2 => {
                        if (e2.owner.layout == 'HORIZ' && (e2.typeForm() == 'AREA' || e2.typeForm() == 'STVORKA')) {
                            e2.lengthX = k * e2.lengthX; //рекурсия изменение детей
                        }
                    });
                }
            });
        }
    }

    //Изменение размера
    set lengthY(v) {

        if (this.id == 0) {
            var k = v / this.obj.height; //коэффициент
            this.obj.height = v;
            this.obj.heightAdd = k * this.obj.heightAdd;
            this.winc.areaList.forEach(e => {
                if (e.layout == 'VERT') {
                    e.childs.forEach(e2 => { //изменение всех по высоте
                        e2.obj.length = k * e2.obj.length;
                    });
                }
            });
        } else {
            let k = v / this.obj.length; //коэффициент            
            this.obj.length = v;
            if (this.typeForm() == 'ARCH' || this.typeForm() == 'TRAPEZE') {
                this.winc.obj.heightAdd = this.winc.obj.height - v;
            }
            this.childs.forEach(e => {
                if (e.owner.layout == 'VERT' && (e.typeForm() == 'AREA' || e.typeForm() == 'STVORKA')) {
                    e.lengthY = k * e.lengthY; //рекурсия изменение детей

                } else if (e.childs != null) {
                    e.childs.forEach(e2 => {
                        if (e2.owner.layout == 'VERT' && (e2.typeForm() == 'AREA' || e2.typeForm() == 'STVORKA')) {
                            e2.lengthY = k * e2.lengthY; //рекурсия изменение детей
                        }
                    });
                }
            });
        }
    }

    //Точка попадает в контур элемента
    inside(X, Y)
    {
        if ((this.x2 | this.y2) < 0) {
            return false;
        }
        if (X < this.x1 || Y < this.y1) {
            return false;
        }
        return ((this.x2 >= X) && (this.y2 >= Y));
    }
}
//------------------------------------------------------------------------------
export class Area extends Com5t {

    constructor(obj, owner, winc) {
        super(obj, owner, winc);
        if (obj.form != undefined) {
            this.form = obj.form;
        }

        this.childs = new Array(0); //список детей 

        //Коробка
        if (obj.length == undefined && (owner == null || owner == winc.root)) {
            this.dimension(0, 0, winc.width(), winc.height());

            //Створка
        } else if (this.typeForm() == 'STVORKA') {
            this.dimension(owner.x1, owner.y1, owner.x2, owner.y2);

            //Аrеа
        } else {
            let height = (owner.layout == "VERT") ? obj.length : owner.height;
            let width = (owner.layout == "HORIZ") ? obj.length : owner.width;

            if (owner.childs.length == 0) { //если owner.childs.length == 0 то prevArea искать нет смысла
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

    //Форма контура
    typeForm() {
        if (this.id != 0 && this.form != undefined) {
            return this.winc.root.type;
        }
        return this.type;
    }

    lineCross(cross) {
        let arr = [];
        this.winc.elemList.forEach(e => {
            if (e.id == cross.id) {
                e.owner.childs.forEach((e2, i) => {
                    if (e2.id == cross.id)
                        arr = [e.owner.childs[i - 1], e.owner.childs[i + 1]];
                });
            }
        });
        return arr;
    }
}
//------------------------------------------------------------------------------
export class Root extends Area {

    constructor(obj, owner, winc) {
        super(obj, owner, winc);
        this.frames = new Map(); //рамы конструкции 
        this.pardefMap = new Map(); //параметры по умолчанию   

        //Радиус
        if (this.typeForm() == "ARCH") {
            let dh = win.dh_frm;
            let h = winc.height1 - winc.height2;
            let w = winc.width();
            this.radiusArch = (Math.pow(w / 2, 2) + Math.pow(h, 2)) / (2 * h);  //R = (L2 + H2) / 2H - радиус арки        
        }

        //Параметр
        for (let syspar1Rec of dbset.syspar1List) {
            if (winc.nuni == syspar1Rec[SYSPAR1.systree_id]) {
                this.pardefMap.set(syspar1Rec[SYSPAR1.params_id], syspar1Rec);
            }
        }
        this.init_pardef_map();
    }

    //Параметр
    init_pardef_map() {
        if (this.obj.param != undefined) {
            if (this.obj.param.ioknaParam != undefined) {
                //Накладываем к параметрам системы конструкции параметры конкретной конструкции
                let groupArr = this.obj.param.ioknaParam;
                for (let group of groupArr) {
                    let paramsRec = dbset.paramsList.find(rec => group == rec[PARAMS.id]);
                    let syspar1Rec = this.pardefMap.get(paramsRec[PARAMS.params_id]);
                    syspar1Rec[SYSPAR1.text] = paramsRec[PARAMS.text];
                }
            }
        }
    }
}
//------------------------------------------------------------------------------
export class Stvorka extends Area {

    constructor(obj, owner, winc) {
        super(obj, owner, winc);

        this.frames = new Map(); //рамы конструкции 

        //Коррекция area створки с учётом ширины рамы и нахлёста
        this.dimension(owner.x1 + (this.margin("LEFT") - win.naxl), owner.y1 + (this.margin("TOP") - win.naxl),
                owner.x2 - (this.margin("RIGHT") - win.naxl), owner.y2 - (this.margin("BOTT") - win.naxl));

        this.frames.set("BOTT", new Frame(obj, this, winc, this.param('stvorkaBottom'), this.id + '.1', "BOTT", "STVORKA_SIDE"));
        this.frames.set("RIGHT", new Frame(obj, this, winc, this.param('stvorkaRight'), this.id + '.2', "RIGHT", "STVORKA_SIDE"));
        this.frames.set("TOP", new Frame(obj, this, winc, this.param('stvorkaTop'), this.id + '.3', "TOP", "STVORKA_SIDE"));
        this.frames.set("LEFT", new Frame(obj, this, winc, this.param('stvorkaLeft'), this.id + '.4', "LEFT", "STVORKA_SIDE"));

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
        if (this.obj.param != undefined && this.obj.param.sysfurnID != undefined)
            this.sysfurnRec = dbset.sysfurnList.find(rec => this.obj.param.sysfurnID == rec[SYSFURN.id]); //по параметру
        if (this.sysfurnRec == undefined)
            this.sysfurnRec = findef(dbset.sysfurnList.find(rec => rec[SYSFURN.systree_id] == this.winc.nuni), dbset.sysfurnList); //ищем первую в системе

        //Ручка
        if (this.obj.param != undefined && this.obj.param.artiklHandl != undefined)
            this.handleRec = this.obj.param.artiklHandl; //по параметру
        else if (this.sysfurnRec != undefined)
            this.handleRec = findef(dbset.artiklList.find(rec =>
                this.sysfurnRec[SYSFURN.artikl_id1] == rec[ARTIKL.id]), dbset.artiklList); //ручка по умолчанию см. систему

        //Текстура ручки
        if (this.obj.param != undefined && this.obj.param.colorHandl != undefined)
            this.handleColor = this.obj.param.colorHandl; //по параметру
        else if (this.handleRec != undefined) {
            this.handleColor = findef(dbset.artdetList.find(rec =>
                this.handleRec[ARTIKL.id] == rec[ARTDET.artikl_id]), dbset.artdetList)[ARTDET.color_fk]; //первая запись
            if (this.handleColor < 0)
                this.handleColor = findef(dbset.colorList.find(rec =>
                    (-1 * this.handleColor) == rec[COLOR.id]), dbset.colorList)[COLOR.id]; //первый цвет в группе
        }

        //Подвес (петли)
        if (this.obj.param != undefined && this.obj.param.artiklLoop != undefined)
            this.loopRec = findef(dbset.artiklList.find(rec => this.obj.param.artiklLoop == rec[ARTIKL.id]), dbset.artiklList);

        //Текстура подвеса
        if (this.obj.param != undefined && this.obj.param.colorLoop != undefined)
            this.loopColor = this.obj.param.colorLoop;

        //Замок
        if (this.obj.param != undefined && this.obj.param.artiklLock != undefined)
            this.lockRec = findef(dbset.artiklList.find(rec => this.obj.param.artiklLock == rec[ARTIKL.id]), dbset.artiklList);

        //Текстура замка
        if (this.obj.param != undefined && this.obj.param.colorLock != undefined)
            this.lockColor = this.obj.param.colorLock;

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
                this.handleHeight = this.frames.get("LEFT").height / 2;

            }
        } else if (this.sysfurnRec != undefined && this.sysfurnRec[SYSFURN.hand_pos] == 1) {  //MIDL.id
            this.handleLayout = 'MIDL';
            this.handleHeight = this.frames.get("LEFT").height / 2;
        } else if (this.sysfurnRec != undefined && this.sysfurnRec[SYSFURN.hand_pos] == 2) {    //CONST.id) {
            this.handleLayout = 'CONST';
            this.handleHeight = this.frames.get("LEFT").height / 2;
        } else if (this.sysfurnRec != undefined && this.sysfurnRec[SYSFURN.hand_pos] == 3) {    //VARIAT.id) {
            this.handleLayout = 'VARIAT';
            this.handleHeight = this.frames.get("LEFT").height / 2;
        } else {
            this.handleLayout = 'MIDL'; //по умолчанию
            this.handleHeight = this.frames.get("LEFT").height / 2;
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

    param(side) {

        if (this.obj.param != undefined && this.obj.param[side] != undefined)
            return this.obj.param[side];
        else
            return undefined;
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
        if (this.typeOpen == 3 || this.typeOpen == 4) {
            draw_line(this.winc, elemT.x1 + (elemT.x2 - elemT.x1) / 2, elemT.y1, elemB.x1, elemB.y2);
            draw_line(this.winc, elemT.x1 + (elemT.x2 - elemT.x1) / 2, elemT.y1, elemB.x2, elemB.y2);
        }

        if (this.winc.root.typeForm() == "DOOR") {

        } else {
            let handlRGB = findef(dbset.colorList.find(rec => this.handleColor == rec[COLOR.id]), dbset.colorList);
            draw_stroke_polygon(this.winc, X1 - DX, X1 + DX, X1 + DX, X1 - DX, Y1 - DY, Y1 - DY, Y1 + DY, Y1 + DY, handlRGB);
            DX = DX - 12;
            Y1 = Y1 + 20;
        }
    }
}
//------------------------------------------------------------------------------
export class Cross extends Com5t {

    constructor(obj, owner, winc) {
        super(obj, owner, winc);
        this.layout = (owner.layout == 'VERT') ? 'HORIZ' : 'VERT';
        this.anglCut = [90, 90]; //угол реза

        this.init_constructiv(this.obj.param);
        this.set_location(obj, owner, winc);
    }

    init_constructiv(param) {
        this.color1Rec = (param != undefined && param.colorID1 != undefined) ? findef(dbset.colorList.find(rec => param.colorID1 == rec[COLOR.id]), dbset.colorList) : this.winc.color1Rec;
        this.color2Rec = (param != undefined && param.colorID2 != undefined) ? findef(dbset.colorList.find(rec => param.colorID2 == rec[COLOR.id]), dbset.colorList) : this.winc.color2Rec;
        this.color3Rec = (param != undefined && param.colorID3 != undefined) ? findef(dbset.colorList.find(rec => param.colorID3 == rec[COLOR.id]), dbset.colorList) : this.winc.color3Rec;

        //Профиль поперечины
        if (this.obj.param != undefined && this.obj.param.sysprofID != undefined)
            this.sysprofRec = this.obj.param.sysprofID;

        else {
            if ("VERT" == this.layout) { //сверху вниз
                this.sysprofRec = this.find_first(this.winc.nuni, Type[this.type][1], UseSide.HORIZ[0]);

            } else if ("HORIZ" == this.layout) { //слева направо
                this.sysprofRec = this.find_first(this.winc.nuni, Type[this.type][1], UseSide.VERT[0]);
            }
        }
        this.artiklRec = findef(dbset.artiklList.find(rec => this.sysprofRec[SYSPROF.artikl_id] == rec[ARTIKL.id]), dbset.artiklList);
        this.artiklAn = findef(dbset.artiklList.find(rec => this.artiklRec[ARTIKL.analog_id] == rec[ARTIKL.id]), dbset.artiklList);
        if (this.artiklAn == undefined) {
            this.artiklAn = this.artiklRec;
        }
    }

    set_location(obj, owner, winc) {

        //Коррекция положения импоста арки (подкдадка ареа над импостом)
        if ("ARCH" == owner.typeForm()) {
            let prevArea = owner.childs[0];
            prevArea.y2 = prevArea.y2 + win.dh_crss / 2;

        } else if ("TRAPEZE" == owner.typeForm()) {
            let prevArea = owner.childs[0];
            if (winc.form == 'RIGHT') {
                let angl = winc.root.frames.get('RIGHT').anglCut[1];
                var dy = win.dh_frm * Math.tan(Math.toRadians(90 - angl));
            }
            prevArea.dimension(prevArea.x1, prevArea.y1, prevArea.x2, prevArea.y2 + (win.dh_crss / 2) + dy);
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

    find_first(nuni, typ, us1) {
        let record = dbset.sysprofList.find(rec => nuni == rec[SYSPROF.systree_id]
                    && rec[SYSPROF.use_type] == typ && UseSide.MANUAL[0] != rec[SYSPROF.use_side]
                    && (us1 == rec[SYSPROF.use_side] || UseSide.ANY[0] == rec[SYSPROF.use_side]));
        if (nuni == -3 || record == undefined) {
            return dbset.sysprofList.virtualRec; //[-3, 0, typ, -1, -3, -3];
        }
        return record;
    }

    paint() {
        if ("VERT" == this.owner.layout) {
            draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.color2Rec);

        } else if ("HORIZ" == this.owner.layout) {
            draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.color2Rec);
        }
    }
}
//------------------------------------------------------------------------------
export class Frame extends Com5t {

    constructor(obj, owner, winc, param, id, layout, type) {
        super(obj, owner, winc);
        this.anglCut = [45, 45]; //угол реза
        if (id != undefined) { //если сторона створки
            this.id = id;      //дополнительные параметры
            this.layout = layout;
            this.type = type;
        }

        this.init_constructiv(param);
        this.set_location(obj, owner, winc, param, id, layout, type);
    }

    init_constructiv(param) {
        this.color1Rec = (param != undefined && param.colorID1 != undefined) ? findef(dbset.colorList.find(rec => param.colorID1 == rec[COLOR.id]), dbset.colorList) : this.winc.color1Rec;
        this.color2Rec = (param != undefined && param.colorID2 != undefined) ? findef(dbset.colorList.find(rec => param.colorID2 == rec[COLOR.id]), dbset.colorList) : this.winc.color2Rec;
        this.color3Rec = (param != undefined && param.colorID3 != undefined) ? findef(dbset.colorList.find(rec => param.colorID3 == rec[COLOR.id]), dbset.colorList) : this.winc.color3Rec;

        if (param != undefined && param.sysprofID != undefined)
            this.sysprofID = param.sysprofID; //сист.профиль

        else { //профиль по умолчанию
            if ('BOTT' == this.layout)
                this.sysprofID = this.find_first(this.winc.nuni, Type[this.type][1], UseSide['BOTT'][0], UseSide['HORIZ'][0])[SYSPROF.id];
            else if ('RIGHT' == this.layout)
                this.sysprofID = this.find_first(this.winc.nuni, Type[this.type][1], UseSide['RIGHT'][0], UseSide['VERT'][0])[SYSPROF.id];
            else if ('TOP' == this.layout)
                this.sysprofID = this.find_first(this.winc.nuni, Type[this.type][1], UseSide['TOP'][0], UseSide['HORIZ'][0])[SYSPROF.id];
            else if ('LEFT' == this.layout)
                this.sysprofID = this.find_first(this.winc.nuni, Type[this.type][1], UseSide['LEFT'][0], UseSide['VERT'][0])[SYSPROF.id];

        }
        this.sysprofRec = findef(dbset.sysprofList.find(rec => this.sysprofID == rec[SYSPROF.id]), dbset.sysprofList);
        this.artiklRec = findef(dbset.artiklList.find(rec => this.sysprofRec[SYSPROF.artikl_id] == rec[ARTIKL.id]), dbset.artiklList);
        this.artiklAn = findef(dbset.artiklList.find(el => el[ARTIKL.id] == this.artiklRec[ARTIKL.analog_id]), dbset.artiklList);
        if (this.artiklAn == undefined) {
            this.artiklAn = this.artiklRec;
        }
    }

    set_location(obj, owner, winc) {

        if (owner.typeForm() == "ARCH") {
            if ("BOTT" == this.layout) {
                this.dimension(owner.x1, owner.y2 - win.dh_frm, owner.x2, owner.y2);
            } else if ("RIGHT" == this.layout) {
                this.dimension(owner.x2 - win.dh_frm, owner.y2 - this.winc.height2, owner.x2, owner.y2);
            } else if ("TOP" == this.layout) {
                //this.dimension(owner.x1, owner.y1, owner.x2, owner.y1 + win.dh_frm);                 
            } else if ("LEFT" == this.layout) {
                this.dimension(owner.x1, owner.y2 - this.winc.height2, owner.x1 + win.dh_frm, owner.y2);
            }

        } else if (owner.typeForm() == "TRAPEZE") {
            let H = winc.height1 - winc.height2;
            let W = winc.width();

            if ('BOTT' == this.layout) {
                this.dimension(owner.x1, owner.y2 - win.dh_frm, owner.x2, owner.y2);

            } else if ('RIGHT' == this.layout) {
                if (winc.form == 'RIGHT') {
                    this.dimension(owner.x2 - win.dh_frm, owner.y2 - winc.height2, owner.x2, owner.y2);
                    this.anglCut[1] = (180 - Math.toDegrees(Math.atan(W / H))) / 2;
                } else {
                    this.dimension(owner.x2 - win.dh_frm, owner.y1, owner.x2, owner.y2);
                    this.anglCut[0] = Math.toDegrees(Math.atan(W / H)) / 2;
                }
            } else if ('TOP' == this.layout) {
                if (winc.form == 'RIGHT') {
                    this.dimension(owner.x1, owner.y1, owner.x2, winc.height1 - winc.height2);
                    this.anglCut[0] = (180 - Math.toDegrees(Math.atan(W / H))) / 2;
                    this.anglCut[1] = Math.toDegrees(Math.atan(W / H)) / 2;
                } else {
                    this.dimension(owner.x1, winc.height2 - winc.height1, owner.x2, owner.y1);
                    this.anglCut[1] = (180 - Math.toDegrees(Math.atan(W / H))) / 2;
                    this.anglCut[0] = Math.toDegrees(Math.atan(W / H)) / 2;
                }
            } else if ('LEFT' == this.layout) {
                if (winc.form == 'RIGHT') {
                    this.dimension(owner.x1, owner.y1, owner.x1 + win.dh_frm, owner.y2);
                    this.anglCut[0] = (Math.toDegrees(Math.atan(W / H))) / 2;
                } else {
                    this.dimension(owner.x1, owner.y2 - winc.height1, owner.x1 + win.dh_frm, owner.y2);
                    this.anglCut[0] = (180 - Math.toDegrees(Math.atan(W / H))) / 2;
                }
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
    }

    find_first(nuni, typ, us1, us2) {
        let record = dbset.sysprofList.find(rec => nuni == rec[SYSPROF.systree_id] && typ == rec[SYSPROF.use_type] && 0 != rec[SYSPROF.use_side]
                    && (us1 == rec[SYSPROF.use_side] || us2 == rec[SYSPROF.use_side] || UseSide.ANY[0] == rec[SYSPROF.use_side]));
        if (nuni == -3 || record == undefined) {
            dbset.sysprofList.virtualRec; //[-3, 0, typ, -1, -3, -3];
        }
        return record;
    }

    paint() {
        let dh = win.dh_frm;
        let dh0 = win.dh_frm; //см. winapp
        let dh1 = win.dh_frm; //см. winapp
        let dz = 4
        if (this.owner.typeForm() == "ARCH") {
            let Y1 = this.winc.height1 - this.winc.height2;
            let r = this.winc.root.radiusArch;

            if ("BOTT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1 + dh0, this.x2 - dh1, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.color2Rec);

            } else if ("RIGHT" == this.layout) {
                let ang2 = 90 - Math.toDegrees(Math.asin((this.winc.width() - 2 * dh) / ((r - dh) * 2)));
                let a = (r - dh) * Math.sin(Math.toRadians(ang2));
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, (r - a), this.y1, this.y2, this.y2 - dh0, this.color2Rec);

            } else if ("TOP" == this.layout) {
                let r2 = r - win.dh_frm;
                let ang1 = Math.PI + Math.acos(this.winc.width() / (r * 2));
                let ang2 = 2 * Math.PI - Math.acos(this.winc.width() / (r * 2));
                draw_full_arc(this.winc, this.winc.width() / 2, r, r - win.dh_frm / 2, ang1, ang2, win.dh_frm, this.color2Rec);
                draw_full_arc(this.winc, this.winc.width() / 2, r, r, ang1, ang2, 5);
                draw_full_arc(this.winc, this.winc.width() / 2, r, r - win.dh_frm, ang1, ang2, 5);
            } else if ("LEFT" == this.layout) {
                let ang2 = 90 - Math.toDegrees(Math.asin((this.winc.width() - 2 * dh) / ((r - dh) * 2)));
                let a = (r - dh) * Math.sin(Math.toRadians(ang2));
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, (r - a), this.y2 - dh1, this.y2, this.color2Rec);

            }
            //draw_line(this.winc, this.owner.x1 + dz, this.owner.y1 + dz, this.owner.x1 + dh, this.owner.y1 + dh, this.color2Rec);
            //draw_line(this.winc, this.owner.x2 - dz, this.owner.y1 + dz, this.owner.x2 - dh, this.owner.y1 + dh, this.color2Rec);
            //draw_line(this.winc, this.owner.x2 - dz, this.owner.y2 - dz, this.owner.x2 - dh, this.owner.y2 - dh, this.color2Rec);
            //draw_line(this.winc, this.owner.x1 + dz, this.owner.y2 - dz, this.owner.x1 + dh, this.owner.y2 - dh, this.color2Rec);


        } else if (this.owner.typeForm() == 'TRAPEZE') {
            if ('BOTT' == this.layout) {
                draw_stroke_polygon(this.winc, this.x1 + dh0, this.x2 - dh1, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.color2Rec);

            } else if ('RIGHT' == this.layout) {
                let angl = (this.winc.form == 'RIGHT') ? Math.toRadians(90 - this.anglCut[1]) : Math.toRadians(90 - this.anglCut[0]);
                let dh2 = dh * Math.tan(angl);
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1 + dh2, this.y1, this.y2, this.y2 - dh0, this.color2Rec);

            } else if ('TOP' == this.layout) {
                let anglHoriz = (180 - Math.toDegrees(Math.atan((this.winc.height1 - this.winc.height2) / this.winc.width())));
                let dy = (win.dh_frm / Math.sin(Math.toRadians(anglHoriz - 90)));
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y2, this.y2 + dy, this.y1 + dy, this.color2Rec);

            } else if ('LEFT' == this.layout) {
                let angl = Math.toRadians(90 - this.anglCut[0]);
                let dh2 = dh * Math.tan(angl);
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1 + dh2, this.y2 - dh1, this.y2, this.color2Rec);
            }

        } else {
            if ("BOTT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1 + dh0, this.x2 - dh1, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.color2Rec);
            } else if ("RIGHT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1 + dh1, this.y1, this.y2, this.y2 - dh0, this.color2Rec);
            } else if ("TOP" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2 - dh0, this.x1 + dh1, this.y1, this.y1, this.y2, this.y2, this.color2Rec);
            } else if ("LEFT" == this.layout) {
                draw_stroke_polygon(this.winc, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1 + dh0, this.y2 - dh1, this.y2, this.color2Rec);
            }
            draw_line(this.winc, this.owner.x1 + dz, this.owner.y1 + dz, this.owner.x1 + dh, this.owner.y1 + dh, this.color2Rec);
            draw_line(this.winc, this.owner.x2 - dz, this.owner.y1 + dz, this.owner.x2 - dh, this.owner.y1 + dh, this.color2Rec);
            draw_line(this.winc, this.owner.x2 - dz, this.owner.y2 - dz, this.owner.x2 - dh, this.owner.y2 - dh, this.color2Rec);
            draw_line(this.winc, this.owner.x1 + dz, this.owner.y2 - dz, this.owner.x1 + dh, this.owner.y2 - dh, this.color2Rec);
        }
    }
}
//------------------------------------------------------------------------------
export class Glass extends Com5t {

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
//------------------------------------------------------------------------------

