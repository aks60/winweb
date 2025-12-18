import {UGeo} from './uGeo.js';
import {Timer} from '../../common/Timer.js';
import {Com5t} from './Com5t.js';

export class ElemSimple extends Com5t {

    constructor(winc, gson, owner) {
        super(winc, gson, owner);

        this.betweenHoriz = [0, 0]; //угол между векторами 
        this.pointPress = null;
        this.passMask = [0, 0]; //маска редактир. [0]=0 -начало, [0]=1 -конец, 
        this.delta = 3;
        this.SIZE = 20;
        this.timer = new Timer(() => {
            alert('exec Timer()');
        }, 3000);
        this.timer.pause();
        //this.borderColor = Color.BLACK; 

        winc.listElem.push(this);
        winc.listAll.push(this);
    }

    initConstructiv(param) {

    }

    initParametr(param) {

    }

    setLocation() {

    }

    paint() {

    }

    layout() {
        try {
            const anglHor = UGeo.anglHor(this.x1, this.y1, this.x2, this.y2);

            if (anglHor > 315 && anglHor <= 360 || anglHor >= 0 && anglHor < 45) {
                return (this.type === 'IMPOST' || this.type === 'SHTULP') ? 'HORIZ' : 'BOTT';

            } else if (anglHor >= 45 && anglHor < 135) {
                return 'RIGHT';

            } else if (anglHor >= 135 && anglHor < 225) {
                return 'TOP';

            } else if (anglHor >= 225 && anglHor <= 315) {
                return (this.type === 'IMPOST' || this.type === 'SHTULP') ? 'VERT' : 'LEFT';
            }
        } catch (e) {
            errorLog("Ошибка:ElemSimple.layout() " + e.message);
        }
        return 'ANY';
    }
}

