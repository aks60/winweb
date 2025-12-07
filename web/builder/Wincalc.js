
import {AreaArch} from './builder/model/areaArch.js';
import {AreaDoor} from './builder/model/areaDoor.js';
import {AreaRectangl} from './builder/model/areaRectangl.js';
import {AreaRoot} from './builder/model/areaRoot.js';
import {AreaSimple} from './builder/model/areaSimple.js';
import {AreaStvorca} from './builder/model/areaStvorkat.js';
import {Com5t} from './model/com5t.js';
import {ElemCross} from '/builder./model/elemCrosst.js';
import {ElemFrame} from './builder/model/elemFrame.js';
import {elemGlass} from './builder/model/elemGlass.js';

win.build = function (canvas, script) {
    let w = new Wincalc(canvas);
    w.parse(script);
    //console.log(JSON.stringify(w.root.obj, undefined, 4));
    return w;
};

export class Wincalc {

    constructor(canvas) {
        this.cnv = canvas;
        this.ctx = canvas.getContext('2d');
    }

    parse(script) {
        //try {
        let obj = JSON.parse(script);
        this.setform(obj, this);         //форма конструкции, см. класс Area
        this.obj = obj;                  //объект калькуляции
        this.prj = obj.prj;              //номер тестируемого проекта, поле пока нужно только для тестов 
        this.ord = obj.ord;              //номер тестируемого заказа, поле пока нужно только для тестов 
        this.nuni = obj.nuni;            //nuni профиля    
        
        this.width1 = (obj.width1 === undefined) ? this.width(obj) : obj.width1; //ширина 2 окна, мм 
        this.width2 = obj.width2; //ширина 2 окна, мм 
        this.height1 = obj.height1; //высота 1 окна
        this.height2 = (obj.height2 === undefined) ? this.height(obj) : obj.height2; //высота 2 окна
        
        this.color1Rec = findef(dbset.colorList.find(rec => obj.color1 == rec[COLOR.id]), dbset.colorList);
        this.color2Rec = findef(dbset.colorList.find(rec => obj.color2 == rec[COLOR.id]), dbset.colorList);
        this.color3Rec = findef(dbset.colorList.find(rec => obj.color3 == rec[COLOR.id]), dbset.colorList);

        this.root = new Root(obj, null, this); //главное окно                      
        this.elements(this.root, obj); //создадим элементы конструкции

        this.areaList = new Array(); //массив area конструкции  
        this.elemList = new Array(); //массив элементов конструкции  
        this.arr_of_winc(this.root);
        this.areaList.sort((a, b) => a.id - b.id);
        this.elemList.sort((a, b) => a.id - b.id);
        this.scale = 1;
        draw_elements(this); //рисуем конструкцию 

//        } catch (e) {
//            alert('Ошибка:Wincalc.parse() ' + e.message);
//        }
    }

    //Поднять elem.form до Wincalc.form
    setform(obj, winc) {
        obj.childs.forEach(el => {
            if (el.form != null)
                winc.form = el.form;
            if (el.type == "AREA" || el.type == "ARCH" || el.type == "TRAPEZE" || el.type == "TRIANGL" || el.type == "DOOR")
                winc.setform(el, winc); //рекурсия 
        });
    }

    elements(owner, obj) {
        try {
            let hm = new Map();
            for (let ob2 of obj.childs) {
                if (ob2.type == "FRAME_SIDE") {
                    let frm = new Frame(ob2, owner, this, ob2.param);
                    owner.frames.set(ob2.layout, frm);

                } else if (ob2.type == "STVORKA") {
                    let stv = new Stvorka(ob2, owner, this);
                    owner.childs.push(stv);
                    hm.set(stv, ob2);

                } else if (ob2.type == "AREA" || ob2.type == "ARCH" || ob2.type == "TRAPEZE" || ob2.type == "TRIANGL" || ob2.type == "DOOR") {
                    let area = new Area(ob2, owner, this);
                    owner.childs.push(area);
                    hm.set(area, ob2);

                } else if (ob2.type == "IMPOST" || ob2.type == "SHTULP" || ob2.type == "STOIKA") {
                    let cross = new Cross(ob2, owner, this);
                    owner.childs.push(cross);

                } else if (ob2.type == "GLASS") {
                    let glass = new Glass(ob2, owner, this);
                    owner.childs.push(glass);
                }
            }
            //Теперь вложенные элементы
            for (let k of hm.keys()) {
                this.elements(k, hm.get(k));
            }
        } catch (e) {
            alert('Ошибка:Wincalc.elements ' + e.message);
        }
    }

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

    width(obj) {
        if (arguments.length === 1) {
            if (obj.width1 === undefined) {
                return obj.width2;
            } else if (obj.width2 === undefined) {
                return obj.width1;
            } else if (obj.width1 > obj.width2) {
                return obj.width1;
            } else {
                return obj.width2;
            }
        } else {
            return (this.width1 > this.width2) ? this.width1 : this.width2;
        }
    }

    height(obj) {
        if (arguments.length === 1) {
            if (obj.height1 === undefined) {
                return obj.height2;
            } else if (obj.height2 === undefined) {
                return obj.height1;
            } else if (obj.height1 > obj.height2) {
                return obj.height1;
            } else {
                return obj.height2;
            }
        } else {
            return (this.height1 > this.height2) ? this.height1 : this.height2;
        }
    }
}



