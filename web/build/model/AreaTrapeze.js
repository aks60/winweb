
import {AreaSimple, Com5t} from './model.js';
import {UGeo} from './uGeo.js';
import Coordinate from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Coordinate.js';

export class AreaTrapeze extends AreaSimple {

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
            let coo = new Array();
            this.frames.forEach(line => coo.push(Coordinate.new(line.x1, line.y1, line.id)));
            coo.push(Coordinate.new(this.frames[0].x1, this.frames[0].y1, this.frames[0].id));

            //Аrea рамы
            let geoShell = Com5t.gf.createPolygon(coo);
            let geoInner = UGeo.bufferGeometry(geoShell, this.winc.listElem, 0, 0);
            let geoFalz = UGeo.bufferGeometry(geoShell, this.winc.listElem, 0, 1);
            this.area = Com5t.gf.createMultiPolygon([geoShell, geoInner, geoFalz]);
        } catch (e) {
            errorLog('Error: AreaTrapeze.setLocation() ' + e.message);
        }
    }
}

