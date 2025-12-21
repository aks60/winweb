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
                hm.set(el.id, rec[ARTIKL.height] - rec[ARTIKL.size_centr] - rec[ARTIKL.size_falz] + amend);
            }
        }
        return 777;
//               if (cooShell.length > Com5t.MAXSIDE) {
//     double id = cooShell[geoShell.getCoordinates().length / 2].z;
//     Polygon polyCurv = bufferCurve(geoShell, hm.get(id));
//     Polygon polyRect = bufferRectangl(geoShell, hm);
//     Polygon polyArch = (Polygon) polyRect.union(polyCurv);
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


