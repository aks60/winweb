
import {AreaSimple} from './frm/builder/model/areaSimple.js';

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

        this.sysfurnRec = dbset.sysfurnVirt; //фурнитура створки
        this.handleRec = dbset.artiklVirt;   //ручка       
        this.loopRec = dbset.artiklVirt;     //подвес (петли)
        this.lockRec = dbset.artiklVirt;     //замок
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
