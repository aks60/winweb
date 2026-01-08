//https://stackoverflow.com/questions/36118883/using-jsts-buffer-to-identify-a-self-intersecting-polygon
//https://openlayers.org/en/latest/examples/jsts.html
//https://gist.github.com/pgiraud/2ed05b0a9e394c5652b3
//https://gis.stackexchange.com/questions/388347/spatial-operations-with-jsts
//https://www.clouddefense.ai/code/javascript/example/jsts
//https://gist.github.com/ThomasG77/d66f1040960646abf56c90ae5e759b8a

import {Com5t} from '../build/model/Com5t.js'
import {UGeo} from '../build/model/uGeo.js';
import Coordinate from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/Coordinate.js'
import Point from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/Point.js'
import LineSegment from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/LineSegment.js'
import LineString from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/LineString.js'
import LinearRing from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/LinearRing.js'
import Polygon from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/Polygon.js';

import WKTReader from '../lib-js/jsts-2.12.1/org/locationtech/jts/io/WKTReader.js'
import WKTWriter from '../lib-js/jsts-2.12.1/org/locationtech/jts/io/WKTWriter.js'
import UnionOp from '../lib-js/jsts-2.12.1/org/locationtech/jts/operation/union/UnionOp.js'
import UnaryUnionOp from '../lib-js/jsts-2.12.1/org/locationtech/jts/operation/union/UnaryUnionOp.js'
import Polygonizer from '../lib-js/jsts-2.12.1/org/locationtech/jts/operation/polygonize/Polygonizer.js'
import Geometry from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/Geometry.js';
import GeometryFactory from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/GeometryFactory.js';
import GeoJSONReader from '../lib-js/jsts-2.12.1/org/locationtech/jts/io/GeoJSONReader.js';
import GeoJSONWriter from '../lib-js/jsts-2.12.1/org/locationtech/jts/io/GeoJSONWriter.js';

//import Intersection from '../lib-js/jsts-2.12.1/org/locationtech/jts/algorithm/Intersection.js';
//import PointLocator from '../lib-js/jsts-2.12.1/org/locationtech/jts/algorithm/PointLocator.js';

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
        arr.push(new Coordinate(arr[0]));
        return Com5t.gf.createPolygon(arr);
    };
}

export function Test1() {
    try {
//        debugger;
//        let p1 = new Coordinate(10, 0, 1);
//        let p2 = new Coordinate(100, 100, 2);
//        let p3 = new Coordinate(5, 20, 3);
//        let p4 = new Coordinate(5, 40, 4);
//
//        let c1 = new Coordinate(10, 0, 1);
//        let c2 = new Coordinate(100, 100, 2);
//        let x1 = LineString.new([c1, c2]);
//        let x2 = Polygon.new([p1, p2, p3, p4]);

//        let o1 = LineSegment.new([650, 0, 7], [650, 1400, 7]);
//        let o2 = Polygon.new([[0, 0, 1], [0, 1400, 2], [1300, 1400, 3], [1300, 0, 4]]);
//        let o3 = UGeo.splitPolygon(o2, o1);
//        let o4 = 0;

        //alert(`Превет Test().`);
    } catch (e) {
        alert(`Ошибка: Test1()  ` + e.message);
    }
}

export function Test2() {
    try {
        debugger;
// POLYGON((1 1,1 5,9 5,9 1,1 1))
// POLYGON((1 5,1 9,9 9,9 5,1 5))

        var reader = new WKTReader();
        var writer = new WKTWriter();

        var a = reader.read('POLYGON ((0 0, 0 50, 50 50, 50 0, 0 0))');
        var b = reader.read('LINESTRING (0 20, 50 20)');
        //var a = reader.read('POLYGON ((1 1, 1 9, 9 9, 9 1, 1 1))');
        //var b = reader.read('LINESTRING (0.5 5, 9.6 5, 9.6 3.9)');
        //var a = reader.read('POLYGON ((10 10, 10 40, 40 40, 40 10, 10 10))');
        //var b = reader.read('POLYGON ((30 30, 30 60, 60 60, 60 30, 30 30))');

        var unions = a.union();

        var a1 = a.getExteriorRing();
        var b1 = a.getExteriorRing();
        var union = UnionOp.union(a1, b1);

//        var polygonizer = new Polygonizer();
//        polygonizer.add(union);
//
//        var polygons = polygonizer.getPolygons();
//        for (var i = polygons.iterator(); i.hasNext(); ) {
//            var polygon = i.next();
//            console.log(writer.write(polygon));
//        }
//        console.log('Union Result WKT:', polygons);

    } catch (e) {
        alert(`Ошибка: Test2()  ` + e.message);
    }
}

export function Test3() {
    try {
        const wktGeom1 = 'POLYGON ((10 10, 10 40, 40 40, 40 10, 10 10))';
        const wktGeom2 = 'POLYGON ((30 30, 30 60, 60 60, 60 30, 30 30))';
        const wktGeom3 = 'POLYGON ((50 50, 50 80, 80 80, 80 50, 50 50))';

        var reader = new WKTReader();
        const geom1 = reader.read(wktGeom1);
        const geom2 = reader.read(wktGeom2);
        const geom3 = reader.read(wktGeom3);

        const geometries = [geom1, geom2, geom3];

        const unionOp = new UnaryUnionOp(geometries);

        const unionResult = unionOp.union();

        console.log('Union Result WKT:', unionResult.toString());

    } catch (e) {
        alert(`Ошибка: Test3()  ` + e.message);
    }
}

export function Test4() {
    let reader = new GeoJSONReader();
    let writer = new GeoJSONWriter();

    var a = {"type": "Polygon", "coordinates": [[
                [-97.82742, 30.44107],
                [-97.82753, 30.44087],
                [-97.82426, 30.43791],
                [-97.82259, 30.43820],
                [-97.82233, 30.43816],
                [-97.82046, 30.44090],
                [-97.82106, 30.44153],
                [-97.82208, 30.44232],
                [-97.82221, 30.44238],
                [-97.82450, 30.44352],
                [-97.82461, 30.44357],
                [-97.82552, 30.44387],
                [-97.82727, 30.44114],
                [-97.82742, 30.44107]
            ]]};

    var b = {"type": "Polygon", "coordinates": [[
                [-97.81808, 30.43962],
                [-97.81585, 30.43878],
                [-97.81445, 30.43504],
                [-97.81522, 30.42965],
                [-97.81685, 30.42817],
                [-97.81847, 30.42851],
                [-97.82310, 30.43025],
                [-97.83076, 30.42995],
                [-97.83162, 30.43439],
                [-97.82789, 30.43968],
                [-97.81808, 30.43962]
            ]]};

    a = reader.read(a);
    b = reader.read(b);

    var result = a.union(b);

    result = writer.write(result);

    console.log(result);
}

