export class LineSegm extends jsts.geom.LineSegment {

    constructor() {
        super();
    }

    setCoordinates(p0, p1, z) {
        this.p0.x = p0.x;
        this.p0.y = p0.y;
        this.p0.z = p0.z;
        this.p1.x = p1.x;
        this.p1.y = p1.y;
        this.p1.z = p1.z;
    }

    offset(offsetDistance) {
        seg = super.offset(offsetDistance);
        seg.p0.z = this.p0.z;
        seg.p1.z = this.p1.z;
        return seg;
    }

    intersection(line) {
        let c = super.intersection(line);
        c.z = line.p0.z;
        return c;
    }
}


