import {UGeo} from './uGeo.js';
import {UCom} from '../../common/uCom.js';
import {Timer} from '../../common/Timer.js';
import {Com5t} from './Com5t.js';
import {Layout, Type} from '../../enums/enums.js';
import LineSegment from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineSegment.js';
import Coordinate from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Coordinate.js';

export class ElemSimple extends Com5t {

    betweenHoriz = [0, 0]; //угол между векторами   
    pointPress = [0, 0]; //координаты клика на канве
    passMask = [0, 0]; //маска редактир. [0]=0 -начало, [0]=1 -конец, [0]=2 -середина вектора, [1] > 0 -вешаем обр. прорисовки кружка и разр. редактиров. x,y
    SIZE = 20;
    //timer = new Timer(() => alert('exec Timer()'), 9160);
    //timer = setTimeout(() => {console.log("Stop timer.");}, 160);

    constructor(winc, gson, owner) {
        super(winc, gson, owner);

        //this.timer.pause();
        winc.listElem.push(this);
        winc.listAll.push(this);
    }

    addListenerEvents() {
        try {
            if (this.cnv.width < 100 && this.cnv.height < 100) {
                return;
            }
            this.winc.cnv.addEventListener("keydown", (evt) => {
                /*if (this.area != null && passMask[1] > 0) {
                 LineSegment segm = new LineSegment(this.x1(), this.y1(), this.x2(), this.y2());
                 int key = evt.getKeyCode();
                 //double dxy = (timer.isRunning() == true) ? 0.14 + winc.scale : 0.1 * winc.scale;
                 double dxy = (timer.isRunning() == true) ? 0.04 : 0.1 * winc.scale;
                 double X = 0, Y = 0, dX = 0, dY = 0;
                 
                 if (key == KeyEvent.VK_UP) {
                 dY = -dxy;
                 } else if (key == KeyEvent.VK_DOWN) {
                 dY = dxy;
                 } else if (key == KeyEvent.VK_LEFT) {
                 dX = -dxy;
                 } else if (key == KeyEvent.VK_RIGHT) {
                 dX = dxy;
                 }
                 //Кликнул начало вектора
                 if (passMask[0] == 0) {
                 X = dX / winc.scale + this.x1();
                 Y = dY / winc.scale + this.y1();
                 moveXY(X, Y);
                 
                 //Кликнул конец вектора
                 } else if (passMask[0] == 1) {
                 X = dX / winc.scale + this.x2();
                 Y = dY / winc.scale + this.y2();
                 moveXY(X, Y);
                 
                 //Кликнул по середине вектора 
                 } else if (passMask[0] == 2) {
                 
                 if (this.h() != null) {
                 this.h(this.h() - dY / winc.scale);
                 } else {
                 X = dX / winc.scale + this.x2();
                 Y = dY / winc.scale + this.y2();
                 
                 if (Y > 0 && List.of(Layout.BOT, Layout.TOP, Layout.HOR).contains(this.layout())) {
                 this.y1(Y);
                 this.y2(Y);
                 }
                 if (X > 0 && List.of(Layout.LEF, Layout.RIG, Layout.VER).contains(this.layout())) {
                 this.x1(X);
                 this.x2(X);
                 }
                 }
                 }
                 if (X < 0 || Y < 0) {
                 UGeo.winresiz(winc.gson, Math.abs(dX), Math.abs(dY), winc.scale);
                 }
                 }
                 timer.stop();
                 timer.start();*/
            });
            this.winc.cnv.addEventListener("mousedown", (evt) => {
                if (this.area !== null) {
                    
                    if(this.id === 1) 
                           debugger;
                    //console.log('AKSENOV mousedown_' + this.id);
                    
                    let wincPress2 = Coordinate.new(evt.clientX / this.winc.scale, evt.clientY / this.winc.scale);
                    let inside2 = UGeo.inside(this.area, evt.clientX, evt.clientY);
                    let wincPress = Coordinate.new(evt.clientX / this.winc.scale, evt.clientY / this.winc.scale);
                    let inside = UGeo.inside(this.area, evt.clientX / this.winc.scale, evt.clientY / this.winc.scale);

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
                    //this.winc.cnv.requestFocusInWindow();
                    //this.winc.cnv.repaint();
                }
            });
            this.winc.cnv.addEventListener("mousemove", (evt) => {
                let o1 = this.id;
                //debugger;
                if (this.area !== null) {
                    let X = 0, Y = 0;
                    let W = this.winc.cnv.width, H = this.winc.cnv.height;
                    let dX = evt.clientX - this.pointPress[0]; //прирощение по горизонтали
                    let dY = evt.clientY - this.pointPress[1]; //прирощение по вертикали 

                    //Фильтр движухи вкл-ся когда passMask[1] > 1 !!! 
                    if (this.passMask[1] > 1) {
                        this.pointPress = [evt.clientX, evt.clientY];

                        if (this.passMask[0] === 0) { //начало вектора
                            X = dX / this.winc.scale + this.x1;
                            Y = dY / this.winc.scale + this.y1;
                            this.moveXY(X, Y);

                        } else if (this.passMask[0] === 1) { //конец вектора
                            X = dX / this.winc.scale + this.x2;
                            Y = dY / this.winc.scale + this.y2;
                            this.moveXY(X, Y);

                        } else if (this.passMask[0] === 2) { //середина вектора
                            X = dX / this.winc.scale + this.x2;
                            Y = dY / this.winc.scale + this.y2;
                            if (Y > 0 && [Layout.BOT, Layout.TOP, Layout.HOR].includes(this.layout)) {
                                if (this.h !== null) {
                                    this.h = (this.h - dY / this.winc.scale);
                                } else {
                                    this.y1 = Y;
                                    this.y2 = Y;
                                }
                            }
                            if (X > 0 && [Layout.LEF, Layout.RIG, Layout.VER].includes(this.layout)) {
                                if (this.h !== null) {
                                    this.h = (this.h - dX / this.winc.scale);
                                } else {
                                    this.x1 = X;
                                    this.x2 = X;
                                }
                            }
                        }
                        if (X < 0 || Y < 0) {
                            console.log('AKSENOF UGeo.winresiz()');
                            UGeo.winresiz(this.winc.gson, Math.abs(dX), Math.abs(dY), this.winc.scale);
                        }
                    }
                }
            });
            
        } catch (e) {
            errorLog("Error: ElemSimple.addListenerEvents() " + e.message);
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
        //debugger;
        if (this.winc.sceleton === false) {
            if (this.area !== null) {
                if (this.passMask[1] > 0) {
                    this.root.listenerPassEdit = () => {  //вешаем глобальный обработчик!
                        //debugger;
                        this.winc.ctx.strokeStyle = '#ff0000';
                        this.winc.ctx.fillStyle = '#ff0000';
                        this.winc.ctx.beginPath();

                        //Хвост вектора, точка круг
                        if (this.passMask[0] === 0) {
                            this.winc.ctx.arc(this.x1 - this.SIZE / 2, this.y1 - this.SIZE / 2, this.SIZE, 0, 2 * Math.PI);
                            this.winc.ctx.fill();

                            //Начало вектора. точка круг
                        } else if (this.passMask[0] === 1) {
                            this.winc.ctx.arc(this.x2() - this.SIZE / 2, this.y2() - this.SIZE / 2, this.SIZE, 0, 2 * Math.PI);
                            this.winc.ctx.fill();

                            //Середина вектора. точка квадрат
                        } else if (this.passMask[0] === 2) {
                            if (this.h !== null) { //арка
                                //List<Coordinate> list = Arrays.asList(owner.area.getGeometryN(0).getCoordinates())
                                //        .stream().filter(c -> c.z == this.id).collect(toList());
                                //int i = list.size() / 2; //index середины дуги
                                //Coordinate c1 = list.get(i), c2 = list.get(i + 1);
                                //Coordinate smid = new LineSegment(c1.x, c1.y, c2.x, c2.y).midPoint();
                                //Rectangle2D rec = new Rectangle2D.Double(smid.x - this.SIZE / 2, smid.y - this.SIZE / 2, this.SIZE, this.SIZE);
                                //this.winc.gc2d.draw(rec);

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

