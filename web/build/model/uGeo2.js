
export let UGeo = {};
//------------------------------------------------------------------------------
UGeo.isValidJson = (jso, key, def) => {
    try {
        if (isValidNumber(jso[key])) {
            return jso[key];
        } else {
            return def;
        }
    } catch (e) {
        return def;
    }
};
//------------------------------------------------------------------------------
UGeo.isValidNumber = (val, def) => {
    if (typeof val === 'number' && Number.isFinite(val)) {
        return val;
    } else {
        def;
    }
};
//------------------------------------------------------------------------------
UGeo.findJson = (id, data) => {
    let obj = {};

    let recursive = (data) => {
        if (id == data.id) {
            obj = data;
        }
        if (typeof data === 'object' && data !== null) {
            // Если это массив
            if (Array.isArray(data)) {
                data.forEach((item, index) => {
                    recursive(item); //рекурсивный вызов
                });
            } else { // Если это объект
                Object.keys(data).forEach(key => {
                    recursive(data[key]); //рекурсивный вызов
                });
            }
        }
    };
    recursive(data);
    return obj;
};
//------------------------------------------------------------------------------
//Угол неориентированный к горизонту. Угол нормируется в диапазоне [0, 2PI].
UGeo.anglHor = (x1, y1, x2, y2) => {
    let ang = radToDeg(jsts.algoritm.Angle.angle(new jsts.geom.Coordinate(x1, y1), new jsts.geom.Coordinate(x2, y2)));
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
     System.err.println("Ошибка:uGeo.buffer() " + e);
     }
     return null;
     */
};


