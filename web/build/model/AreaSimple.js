
import {Com5t} from './Com5t.js';

export class AreaSimple extends Com5t {

    frames = new Array(); //список рам 
    childs = new Array(); //дети
    listenerPassEdit = null; //для прорисовки точек движения сегментов
    
    constructor(winc, gson, owner) {
        try {
            super(winc, gson, owner);
            winc.listArea.push(this);
            winc.listAll.push(this);
        } catch (e) {
            errorLog('Error: AreaSimple.constructor() ' + e.message);
        }
    }

    setLocation() {
        try {
//            Polygon geoShell = (Polygon) this.area.getGeometryN(0);
//            Polygon geoInner = Com5t.buffer(geoShell, winc.listElem, 0, 0);
//            Polygon geoFalz = Com5t.buffer(geoShell, winc.listElem, 0, 1);
//            this.area = gf.createMultiPolygon(new Polygon[]{geoShell, geoInner, geoFalz});
            
            //consoleLog('Exec:AreaSimple.setLocation()');
        } catch (e) {
            errorLog('Error: AreaSimple.setLocation() ' + e.message);
        }
    }

    paint() {
        try {
            consoleLog('Exec: AreaSimple.paint()');
        } catch (e) {
            errorLog('Error: AreaSimple.paint() ' + e.message);
        }
    }
}


