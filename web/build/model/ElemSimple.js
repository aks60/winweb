import {UGeo} from './uGeo.js';
import {UCom} from '../../common/uCom.js';
import {Com5t} from './Com5t.js';
import {Layout, Type} from '../../enums/enums.js';
import LineSegment from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineSegment.js';
import Coordinate from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Coordinate.js';

export class ElemSimple extends Com5t {

    betweenHoriz = [0, 0]; //угол между векторами   
    pointPress = [0, 0]; //координаты клика на канве
    passMask = [0, 0]; //маска редактир. [0]=0 -начало, [0]=1 -конец, [0]=2 -середина вектора, [1] > 0 -вешаем обр. прорисовки кружка и разр. редактиров. x,y
    SIZE = 20;
    timerID = 0; //таймер

    constructor(winc, gson, owner) {
        super(winc, gson, owner);


        winc.listElem.push(this);
        winc.listAll.push(this);
    }

    addListenerEvents() {
        if (this.winc.cnv.width > 100 && this.winc.cnv.height > 100) {
            try {

                this.winc.cnv.addEventListener("keydown", (evt) => {
                    let scale = this.winc.scale;
                    if (this.area !== null && this.passMask[1] > 0) {
                        let segm = LineSegment.new([this.x1, this.y1], [this.x2, this.y2]);
                        let key = evt.key;
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
                            this.moveXY(X, Y);

                            //Кликнул конец вектора
                        } else if (this.passMask[0] === 1) {
                            X = dX / scale + this.x2;
                            Y = dY / scale + this.y2;
                            this.moveXY(X, Y);

                            //Кликнул по середине вектора 
                        } else if (this.passMask[0] === 2) {

                            if (this.h !== null) {
                                this.h(this.h - dY / scale);
                            } else {
                                X = dX / scale + this.x2;
                                Y = dY / scale + this.y2;

                                if (Y > 0 && [Layout.BOT, Layout.TOP, Layout.HOR].includes(this.layout)) {
                                    this.y1(Y);
                                    this.y2(Y);
                                }
                                if (X > 0 && [Layout.LEF, Layout.RIG, Layout.VER].includes(this.layout)) {
                                    this.x1(X);
                                    this.x2(X);
                                }
                            }
                        }
                        if (X < 0 || Y < 0) {
                            UGeo.winresiz(this.winc.gson, Math.abs(dX), Math.abs(dY), scale);
                        }
                    }
                    clearTimeout(this.timerID); //остановка
                    this.timerID = setTimeout(null, 160); //запуск
                });

                this.winc.cnv.addEventListener("mousedown", (evt) => {
                    let scale = this.winc.scale;
                    //console.log(evt.offsetX / scale + ' <> ' + evt.offsetY / scale);

                    if (this.area !== null) {

                        let wincPress = Coordinate.new(evt.offsetX / scale, evt.offsetY / scale);
                        let inside = UGeo.insidePoly(this.area, evt.offsetX / scale, evt.offsetY / scale);

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
                            this.root.listenerPassEdit = null;
                        }
                        this.winc.cnv.focus();
                        this.winc.cnv.width = this.winc.cnv.offsetWidth;
                        this.winc.cnv.height = this.winc.cnv.offsetHeight;
                        this.winc.draw();
                    }
                });

                this.winc.cnv.addEventListener("mousemove", (evt) => {
                    let scale = this.winc.scale;                    
                    if (this.area !== null) {
                        let X = 0, Y = 0;
                        let W = this.winc.cnv.width, H = this.winc.cnv.height;
                        let dX = evt.offsetX - this.pointPress[0]; //прирощение по горизонтали
                        let dY = evt.offsetY - this.pointPress[1]; //прирощение по вертикали 
//if(this.id === 3) debugger;
                        //Фильтр движухи вкл-ся когда passMask[1] > 1 !!! 
                        if (this.passMask[1] > 1) {
                            this.pointPress = [evt.offsetX, evt.offsetY];
                            console.log(evt.offsetX / scale + ' <> ' + evt.offsetY / scale);

                            if (this.passMask[0] === 0) { //начало вектора
                                X = dX / scale + this.x1;
                                Y = dY / scale + this.y1;
                                this.moveXY(X, Y);

                            } else if (this.passMask[0] === 1) { //конец вектора
                                X = dX / scale + this.x2;
                                Y = dY / scale + this.y2;
                                this.moveXY(X, Y);

                            } else if (this.passMask[0] === 2) { //середина вектора
                                X = dX / scale + this.x2;
                                Y = dY / scale + this.y2;
                                if (Y > 0 && [Layout.BOT, Layout.TOP, Layout.HOR].includes(this.layout)) {
                                    if (this.h !== null) {
                                        this.h = (this.h - dY / scale);
                                    } else {
                                        this.y1 = Y;
                                        this.y2 = Y;
                                    }
                                }
                                if (X > 0 && [Layout.LEF, Layout.RIG, Layout.VER].includes(this.layout)) {
                                    if (this.h !== null) {
                                        this.h = (this.h - dX / scale);
                                    } else {
                                        this.x1 = X;
                                        this.x2 = X;
                                    }
                                }
                            }
                            if (X < 0 || Y < 0) {
                                UGeo.winresiz(this.winc.gson, Math.abs(dX), Math.abs(dY), scale);
                            }
                        }
                    }
                });

            } catch (e) {
                errorLog("Error: ElemSimple.addListenerEvents() " + e.message);
            }
        }
    }

    moveXY(x, y) {

        if (x > 0 || y > 0) {
            if ([Layout.BOT, Layout.HOR].includes(this.layout)) {
                if (this.passMask[0] === 0) {
                    this.y1 = y;
                } else if (this.passMask[0] === 1) {
                    this.y2 = y;
                }
            } else if ([Layout.RIG].includes(this.layout)) {
                if (this.passMask[0] === 0) {
                    this.x1 = x;
                } else if (this.passMask[0] === 1) {
                    this.x2 = x;
                }
            } else if ([Layout.TOP].includes(this.layout)) {
                if (this.passMask[0] === 0) {
                    this.y1 = y;
                } else if (this.passMask[0] === 1) {
                    this.y2 = y;
                }
            } else if ([Layout.LEF, Layout.VER].includes(this.layout)) {
                if (this.passMask[0] === 0) {
                    this.x1 = x;
                } else if (this.passMask[0] === 1) {
                    this.x2 = x;
                }
            }
        }
//        if(this instanceof ElemCross) {
//            UGeo.normalizeElem(this);
//        }        
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
        if (this.winc.sceleton === false) {
            if (this.area !== null) {
                if (this.passMask[1] > 0) {
                    this.root.listenerPassEdit = () => {  //вешаем глобальный обработчик!
                        this.winc.ctx.strokeStyle = '#f00';
                        this.winc.ctx.fillStyle = '#f00';
                        this.winc.ctx.beginPath();

                        //Хвост вектора, точка круг
                        if (this.passMask[0] === 0) {
                            this.winc.ctx.arc(this.x1 - this.SIZE / 2, this.y1 - this.SIZE / 2, this.SIZE, 0, 2 * Math.PI);
                            this.winc.ctx.fill();

                            //Начало вектора. точка круг
                        } else if (this.passMask[0] === 1) {
                            this.winc.ctx.arc(this.x2 - this.SIZE / 2, this.y2 - this.SIZE / 2, this.SIZE, 0, 2 * Math.PI);
                            this.winc.ctx.fill();

                            //Середина вектора. точка квадрат
                        } else if (this.passMask[0] === 2) {
                            if (this.h !== undefined) { //арка
                                let list = this.owner.area.getGeometryN(0).getCoordinates().filter(c => c.z == this.id);
                                let i = list.length / 2; //index середины дуги
                                let c1 = list[i], c2 = list[i + 1];
                                let smid = LineSegment.new([c1.x, c1.y], [c2.x, c2.y]).midPoint();
                                this.winc.ctx.fillRect(smid.x - this.SIZE / 2, smid.y - this.SIZE / 2, this.SIZE, this.SIZE);

                            } else {
                                let smid = new LineSegment(this.x1, this.y1, this.x2, this.y2).midPoint();
                                this.winc.ctx.fillRect(smid.x - this.SIZE / 2, smid.y - this.SIZE / 2, this.SIZE, this.SIZE);
                            }
                        }
                        this.winc.ctx.closePath();
                    };
                }
            }
        } else if (this.area !== null) {
            //Shape shape1 = new ShapeWriter().toShape(this.area.getGeometryN(0));
            //Shape shape2 = new ShapeWriter().toShape(this.area.getGeometryN(1));
            //Shape shape3 = new ShapeWriter().toShape(this.area.getGeometryN(2));

            //this.winc.gc2d.setColor(new java.awt.Color(eColor.find(this.colorID2).getInt(eColor.rgb)));
            //this.winc.gc2d.fill(shape1);
            //this./winc.gc2d.fill(shape2);
            //this.winc.gc2d.fill(shape3);

            //this.winc.gc2d.setColor(new java.awt.Color(000, 000, 255));
            //this.winc.gc2d.draw(shape1);
            //this.winc.gc2d.draw(shape2);
            //this.winc.gc2d.draw(shape3);            
        }
    }

    setDimension(x1, y1, x2, y2) {
        this.gson.x1 = x1;
        this.gson.y1 = y1;
        this.gson.x2 = x2;
        this.gson.y2 = y2;
    }
}

