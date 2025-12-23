
export class Com5t {

    static MAXSIDE = 200;
    static MAXPOINT = 1000;
    static gf = new jsts.geom.GeometryFactory(new jsts.geom.PrecisionModel(1000)); //фабрика геометрий    

    id = null; //идентификатор элемента
    winc = null; //главн. класс калькуляции
    owner = null; //владелец
    gson = null; //json объект элемента
    type = null; //тип элемента или окна
    area = null; //ареа компонента 

    sysprofRec = null; //профиль системы
    artiklRec = null; //мат.средства
    artiklRecAn = null; //аналог.мат.средств    

    color1Rec = null; //базовый
    color2Rec = null; //внутренний
    color3Rec = null; //внешний

    constructor(winc, gson, owner) {
        try {
            this.id = gson.id;
            this.winc = winc;
            this.owner = owner; //владелец
            this.gson = gson;
            this.color1Rec = winc.color1Rec;
            this.color2Rec = winc.color2Rec;
            this.color3Rec = winc.color3Rec;
        } catch (e) {
            errorLog('Error: Com5t.constructor() ' + e.message);
        }
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
}