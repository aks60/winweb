//https://stackoverflow.com/questions/36118883/using-jsts-buffer-to-identify-a-self-intersecting-polygon
//https://openlayers.org/en/latest/examples/jsts.html
//https://gist.github.com/pgiraud/2ed05b0a9e394c5652b3
//https://gis.stackexchange.com/questions/388347/spatial-operations-with-jsts
//https://www.clouddefense.ai/code/javascript/example/jsts
//https://gist.github.com/ThomasG77/d66f1040960646abf56c90ae5e759b8a

import {Com5t} from '../build/model/Com5t.js';
import Coordinate from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/Coordinate.js';
import LineSegment from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/LineSegment.js';
import LineString from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/LineString.js';
import LinearRing from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/LinearRing.js';
import Polygon from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/Polygon.js';

//import Intersection from '../lib-js/jsts-2.12.1/org/locationtech/jts/algorithm/Intersection.js';
//import PointLocator from '../lib-js/jsts-2.12.1/org/locationtech/jts/algorithm/PointLocator.js';

export function localizeFactory() {
    
    Coordinate.new = (x, y, z) => {
        if (z === undefined)
            return new Coordinate(x, y);
        else
            return new Coordinate(x, y, z);
    };

    LineSegment.new = (arr1, arr2) => {
        let p1 = null, p2 = null;
        if (arr1.length < 3)
            p1 = new Coordinate(arr1[0], arr1[1]);
        else
            p1 = new Coordinate(arr1[0], arr1[1], arr1[2]);

        if (arr2.length < 3)
            p2 = new Coordinate(arr2[0], arr2[1]);
        else
            p2 = new Coordinate(arr2[0], arr2[1], arr2[2]);

        return new LineSegment(p1, p2);
    };

    LineString.new = (masArr) => {
        let arr = new Array();
        for (const p of masArr) {
            if (p.length < 3)
                arr.push(Coordinate.new(p[0], p[1]));
            else
                arr.push(Coordinate.new(p[0], p[1], p[2]));
        }
        return  Com5t.gf.createLineString(arr);
    };

    LinearRing.new = (masArr) => {
        let arr = new Array();
        for (const p of masArr) {
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
        for (const p of masArr) {
            if (p.length < 3)
                arr.push(Coordinate.new(p[0], p[1]));
            else
                arr.push(Coordinate.new(p[0], p[1], p[2]));
        }
        arr.push(new Coordinate(arr[0]));
        return Com5t.gf.createPolygon(arr);
    };
}

export function Test() {
    try {
        let p1 = new Coordinate(10, 0, 1);
        let p2 = new Coordinate(100, 100, 2);
        let p3 = new Coordinate(5, 20, 3);
        let p4 = new Coordinate(5, 40, 4);
        let p5 = new Coordinate(5, 40, 5);
        let p6 = new Coordinate(100, 40, 6);

        let poly1 = Polygon.new([[0, 0, 1], [0, 1300, 2], [1400, 1300, 3], [1400, 0, 4]]);
        let poly2 = Polygon.new([[0, 0], [0, 1300], [1400, 1300], [1400, 0]]);
        let line1 = LineString.new([[0, 0, 1], [100, 20, 2]]);
        let line2 = LineString.new([[0, 0], [100, 20]]);
        var v = 0;


        //alert(`Превет Test().`);
    } catch (e) {
        alert(`Ошибка: Test()  ` + e.message);
    }
}



