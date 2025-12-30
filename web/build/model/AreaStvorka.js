
import {AreaSimple} from './AreaSimple.js';

export class AreaStvorka extends AreaSimple {

    /*spcRec = null; //спецификация москитки
    sysfurnRec = eSysfurn.vrec; //фурнитура
    knobRec = eArtikl.vrec; //ручка
    loopRec = eArtikl.vrec; //подвес(петли)
    lockRec = eArtikl.vrec; //замок
    mosqRec = eArtikl.vrec; //москитка
    elementRec = eElement.up.newRecord(Query.SEL); //состав москидки 

    lineOpenHor = null; //линии горизонт. открывания
    lineOpenVer = null; //линии вертик. открывания
    knobOpen = null; //ручка открывания    
    knobColor = -3; //цвет ручки вирт...
    loopColor = -3; //цвет подвеса вирт...
    lockColor = -3; //цвет замка вирт...
    mosqColor = -3; //цвет москитки вирт...

    knobHeight = 0; //высота ручки
    typeOpen = TypeOpen1.EMPTY; //направление открывания
    knobLayout = LayoutKnob.MIDL; //положение ручки на створке      
    offset[] = [0, 0, 0, 0];
     */
    
    constructor(winc, gson, owner) {
        super(winc, gson, owner);

        this.frames = new Map(); //рамы конструкции 

//        //Коррекция area створки с учётом ширины рамы и нахлёста
//        this.dimension(owner.x1 + (this.margin("LEFT") - win.naxl), owner.y1 + (this.margin("TOP") - win.naxl),
//                owner.x2 - (this.margin("RIGHT") - win.naxl), owner.y2 - (this.margin("BOTT") - win.naxl));
//
//        this.frames.set("BOTT", new ElemFrame(gson, this, winc, this.param('stvorkaBottom'), this.id + '.1', "BOTT", "STVORKA_SIDE"));
//        this.frames.set("RIGHT", new ElemFrame(gson, this, winc, this.param('stvorkaRight'), this.id + '.2', "RIGHT", "STVORKA_SIDE"));
//        this.frames.set("TOP", new ElemFrame(gson, this, winc, this.param('stvorkaTop'), this.id + '.3', "TOP", "STVORKA_SIDE"));
//        this.frames.set("LEFT", new ElemFrame(gson, this, winc, this.param('stvorkaLeft'), this.id + '.4', "LEFT", "STVORKA_SIDE"));
debugger;
        this.sysfurnRec = eSysfurn.vrec; //фурнитура створки
        this.handleRec = eArtikl.vrec;   //ручка       
        this.loopRec = eArtikl.vrec;     //подвес (петли)
        this.lockRec = eAartikl.vrec;     //замок
        this.handleColor = -3;
        this.loopColor = -3;
        this.lockColor = -3;
        this.typeOpen = 0;

        this.init_constructiv();
    }

    init_constructiv() {
        //Фурнитура створки
        if (this.gson.param != undefined && this.gson.param.sysfurnID != undefined)
            this.sysfurnRec = eSysfurn.list.find(rec => this.gson.param.sysfurnID == rec.list[eSysfurn.id]); //по параметру
        if (this.sysfurnRec == undefined)
            this.sysfurnRec = findef(this.winc.nuni, eSysfurn.systree_id, eSysfurn); //ищем первую в системе

        //Ручка
        if (this.gson.param != undefined && this.gson.param.artiklHandl != undefined)
            this.handleRec = this.gson.param.artiklHandl; //по параметру
        else if (this.sysfurnRec != undefined)
            this.handleRec = findef(this.sysfurnRec[eSysfurn.artikl_id1], eArtikl.id, eArtikl.list); //ручка по умолчанию см. систему

        //Текстура ручки
        if (this.gson.param != undefined && this.gson.param.colorHandl != undefined)
            this.handleColor = this.gson.param.colorHandl; //по параметру
        else if (this.handleRec != undefined) {
             this.handleColor = findef(this.handleRec[eArtikl.id], eArtdet.artikl_id, eArtdet).list[eArtdet.color_fk];  //первая запись
             
            if (this.handleColor < 0)
                this.handleColor = findef((-1 * this.handleColor), eColor.id, eColor).list[eColor.id]; //первый цвет в группе
        }

        //Подвес (петли)
        if (this.gson.param != undefined && this.gson.param.artiklLoop != undefined)
            this.loopRec = findef(this.gson.param.artiklLoop, eArtikl.id, eArtikl);

        //Текстура подвеса
        if (this.gson.param != undefined && this.gson.param.colorLoop != undefined)
            this.loopColor = this.gson.param.colorLoop;

        //Замок
        if (this.gson.param != undefined && this.gson.param.artiklLock != undefined)
            this.lockRec = findef(this.gson.param.artiklLock, eArtikl.id, eArtikl);

        //Текстура замка
        if (this.gson.param != undefined && this.gson.param.colorLock != undefined)
            this.lockColor = this.gson.param.colorLock;

        //Сторона открывания
        if (this.gson.param != undefined && this.gson.param.typeOpen != undefined) {
            this.typeOpen = this.gson.param.typeOpen;
        } else if (this.sysfurnRec != undefined) {
            this.typeOpen = (this.sysfurnRec[eSysfurn.side_open] == 1) ? 1 : 2;
        }

        //Положение или высота ручки на створке
        if (this.gson.param != undefined && this.gson.param.positionHandl != undefined) {
            let position = this.gson.param.positionHandl;
            if (position == 3) { //VARIAT.id
                this.handleLayout = 'VARIAT';
                this.handleHeight = this.gson.param.heightHandl;
            } else {
                this.handleLayout = (this.position == 'MIDL') ? 'MIDL' : 'CONST';
                this.handleHeight = this.frames.get("LEFT").height / 2;

            }
        } else if (this.sysfurnRec != undefined && this.sysfurnRec[eSysfurn.hand_pos] == 1) {  //MIDL.id
            this.handleLayout = 'MIDL';
            this.handleHeight = this.frames.get("LEFT").height / 2;
        } else if (this.sysfurnRec != undefined && this.sysfurnRec[eSysfurn.hand_pos] == 2) {    //CONST.id) {
            this.handleLayout = 'CONST';
            this.handleHeight = this.frames.get("LEFT").height / 2;
        } else if (this.sysfurnRec != undefined && this.sysfurnRec[eSysfurn.hand_pos] == 3) {    //VARIAT.id) {
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

        if (this.gson.param != undefined && this.gson.param[side] != undefined)
            return this.gson.param[side];
        else
            return undefined;
    }

    paint() {
//        let DX = 16, DY = 60, X1 = 0, Y1 = 0;
//        let elemB = this.frames.get("BOTT");
//        let elemR = this.frames.get("RIGHT");
//        let elemT = this.frames.get("TOP");
//        let elemL = this.frames.get("LEFT");
//        elemB.paint();
//        elemR.paint();
//        elemT.paint();
//        elemL.paint();
//
//        if (this.typeOpen == 1 || this.typeOpen == 3) {
//            X1 = elemR.x1 + (elemR.x2 - elemR.x1) / 2;
//            Y1 = elemR.y1 + (elemR.y2 - elemR.y1) / 2;
//            draw_line(this.winc, elemL.x1, elemL.y1, elemR.x2, elemR.y1 + (elemR.y2 - elemR.y1) / 2);
//            draw_line(this.winc, elemL.x1, elemL.y2, elemR.x2, elemR.y1 + (elemR.y2 - elemR.y1) / 2);
//
//        } else if (this.typeOpen == 2 || this.typeOpen == 4) {
//            X1 = elemL.x1 + (elemL.x2 - elemL.x1) / 2;
//            Y1 = elemL.y1 + (elemL.y2 - elemL.y1) / 2;
//            draw_line(this.winc, elemR.x2, elemR.y1, elemL.x1, elemL.y1 + (elemL.y2 - elemL.y1) / 2);
//            draw_line(this.winc, elemR.x2, elemR.y2, elemL.x1, elemL.y1 + (elemL.y2 - elemL.y1) / 2);
//        }
//        if (this.typeOpen == 3 || this.typeOpen == 4) {
//            draw_line(this.winc, elemT.x1 + (elemT.x2 - elemT.x1) / 2, elemT.y1, elemB.x1, elemB.y2);
//            draw_line(this.winc, elemT.x1 + (elemT.x2 - elemT.x1) / 2, elemT.y1, elemB.x2, elemB.y2);
//        }
//
//        if (this.winc.root.typeForm() == "DOOR") {
//
//        } else {
//            let handlRGB = findef(this.handleColor, eColor.id, eColor);
//            draw_stroke_polygon(this.winc, X1 - DX, X1 + DX, X1 + DX, X1 - DX, Y1 - DY, Y1 - DY, Y1 + DY, Y1 + DY, handlRGB);
//            DX = DX - 12;
//            Y1 = Y1 + 20;
//        }
    }
}
