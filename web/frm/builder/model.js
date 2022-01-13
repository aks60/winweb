//------------------------------------------------------------------------------
import {draw_line, draw_stroke_polygon, draw_full_polygon} from './drawing.js';
import {SYS, CGR, COL, ART, ADET, PROD, SFUR} from './dbset.js';
//------------------------BASE--------------------------------------------------
export class Com5t {

    constructor(obj, owner, iwin) {
//    constructor(id, owner, iwin, layout, type) {
        this.obj = obj;
        this.id = obj.id;//идентификатор 
        this.owner = owner;//владелец
        this.iwin = iwin;//главный класс калькуляции   
        this.layout = obj.layout;//напрвление расположения
        this.type = obj.type;//тип элемента

        this.rgb = iwin.RGB;
    }

    dimension(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    width() {
        return (this.x2 > this.x1) ? this.x2 - this.x1 : this.x1 - this.x2;
    }
    height() {
        return (this.y2 > this.y1) ? this.y2 - this.y1 : this.y1 - this.y2;
    }
}
//-------------------------AREA-------------------------------------------------
export class Area extends Com5t {

    constructor(obj, owner, iwin) {
//    constructor(id, owner, iwin, layout, type, width, height) {
        super(obj, owner, iwin);
//        super(id, owner, iwin, layout, type);
        //debugger;

        this.childs = new Array(0); //список детей 
        if (owner == null) {
            this.dimension(0, 0, iwin.width, iwin.height);
        } else {
            let height = (obj.layout == "VERT") ? obj.length : owner.height();
            let width = (obj.layout == "HORIZ") ? obj.length : owner.width();

            if (this.childs.length == 0) {
                if (owner.layout == "VERT") { //сверху вниз
                    let Y2 = (owner.y1 + height > owner.y2) ? owner.y2 : owner.y1 + height;
                    this.dimension(owner.x1, owner.y1, owner.x2, Y2);

                } else if (owner.layout == "HORIZ") { //слева направо
                    let X2 = (owner.x1 + width > owner.x2) ? owner.x2 : owner.x1 + width;
                    this.dimension(owner.x1, owner.y1, X2, owner.y2);
                }
            } else {
                for (let index = owner.childs.length - 1; index >= 0; --index) { //т.к. this area ёщё не создана начнём с конца
                    if (owner.childs[ndex] instanceof Area) {
                        let prevArea = owner.childs[index];

                        if (owner.layout == "VERT") { //сверху вниз                            
                            let Y2 = (prevArea.y2 + height > owner.y2) ? owner.y2 : prevArea.y2 + height;
                            this.dimension(owner.x1, prevArea.y2, owner.x2, Y2);

                        } else if (owner.layout == "HORIZ") { //слева направо
                            let X2 = (prevArea.x2 + width > owner.x2) ? owner.x2 : prevArea.x2 + width;
                            this.dimension(prevArea.x2, owner.y1, X2, owner.y2);
                        }
                        break;
                    }
                }
            }
        }
    }
}
//---------------------------ROOT-----------------------------------------------
export class Root extends Area {

    constructor(obj, owner, iwin) {
//    constructor(id, owner, iwin, layout, type, width, height) {
        super(obj, owner, iwin);
//        super(id, owner, iwin, layout, type, width, height);

        this.frames = new Map(); //рамы конструкции 
    }
}
//---------------------------STVORKA--------------------------------------------
export class Stvorka extends Area {

    constructor(obj, owner, iwin) {
//    constructor(id, owner, iwin, layout, type, param) {
        super(obj, owner, iwin);
//        super(id, owner, iwin, layout, type, owner.width(), owner.height());

        this.frames = new Map(); //рамы конструкции 

        this.frames.set("BOTT", new Frame(this.id + '.1', this, iwin, "BOTT", "STVORKA_SIDE", obj.param));
        this.frames.set("RIGHT", new Frame(this.id + '.2', this, iwin, "RIGHT", "STVORKA_SIDE", obj.param));
        this.frames.set("TOP", new Frame(this.id + '.3', this, iwin, "TOP", "STVORKA_SIDE", obj.param));
        this.frames.set("LEFT", new Frame(this.id + '.4', this, iwin, "LEFT", "STVORKA_SIDE", obj.param));

        //Фурнитура створки, ручка, подвес
        if (obj.param != undefined && obj.param.sysfurnID != undefined) {
            this.sysfurn = dbset.find_rec(obj.param.sysfurnID, dbset.sysfurnList);
        } else {
            this.sysfurn = dbset.find2_rec(SFUR.systree_id, iwin.nuni, dbset.sysfurnList);
        }
        //Сторона открывания
        if (obj.param != undefined && obj.param.typeOpen != undefined) {
            this.typeOpen = obj.param.typeOpen;
        } else {
            this.typeOpen = (this.sysfurn[SFUR.side_open] == 1) ? 1 : 2;
        }
    }

    paint() {
        let DX = 20, DY = 60, X1 = 0, Y1 = 0;
        let elemB = this.frames.get("BOTT");
        let elemR = this.frames.get("RIGHT");
        let elemT = this.frames.get("TOP");
        let elemL = this.frames.get("LEFT");
        elemB.paint();
        elemR.paint();
        elemT.paint();
        elemL.paint();

        if (this.typeOpen == 1 || this.typeOpen == 3) {
            X1 = elemR.x1 + (elemR.x2 - elemR.x1) / 2;
            Y1 = elemR.y1 + (elemR.y2 - elemR.y1) / 2;
            draw_line(this.iwin, elemL.x1, elemL.y1, elemR.x2, elemR.y1 + (elemR.y2 - elemR.y1) / 2);
            draw_line(this.iwin, elemL.x1, elemL.y2, elemR.x2, elemR.y1 + (elemR.y2 - elemR.y1) / 2);

        } else if (this.typeOpen == 2 || this.typeOpen == 4) {
            X1 = elemL.x1 + (elemL.x2 - elemL.x1) / 2;
            Y1 = elemL.y1 + (elemL.y2 - elemL.y1) / 2;
            draw_line(this.iwin, elemR.x2, elemR.y1, elemL.x1, elemL.y1 + (elemL.y2 - elemL.y1) / 2);
            draw_line(this.iwin, elemR.x2, elemR.y2, elemL.x1, elemL.y1 + (elemL.y2 - elemL.y1) / 2);
        }

        if (this.iwin.root.type == "DOOR") {

        } else {
            draw_stroke_polygon(this.iwin, X1 - DX, X1 + DX, X1 + DX, X1 - DX, Y1 - DY, Y1 - DY, Y1 + DY, Y1 + DY, "#FFFFFFFF");
            DX = DX - 12;
            Y1 = Y1 + 20;
        }
    }
}
//------------------------------CROSS-------------------------------------------
export class Cross extends Com5t {

    constructor(id, owner, iwin) {
//    constructor(id, owner, iwin, layout, type, param) {
        super(obj, owner, iwin);
//        super(id, owner, iwin, layout, type);
        //debugger; 
        if ("ARCH" == owner.type && owner.childs.length == 1) {
            //AreaSimple prevArea = (AreaSimple) owner.childs.get(0);
            //prevArea.setDimension(prevArea.x1, prevArea.y1, prevArea.x2, prevArea.y2 + artiklRec.getFloat(eArtikl.height) / 2);

        } else if ("TRAPEZE" == owner.type && owner.childs.length == 1) {
            //AreaSimple prevArea = (AreaSimple) owner.childs.get(0);
            //float dy = 0;
            //if(iwin.form == Form.NUM2) {
            //   float angl = root.frames.get(Layout.RIGHT).anglCut[1];
            //   dy = (float) (root.frames.get(Layout.RIGHT).artiklRec.getDbl(eArtikl.height) * Math.tan(Math.toRadians((double) (90 - angl))));
            //}
            //prevArea.setDimension(prevArea.x1, prevArea.y1, prevArea.x2, prevArea.y2 + artiklRec.getFloat(eArtikl.size_centr) + dy);
        }
        for (let index = owner.childs.length - 1; index >= 0; --index) {
            if (owner.childs[index] instanceof Area) {
                let prevArea = owner.childs[index]; //index указывает на предыдущий элемент
                let db = winc.dh_cross;

                if ("VERT" == owner.layout) { //сверху вниз
                    this.dimension(prevArea.x1, prevArea.y2 - db, prevArea.x2, prevArea.y2 + db);
                    this.anglHoriz = 0;

                } else if ("HORIZ" == owner.layout) { //слева направо
                    this.dimension(prevArea.x2 - db, prevArea.y1, prevArea.x2 + db, prevArea.y2);
                    this.anglHoriz = 90;
                }
                break;
            }
        }
    }

    paint() {
        //let rgb = eColor.find(colorID2).getInt(eColor.rgb);
        if (Layout.VERT == owner.layout) {
            draw_stroke_polygon(this.iwin, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.rgb);

        } else if (Layout.HORIZ == owner.layout) {
            draw_stroke_polygon(this.iwin, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.rgb);
        }
    }
}
//-----------------------------------FRAME--------------------------------------
export class Frame extends Com5t {

    constructor(obj, owner, iwin) {
//    constructor(id, owner, iwin, layout, type, param) {
        super(obj, owner, iwin);
//        super(id, owner, iwin, layout, type);

        let x1 = (owner.type != "STVORKA") ? owner.x1 : (owner.x1 + winc.dh_frame) - winc.naxl;
        let y1 = (owner.type != "STVORKA") ? owner.y1 : (owner.y1 + winc.dh_frame) - winc.naxl;
        let x2 = (owner.type != "STVORKA") ? owner.x2 : (owner.x2 - winc.dh_frame) + winc.naxl;
        let y2 = (owner.type != "STVORKA") ? owner.y2 : (owner.y2 - winc.dh_frame) + winc.naxl;

        if (iwin.root.type == "RECTANGL") {
            if ("BOTT" == this.layout) {
                this.dimension(x1, y2 - winc.dh_frame, x2, y2);
            } else if ("RIGHT" == this.layout) {
                this.dimension(x2 - winc.dh_frame, y1, x2, y2);
            } else if ("TOP" == this.layout) {
                this.dimension(x1, y1, x2, y1 + winc.dh_frame);
            } else if ("LEFT" == this.layout) {
                this.dimension(x1, y1, x1 + winc.dh_frame, y2);
            }
        }
    }

    paint() {
        debugger;
        let dh = winc.dh_frame;
        if (this.iwin.root.type == "RECTANGL") {
            if ("BOTT" == this.layout) {
                draw_stroke_polygon(this.iwin, this.x1 + dh, this.x2 - dh, this.x2, this.x1, this.y1, this.y1, this.y2, this.y2, this.rgb);
            } else if ("RIGHT" == this.layout) {
                draw_stroke_polygon(this.iwin, this.x1, this.x2, this.x2, this.x1, this.y1 + dh, this.y1, this.y2, this.y2 - dh, this.rgb);
            } else if ("TOP" == this.layout) {
                draw_stroke_polygon(this.iwin, this.x1, this.x2, this.x2 - dh, this.x1 + dh, this.y1, this.y1, this.y2, this.y2, this.rgb);
            } else if ("LEFT" == this.layout) {
                draw_stroke_polygon(this.iwin, this.x1, this.x2, this.x2, this.x1, this.y1, this.y1 + dh, this.y2 - dh, this.y2, this.rgb);
            }
        }
    }
}
//------------------------------GLASS-------------------------------------------
export class Glass extends Com5t {

    constructor(id, owner, iwin, layout, type, param) {
        super(id, owner, iwin, layout, type);
        let artdetRec = null;

        if (param != undefined && param.artglasID != undefined) {
            artdetRec = find2_rec(ADET.artikl_id, param.artglasID, dbset.artdetList);
        } else {
            let treeRec = dbset.find_rec(iwin.nuni, dbset.treeList); //по умолчанию стеклопакет
            for (let i = 0; i < dbset.artiklList.length; i++) {
                if (treeRec[SYS.glas] == dbset.artiklList[i][ART.code]) {
                    let artiklRec = dbset.artiklList[i];
                    artdetRec = dbset.find2_rec(ADET.artikl_id, artiklRec[ART.id], dbset.artdetList);
                    break;
                }
            }
        }
        let color_fk = artdetRec[ADET.color_fk];
        let colorRec = dbset.find_rec(color_fk, dbset.colorList);
        this.rgb = '#' + colorRec[COL.rgb].toString(16);
    }

    paint() {
        if (this.iwin.root.type == "RECTANGL") {
            draw_full_polygon(this.iwin, this.owner.x1, this.owner.x2, this.owner.x2,
                    this.owner.x1, this.owner.y1, this.owner.y1, this.owner.y2, this.owner.y2, this.rgb);
        }
    }
}
//------------------------------------------------------------------------------

