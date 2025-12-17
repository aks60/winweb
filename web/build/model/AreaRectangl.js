
import {AreaSimple} from './AreaSimple.js';
import {bufferGeometry} from './bufferGeometry.js';

export class AreaRectangl extends AreaSimple {

    constructor(winc, id, ownerId) {
        try {
            super(winc, id, ownerId);
        } catch (e) {
            errorLog('Error:AreaRectangl.constructor() ' + e.message);
        }
    }

    setLocation() {
        try {
            debugger;
            let cooBox = new Array;
            this.frames.forEach(frame => cooBox.push(new jsts.geom.Coordinate(frame.x1, frame.y1, frame.id)));
            cooBox.push(new jsts.geom.Coordinate(this.frames[0].x1, this.frames[0].y1, this.frames[0].id));
            
            let geoShell = this.winc.gf.createPolygon(cooBox);
            let geoInner = bufferGeometry(geoShell, this.winc.listElem, -6, 1);

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


