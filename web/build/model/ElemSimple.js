import {UGeo} from './uGeo.js';
import {UCom} from '../../common/uCom.js';
import {Com5t} from './Com5t.js';
import {Layout, Type} from '../../enums/enums.js';
import LineSegment from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineSegment.js';
import Coordinate from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Coordinate.js';

export class ElemSimple extends Com5t {

    betweenHoriz = [0, 0]; //угол между векторами   
    pointPress = [0, 0]; //координаты клика на канве
    passMask = [0, 0]; //маска редактир. [0]=0 -начало, [0]=1 -конец, [0]=2 -середина, [1] > 0 -вешаем обр. прорисовки кружка и разреш. редактиров. x,y
    timerID = 0; //таймер
    count = 0;
    constructor(winc, gson, owner) {
        super(winc, gson, owner);

        winc.listElem.push(this);
        winc.listAll.push(this);
    }

    addListenerEvents() {
        if (this.winc.cnv.width > 100 && this.winc.cnv.height > 100) {
            try {
                this.winc.cnv.addEventListener("keydown", (evt) => {

                    if (this.area !== null && this.passMask[1] > 0) {

                        let key = evt.key;
                        let scale = this.winc.scale;
                        let segm = LineSegment.new([this.x1, this.y1], [this.x2, this.y2]);
                        //При нажатой клавише this.timerID всегда > 0
                        let dxy = (this.timerID > 0) ? 0.04 : 0.1 * scale;

                        let X = 0, Y = 0, dX = 0, dY = 0;
                        if (key === 'ArrowUp') {
                            dY = -dxy;
                        } else if (key === 'ArrowDown') {
                            dY = dxy;
                        } else if (key === 'ArrowLeft') {
                            dX = -dxy;
                        } else if (key === 'ArrowRight') {
                            dX = dxy;
                        }
                        //Кликнул начало вектора
                        if (this.passMask[0] === 0) {
                            X = dX / scale + this.x1;
                            Y = dY / scale + this.y1;
                            UGeo.movePoint(this, X, Y);

                            //Кликнул конец вектора
                        } else if (this.passMask[0] === 1) {
                            X = dX / scale + this.x2;
                            Y = dY / scale + this.y2;
                            UGeo.movePoint(this, X, Y);

                            //Кликнул по середине вектора 
                        } else if (this.passMask[0] === 2) {

                            if (this.h !== undefined) {
                                this.h = this.h - dY / scale;
                            } else {
                                X = dX / scale + this.x2;
                                Y = dY / scale + this.y2;

                                if (Y > 0 && [Layout.BOT, Layout.TOP, Layout.HOR].includes(this.layout)) {
                                    this.y1 = Y;
                                    this.y2 = Y;
                                }
                                if (X > 0 && [Layout.LEF, Layout.RIG, Layout.VER].includes(this.layout)) {
                                    this.x1 = X;
                                    this.x2 = X;
                                }
                            }
                        }
                        if (X < 0 || Y < 0) {
                            UGeo.moveGson(this.winc.gson, Math.abs(dX), Math.abs(dY), scale);
                        }
                        this.winc.resize();
                        clearTimeout(this.timerID); //остановка
                        this.timerID = setTimeout(null, 10); //запуск
                    }
                });

                this.winc.cnv.addEventListener("mousedown", (evt) => {
                    if (this.area !== null) {

                        let scale = this.winc.scale;
                        let X = (evt.offsetX - Com5t.TRANS) / scale;
                        let Y = (evt.offsetY - Com5t.TRANS) / scale;
                        let wincPress = Coordinate.new(X, Y);
                        this.pointPress = [evt.offsetX, evt.offsetY];
                        let inside = UGeo.insidePoly(this.area, X, Y);

                        //Если клик внутри контура
                        if (inside === true) {
                            ++this.passMask[1];

                            let segm = LineSegment.new([this.x1, this.y1], [this.x2, this.y2]);
                            const coeff = segm.segmentFraction(wincPress); //доля расстояния вдоль этого отрезка.

                            if (coeff < .33) { //кликнул начало вектора
                                this.passMask[1] = (this.passMask[0] !== 0) ? 1 : this.passMask[1];
                                this.passMask[0] = 0;

                            } else if (coeff > .67) {//кликнул конец вектора
                                this.passMask[1] = (this.passMask[0] !== 1) ? 1 : this.passMask[1];
                                this.passMask[0] = 1;

                            } else {//кликнул по середине вектора                 
                                this.passMask[1] = (this.passMask[0] !== 2) ? 1 : this.passMask[1];
                                this.passMask[0] = 2;
                            }
                        } else { //Промах, всё обнуляю
                            this.passMask = [0, 0];
                        }
                        this.winc.cnv.focus();
                        this.winc.cnv.width = this.winc.cnv.offsetWidth;
                        this.winc.cnv.height = this.winc.cnv.offsetHeight;
                        this.winc.draw();
                    }
                });

                this.winc.cnv.addEventListener("mouseup", (evt) => {
                    if (this.passMask[1] > 1) {
                        this.passMask[1] = 1;
                    }
                });

                this.winc.cnv.addEventListener("mousemove", (evt) => {
                    //Фильтр движухи откл. когда passMask[1] > 1
                    if (this.passMask[1] > 1 && this.area !== null) {

                        let scale = this.winc.scale;
                        let X = 0, Y = 0;
                        let dX = evt.offsetX - this.pointPress[0]; //прирощение по горизонтали
                        let dY = evt.offsetY - this.pointPress[1]; //прирощение по вертикали 
                        this.pointPress = [evt.offsetX, evt.offsetY]; //новое положение клика точки

                        if (this.passMask[0] === 0) { //начало вектора
                            X = dX / scale + this.x1;
                            Y = dY / scale + this.y1;
                            UGeo.movePoint(this, X, Y);

                        } else if (this.passMask[0] === 1) { //конец вектора
                            X = dX / scale + this.x2;
                            Y = dY / scale + this.y2;
                            UGeo.movePoint(this, X, Y);

                        } else if (this.passMask[0] === 2) { //середина вектора
                            X = dX / scale + this.x2;
                            Y = dY / scale + this.y2;
                            if (Y > 0 && [Layout.BOT, Layout.TOP, Layout.HOR].includes(this.layout)) {
                                if (this.h !== undefined) {
                                    this.h = (this.h - dY / scale);
                                } else {
                                    this.y1 = Y;
                                    this.y2 = Y;
                                }
                            }
                            if (X > 0 && [Layout.LEF, Layout.RIG, Layout.VER].includes(this.layout)) {
                                if (this.h !== undefined) {
                                    this.h = (this.h - dX / scale);
                                } else {
                                    this.x1 = X;
                                    this.x2 = X;
                                }
                            }
                        }
                        if (X < 0 || Y < 0) {
                            UGeo.moveGson(this.winc.gson, Math.abs(dX), Math.abs(dY), scale);
                        }
                        this.winc.resize();
                    }
                });

            } catch (e) {
                errorLog("Error: ElemSimple.addListenerEvents() " + e.message);
            }
        }
    }

    get layout() {
        try {
            const anglHor = UGeo.anglHor(this.x1, this.y1, this.x2, this.y2);

            if (anglHor > 315 && anglHor <= 360 || anglHor >= 0 && anglHor < 45) {
                return (this.type === Type.IMPOST || this.type === Type.SHTULP) ? Layout.HOR : Layout.BOT;

            } else if (anglHor >= 45 && anglHor < 135) {
                return Layout.RIG;

            } else if (anglHor >= 135 && anglHor < 225) {
                return Layout.TOP;

            } else if (anglHor >= 225 && anglHor <= 315) {
                return (this.type === Type.IMPOST || this.type === Type.SHTULP) ? Layout.VER : Layout.LEF;
            }
        } catch (e) {
            errorLog("Error: ElemSimple.layout() " + e.message);
        }
        return Layout.ANY;
    }

    paint() {
    }
}

