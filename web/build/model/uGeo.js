import {Com5t} from './Com5t.js';
import Intersection from '../../lib-js/jsts-2.12.1/org/locationtech/jts/algorithm/Intersection.js';
import InteriorPoint from '../../lib-js/jsts-2.12.1/org/locationtech/jts/algorithm/InteriorPoint.js';
import PointLocator from '../../lib-js/jsts-2.12.1/org/locationtech/jts/algorithm/PointLocator.js';
import Angle from '../../lib-js/jsts-2.12.1/org/locationtech/jts/algorithm/Angle.js';
import Polygon from '../../lib-js/jsts-2.12.1/org/locationtech/jts/geom/Polygon.js';
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
UGeo.splitPolygon = (geom, segm) => {
    try {
        var b = true, hsCheck = new Set();
        let coo = geom.getGeometryN(0).copy().getCoordinates();
        let cooL = [], cooR = [];
        let crosTwo = [], listExt = [coo[0]];
        let segmImp = UGeo.normalizeSegm(LineSegment.new(
                [segm.p0.x, segm.p0.y, segm.p0.z],
                [segm.p1.x, segm.p1.y, segm.p1.z]));
        //Вставим точки пересечения в список коорд.
        const pointloc = new PointLocator();
        for (let i = 1; i < coo.length; i++) {

            let cros = Intersection.intersection(segmImp.p0, segmImp.p1, coo[i - 1], coo[i]); //точка пересечения двкх линии 
            hsCheck.add(coo[i]);
            if (cros !== null) {
                let line = LineString.new([coo[i - 1], coo[i]]);
                let bool = pointloc.intersects(cros, line);
                //Вставим точку в сегмент
                if (bool === true) {
                    crosTwo.push(cros);
                    if (hsCheck.add(cros)) {
                        listExt.push(cros);
                    }
                }
            }
            listExt.push(coo[i]);
        }
        //Обход сегментов до и после точек пересечения
        for (let i = 0; i < listExt.length; ++i) {
            let crd = listExt[i];
            //Проход через точку пересечения
            if (Number.isNaN(crd.z)) {
                b = !b; //первая точка пройдена
                let cL = Coordinate.new(crd.x, crd.y, segmImp.p0.z);
                let cR = Coordinate.new(crd.x, crd.y);
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
            UGeo.rotate(cooR);
            cooR.push(cooR[0]);
        } else {
            cooR.push(cooR[0]);
        }

        return [LineString.new(crosTwo), Polygon.new(cooL), Polygon.new(cooR)];
    } catch (e) {
        errorLog("Error: UGeo.splitPolygon() " + e.message);
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
UGeo.bufferGeometry = (geoShell, list, amend, opt) => {
    try {
        const cooShell = geoShell.getCoordinates();
        let hm = new Map();
        //Смещения сегментов
        for (let el of list) {
            const rec = (el.artiklRec === null) ? eArtikl.vrec : el.artiklRec;
            if (opt === 0) {
                hm.set(el.id, rec[eArtikl.height] - rec[eArtikl.size_centr] + amend);
            } else if (opt === 1) {
                hm.set(el.id, rec[eArtikl.height] - rec[eArtikl.size_centr] - rec[eArtikl.size_falz] + amend);
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
        errorLog("Error: uGeo.bufferGeometry() " + e);
    }
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
        errorLog("Error: UGeo.bufferPolygon() " + e.message);
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
