//------------------------------------------------------------------------------
export let UGeo = {};
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
        debugger;
//  if (cooShell.length > Com5t.MAXSIDE) {
//     let id = cooShell[geoShell.getCoordinates().length / 2].z;
//     let polyCurv = bufferCurve(geoShell, hm.get(id));
//     let polyRect = bufferRectangl(geoShell, hm);
//     let polyArch = polyRect.union(polyCurv);
//     
//     LinearRing ring = polyArch.getInteriorRingN(0);
//     Polygon poly = gf.createPolygon(ring);
//     poly.normalize();
//     //Test.init(polyRect); 
//     updateZet(poly, polyRect);
//     return poly;
//     
//     } else {
//     Polygon poly1 = bufferPolygon(geoShell, hm);
//     return poly1;
//     }
        //Test.init(poly1, poly2); 
    } catch (e) {
        console.log("Ошибка: uGeo.bufferGeometry() " + e);
    }
    return null;

};
//------------------------------------------------------------------------------
UGeo.bufferCurve = (geoShell, dist) => {

//        Polygon result = gf.createPolygon();
//        Coordinate[] cooShell = geoShell.getCoordinates();
//        double ID = cooShell[cooShell.length / 2].z;
//
//        List<Coordinate> listInner = new ArrayList<Coordinate>();
//        List<Coordinate> listShell = List.of(cooShell).stream().filter(c -> c.z == ID).toList();
//
//        try {
//            for (int i = 1; i < listShell.size(); i++) {
//
//                //Перебор левого и правого сегмента от точки пересечения
//                if (i > Com5t.MAXSIDE || (cross != null && i < Com5t.MAXSIDE)) {
//                    segRighShell.setCoordinates(listShell.get(i - 1), listShell.get(i));
//                    segRighInner = segRighShell.offset(-dist);
//                }
//                if (i < Com5t.MAXSIDE || (cross != null && i > Com5t.MAXSIDE)) {
//                    int j = (i == listShell.size() - 1) ? 1 : i + 1;
//                    segLeftShell.setCoordinates(listShell.get(i), listShell.get(j));
//                    segLeftInner = segLeftShell.offset(-dist);
//                }
//
//                //Коррекция первой и последней точки дуги
//                if (i == 1) {
//                    segRighInner.p0.z = ID;
//                    listInner.add(segRighInner.p0);
//                }
//                //Точка пересечения сегментов
//                cross = segLeftInner.intersection(segRighInner);
//
//                if (cross != null) { //заполнение очереди
//                    cross.z = ID;
//                    listInner.add(cross);
//                }
//                if (i == listShell.size() - 2) {
//                    segLeftInner.p1.z = ID;
//                    listInner.add(segLeftInner.p1);
//                }
//            }
//            //Test.init(gf.createLineString(listInner.toArray(new Coordinate[0]);
//            Collections.reverse(listInner);
//            listInner.addAll(listShell);
//            listInner.add(0, listInner.get(listInner.size() - 1));
//            result = gf.createPolygon(listInner.toArray(new Coordinate[0]));
//
//        } catch (Exception e) {
//            System.err.println("Ошибка:UGeo.bufferCurve() " + e);
//        }
//        return result;
            return {};
    }
