import {Com5t} from '/winweb/build/model/Com5t.js';

//https://stackoverflow.com/questions/36118883/using-jsts-buffer-to-identify-a-self-intersecting-polygon
//https://openlayers.org/en/latest/examples/jsts.html
//https://gist.github.com/pgiraud/2ed05b0a9e394c5652b3
//https://gis.stackexchange.com/questions/388347/spatial-operations-with-jsts
//https://www.clouddefense.ai/code/javascript/example/jsts
//https://gist.github.com/ThomasG77/d66f1040960646abf56c90ae5e759b8a

export function Test1() {
    try {
        var OBJ03 = new jsts.io.GeoJSONReader();
        var OBJ04 = new jsts.geom.Location();
        var OBJ06 = new jsts.operation.buffer.BufferParameters();
        var OBJ07 = new jsts.io.GeoJSONWriter();
        var OBJ08 = new jsts.geom.Coordinate();
        var OBJ09 = new jsts.io.OL3Parser();
        var OBJ10 = new jsts.geom.PrecisionModel(1000);
        var OBJ11 = new jsts.geom.GeometryFactory(OBJ10);
        var OBJ12 = new jsts.util.GeometricShapeFactory(OBJ11);
        var OBJ13 = new jsts.geom.util.AffineTransformation();
        var OBJ15 = new jsts.geom.Envelope();
        var OBJ16 = new jsts.geom.Geometry();
        var OBJ17 = new jsts.geom.LineString();
        //var OBJ18 = new jsts.geom.Polygon();

        {
            let coordinates = [
                new jsts.geom.Coordinate(0, 0),
                new jsts.geom.Coordinate(10, 0),
                new jsts.geom.Coordinate(10, 10),
                new jsts.geom.Coordinate(0, 10),
                new jsts.geom.Coordinate(0, 0) // Closing point
            ];
            let pm = new jsts.geom.PrecisionModel(1000);
            let gf = new jsts.geom.GeometryFactory(pm);
            let shell = gf.createLinearRing(coordinates);
            let polygon = gf.createPolygon(shell, null);
            console.log("Polygon area:", polygon.getArea());
            console.log("Polygon centroid:", polygon.getCentroid().toString());
            console.log("WKT representation:", new jsts.io.WKTWriter().write(polygon));

        }

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


