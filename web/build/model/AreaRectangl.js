
import {AreaSimple} from './AreaSimple.js';

export class AreaRectangl extends AreaSimple {

    constructor(winc, gson, owner) {
        try {
            super(winc, gson, null);
            if (owner == null)
                this.owner = this;
        } catch (e) {
            errorLog('Error:AreaRectangl.constructor() ' + e.message);
        }
    }

    setLocation() {
        try {
            debugger;
            let cooBox = new Array;
            var OBJ08 = new jsts.geom.Coordinate(10.0, 20.0, 5.0);
            cooBox = new Array();

            consoleLog('Exec:AreaRectangl.setLocation()');
        } catch (e) {
            errorLog('Error:AreaRectangl.setLocation() ' + e.message);
        }
    }

    paint() {
        try {
            //alert('Exec:AreaRectangl.paint()');
            consoleLog('Exec:AreaRectangl.paint()');
        } catch (e) {
            errorLog('Error:AreaRectangl.paint() ' + e.message);
        }
    }
}


