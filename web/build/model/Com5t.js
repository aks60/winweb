
export class Com5t {

    static MAXSIDE = 200;
    static MAXPOINT = 1000;

    constructor(winc, id, ownerId) {
        this.winc = winc;
        this.ownerId = ownerId;
        this.gson = winc.findJson(id);
        this.color1Rec = winc.color1Rec;
        this.color2Rec = winc.color2Rec;
        this.color3Rec = winc.color3Rec;
    }   

    get id() {
        return this.gson.id;
    }
//    get ownerId() {
//        return this.ownerId;
//    }
//    set(ownerId) {
//        this.ownerId = ownerId;
//    }
    get childs() {
        return this.gson.childs;
    }
    get param() {
        return this.gson.param;
    }
    get type() {
        return this.gson.type;
    }
}