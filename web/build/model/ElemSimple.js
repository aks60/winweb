import {UGeo} from './uGeo.js';
import {Timer} from '../../common/Timer.js';
import {Com5t} from './Com5t.js';

export class ElemSimple extends Com5t {

    betweenHoriz = [0, 0]; //угол между векторами   
    pointPress = null;
    passMask = [0, 0]; //маска редактир. [0]=0 -начало, [0]=1 -конец, [0]=2 -середина вектора, [1] > 0 -вешаем обр. прорисовки кружка и разр. редактиров. x,y
    delta = 3;
    SIZE = 20;
    timer = new Timer(() => alert('exec Timer()'), 160);

    constructor(winc, gson, owner) {
        super(winc, gson, owner);

        this.timer.pause();
        winc.listElem.push(this);
        winc.listAll.push(this);
    }

    addListenerEvents() {
        this.timer.stop();
    }

    moveXY(x, y) {

    }
    
    layout() {
        try {
            const anglHor = UGeo.anglHor(this.x1, this.y1, this.x2, this.y2);

            if (anglHor > 315 && anglHor <= 360 || anglHor >= 0 && anglHor < 45) {
                return (this.type === 'IMPOST' || this.type === 'SHTULP') ? Layout.HOR : Layout.BOT;

            } else if (anglHor >= 45 && anglHor < 135) {
                return Layout.RIG;

            } else if (anglHor >= 135 && anglHor < 225) {
                return 'TOP';

            } else if (anglHor >= 225 && anglHor <= 315) {
                return (this.type === 'IMPOST' || this.type === 'SHTULP') ? Layout.VER : Layout.LEF;
            }
        } catch (e) {
            errorLog("Ошибка:ElemSimple.layout() " + e.message);
        }
        return 'ANY';
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

