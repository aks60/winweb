
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

    constructor(canvas=null) {
        this.cnv = canvas;
        this.ctx = canvas.getContext('2d');
        this.wson = null; //объектная модель конструкции 1-го уровня
        this.mapPardef = new Map(); //пар. по умолчанию + наложенные пар. клиента
        this.listArea = new Array(); //список ареа.
        this.listElem = new Array(); //список элем.
        this.listJoin = new Array(); //список соед.
        this.listAll = new Array(); //список всех компонентов (area + elem)
        this.listKit = new Array(); //комплектация
    }

    build(script) {
        // try {
        //Инит свойств
        this.nppID = 0;
        this.mapPardef.clear();
        for (var el of  [this.listArea, this.listElem, this.listJoin, this.listAll, this.listKit]) {
            el.length = 0;
        }
        this.wson = JSON.parse(script); //объект калькуляции
        this.setform(wson, this);         //форма конструкции, см. класс Area                 
        this.prj = wson.prj;              //номер тестируемого проекта, поле пока нужно только для тестов 
        this.ord = wson.ord;              //номер тестируемого заказа, поле пока нужно только для тестов 
        this.nuni = wson.nuni;            //nuni профиля    

        this.width1 = (wson.width1 === undefined) ? this.width(wson) : wson.width1; //ширина 1 окна
        this.width2 = wson.width2; //ширина 2 окна
        this.height1 = wson.height1; //высота 1 окна
        this.height2 = (wson.height2 === undefined) ? this.height(wson) : wson.height2; //высота 2 окна

        this.color1Rec = findefs(wson.color1, COLOR.id, dbset.colorList);
        this.color2Rec = findefs(wson.color2, COLOR.id, dbset.colorList);
        this.color3Rec = findefs(wson.color3, COLOR.id, dbset.colorList);

        this.root = new AreaRoot(wson, null, this); //главное окно  
            //Главное окно
            if (Type.RECTANGL == wson.type) {
                root = new AreaRectangl(this, wson);

            } else if (Type.TRAPEZE == wson.type) {
                root = new AreaTrapeze(this, wson);

            } else if (Type.ARCH == wson.type) {
                root = new AreaArch(this, wson);

            } else if (Type.DOOR == wson.type) {
                root = new AreaDoor(this, wson);
            }        

        creator(); //создадим элементы конструкции
        location(); //кальк. коорд. элементов конструкции

        this.areaList = new Array(); //массив area конструкции  
        this.elemList = new Array(); //массив элементов конструкции  
        this.arr_of_winc(this.root);
        this.areaList.sort((a, b) => a.id - b.id);
        this.elemList.sort((a, b) => a.id - b.id);
        this.scale = 1;

        //draw_elements(this); //рисуем конструкцию 

        return this;

        //console.log(JSON.stringify(w.root.wson, undefined, 4));
        // } catch (e) {
        // alert('Ошибка:Wincalc.parse() ' + e.message);
        //}
    }

    //Цыклическое заполнение root по содержимому wson 
    creator() {
        try {
            let hm = new Map();
            for (let ob2 of this.wson.childs) {
                if (ob2.type == "FRAME_SIDE") {
                    let frm = new ElemFrame(ob2, owner, this, ob2.param);
                    owner.frames.set(ob2.layout, frm);

                } else if (ob2.type == "STVORKA") {
                    let stv = new AreaStvorka(ob2, this.root, this);
                    this.root.childs.push(stv);
                    hm.set(stv, ob2);

                } else if (ob2.type == "AREA" || ob2.type == "ARCH" || ob2.type == "TRAPEZE" || ob2.type == "TRIANGL" || ob2.type == "DOOR") {
                    let area = new AreaSimple(ob2, this.root, this);
                    this.root.childs.push(area);
                    hm.set(area, ob2);

                } else if (ob2.type == "IMPOST" || ob2.type == "SHTULP" || ob2.type == "STOIKA") {
                    let cross = new ElemCross(ob2, this.root, this);
                    this.root.childs.push(cross);

                } else if (ob2.type == "GLASS") {
                    let glass = new ElemGlass(ob2, this.root, this);
                    this.root.childs.push(glass);
                }
            }
            //Теперь вложенные элементы
            for (let k of hm.keys()) {
                this.creator(k, hm.get(k));
            }
        } catch (e) {
            alert('Ошибка:Wincalc.elements ' + e.message);
        }
    }

    //Кальк.коорд. элементов конструкции
    loacation() {

    }

    //Рисуем конструкцию
    draw() {

    }

    width(wson) {
        if (arguments.length === 1) {
            if (wson.width1 === undefined) {
                return wson.width2;
            } else if (wson.width2 === undefined) {
                return wson.width1;
            } else if (wson.width1 >wsonj.width2) {
                return wson.width1;
            } else {
                return wson.width2;
            }
        } else {
            return (this.width1 > this.width2) ? this.width1 : this.width2;
        }
    }

    height(wson) {
        if (arguments.length === 1) {
            if (wson.height1 === undefined) {
                return wson.height2;
            } else if (wson.height2 === undefined) {
                return wson.height1;
            } else if (wson.height1 >wsonj.height2) {
                return wson.height1;
            } else {
                return wson.height2;
            }
        } else {
            return (this.height1 > this.height2) ? this.height1 : this.height2;
        }
    }

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
    setform(wson, winc) {
        wson.childs.forEach(el => {
            if (el.form != null)
                winc.form = el.form;
            if (el.type == "AREA" || el.type == "ARCH" || el.type == "TRAPEZE" || el.type == "TRIANGL" || el.type == "DOOR")
                winc.setform(el, winc); //рекурсия 
        });
    }
// </editor-fold> 
}



