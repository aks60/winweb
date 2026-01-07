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
        alert(`Ошибка: Test()  ` + e.message);
    }
}

export function Test2() {
// Output:
// POLYGON((1 1,1 5,9 5,9 1,1 1))
// POLYGON((1 5,1 9,9 9,9 5,1 5))

    var reader = new WKTReader();
    var writer = new WKTWriter();

    //var a = reader.read('POLYGON ((0 0, 0 50, 50 50, 50 0, 0 0))');
    //var b = reader.read('LINESTRING (0 20, 50 20)');
    var a = reader.read('POLYGON ((1 1, 1 9, 9 9, 9 1, 1 1))');
    var b = reader.read('LINESTRING (0.5 5, 9.6 5, 9.6 3.9)');

    //var union = a.getExteriorRing().union(b);
    var union = UnionOp.union(a, b);

    var polygonizer = new Polygonizer();
    polygonizer.add(union);

    var polygons = polygonizer.getPolygons();
    for (var i = polygons.iterator(); i.hasNext(); ) {
        var polygon = i.next();
        console.log(writer.write(polygon));
    }
}



