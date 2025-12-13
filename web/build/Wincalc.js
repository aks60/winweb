
import {WsonRoot} from './script/WsonRoot.js';
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
        this.cnv = canvas;
        this.ctx = canvas.getContext('2d');
        this.mapPardef = new Map();  //пар. по умолчанию + наложенные пар. клиента
        this.listArea = new Array(); //список ареа.
        this.listElem = new Array(); //список элем.
        this.listJoin = new Array(); //список соед.
        this.listAll = new Array();  //список всех компонентов (area + elem)
        this.listKit = new Array();  //комплектация
    }

    build(script) {
        //try {
            //Инит свойств
            this.nppID = 0;
            this.mapPardef.clear();
            for (var el of  [this.listArea, this.listElem, this.listJoin, this.listAll, this.listKit]) {
                el.length = 0;
            }
            this.jsonObj = JSON.parse(script);      //объект калькуляции
            this.gson = new WsonRoot(this.jsonObj); //объектная модель конструкции 1-го уровня
            //this.setform(gson, this);             //форма конструкции, см. класс Area                   

            this.width1 = (this.gson.obj.width1 === undefined) ? this.width(this.gson) : this.gson.obj.width1; //ширина 1 окна
            this.width2 = this.gson.obj.width2; //ширина 2 окна
            this.height1 = this.gson.obj.height1; //высота 1 окна
            this.height2 = (this.gson.obj.height2 === undefined) ? this.height(this.gson) : this.gson.height2; //высота 2 окна

            this.color1Rec = findefs(this.gson.obj.color1, COLOR.id, dbset.color);
            this.color2Rec = findefs(this.gson.obj.color2, COLOR.id, dbset.color);
            this.color3Rec = findefs(this.gson.obj.color3, COLOR.id, dbset.color);

            //Главное окно
            if ('RECTANGL' === this.gson.obj.type) {
                this.root = new AreaRectangl(this, this.gson, null);

            } else if ('TRAPEZE' === this.gson.obj.type) {
                this.root = new AreaTrapeze(this, this.gson, null);

            } else if ('ARCH' === this.gson.obj.type) {
                this.root = new AreaArch(this, this.gson, null);

            } else if ('DOOR' === this.gson.obj.type) {
                this.root = new AreaDoor(this, this.gson, null);
            }
            this.creator(); //создадим элементы конструкции       
            this.location(); //кальк. коорд. элементов конструкции       
            this.draw(); //прорисовка конструкции

            //this.arr_of_winc(this.root);
            //draw_elements(this); //рисуем конструкцию 

            return this;

            //console.log(JSON.stringify(w.root.gson, undefined, 4));
        //} catch (e) {
        //    alert('Ошибка:Wincalc.build(). ' + e.message);
        //}
    }

    //Цыклическое заполнение root по содержимому gson 
    creator() {
        this.test = 0;
/*        try {
            let hm = new Map();
            for (let ob2 of this.gson.childs) {
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
        }*/
    }

    //Кальк.коорд. элементов конструкции
    location() {

    }

    //Рисуем конструкцию
    draw() {
        debugger;
        //const mas = this.listArea.filter(el => el.gson.obj.type == 'RECTANGL');
        //mas.foEach(el => el.pain());
        
        this.listArea.forEach(area => {
            if(area.gson.obj.type == 'RECTANGL') {
                area.pain();
            }
        });
    }

    width(gson) {
        if (arguments.length === 1) {
            if (gson.obj.width1 === undefined) {
                return gson.obj.width2;
            } else if (gson.obj.width2 === undefined) {
                return gson.obj.width1;
            } else if (gson.obj.width1 > gson.obj.width2) {
                return gson.obj.width1;
            } else {
                return gson.obj.width2;
            }
        } else {
            return (this.width1 > this.width2) ? this.width1 : this.width2;
        }
    }

    height(gson) {
        if (arguments.length === 1) {
            if (gson.obj.height1 === undefined) {
                return gson.obj.height2;
            } else if (gson.obj.height2 === undefined) {
                return gson.obj.height1;
            } else if (gson.obj.height1 > gson.obj.height2) {
                return gson.obj.height1;
            } else {
                return gson.obj.height2;
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



