
export class Com5t {

    static MAXSIDE = 200;
    static MAXPOINT = 1000;

    constructor(winc, gson, owner) {
        this.winc = winc;
        this.owner = owner; //владелец
        this.gson = gson;
        this.color1Rec = winc.color1Rec;
        this.color2Rec = winc.color2Rec;
        this.color3Rec = winc.color3Rec;
    }   
}