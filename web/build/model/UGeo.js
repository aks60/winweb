
//------------------------------------------------------------------------------
export function isValidColor(jso, key, def) {
    try {
        if (isValidNumber(jso[key])) {
            return jso[key];
        } else {
            return def;
        }
    } catch (e) {
        return def;
    }
}
////------------------------------------------------------------------------------
//export function isEmptyParam(jso, key) {
//    try {
//        if (isValidNumber(jso[key])) {
//            return jso[key];
//        } else {
//            return def;
//        }
//    } catch (e) {
//        return def;
//    }
//}
//------------------------------------------------------------------------------
export function isValidNumber(val, def) {
    if (typeof val === 'number' && Number.isFinite(val)) {
        return val;
    } else {
        def;
    }
}
//------------------------------------------------------------------------------    
export function isValidJson(str, def) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return def;
    }
}
//------------------------------------------------------------------------------
//bufferGeometry(geoShell, this.winc.listElem, -6, 1)
export function bufferGeometry(geoShell, list, amend, opt) {

    /*        let cooShell = geoShell.getCoordinates();
     Map hm = new Map();
     try {
     //Смещения сегментов
     for (let el of list) {
     dataset.Record rec = (el.artiklRec == null) ? eArtikl.virtualRec() : el.artiklRec;
     if (opt == 0) {
     hm.put(el.id, rec.getDbl(eArtikl.height) - rec.getDbl(eArtikl.size_centr) + amend);
     } else if (opt == 1) {
     hm.put(el.id, rec.getDbl(eArtikl.height) - rec.getDbl(eArtikl.size_centr) - rec.getDbl(eArtikl.size_falz) + amend);
     }
     }
     /*           if (cooShell.length > Com5t.MAXSIDE) {
     double id = cooShell[geoShell.getCoordinates().length / 2].z;
     Polygon polyCurv = bufferCurve(geoShell, hm.get(id));
     Polygon polyRect = bufferRectangl(geoShell, hm);
     Polygon polyArch = (Polygon) polyRect.union(polyCurv);
     
     LinearRing ring = polyArch.getInteriorRingN(0);
     Polygon poly = gf.createPolygon(ring);
     poly.normalize();
     //Test.init(polyRect); 
     updateZet(poly, polyRect);
     return poly;
     
     } else {
     Polygon poly1 = bufferPolygon(geoShell, hm);
     return poly1;
     }
     //Test.init(poly1, poly2); 
     } catch (Exception e) {
     System.err.println("Ошибка:UGeo.buffer() " + e);
     }
     return null;
     */
}


