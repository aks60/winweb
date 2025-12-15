
import {Timer} from '/common/Timer.js';
import {Com5t} from './Com5t.js';

export class ElemSimple extends Com5t {

    constructor(winc, gson, owner) {
        super(winc, gson.id, gson, owner);

        this.betweenHoriz = [0, 0]; //угол между векторами 
        this.pointPress = null;
        this.passMask = [0, 0]; //маска редактир. [0]=0 -начало, [0]=1 -конец, 
        this.delta = 3;
        this.SIZE = 20;
//        this.timer = new Timer(() => {
//            alert('exec Timer()');
//        }, 3000);
//        this.timer.test();
        //this.timer.pause();
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

    pain() {

    }

    test() {
        alert('exec Timer.test()');
    }
}

