import {Com5t} from './Com5t.js'
import {UCom} from '../../common/uCom.js';
import {Type, Layout} from '../../enums/enums.js';
import Intersection from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/Intersection.js'
//import InteriorPoint from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/InteriorPoint.js'
//import PointLocator from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/PointLocator.js'
//import PointLocation from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/PointLocation.js'
import CGAlgorithmsDD from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/CGAlgorithmsDD.js'
import Angle from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/Angle.js'
import Polygon from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Polygon.js'
import LineSegment from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineSegment.js'
import LineString from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineString.js'
import Coordinate from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Coordinate.js'
import AffineTransformation from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/util/AffineTransformation.js'
import WKTReader from '../../lib-js/jsts-2.11.2/org/locationtech/jts/io/WKTReader.js'
import WKTWriter from '../../lib-js/jsts-2.11.2/org/locationtech/jts/io/WKTWriter.js'
import Orientation from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/Orientation.js';
import Distance from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/Distance.js';

export let UGeo = {};

//Угол неориентированный к горизонту. Угол нормируется в диапазоне [0, 2PI].
UGeo.anglHor = (x1, y1, x2, y2) => {
    let ang = UGeo.toDegrees(Angle.angle(new Coordinate(x1, y1), new Coordinate(x2, y2)));
    return (ang > 0) ? 360 - ang : Math.abs(ang);
};

UGeo.toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

UGeo.toDegrees = (rad) => {
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

//Арка полигона
UGeo.polyCurve = (geoShell, geoInner, ID) => {

    let cooShell = geoShell.getCoordinates();
    let cooInner = geoInner.getCoordinates();
    let listFrame = new Array();

    for (let j = 0; j < cooShell.length; j++) {
        if (cooShell[j].z === ID) {
            listFrame.push(cooShell[j]);
        }
    }
    listFrame.push(cooInner[0]); //посл.точка арки
    for (let k = cooInner.length - 1; k >= 0; k--) {
        if (cooInner[k].z == ID) {
            listFrame.push(cooInner[k]);
        }
    }

    listFrame.push(listFrame.get(0));
    return Com5t.gf.createPolygon(listFrame); //полигон рамы арки
};

//Длина арки
UGeo.lengthCurve = (geo, id) => {

    let coo = geo.getCoordinates();
    let width = 0;
    for (let j = 1; j < coo.length; j++) {
        if (coo[j - 1].z == id) {
            width += coo[j - 1].distance(coo[j]);
        }
    }
    return width;
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
        for (let i = 1; i < coo.length; i++) {

            let crosP = UGeo.intersectionLS(segmImp.p0, segmImp.p1, coo[i - 1], coo[i]) //точка пересечения прямой и отрезка           
            hsCheck.add(coo[i]);
            if (crosP !== null) {
                crosTwo.push(crosP); //вставим точку в сегмент
                if (hsCheck.add(crosP)) {
                    listExt.push(crosP);
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
        //PRINT(Polygon.new(cooL), 'Split-' + cooL.length + 'L-');
        //PRINT(Polygon.new(cooR), 'Split-' + cooR.length + 'R-');
        return [Polygon.new(cooL), Polygon.new(cooR)];

    } catch (e) {
        errorLog("Error: UGeo.splitPolygon(*) " + e.message);
    }
};

//Точка пересечения прямой и отрезка
UGeo.intersectionLS = (line1, line2, seg1, seg2) => {

    let orientS1 = Orientation.index(line1, line2, seg1);
    if (orientS1 === 0) {
        return seg1.copy();
    }
    let orientS2 = Orientation.index(line1, line2, seg2);
    if (orientS2 === 0) {
        return seg2.copy();
    }
    if ((orientS1 > 0 && orientS2 > 0) || (orientS1 < 0 && orientS2 < 0)) {
        return null;
    }
    let intPt = CGAlgorithmsDD.intersection(line1, line2, seg1, seg2); //точка пересечения двух линии               
    if (intPt !== null) {
        return intPt;
    }
    let dist1 = Distance.pointToLinePerpendicular(seg1, line1, line2);
    let dist2 = Distance.pointToLinePerpendicular(seg2, line1, line2);
    if (dist1 < dist2) {
        return seg1.copy();
    }
    return seg2;
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
UGeo.crossGeoOfLine = (poly, line) => {
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
        errorLog("Error: UGeo.crossGeoOfLine()" + e);
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

//При слиянии двух полигонов появляются точки соединения с непонятным Z значением
UGeo.updateZet = (arc, rec) => {
    let pass = false;
    let cooArc = arc.getCoordinates();
    let cooRec = rec.getCoordinates();

    for (let i = 0; i < cooArc.length - 1; i++) {
        if (cooArc[i].z % 1 !== 0) {
            for (let j = 1; j < cooRec.length; j++) {

                if (PointLocation.isOnLine(cooArc[i], [cooRec[j - 1], cooRec[j]])) {
                    if (pass === false) {

                        cooArc[i].z = cooRec[j].z;
                    } else {
                        cooArc[i].z = cooRec[j - 1].z;
                    }
                    pass = true;
                    break;
                }
            }
        }
    }
    cooArc[cooArc.length - 1].z = cooArc[0].z;
};

UGeo.bufferRectangl = (geoShell, hmDist) => {
    let segmRighShell = new LineSegment(), segmRighInner = null;
    let segmLeftShell = new LineSegment(), segmLeftInner = null;
    let set = new Set();
    let listBuffer = new Array();
    let listShell = new Array();
    let cooShell = geoShell.getCoordinates();
    try {
        for (let i = 0; i < cooShell.length; i++) {
            if (set.has(cooShell[i].z) === false) {
                set.add(cooShell[i].z);
                listShell.push(cooShell[i]);
            }
        }
        hmDist.set(4.0, 0.0); //такая вот фича!

        for (let i = 0; i < listShell.length; i++) {

            //Перебор левого и правого сегмента от точки пересечения 
            let j = (i === 0) ? listShell.length - 1 : i - 1;
            const id1 = listShell[j].z;
            segmRighShell.setCoordinates(listShell[j], listShell[i]);          
            segmRighInner = UGeo.offsetSegm(segmRighShell, -hmDist.get(id1));
            segmRighInner.p0.z = segmRighShell.p0.z;
            segmRighInner.p1.z = segmRighShell.p1.z;

            let k = (i === listShell.length - 1) ? 0 : i + 1;
            let id2 = listShell[i].z;
            segmLeftShell.setCoordinates(listShell[i], listShell[k]);
            segmLeftInner = UGeo.offsetSegm(segmLeftShell, -hmDist.get(id2));

            //Точка пересечения сегментов
            //let cross = segmLeftInner.lineIntersection(segmRighInner);
            let cross = CGAlgorithmsDD.intersection(segmLeftInner.p0, segmLeftInner.p1, segmRighInner.p0, segmRighInner.p1);
            if (cross !== null) {
                cross.z = listShell[i].z;
                listBuffer.push(cross);
            }
        }
        listBuffer.reverse();
        let listOut = [listShell];
        listOut.push(...listBuffer);
        listOut.push(listOut[0]);
        let result = Com5t.gf.createPolygon([...listOut]);
        return result;

    } catch (e) {
        errorLog("Error: UGeo.bufferRectangl() " + e);
    }
};

UGeo.bufferCurve = (geoShell, dist) => {

    let segmRighShell = new LineSegment(), segmRighInner = null;
    let segmLeftShell = new LineSegment(), segmLeftInner = null;
    let cross = new Coordinate();
    let cooShell = geoShell.getCoordinates();
    let ID = cooShell[cooShell.length / 2].z;

    let listInner = new Array();
    let listShell = cooShell.filter(c => c.z === ID);

    try {
        for (let i = 1; i < listShell.length; i++) {

            //Перебор левого и правого сегмента от точки пересечения
            if (i > Com5t.MAXSIDE || (cross !== null && i < Com5t.MAXSIDE)) {
                segmRighShell.setCoordinates(listShell[i - 1], listShell[i]);
                segmRighInner = UGeo.offsetSegm(segmRighShell, -dist);
            }
            if (i < Com5t.MAXSIDE || (cross !== null && i > Com5t.MAXSIDE)) {
                let j = (i === listShell.length - 1) ? 1 : i + 1;
                segmLeftShell.setCoordinates(listShell[i], listShell[j]);
                segmLeftInner = UGeo.offsetSegm(segmLeftShell, -dist);
            }

            //Коррекция первой и последней точки дуги
            if (i === 1) {
                segmRighInner.p0.z = ID;
                listInner.push(segmRighInner.p0);
            }
            //Точка пересечения сегментов
            cross = CGAlgorithmsDD.intersection(segmLeftInner.p0, segmLeftInner.p1, segmRighInner.p0, segmRighInner.p1);

            if (cross !== null) { //заполнение очереди
                cross.z = ID;
                listInner.push(cross);
            }
            if (i === listShell.length - 2) {
                segmLeftInner.p1.z = ID;
                listInner.push(segmLeftInner.p1);
            }
        }
        listInner.reverse();
        listInner.push(...listShell);
        listInner[0] = listInner[listInner.length - 1];               
        let result = Com5t.gf.createPolygon([...listInner]);
        return result; 
        
    } catch (e) {
        errorLog("Ошибка:UGeo.bufferCurve() " + e);
    }
}

UGeo.bufferPolygon = (geoShell, hmDist) => {
    try {
        let segmRighShell = new LineSegment(), segmRighInner = null;
        let segmLeftShell = new LineSegment(), segmLeftInner = null;
        let listBuffer = new Array();
        let listShell = geoShell.getCoordinates();
        for (let i = 0; i < listShell.length - 1; i++) {

            //Перебор левого и правого сегмента от точки пересечения 
            let j = (i === 0) ? listShell.length - 2 : i - 1;
            const id1 = listShell[j].z;
            segmRighShell.setCoordinates(listShell[j], listShell[i]);
            segmRighInner = UGeo.offsetSegm(segmRighShell, -hmDist.get(id1));
            
            let k = (i === listShell.length - 1) ? 0 : i + 1;
            const id2 = listShell[i].z;
            segmLeftShell.setCoordinates(listShell[i], listShell[k]);
            segmLeftInner = UGeo.offsetSegm(segmLeftShell, -hmDist.get(id2));
            
            //Точка пересечения сегментов
            let cross = CGAlgorithmsDD.intersection(segmLeftInner.p0, segmLeftInner.p1, segmRighInner.p0, segmRighInner.p1);
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

UGeo.newLineArch = (x1, x2, y, h, z) => {
    try {
        let R = (Math.pow((x2 - x1) / 2, 2) + Math.pow(h, 2)) / (2 * h);  //R = (L2 + H2) / 2H - радиус арки
        let angl = Math.PI / 2 - Math.asin((x2 - x1) / (R * 2));
        Com5t.gsf.setSize(2 * R);
        Com5t.gsf.setNumPoints(Com5t.MAXPOINT);
        let coord = Coordinate.new(x1 + (x2 - x1) / 2 - R, y - h);
        Com5t.gsf.setBase(coord);
        let ls = Com5t.gsf.createArc(Math.PI + angl, Math.PI - 2 * angl).reverse();
        let lc = ls.getCoordinates();
        lc.forEach(c => c.z = z);
        return Com5t.gf.createLineString(lc);
    } catch (e) {
        errorLog("Error: UGeo.lineArch() " + e.message);
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

/*
 * Точка внутри многоугольника.
 */
UGeo.insidePoly = (poly, x, y) => {
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

//Переьещение gson (точек на канве)
UGeo.moveGson = (gson, dx, dy, scale) => {
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
                UGeo.moveGson(child, dx, dy, scale);
            }
        }
    }
};

//Перемещение точек на канве (изменение размера окна)
UGeo.movePoint = (el, x, y) => {
    if (x > 0 || y > 0) {
        if ([Layout.BOT, Layout.HOR].includes(el.layout)) {
            if (el.passMask[0] === 0) {
                el.y1 = y;
            } else if (el.passMask[0] === 1) {
                el.y2 = y;
            }
        } else if ([Layout.RIG].includes(el.layout)) {
            if (el.passMask[0] === 0) {
                el.x1 = x;
            } else if (el.passMask[0] === 1) {
                el.x2 = x;
            }
        } else if ([Layout.TOP].includes(el.layout)) {
            if (el.passMask[0] === 0) {
                el.y1 = y;
            } else if (el.passMask[0] === 1) {
                el.y2 = y;
            }
        } else if ([Layout.LEF, Layout.VER].includes(el.layout)) {
            if (el.passMask[0] === 0) {
                el.x1 = x;
            } else if (el.passMask[0] === 1) {
                el.x2 = x;
            }
        }
    }
};

UGeo.segmentOffset = (segShell, dxy) =>  {
        let segInner = segShell.offset(dxy);
        segInner.p0.z = segShell.p0.z;
        segInner.p1.z = segShell.p1.z;
        return segInner;
    }
