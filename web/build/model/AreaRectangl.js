
import {AreaSimple} from './AreaSimple.js';

export class AreaRectangl extends AreaSimple {

    constructor(winc, gson, owner) {
        super(winc, gson, null);
        if (owner == null)
            this.owner = this;
        //alrt('new AreaRectangl');
    }

    pain() {
//        console.log('exec AreaRectangl.pain()');
        alert('exec AreaRectangl.pain()');
    }
}


