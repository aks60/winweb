import {UGeo} from './uGeo.js';
import {UCom} from '../../common/uCom.js';
import {Timer} from '../../common/Timer.js';
import {Com5t} from './Com5t.js';
import {Layout, Type} from '../../enums/enums.js';
import LineSegment from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineSegment.js';
import Coordinate from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Coordinate.js';
//import Point from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Point.js';

export class ElemSimple extends Com5t {

    betweenHoriz = [0, 0]; //угол между векторами   
    translate = [2, 2];
    pointPress = [0, 0]; //координаты клика на канве
    passMask = [0, 0]; //маска редактир. [0]=0 -начало, [0]=1 -конец, [0]=2 -середина вектора, [1] > 0 -вешаем обр. прорисовки кружка и разр. редактиров. x,y
    delta = 3;
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
            //this.timer.setRepeats(false);

            let keyPressed = (evt) => {
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
                 winc.gson.translate(winc.gson, Math.abs(dX), Math.abs(dY), winc.scale);
                 }
                 }
                 timer.stop();
                 timer.start();*/
            };
            let mousePressed = (evt) => {
                if (this.area !== null) {
                    debugger;
                    this.pointPress = [evt.clientX, evt.clientY];
                    let wincPress = Coordinate.new((evt.clientX - this.translate[0])
                            / this.winc.scale, (evt.clientY - this.translate[1]) / this.winc.scale);
                    let inside = UGeo.inside(this.area, wincPress);

                    //Если клик внутри контура
                    if (inside === true) {
                        ++this.passMask[1];
                        let segm = LineSegment.new([this.x1, this.y1], [this.x2, this.y2]);
                        const coeff = segm.segmentFraction(wincPress); //доля расстояния (в [0,0, 1,0] ) вдоль этого отрезка.

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
            };
            let mouseDragge = (evt) => {
                /*if (this.area != null) {
                 double X = 0, Y = 0;
                 double W = winc.canvas.getWidth(), H = winc.canvas.getHeight();
                 double dX = evt.getX() - pointPress.getX(); //прирощение по горизонтали
                 double dY = evt.getY() - pointPress.getY(); //прирощение по вертикали 
                 
                 //Фильтр движухи вкл-ся когда passMask[1] > 1 !!! 
                 if (passMask[1] > 1) {
                 pointPress = evt.getPoint();
                 
                 if (passMask[0] == 0) { //начало вектора
                 X = dX / winc.scale + x1();
                 Y = dY / winc.scale + y1();
                 moveXY(X, Y);
                 
                 } else if (passMask[0] == 1) { //конец вектора
                 X = dX / winc.scale + x2();
                 Y = dY / winc.scale + y2();
                 moveXY(X, Y);
                 
                 } else if (passMask[0] == 2) { //середина вектора
                 X = dX / winc.scale + x2();
                 Y = dY / winc.scale + y2();
                 if (Y > 0 && List.of(Layout.BOT, Layout.TOP, Layout.HOR).contains(layout())) {
                 if (this.h() != null) {
                 this.h(this.h() - dY / winc.scale);
                 } else {
                 this.y1(Y);
                 this.y2(Y);
                 }
                 }
                 if (X > 0 && List.of(Layout.LEF, Layout.RIG, Layout.VER).contains(layout())) {
                 if (this.h() != null) {
                 this.h(this.h() - dX / winc.scale);
                 } else {
                 this.x1(X);
                 this.x2(X);
                 }
                 }
                 }
                 if (X < 0 || Y < 0) {
                 winc.gson.translate(winc.gson, Math.abs(dX), Math.abs(dY), winc.scale);
                 }
                 }
                 }*/
            };

            //this.winc.cnv.keyboardPressed.addEventListener("keydown", keyPressed);
            this.winc.cnv.addEventListener("mousedown", mousePressed);
            //this.winc.cnv.mouseDragged.addEventListener("mousemove", mouseDragge);

        } catch (e) {
            errorLog("Error: ElemSimple.addListenerEvents() " + e.message);
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

    setDimension(x1, y1, x2, y2) {
        this.gson.x1 = x1;
        this.gson.y1 = y1;
        this.gson.x2 = x2;
        this.gson.y2 = y2;
    }
}

