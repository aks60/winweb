import {Com5t} from './Com5t.js';
import Intersection from '../../lib-js/jsts-2.12.1/org/locationtech/jts/algorithm/Intersection.js';
import InteriorPoint from '../../lib-js/jsts-2.12.1/org/locationtech/jts/algorithm/InteriorPoint.js';
import Angle from '../../lib-js/jsts-2.12.1/org/locationtech/jts/algorithm/Angle.js';
import LineSegment from '../../lib-js/jsts-2.12.1/org/locationtech/jts/geom/LineSegment.js';
import LineString from '../../lib-js/jsts-2.12.1/org/locationtech/jts/geom/LineString.js';
import Coordinate from '../../lib-js/jsts-2.12.1/org/locationtech/jts/geom/Coordinate.js';

export let UGeo = {};

UGeo.segRighShell = new LineSegment(), UGeo.segRighInner = null;
UGeo.segLeftShell = new LineSegment(), UGeo.segLeftInner = null;
UGeo.cross = new Coordinate();

//Угол неориентированный к горизонту. Угол нормируется в диапазоне [0, 2PI].
UGeo.anglHor = (x1, y1, x2, y2) => {
    let ang = UGeo.radToDeg(Angle.angle(new Coordinate(x1, y1), new Coordinate(x2, y2)));
    return (ang > 0) ? 360 - ang : Math.abs(ang);
};

UGeo.degToRad = (degrees) => {
    return degrees * (Math.PI / 180);
};

UGeo.radToDeg = (rad) => {
    return rad / (Math.PI / 180);
};

//Список входн. параметров не замыкается начальной точкой как в jts!
UGeo.arrCoord = (arr) => {
    list = new Array();
    for (const i = 1; i < arr.length; i = i + 2) {
        list.puth(new Coordinate(arr[i - 1], arr[i]));
    }
    list.push(new Coordinate(arr[0], arr[1]));

    return list;
};

//Список входн. параметров не замыкается начальной точкой как в jts!
UGeo.newPolygon = (arr) => {
    try {
        return Com5t.gf.createPolygon(UGeo.arrCoord(arr));
    } catch (e) {
        errorLog("Error: UGeo.newPolygon()" + e);
    }
};

//Пилим многоугольник
UGeo.splitPolygon = (geom, segment) => {
    try {
        var b = true;
        let hsCheck = new Set();
        let coo = geom.getGeometryN(0).copy().getCoordinates();
        let cooL = [], cooR = [];
        let crosTwo = [], listExt = [coo[0]];
        let segmImp = UGeo.normalizeSegm(new LineSegment(
                new Coordinate(segment.p0.x, segment.p0.y, segment.p0.z),
                new Coordinate(segment.p1.x, segment.p1.y, segment.p1.z)));

        //Вставим точки пересечения в список коорд. см.exten
        for (const i = 1; i < coo.length; i++) {
            
            debugger;                                
            let p1 =  new Coordinate(10, 0, 11);
            let p2 =  new Coordinate(100, 100, 22);
            let p3 =  new Coordinate(5, 20, 33);
            let p4 =  new Coordinate(5, 40, 44);
            const cross2 = Intersection.intersection(p1, p2, p3, p4);
            const line2 = new LineString(p3, p4);
            let point = InteriorPoint.getInteriorPoint(line2);
            

            const crosP = Intersection.intersection(segmImp.p0, segmImp.p1, coo[i - 1], coo[i]); //точка пересечения двкх линии                          
            
            hsCheck.add(coo[i]);
            //Вставим точку в сегмент
            if (crosP !== null) {
                crosTwo.push(crosP);
                if (hsCheck.add(crosP)) {
                    listExt.push(crosP);
                }
            }
            listExt.push(coo[i]);
        }

        //Обход сегментов до и после точек пересечения
        for (const i = 0; i < listExt.length; ++i) {
            let crd = listExt[i];

            //Проход через точку пересечения
            if (crd.z === undefined) {
                b = !b; //первая точка пройдена
                let cL = new Coordinate(crd.x, crd.y, segmImp.p0.z);
                let cR = newCoordinate(crd.x, crd.y);

                if (crosTwo[0] === crd) {
                    cL.z = segmImp.p0.z;
                    cR.z = listExt[i - 1].z;
                } else {
                    cL.z = listExt[i - 1].z;
                    cR.z = segmImp.p0.z;
                }
                cooL.push(cL);
                cooR.push(cR);

            } else { //Построение координат слева и справа от импоста
                ((b === true) ? cooL : cooR).push(crd);
            }
        }
        //Построение 'пятой' точки
        if (segmImp.p0.y !== segmImp.p1.y) {
            UGeom.rotate(cooR);
            cooR.push(cooR.get(0));
        } else {
            cooR.push(cooR.get(0));
        }
        return [Com5t.gf.createLineString(crosTwo),
            Com5t.gf.createPolygon(cooL),
            Com5t.gf.createPolygon(cooR)];
        
    } catch (e) {
        errorLog("Error: UGeo.splitPolygon() " + e);
    }
};

UGeo.rotate = (arr) => {
    arr.push(arr.shift());
    return arr;
}

UGeo.normalizeSegm = (segm) => {
    segm.normalize();
    return segm;
};

//Пересечение сегмента(линии) импоста с сегментами(отрезками) многоугольника
UGeo.geoCross = (poly, line) => {
    try {
        poly = poly.getGeometryN(0);
        out = new Array();
        const c = poly.getCoordinates();
        for (let i = 1; i < c.length; i++) {

            const segm1 = c[i - 1];
            const segm2 = c[i];
            const c3 = Intersection.lineSegment(line.p0, line.p1, segm1, segm2);
            if (c3 !== null) {
                out.push(c3);
            }
        }
        if (out[0] < out[1]) {
            const temp = out[0];
            out[0] = out[1];
            out[1] = temp;
        }
        return out;

    } catch (e) {
        errorLog("Error: UGeo.geoCross()" + e);
    }
};

UGeo.polyCurve = (geoShell, geoInner, ID) => {

};

//bufferGeometry(geoShell, this.winc.listElem, -6, 1)
UGeo.bufferGeometry = (geoShell, list, amend, opt) => {
    //debugger;
    const cooShell = geoShell.getCoordinates();
    let hm = new Map();
    try {
        //Смещения сегментов
        for (let el of list) {
            const rec = (el.artiklRec === null) ? dbset.artikl.vrec : el.artiklRec;
            if (opt === 0) {
                hm.set(el.id, rec[ARTIKL.height] - rec[ARTIKL.size_centr] + amend);
            } else if (opt === 1) {
                hm.set(el.id, rec[ARTIKL.height] - rec[ARTIKL.size_centr] - rec[ARTIKL.size_falz] + amend);
            }
        }
        if (cooShell.length > Com5t.MAXSIDE) {
            let id = cooShell[geoShell.getCoordinates().length / 2].z;
            let polyCurv = UGeo.bufferCurve(geoShell, hm.get(id));
            let polyRect = UGeo.bufferRectangl(geoShell, hm);
            let polyArch = UGeo.polyRect.union(polyCurv);

            let ring = polyArch.getInteriorRingN(0);
            let polyCurve = Com5t.gf.createPolygon(ring);
            polyCurve.normalize();
            UGeo.updateZet(polyCurve, polyRect);
            return polyCurve;

        } else {
            let polyRect = UGeo.bufferPolygon(geoShell, hm);
            return polyRect;
        }
    } catch (e) {
        console.log("Ошибка: uGeo.bufferGeometry() " + e);
    }
};

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
//                segRighInner = UGeo.offsetSegm(segRighShell, -hmDist.get(id1));
//
//                int k = (i == listShell.size() - 1) ? 0 : i + 1;
//                final double id2 = listShell.get(i).z;
//                segLeftShell.setCoordinates(listShell.get(i), listShell.get(k));
//                segLeftInner = UGeo.offsetSegm(segLeftShell, -hmDist.get(id2));
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
 
UGeo.bufferPolygon = (geoShell, hmDist) => {
    try {
        let listBuffer = new Array();
        let listShell = geoShell.getCoordinates();
        for (let i = 0; i < listShell.length - 1; i++) {

            //Перебор левого и правого сегмента от точки пересечения 
            let j = (i === 0) ? listShell.length - 2 : i - 1;
            const id1 = listShell[j].z;
            UGeo.segRighShell.setCoordinates(new Coordinate(listShell[j]), new Coordinate(listShell[i]));
            UGeo.segRighInner = UGeo.offsetSegm(UGeo.segRighShell, -hmDist.get(id1));

            let k = (i === listShell.length - 1) ? 0 : i + 1;
            const id2 = listShell[i].z;
            UGeo.segLeftShell.setCoordinates(new Coordinate(listShell[i]), new Coordinate(listShell[k]));
            UGeo.segLeftInner = UGeo.offsetSegm(UGeo.segLeftShell, -hmDist.get(id2));

            //Точка пересечения сегментов
            let cross = UGeo.segLeftInner.intersection(UGeo.segRighInner);
            if (cross !== null) {
                cross.z = listShell[i].z;
                let p = new Coordinate(cross.x, cross.y, cross.z);
                listBuffer.push(p);
            }
        }
        listBuffer.push(listBuffer[0]);
        return  Com5t.gf.createPolygon(listBuffer);

    } catch (e) {
        console.log("Ошибка: UGeo.bufferPolygon() " + e);
    }
};

UGeo.offsetSegm = (lineSegm, offsetDistance) => {
    let offset0 = UGeo.pointAlongOffset(lineSegm, 0, offsetDistance);
    let offset1 = UGeo.pointAlongOffset(lineSegm, 1, offsetDistance);
    return new LineSegment(offset0, offset1);
};

UGeo.pointAlongOffset = (lineSegm, segmentLengthFraction, offsetDistance) => {

    let segx = lineSegm.p0.x + segmentLengthFraction * (lineSegm.p1.x - lineSegm.p0.x);
    let segy = lineSegm.p0.y + segmentLengthFraction * (lineSegm.p1.y - lineSegm.p0.y);
    let segz = (segmentLengthFraction === 0) ? lineSegm.p0.z : lineSegm.p1.z;

    let dx = lineSegm.p1.x - lineSegm.p0.x;
    let dy = lineSegm.p1.y - lineSegm.p0.y;
    let len = Math.hypot(dx, dy);
    let ux = 0.0;
    let uy = 0.0;
    if (offsetDistance !== 0.0) {
        ux = offsetDistance * dx / len;
        uy = offsetDistance * dy / len;
    }

    let offsetx = segx - uy;
    let offsety = segy + ux;

    let coord = new Coordinate(lineSegm.p0);
    coord.setX(offsetx);
    coord.setY(offsety);
    coord.setZ(segz);
    return coord;
};

function findIntersection(lineY, point1, point2) {
//    let { k, b } = lineY; // Прямая L: y = kx + b
//    let { x1, y1 } = point1; // Конечная точка отрезка A
//    let { x2, y2 } = point2; // Конечная точка отрезка B
//
//    // Уравнение прямой, проходящей через A и B (если она не вертикальная)
//    // (y - y1) / (x - x1) = (y2 - y1) / (x2 - x1)
//
//    // Подставляем y = kx + b в уравнение прямой через точки
//    // (kx + b - y1) / (x - x1) = (y2 - y1) / (x2 - x1)
//
//    // Решаем относительно x (перемножаем крест-накрест)
//    // (kx + b - y1) * (x2 - x1) = (y2 - y1) * (x - x1)
//    // kx*(x2-x1) + (b-y1)*(x2-x1) = (y2-y1)*x - (y2-y1)*x1
//    // x * (k*(x2-x1) - (y2-y1)) = -(b-y1)*(x2-x1) - (y2-y1)*x1
//    // x * (k*(x2-x1) - (y2-y1)) = (y1-b)*(x2-x1) - (y2-y1)*x1
//
//    let denom = k * (x2 - x1) - (y2 - y1); // Знаменатель для x
//
//    // Проверка на параллельность (если знаменатель 0, прямые параллельны или совпадают)
//    if (Math.abs(denom) < 1e-9) { // Используем допуск для плавающей точки
//        // Прямые параллельны, пер
//    }
}
