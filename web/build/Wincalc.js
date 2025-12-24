
import {UGeo} from './model/uGeo.js';
import {Com5t} from './model/Com5t.js';
import {Type} from '../enums/Type.js';
import {AreaSimple} from './model/AreaSimple.js';
import {AreaArch} from './model/AreaArch.js';
import {AreaDoor} from './model/AreaDoor.js';
import {AreaRectangl} from './model/AreaRectangl.js';
import {AreaStvorka} from './model/AreaStvorka.js';
import {ElemCross} from './model/ElemCross.js';
import {ElemFrame} from './model/ElemFrame.js';
import {ElemGlass} from './model/ElemGlass.js';

win.build = function (canvas, script) {
    return new Wincalc(canvas).build(script);
};

export class Wincalc {
    id; //id конструкции
    nuni; //код системы  
    gson; //объектная модель конструкции
    mapPardef = new Map();  //пар. по умолчанию + наложенные пар. клиента
    listArea = new Array(); //список ареа.
    listElem = new Array(); //список элем.
    listJoin = new Array(); //список соед.
    listAll = new Array();  //список всех компонентов (area + elem)
    listKit = new Array();  //комплектация    
    color1Rec; //цвет базовый
    color2Rec; //цвет внутр.
    color3Rec; //цвет внещний 
    root; //объектная модель конструкции
    cnv; //канва рисования 2d
    sceleton = false; //см. paint
    ctx; //графический контекст 2d    

    constructor(canvas = null) {
        try {
            this.cnv = canvas;
            this.ctx = canvas.getContext('2d');
        } catch (e) {
            errorLog('Error: Wincalc.constructor() ' + e.message);
    }
    }

    build(script) {
        try {
            //Инит свойств
            this.mapPardef.clear();
            for (var el of  [this.listArea, this.listElem, this.listJoin, this.listAll, this.listKit]) {
                el.length = 0;
            }
            this.gson = JSON.parse(script);      //объектная модель конструкции
            //this.setform(gson, this);             //форма конструкции, см. класс Area                   

            //Инит конструктива
            this.id = this.gson.id;
            this.nuni = (this.gson.nuni === undefined) ? -3 : this.gson.nuni;
            this.color1Rec = findef(this.gson.color1, COLOR.id, dbset.color);
            this.color2Rec = findef(this.gson.color2, COLOR.id, dbset.color);
            this.color3Rec = findef(this.gson.color3, COLOR.id, dbset.color);

            //Главное окно
            if ('RECTANGL' === this.gson.type) {
                this.root = new AreaRectangl(this, this.gson, null);
                this.root.type = Type.RECTANGL;

            } else if ('TRAPEZE' === this.gson.type) {
                this.root = new AreaTrapeze(this, this.gson, null);
                this.root.type = Type.TRAPEZE;

            } else if ('ARCH' === this.gson.type) {
                this.root = new AreaArch(this, this.gson, null);
                this.root.type = Type.ARCH;

            } else if ('DOOR' === this.gson.type) {
                this.root = new AreaDoor(this, this.gson, null);
                this.root.type = Type.DOOR;
            }

            this.creator(this.root, this.gson); //создадим элементы конструкции    
            
            this.listElem.forEach(e => e.initArtikle()); //артиклы элементов
            
            this.location(); //кальк. коорд. элементов конструкции    
            
            this.draw(); //прорисовка конструкции
            
            return this;

        } catch (e) {
            errorLog('Error: Wincalc.build(). ' + e.message);
        }
    }

    //Цыклическое заполнение root по содержимому gson 
    creator(owner, gson) {
        try {
            let hm = new Map();
            for (let js of gson.childs) {
                if (js.type === "BOX_SIDE") {
                    let box = new ElemFrame(this, js, owner);
                    box.type = Type.BOX_SIDE;
                    this.root.frames.push(box);
                    hm.set(box, js);

                } else if (js.type === "STVORKA") {
                    //let stv = new AreaStvorka(this, js, owner);
                    //stv.type = Type.STVORKA;
                    //this.root.childs.push(stv);
                    //hm.set(stv, js);

                } else if (js.type === "AREA" || js.type === "ARCH" || js.type === "TRAPEZE" || js.type === "TRIANGL" || js.type === "DOOR") {
//                    let area = new AreaSimple(this, js, owner);
//                    if (js.type === "AREA")
//                        area.type = Type.AREA;
//                    else if (js.type === "ARCH")
//                        area.type = Type.ARCH;
//                    else if (js.type === "TRAPEZE")
//                        area.type = Type.TRAPEZE;
//                    else if (js.type === "TRIANGL")
//                        area.type = Type.TRIANGL;
//                    else if (js.type === "DOOR")
//                        area.type = Type.DOOR;
//                    this.root.childs.push(area);
//                    hm.set(area, js);

                } else if (js.type === "IMPOST" || js.type === "SHTULP" || js.type === "STOIKA") {
//                    let cross = new ElemCross(this, js, owner);
//                    if (js.type === "IMPOST")
//                        cross.type = Type.IMPOST;
//                    else if (js.type === "SHTULP")
//                        cross.type = Type.SHTULP;
//                    else if (js.type === "STOIKA")
//                        cross.type = Type.STOIKA;
//                    this.root.childs.push(cross);

                } else if (js.type === "GLASS") {
//                    let glass = new ElemGlass(js, this.root, this);
//                    glass.type = Type.GLASS;
//                    this.root.childs.push(glass);
                }
            }
            //Теперь вложенные элементы
//            for (let k of hm.keys()) {
//                this.creator(k, hm.get(k));
//            }
        } catch (e) {
            errorLog('Error: Wincalc.creator() ' + e.message);
        }
    }

    //Кальк.коорд. элементов конструкции
    location() {
        try {            
            this.root.setLocation();

            for (let elem of this.listElem) {
                if (elem instanceof ElemFrame) {
                    elem.setLocation();
                } //else if (elem instanceof ElemCross && elem.owner instanceof AreaStvorka == false) {
                //  elem.setLocation();
                //}
                for (let area of this.listArea) {
                    if (area.id != 0.0) {
                        if (area instanceof AreaStvorka == false && area.owner instanceof AreaStvorka == false) {
                            area.setLocation();
                        }
                    }
                }
            }
        } catch (e) {
            errorLog('Error: Wincalc.location() ' + e.message);
        }
    }

    //Рисуем конструкцию
    draw() {
        try {
            this.listArea.filter(el => el.gson.type == 'RECTANGL').forEach((el) => el.paint());
            this.listElem.filter(el => el.gson.type == 'BOX_SIDE').forEach((el) => el.paint());
        } catch (e) {
            errorLog('Error: Wincalc.draw() ' + e.message);
        }
    }
    // <editor-fold defaultstate="collapsed" desc="GET AND SET"> 
    width() {
        //return root.area.getGeometryN(0).getEnvelopeInternal().getWidth();
    }

    height() {
        //return root.area.getGeometryN(0).getEnvelopeInternal().getHeight();
    }
    // </editor-fold>     

// <editor-fold defaultstate="collapsed" desc="SUPPORT"> 
    arr_of_winc(area) {
        if (area.id == 0) {
            this.areaList.push(this.root);
        }
        if (area.frames !== null) {
            this.elemList.push(area);
            for (let frm of area.frames.values())
                this.elemList.push(frm);
        }
        for (let com of area.childs) {
            if (com instanceof Area) {
                this.areaList.push(com);
                this.arr_of_winc(com);
            } else {
                this.elemList.push(com);
            }
        }
    }

    //Поднять elem.form до Wincalc.form
    setform(gson, winc) {
        gson.childs.forEach(el => {
            if (el.form != null)
                winc.form = el.form;
            if (el.type == "AREA" || el.type == "ARCH" || el.type == "TRAPEZE" || el.type == "TRIANGL" || el.type == "DOOR")
                winc.setform(el, winc); //рекурсия 
        });
    }
// </editor-fold> 
}



