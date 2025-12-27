import {Com5t} from '/winweb/build/model/Com5t.js';
import PrecisionModel from '../lib-js/jsts-2.12.1M/org/locationtech/jts/geom/PrecisionModel.js';
import GeometryFactory from '../lib-js/jsts-2.12.1M/org/locationtech/jts/geom/GeometryFactory.js';

//https://stackoverflow.com/questions/36118883/using-jsts-buffer-to-identify-a-self-intersecting-polygon
//https://openlayers.org/en/latest/examples/jsts.html
//https://gist.github.com/pgiraud/2ed05b0a9e394c5652b3
//https://gis.stackexchange.com/questions/388347/spatial-operations-with-jsts
//https://www.clouddefense.ai/code/javascript/example/jsts
//https://gist.github.com/ThomasG77/d66f1040960646abf56c90ae5e759b8a

export function Test1() {
    try {
//        var OBJ03 = new GeoJSONReader();
//        var OBJ04 = new Location();
//        var OBJ06 = new BufferParameters();
//        var OBJ07 = new GeoJSONWriter();
//        var OBJ08 = new Coordinate();
//        var OBJ09 = new OL3Parser();
//        var OBJ10 = new PrecisionModel(1000);
//        var OBJ11 = new GeometryFactory(OBJ10);
//        var OBJ12 = new GeometricShapeFactory(OBJ11);
//        var OBJ13 = new AffineTransformation();
//        var OBJ15 = new Envelope();
//        var OBJ16 = new Geometry();
//        var OBJ17 = new LineString();
//        //var OBJ18 = new Polygon();
//
//        {
//            let coordinates = [
//                new Coordinate(0, 0),
//                new Coordinate(10, 0),
//                new Coordinate(10, 10),
//                new Coordinate(0, 10),
//                new Coordinate(0, 0) // Closing point
//            ];
//            let pm = new PrecisionModel(1000);
//            let gf = new GeometryFactory(pm);
//            let shell = gf.createLinearRing(coordinates);
//            let polygon = gf.createPolygon(shell, null);
//            console.log("Polygon area:", polygon.getArea());
//            console.log("Polygon centroid:", polygon.getCentroid().toString());
//            console.log("WKT representation:", new WKTWriter().write(polygon));
//
//        }

        alert(`Превет Test1().`);
    } catch (e) {
        alert(`Ошибка: Test1()  ` + e.message);
    }
}

export function Test2() {
    let result = Com5t.gf.createPolygon();
    let listShell = Array.of([1, 2, 3]);
    let listBuffer = new Array();
}


