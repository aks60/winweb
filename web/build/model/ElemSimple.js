
import {Com5t} from './Com5t.js';

export class ElemSimple extends Com5t {

    constructor(winc, gson, owner) {
        super(winc, gson.id, gson, owner);
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
}

