//------------------------------------------------------------------------------
import {Com5t} from './Com5t.js';
import {LineSegm} from '/winweb/common/LineSegm.js';
//------------------------------------------------------------------------------
export let UGeo = {};
//------------------------------------------------------------------------------
UGeo.segRighShell = new LineSegm();
UGeo.segRighInner = null;
UGeo.egLeftShell = new LineSegm();
UGeo.segLeftInner = null;
UGeo.cross = new jsts.geom.Coordinate();
//------------------------------------------------------------------------------
//Угол неориентированный к горизонту. Угол нормируется в диапазоне [0, 2PI].
UGeo.anglHor = (x1, y1, x2, y2) => {
    let ang = UGeo.radToDeg(jsts.algorithm.Angle.angle(new jsts.geom.Coordinate(x1, y1), new jsts.geom.Coordinate(x2, y2)));
    return (ang > 0) ? 360 - ang : Math.abs(ang);
};
UGeo.degToRad = (degrees) => {
    return degrees * (Math.PI / 180);
};
UGeo.radToDeg = (rad) => {
    return rad / (Math.PI / 180);
};
//------------------------------------------------------------------------------
//bufferGeometry(geoShell, this.winc.listElem, -6, 1)
UGeo.bufferGeometry = (geoShell, list, amend, opt) => {
    const cooShell = geoShell.getCoordinates();
    let hm = new Map();
    try {
        //Смещения сегментов
        for (let el of list) {
            const rec = (el.artiklRec === null) ? dbset.artikl.vrev : el.artiklRec;
            if (opt === 0) {
                hm.set(el.gson.id, rec[ARTIKL.height] - rec[ARTIKL.size_centr] + amend);
            } else if (opt === 1) {
                hm.set(el.gson.id, rec[ARTIKL.height] - rec[ARTIKL.size_centr] - rec[ARTIKL.size_falz] + amend);
            }
        }
        if (cooShell.length > Com5t.MAXSIDE) {
            let id = cooShell[geoShell.getCoordinates().length / 2].z;
            let polyCurv = UGeo.bufferCurve(geoShell, hm.get(id));
            let polyRect = UGeo.bufferRectangl(geoShell, hm);
            let polyArch = UGeo.polyRect.union(polyCurv);

            ring = polyArch.getInteriorRingN(0);
            poly = gf.createPolygon(ring);
            poly.normalize();
            UGeo.updateZet(poly, polyRect);
            return poly;

        } else {
            poly1 = UGeo.bufferPolygon(geoShell, hm);
            return poly1;
        }
        //Test.init(poly1, poly2); 
    } catch (e) {
        console.log("Ошибка: uGeo.bufferGeometry() " + e);
    }
    return null;

};
//------------------------------------------------------------------------------
//TODO Гадкая функция. Надо переписать!
//При слиянии двух полигонов появляются точки соединения с непонятным Z значением
UGeo.updateZet = (arc, rec) => {
//        boolean pass = false;
//        Coordinate cooArc[] = arc.getCoordinates();
//        Coordinate cooRec[] = rec.getCoordinates();
//
//        for (int i = 0; i < cooArc.length - 1; i++) {
//            if (cooArc[i].z % 1 != 0) {
//                for (int j = 1; j < cooRec.length; j++) {
//
//                    if (PointLocation.isOnSegment(cooArc[i], cooRec[j - 1], cooRec[j])) {
//                        if (pass == false) {
//                            
//                            cooArc[i].z = cooRec[j].z;
//                        } else {
//                            cooArc[i].z = cooRec[j - 1].z;
//                        }
//                        pass = true;
//                        break;
//                    }
//                }
//            }
//        }
//        cooArc[cooArc.length - 1].z = cooArc[0].z;
    return {};
};
//------------------------------------------------------------------------------
UGeo.bufferRectangl = (geoShell, hmDist) => {
//        Polygon result = gf.createPolygon();
//        Set<Double> set = new HashSet();
//        List<Coordinate> listBuffer = new ArrayList<Coordinate>();
//        List<Coordinate> listShell = new ArrayList<Coordinate>();
//        Coordinate[] cooShell = geoShell.getCoordinates();
//        try {
//            for (int i = 0; i < cooShell.length; i++) {
//                if (set.add(cooShell[i].z)) {
//                    listShell.add(cooShell[i]);
//                }
//            }
//            hmDist.put(4.0, 0.0); //такая вот фича!
//
//            for (int i = 0; i < listShell.size(); i++) {
//
//                //Перебор левого и правого сегмента от точки пересечения 
//                int j = (i == 0) ? listShell.size() - 1 : i - 1;
//                final double id1 = listShell.get(j).z;
//                segRighShell.setCoordinates(listShell.get(j), listShell.get(i));
//                segRighInner = segRighShell.offset(-hmDist.get(id1));
//
//                int k = (i == listShell.size() - 1) ? 0 : i + 1;
//                final double id2 = listShell.get(i).z;
//                segLeftShell.setCoordinates(listShell.get(i), listShell.get(k));
//                segLeftInner = segLeftShell.offset(-hmDist.get(id2));
//
//                //Точка пересечения сегментов
//                cross = segLeftInner.lineIntersection(segRighInner);
//
//                if (cross != null) {
//                    cross.z = listShell.get(i).z;
//                    listBuffer.add(cross);
//                }
//            }
//            Collections.reverse(listBuffer);
//            List<Coordinate> listOut = new ArrayList(listShell);
//            listOut.addAll(listBuffer);
//            listOut.add(listOut.get(0));
//            Polygon geoBuffer = gf.createPolygon(listOut.toArray(new Coordinate[0]));
//
//            result = geoBuffer;
//
//        } catch (Exception e) {
//            System.err.println("Ошибка:UGeo.bufferRectangl() " + e);
//        }
//        return result;
    return {};
};
//------------------------------------------------------------------------------    
UGeo.bufferPolygon = (geoShell, hmDist) => {
    
    let result = Com5t.gf.createPolygon();
    try {
        let listBuffer = new Array();
        let listShell = geoShell.getCoordinates();
        for (let i = 0; i < listShell.length - 1; i++) {

            //Перебор левого и правого сегмента от точки пересечения 
            let j = (i === 0) ? listShell.length - 2 : i - 1;
            const id1 = listShell[j].z;
            
            debugger;
            
            UGeo.segRighShell.setCoordinates(new jsts.geom.Coordinate(listShell[j]), new jsts.geom.Coordinate(listShell[i]));
            UGeo.segRighInner = UGeo.segRighShell.offset(-hmDist[id1]);

            let k = (i === listShell.length - 1) ? 0 : i + 1;
            const id2 = listShell[i].z;
            UGeo.segLeftShell.setCoordinates(new jsts.geom.Coordinate(listShell[i]),new jsts.geom.Coordinate(listShell[k]));
            UGeo.segLeftInner = UGeo.segLeftShell.offset(-hmDist[id2]);

            //Точка пересечения сегментов
            UGeo.cross = UGeo.segLeftInner.intersection(UGeo.segRighInner);

            if (UGeo.cross != null) {
                UGeo.cross.z = listShell[i].z;
                listBuffer.push(cross);
            }
        }
        listBuffer.push(listBuffer[0]);
        let geoBuffer = Com5t.gf.createPolygon(listBuffer.toArray(new Coordinate[0]));

        result = geoBuffer;

    } catch (e) {
        console.log("Ошибка: UGeo.bufferPolygon() " + e);
    }
    return result;
};
