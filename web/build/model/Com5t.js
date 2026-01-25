
import PrecisionModel from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/PrecisionModel.js';
import GeometryFactory from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/GeometryFactory.js';
import LineSegment from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineSegment.js';

export class Com5t {

    static MAXSIDE = 200;
    static MAXPOINT = 1000;
    static #jsonID = 0;
    static gf = new GeometryFactory(new PrecisionModel()); //фабрика геометрий    
    //static gsf = new GeometricShapeFactory(gf);
    //static aff = new AffineTransformation();    

    id = null; //идентификатор элемента
    winc = null; //главн. класс калькуляции
    root = null;
    owner = null; //владелец
    gson = null; //json объект элемента
    type = null; //тип элемента или окна
    area = null; //ареа компонента 

    sysprofRec = null; //профиль системы
    artiklRec = null; //мат.средства
    artiklRecAn = null; //аналог.мат.средств    

    colorID1 = null; //базовый
    colorID2 = null; //внутренний
    colorID3 = null; //внешний

    constructor(winc, gson, owner) {
        try {
            this.id = gson.id;
            this.winc = winc;
            this.root = winc.root;
            this.owner = owner;
            this.gson = gson;
        } catch (e) {
            errorLog('Error: Com5t.constructor() ' + e.message);
        }
    }
    //Длина компонента
    length() {
        if (this.gson.h !== undefined) {
            return new LineSegment(this.x1, this.y1, this.x2, this.y2).getLength();
        } else {
            //return UGeo.lengthCurve(owner.area.getGeometryN(0), this.id); 
            console.log('Com5t.length() - функция не реализована');
        }
    }
    color() {
        return (this.timer.timerId !== null) ? [255, 120, 0] : this.color2Rec[eColor.rgb];
    }
    
    width() {
        return (this.x2 > this.x1) ? this.x2 - this.x1 : this.x1 - this.x2;
    }

    height() {
        return (this.y2 > this.y1) ? this.y2 - this.y1 : this.y1 - this.y2;
    }
    get x1() {
        return this.gson.x1;
    }

    get y1() {
        return this.gson.y1;
    }

    get x2() {
        return this.gson.x2;
    }

    get y2() {
        return this.gson.y2;
    }

    get jsonID() {
        let max = 0;
        for (let e of this.winc.listAll) {
            max = e.id > max ? e.id : max;
        }
        return max;
    }
}