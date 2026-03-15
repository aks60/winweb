
import {AreaSimple, Com5t} from './model.js';
import {UGeo} from './uGeo.js';
import Coordinate from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Coordinate.js';
//import Polygon from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Polygon.js';


export class AreaRectangl extends AreaSimple {

    constructor(winc, gson, owner) {
        try {
            super(winc, gson, owner);
            if (owner === null)
                this.owner = this;

        } catch (e) {
            console.error(e.message);
        }
    }

    setLocation() {
        try {
            //Вершины рамы
            let cooBox = new Array;
            this.frames.forEach(frame => cooBox.push(Coordinate.new(frame.x1, frame.y1, frame.id)));
            cooBox.push(Coordinate.new(this.frames[0].x1, this.frames[0].y1, this.frames[0].id));

            //Аrea рамы  
            let geoShell = Com5t.gf.createPolygon(cooBox);
            let geoInner = UGeo.bufferGeometry(geoShell, this.winc.listElem, 0, 0);
            let geoFalz = UGeo.bufferGeometry(geoShell, this.winc.listElem, 0, 1);
            this.area = Com5t.gf.createMultiPolygon([geoShell, geoInner, geoFalz]);

        } catch (e) {
            console.error(e.message);
        }
    }

    paint() {
        try {
            super.paint();
        } catch (e) {
            console.error(e.message);
        }
    }
}


