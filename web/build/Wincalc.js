
import {Com5t} from './model/Com5t.js';
import {AreaSimple} from './model/AreaSimple.js';
import {AreaArch} from './model/AreaArch.js';
import {AreaDoor} from './model/AreaDoor.js';
import {AreaRectangl} from './model/AreaRectangl.js';
import {AreaRoot} from './model/AreaRoot.js';
import {AreaStvorka} from './model/AreaStvorka.js';
import {ElemCross} from './model/ElemCross.js';
import {ElemFrame} from './model/ElemFrame.js';
import {ElemGlass} from './model/ElemGlass.js';

win.build = function (canvas, script) {
    return new Wincalc(canvas).build(script);
};

export class Wincalc {

    constructor(canvas = null) {
        try {
            this.cnv = canvas;
            this.ctx = canvas.getContext('2d');
            this.mapPardef = new Map();  //пар. по умолчанию + наложенные пар. клиента
            this.listArea = new Array(); //список ареа.
            this.listElem = new Array(); //список элем.
            this.listJoin = new Array(); //список соед.
            this.listAll = new Array();  //список всех компонентов (area + elem)
            this.listKit = new Array();  //комплектация
            this.gf = new jsts.geom.GeometryFactory(new jsts.geom.PrecisionModel(1000));
        } catch (e) {
            errorLog('Error:Wincalc.constructor() ' + e.message);
    }
    }

    build(script) {
        try {
            //Инит свойств
            this.nppID = 0;
            this.mapPardef.clear();
            for (var el of  [this.listArea, this.listElem, this.listJoin, this.listAll, this.listKit]) {
                el.length = 0;
            }
            this.gson = JSON.parse(script);      //объектная модель конструкции
            //this.setform(gson, this);             //форма конструкции, см. класс Area                   

            //Инит конструктива
            this.id = this.gson.id;
            this.nuni = (this.gson.nuni == undefined) ? -3 : this.gson.nuni;
            this.color1Rec = findefs(this.gson.color1, COLOR.id, dbset.color);
            this.color2Rec = findefs(this.gson.color2, COLOR.id, dbset.color);
            this.color3Rec = findefs(this.gson.color3, COLOR.id, dbset.color);

            //Главное окно
            if ('RECTANGL' === this.gson.type) {
                this.root = new AreaRectangl(this, this.id, this.id);

            } else if ('TRAPEZE' === this.gson.type) {
                this.root = new AreaTrapeze(this, this.id, this.id);

            } else if ('ARCH' === this.gson.type) {
                this.root = new AreaArch(this, this.id, this.id);

            } else if ('DOOR' === this.gson.type) {
                this.root = new AreaDoor(this, this.id, this.id);
            }

            this.creator(this.root, this.gson); //создадим элементы конструкции       
            this.location(); //кальк. коорд. элементов конструкции       
            this.draw(); //прорисовка конструкции
            return this;

            //console.log(JSON.stringify(w.root.gson, undefined, 4));
            consoleLog('Exec:Wincalc.build()');
        } catch (e) {
            errorLog('Error:Wincalc.build(). ' + e.message);
        }
    }

    //Цыклическое заполнение root по содержимому gson 
    creator(owner, gson) {
        //debugger;
        try {
            let hm = new Map();
            for (let js of gson.childs) {
                if (js.type === "BOX_SIDE") {
                    let elem5e = new ElemFrame(this, js.id, owner.id);
                    this.root.frames.push(elem5e);
                    hm.set(elem5e, js);

                } else if (js.type === "STVORKA") {
                    //let stv = new AreaStvorka(js, this.root, this);
                    //this.root.childs.push(stv);
                    // hm.set(stv, js);

                } else if (js.type === "AREA" || js.type === "ARCH" || js.type === "TRAPEZE" || js.type === "TRIANGL" || js.type === "DOOR") {
                    let area = new AreaSimple(js, this.root, this);
                    //this.root.childs.push(area);
                    //hm.set(area, js);

                } else if (js.type === "IMPOST" || js.type === "SHTULP" || js.type == "STOIKA") {
                    //let cross = new ElemCross(js, this.root, this);
                    //this.root.childs.push(cross);

                } else if (js.type === "GLASS") {
                    //let glass = new ElemGlass(js, this.root, this);
                    //this.root.childs.push(glass);
                }
            }
            //Теперь вложенные элементы
            //for (let k of hm.keys()) {
            //    this.creator(k, hm.get(k));
            //}
            consoleLog('Exec:Wincalc.creator()');
        } catch (e) {
            errorLog('Error:Wincalc.creator() ' + e.message);
        }
    }

    //Кальк.коорд. элементов конструкции
    location() {
       // debugger;
        try {
            this.listElem.forEach(e => e.initArtikle());
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
            consoleLog('Exec:Wincalc.location()');
        } catch (e) {
            errorLog('Error:Wincalc.location() ' + e.message);
        }
    }

    //Рисуем конструкцию
    draw() {
        try {
            this.listArea.filter(el => el.gson.type == 'RECTANGL').forEach((el) => el.paint());
            this.listElem.filter(el => el.gson.type == 'BOX_SIDE').forEach((el) => el.paint());
        } catch (e) {
            errorLog('Error:Wincalc.draw() ' + e.message);
        }
    }

    //console.log(findJson(7));
    findJson(id) {
        let obj = {}, data = this.gson;
        
        let recursive = (data) => {
            if (id == data.id) {
                obj = data;
            }
            if (typeof data === 'object' && data !== null) {
                // Если это массив
                if (Array.isArray(data)) {
                    data.forEach((item, index) => {            
                        recursive(item); //рекурсивный вызов
                    });
                } else { // Если это объект
                    Object.keys(data).forEach(key => {
                        recursive(data[key]); //рекурсивный вызов
                    });
                }
            }
        }
        recursive(data);
        return obj;
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
        if (area.frames !== undefined) {
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



