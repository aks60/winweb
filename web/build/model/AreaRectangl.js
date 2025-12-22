
import {AreaSimple} from './AreaSimple.js';
import {Com5t} from './Com5t.js';
import {UGeo} from './uGeo.js';

export class AreaRectangl extends AreaSimple {

    constructor(winc, gson, owner) {
        try {
            super(winc, gson, owner);
            if (owner === null)
                this.owner = this;

        } catch (e) {
            errorLog('Error:AreaRectangl.constructor() ' + e.message);
        }
    }

    setLocation() {
        try {
            let cooBox = new Array;
            this.frames.forEach(frame => cooBox.push(new jsts.geom.Coordinate(frame.x1, frame.y1, frame.id)));
            cooBox.push(new jsts.geom.Coordinate(this.frames[0].x1, this.frames[0].y1, this.frames[0].id));

            let geoShell = Com5t.gf.createPolygon(cooBox);
            let geoInner = UGeo.bufferGeometry(geoShell, this.winc.listElem, -6, 1);
            
        } catch (e) {
            errorLog('Error:AreaRectangl.setLocation() ' + e.message);
        }
    }

    paint() {
        try {
            consoleLog('Exec: AreaRectangl.paint()');
        } catch (e) {
            errorLog('Error: AreaRectangl.paint() ' + e.message);
        }
    }
}


