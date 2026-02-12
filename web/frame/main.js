//https://stackoverflow.com/questions/36118883/using-jsts-buffer-to-identify-a-self-intersecting-polygon
//https://openlayers.org/en/latest/examples/jsts.html
//https://gist.github.com/pgiraud/2ed05b0a9e394c5652b3
//https://gis.stackexchange.com/questions/388347/spatial-operations-with-jsts
//https://www.clouddefense.ai/code/javascript/example/jsts
//https://gist.github.com/ThomasG77/d66f1040960646abf56c90ae5e759b8a

import {Com5t} from '../build/model/Com5t.js'
import {UGeo} from '../build/model/uGeo.js'
import Coordinate from '../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Coordinate.js'
import Point from '../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Point.js'
import LineSegment from '../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineSegment.js'
import LineString from '../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineString.js'
import LinearRing from '../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LinearRing.js'
import Polygon from '../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Polygon.js';
//import {UGeo} from '../build/model/uGeo.js';
import WKTReader from '../lib-js/jsts-2.11.2/org/locationtech/jts/io/WKTReader.js'
import WKTWriter from '../lib-js/jsts-2.11.2/org/locationtech/jts/io/WKTWriter.js'
//import UnionOp from '../lib-js/jsts-2.11.2/org/locationtech/jts/operation/union/UnionOp.js'
//import UnaryUnionOp from '../lib-js/jsts-2.11.2/org/locationtech/jts/operation/union/UnaryUnionOp.js'
//import Geometry from '../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Geometry.js';
//import GeometryFactory from '../lib-js/jsts-2.11.2/org/locationtech/jts/geom/GeometryFactory.js';
//import GeoJSONReader from '../lib-js/jsts-2.11.2/org/locationtech/jts/io/GeoJSONReader.js';
//import GeoJSONWriter from '../lib-js/jsts-2.11.2/org/locationtech/jts/io/GeoJSONWriter.js';
//import Intersection from '../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/Intersection.js';
import Orientation from '../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/Orientation.js';

export function localizeFactory() {

    function mas(geo) {
        if (geo instanceof Coordinate)
            return [geo.x, geo.y, geo.z];
        else if (geo instanceof Array)
            return geo;
        return null;
    }

    Point.new = (p) => {
        if (p instanceof Coordinate)
            return new Point(p);
        else
            return Coordinate.new(p[0], p[1], p[2]);
    };

    Coordinate.new = (x, y, z) => {
        if (z === undefined)
            return new Coordinate(x, y);
        else
            return new Coordinate(x, y, z);
    };

    LineSegment.new = (p1, p2) => {
        let m1 = mas(p1), m2 = mas(p2);
        let c1 = null, c2 = null;
        if (m1.length < 3)
            c1 = Coordinate.new(m1[0], m1[1]);
        else
            c1 = Coordinate.new(m1[0], m1[1], m1[2]);

        if (m2.length < 3)
            c2 = Coordinate.new(m2[0], m2[1]);
        else
            c2 = Coordinate.new(m2[0], m2[1], m2[2]);

        return new LineSegment(c1, c2);
    };

    LineString.new = (masArr) => {
        let arr = new Array();
        for (const m of masArr) {
            let p = mas(m);
            if (p.length < 3)
                arr.push(Coordinate.new(p[0], p[1]));
            else
                arr.push(Coordinate.new(p[0], p[1], p[2]));
        }
        return  Com5t.gf.createLineString(arr);
    };

    LinearRing.new = (masArr) => {
        let arr = new Array();
        for (const m of masArr) {
            let p = mas(m);
            if (p.length < 3)
                arr.push(Coordinate.new(p[0], p[1]));
            else
                arr.push(Coordinate.new(p[0], p[1], p[2]));
        }
        arr.push(new Coordinate(arr[0]));
        return  Com5t.gf.createLinearRing(arr);
    };

    Polygon.new = (masArr) => {
        let arr = new Array();
        for (const m of masArr) {
            let p = mas(m);
            if (p.length < 3)
                arr.push(Coordinate.new(p[0], p[1]));
            else
                arr.push(Coordinate.new(p[0], p[1], p[2]));
        }
        if (arr[0].x !== arr[arr.length - 1].x
                || arr[0].y !== arr[arr.length - 1].y) {
            arr.push(new Coordinate(arr[0]));
        }
        return Com5t.gf.createPolygon(arr);
    };
}

export function Test1() {
    try {
        //debugger;
//        var reader = new WKTReader();
//        let o1 = LineSegment.new([650, 0, 7], [650, 1400, 7]);
//        //let o1 = reader.read('LINESTRING Z (650 0 7, 650 1400 7)');
//        let o2 = reader.read('POLYGON Z ((0 0 1, 0 1400 2, 1302 1195 3, 1300 0 4, 0 0 1))');
//        let o3 = UGeo.splitPolygon(o2, o1);
//        UGeo.PRINT(o3[0]);
//        UGeo.PRINT(o3[1]);
        debugger;
        let test = Coordinate.new(650, 1400);
        //let cross = jsts.algorithm.Intersection.intersection(Coordinate.new(650, 1400),
                //Coordinate.new(650, 0), Coordinate.new(0, 100), Coordinate.new(1300, 100));
        
       let m = Orientation.index(Coordinate.new(650, 1400), Coordinate.new(650, 0),  Coordinate.new(0, 100));
       let h = 0;
    } catch (e) {
        errorLog('Error: Test1()  ' + e.message);
    }
}

export function Test2() {
//    try {
//        var reader = new WKTReader();
//        var writer = new WKTWriter();
//
//        var a = reader.read('POLYGON ((2 2, 2 4, 10 4, 10 2, 2 2))');
//        var b = reader.read('POLYGON ((1 3, 1 6, 8 6, 8 3, 1 3))');
//        var c = reader.read('LINESTRING (0 3, 12 3)');
//
//        var union = UnionOp.union(a.getExteriorRing(), c);
//        var polygonizer = new Polygonizer();
//        polygonizer.add(union);
//        var polygons = polygonizer.getPolygons();
//
//        let set = new WeakSet(polygons.get(0).getExteriorRing());
//        let v = set.values();
//        for (var i = polygons.iterator(); i.hasNext(); ) {
//            var polygon = i.next();
//            console.log(writer.write(polygon));
//        }
//        console.log(writer.write(v));
//
//    } catch (e) {
//        alert(`Ошибка: Test2()  ` + e.message);
//    }
}

export function Test3() {
//    let reader = new GeoJSONReader();
//    let writer = new GeoJSONWriter();
//
//    var a = {"type": "Polygon", "coordinates": [[
//                [-97.82742, 30.44107],
//                [-97.82753, 30.44087],
//                [-97.82426, 30.43791],
//                [-97.82259, 30.43820],
//                [-97.82233, 30.43816],
//                [-97.82046, 30.44090],
//                [-97.82106, 30.44153],
//                [-97.82208, 30.44232],
//                [-97.82221, 30.44238],
//                [-97.82450, 30.44352],
//                [-97.82461, 30.44357],
//                [-97.82552, 30.44387],
//                [-97.82727, 30.44114],
//                [-97.82742, 30.44107]
//            ]]};
//
//    var b = {"type": "Polygon", "coordinates": [[
//                [-97.81808, 30.43962],
//                [-97.81585, 30.43878],
//                [-97.81445, 30.43504],
//                [-97.81522, 30.42965],
//                [-97.81685, 30.42817],
//                [-97.81847, 30.42851],
//                [-97.82310, 30.43025],
//                [-97.83076, 30.42995],
//                [-97.83162, 30.43439],
//                [-97.82789, 30.43968],
//                [-97.81808, 30.43962]
//            ]]};
//
//    a = reader.read(a);
//    b = reader.read(b);
//
//    var result = UnionOp.union(a, b);
//
//    result = writer.write(result);
//
//    console.log(result);
}

