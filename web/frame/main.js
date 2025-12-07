
import {CAMA} from '../build/model/Cama.js';

export function sayHi() {
    
    var OBJ3 = new jsts.io.GeoJSONReader();
    var OBJ4 = new jsts.geom.Location();
    var OBJ5 = new jsts.geom.GeometryFactory();
    var OBJ6 = new jsts.operation.buffer.BufferParameters();
    var OBJ7 = new jsts.io.GeoJSONWriter();
    var OBJ8 = new jsts.geom.Coordinate();
    var OBJ9 = new jsts.io.OL3Parser();
    
    alert(`Превет sayHi(). ` + CAMA);
}


