
import {AreaSimple} from './AreaSimple.js';
import {Com5t} from './Com5t.js';
import {UGeo} from './uGeo.js';
import Coordinate from '../../lib-js/jsts-2.12.1M/org/locationtech/jts/geom/Coordinate.js';

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
            //Вершины рамы
            let cooBox = new Array;
            this.frames.forEach(frame => cooBox.push(new Coordinate(frame.x1, frame.y1, frame.id)));
            cooBox.push(new Coordinate(this.frames[0].x1, this.frames[0].y1, this.frames[0].id));

            //Аrea рамы  
            let geoShell = Com5t.gf.createPolygon(cooBox);
            let geoInner = UGeo.bufferGeometry(geoShell, this.winc.listElem, 0, 0);
            let geoFalz = UGeo.bufferGeometry(geoShell, this.winc.listElem, 0, 1);
            this.area = Com5t.gf.createMultiPolygon([geoShell, geoInner, geoFalz]);

        } catch (e) {
            errorLog('Error:AreaRectangl.setLocation() ' + e.message);
        }
    }

    paint() {
        try {
            super.paint();
            //console.log('Exec: AreaRectangl.paint()');
        } catch (e) {
            errorLog('Error: AreaRectangl.paint() ' + e.message);
        }
    }
}


