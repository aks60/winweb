
import {UGeo} from './uGeo.js';
//import {AreaSimple, Com5t} from './module.js';
import {AreaSimple} from './AreaSimple.js';
import {Com5t} from './Com5t.js';
import Coordinate from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Coordinate.js';
import LineSegment from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineSegment.js';

export class AreaArch extends AreaSimple {

    constructor(winc, gson, owner) {
        try {
            super(winc, gson, owner);
            if (owner === null)
                this.owner = this;

        } catch (e) {
            errorLog('Error:AreaArch.constructor() ' + e.message);
        }
    }

    setLocation() {
        let artiklRec = (this.frames[0].artiklRecAn === null) ? eArtikl.vrec : this.frames[0].artiklRecAn;
        let listShell = new Array();
        let arcA = null, arcB = null;
        try {
            //Вершины арки
            for (let frame of this.frames) {
                if (frame.h !== undefined) {
                    let dh = artiklRec[eArtikl.height];
                    let segm = UGeo.normalizeSegm(LineSegment.new([frame.x1, frame.y1], [frame.x2, frame.y2]));
                    let ANG = UGeo.toDegrees(segm.angle());

                    if (ANG === 0) {
                        arcB = UGeo.newLineArch(segm.p0.x, segm.p1.x, segm.p0.y, frame.h, frame.id);  //созд. арки на горизонтали 
                    } else {
                        //Поворот на горизонталь
                        Com5t.aff.setToRotation(Math.toRadians(-ANG), segm.p0.x, segm.p0.y);
                        let lineStr = Com5t.aff.transform(segm.toGeometry(Com5t.gf)); //трансформация линии в горизонт
                        segm = LineSegment.new(lineStr.getCoordinateN(0), lineStr.getCoordinateN(1));
                        
                        arcA = UGeo.newLineArch(segm.p0.x, segm.p1.x, segm.p0.y, frame.h, frame.id);  //созд. арки на горизонтали   

                        //Обратный поворот
                        Com5t.aff.setToRotation(Math.toRadians(ANG), segm.p0.x, segm.p0.y);
                        arcB = Com5t.aff.transform(arcA);
                    }
                    arcB.getCoordinates().forEach(c => c.setZ(frame.id));
                    listShell.push(...arcB.getCoordinates());

                } else {
                    listShell.push(Coordinate.new(frame.x1, frame.y1, frame.id));
                }
            }
            listShell.push(listShell[0]);

            //Аrea рамы 
            let geoShell = Com5t.gf.createPolygon(listShell);
            let geoInner = UGeo.bufferGeometry(geoShell, this.winc.listElem, 0, 0);
            let geoFalz = UGeo.bufferGeometry(geoShell, this.winc.listElem, 0, 1);
            this.area = Com5t.gf.createMultiPolygon([geoShell, geoInner, geoFalz]);
        } catch (e) {
            errorLog('Error: AreaArch.setLocation() ' + e.message);
        }
    }
    
    paint() {
        try {
            super.paint();
        } catch (e) {
            errorLog('Error: AreaArch.paint() ' + e.message);
        }
    }      
}

