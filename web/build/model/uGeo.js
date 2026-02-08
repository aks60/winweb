import {Com5t} from './Com5t.js'
import {UCom} from '../../common/uCom.js';
import {Type} from '../../enums/enums.js';
import Intersection from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/Intersection.js'
import InteriorPoint from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/InteriorPoint.js'
import PointLocator from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/PointLocator.js'
import Angle from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/Angle.js'
import Polygon from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Polygon.js'
import LineSegment from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineSegment.js'
import LineString from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineString.js'
import Coordinate from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Coordinate.js'
import AffineTransformation from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/util/AffineTransformation.js'


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
    let list = new Array();
    for (const i = 1; i < arr.length; i = i + 2) {
        list.puth(new Coordinate(arr[i - 1], arr[i]));
    }
    list.push(new Coordinate(arr[0], arr[1]));
    return list;
};

//Пилим многоугольник
UGeo.splitPolygon = (geom, segm) => {
    var b = true, hsCheck = new Set();
    let coo = geom.getGeometryN(0).copy().getCoordinates();
    let cooL = [], cooR = [];
    let crosTwo = [], listExt = [coo[0]];
    try {
        let segmImp = UGeo.normalizeSegm(LineSegment.new(
                [segm.p0.x, segm.p0.y, segm.p0.z],
                [segm.p1.x, segm.p1.y, segm.p1.z]));

        //Вставим точки пересечения в список коорд.
        const pointloc = new PointLocator();
        for (let i = 1; i < coo.length; i++) {
            let crosP = Intersection.intersection(segmImp.p0, segmImp.p1, coo[i - 1], coo[i]); //точка пересечения двух линии 
            hsCheck.add(coo[i]);
            if (crosP !== null) {
                //Вставим точку в сегмент
                let bool = pointloc.intersects(crosP, LineString.new([coo[i - 1], coo[i]]));
                if (bool === true) {
                    crosTwo.push(crosP);
                    if (hsCheck.add(crosP)) {
                        listExt.push(crosP);
                    }
                }
            }
            listExt.push(coo[i]);
        }
        //Обход сегментов до и после точек пересечения
        for (let i = 0; i < listExt.length; ++i) {
            let co = listExt[i];

            //Проход через точку пересечения
            if (Number.isNaN(co.z)) {
                b = !b; //первая точка пройдена
                let cL = Coordinate.new(co.x, co.y, segmImp.p0.z);
                let cR = Coordinate.new(co.x, co.y);

                if (crosTwo[0] === co) {
                    cL.z = segmImp.p0.z;
                    cR.z = listExt[i - 1].z;
                } else {
                    cL.z = listExt[i - 1].z;
                    cR.z = segmImp.p0.z;
                }
                cooL.push(cL);
                cooR.push(cR);

            } else { //Построение координат слева и справа от импоста
                ((b === true) ? cooL : cooR).push(co);
            }
        }

        //Построение 'пятой' точки
        if (segmImp.p0.y !== segmImp.p1.y) {
            UGeo.rotate(cooR);
            cooR.push(cooR[0]);
        } else {
            cooR.push(cooR[0]);
        }
        return [Polygon.new(cooL), Polygon.new(cooR)];

    } catch (e) {
        errorLog("Error: UGeo.splitPolygon(*) " + e.message);
    }
};

UGeo.rotate = (arr) => {
    arr.unshift(arr.pop());
    return arr;
}

UGeo.normalizeSegm = (segm) => {
    segm.normalize();
    return segm;
};

//Пересечение сегмента(линии) импоста с сегментами(отрезками) многоугольника
UGeo.geo2Cross = (poly, line) => {
    try {
        poly = poly.getGeometryN(0);
        let out = new Array();
        const coo = poly.getCoordinates();
        for (let i = 1; i < coo.length; i++) {

            const segm1 = coo[i - 1];
            const segm2 = coo[i];
            const cros = Intersection.intersection(line.p0, line.p1, segm1, segm2);
            if (cros !== null) {
                out.push(cros);
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
        let hmDist = new Map();
        //Смещения сегментов
        for (let el of list) {
            const rec = (el.artiklRec === null) ? eArtikl.vrec : el.artiklRec;
            if (opt === 0) {
                hmDist.set(el.id, rec[eArtikl.height] - rec[eArtikl.size_centr] + amend);
            } else if (opt === 1) {
                hmDist.set(el.id, rec[eArtikl.height] - rec[eArtikl.size_centr] - rec[eArtikl.size_falz] + amend);
            }
        }
        if (cooShell.length > Com5t.MAXSIDE) {
            let id = cooShell[geoShell.getCoordinates().length / 2].z;
            let polyCurv = UGeo.bufferCurve(geoShell, hmDist.get(id));
            let polyRect = UGeo.bufferRectangl(geoShell, hmDist);
            let polyArch = UGeo.polyRect.union(polyCurv);
            let ring = polyArch.getInteriorRingN(0);
            let polyCurve = Com5t.gf.createPolygon(ring);
            polyCurve.normalize();
            UGeo.updateZet(polyCurve, polyRect);
            return polyCurve;
        } else {
            let polyRect = UGeo.bufferPolygon(geoShell, hmDist);
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

UGeo.getSegment = (poly, index) => {
    poly = poly.getGeometryN(0);
    let coo = structuredClone(poly.getCoordinates());
    coo.length = coo.length - 1;
    index = (index >= coo.length) ? index - coo.length : index;
    let j = (index < 0) ? index + coo.length : index;
    let k = (j + 1 >= coo.length) ? j + 1 - coo.length : j + 1;

    return new LineSegment(coo[j], coo[k]);
};

UGeo.getIndex = (geo, id) => {
    let coo = geo.getGeometryN(0).getCoordinates();
    for (let i = 0; i < coo.length - 1; i++) {
        if (coo[i].z === id) {
            return i;
        }
    }
    errorLog("Error: UGeo.getIndex()");
};

/**
 * Размерные линии
 *
 * @param midle
 * @param tipX - точка поворота
 * @param tipY - точка поворота
 * @param angl - угол поворота
 * @param length - длина линии
 * @return
 */
UGeo.lineTip = (midle, tipX, tipY, angl, length) => {
    try {
        let dx = (midle === false) ? 0 : 16;
        let line1 = LineString.new([[tipX - length, tipY], [tipX, tipY]]);
        let line2 = LineString.new([[tipX - dx, tipY - 16], [tipX, tipY], [tipX - dx, tipY + 16]]);
        let geometry = Com5t.gf.createMultiLineString([line1, line2]);
        let aff = new AffineTransformation();
        aff.setToRotation(Math.toRadians(angl), tipX, tipY);
        let geom = aff.transform(geometry);
        return geom;
    } catch (e) {
        errorLog("Error: UGeo.lineTip() " + e.message);
    }
};

UGeo.inside = (poly, x, y) => {
    let inside = false;
    const coo = poly.getCoordinates();

    for (let i = 1, j = coo.length - 1; i < coo.length; j = i++) {
        let xi = coo[i].x, yi = coo[i].y
        let xj = coo[j].x, yj = coo[j].y;

        const intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect)
            inside = !inside;
    }
    return inside;
};  

//Перемещение точек на канве (изменение размера окна)
UGeo.winresiz = (gson, dx, dy, scale) => {
        if (gson.childs !== null) {
            let dX = (dx === 0) ? 0 : dx / scale;
            let dY = (dy === 0) ? 0 : dy / scale;
            for (let child of gson.childs) {
                if ([Type.IMPOST, Type.STOIKA, Type.SHTULP].includes(child.type)) {
                    if (dX !== 0) {
                        child.x1 += dX;
                        child.x2 += dX;
                    }
                    if (dY !== 0) {
                        child.y1 += dY;
                        child.y2 += dY;
                    }
                } else if ([Type.BOX_SIDE, Type.STV_SIDE].includes(child.type)) {
                    if (dX !== 0) {
                        child.x1 += +dX;
                    }
                    if (dY !== 0) {
                        child.y1 += dY;
                    }
                }
                if ([Type.AREA, Type.STVORKA].includes(child.type)) {
                    UGeo.winresiz(child, dx, dy, scale);
                }
            }
        }
    };
