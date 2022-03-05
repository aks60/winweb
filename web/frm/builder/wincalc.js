//------------------------------------------------------------------------------
import {draw_elements} from './drawing.js';
import {Root, Area, Stvorka, Cross, Frame, Glass, Com5t} from './model.js';
//------------------------------------------------------------------------------

win.build = function (canvas, script) {
    let w = new Wincalc(canvas);
    w.parse(script);
    return w;
}

class Wincalc {

    constructor(canvas) {
        this.cnv = canvas;
        this.ctx = canvas.getContext('2d');
    }

    parse(script) {
        try {
            let obj = JSON.parse(script);
            this.obj = obj;                  //объект калькуляции
            this.prj = obj.prj;              //номер тестируемого проекта, поле пока нужно только для тестов 
            this.ord = obj.ord;              //номер тестируемого заказа, поле пока нужно только для тестов 
            this.nuni = obj.nuni;            //nuni профиля   
            this.form = obj.form;            //форма конструкции
            this.width = obj.width;          //ширина окна, мм
            this.height = obj.height;        //высота окна, мм 
            this.heightAdd = obj.heightAdd;  //дополнительная высота, мм.      
            this.color1Rec = findef(dbset.colorList.find(rec => obj.color1 == rec[COLOR.id]), dbset.colorList);
            this.color2Rec = findef(dbset.colorList.find(rec => obj.color2 == rec[COLOR.id]), dbset.colorList);
            this.color3Rec = findef(dbset.colorList.find(rec => obj.color3 == rec[COLOR.id]), dbset.colorList);
            
            this.root = new Root(obj, null, this); //главное окно                      
            this.elements(this.root, obj); //создадим элементы конструкции

            this.elemList = new Array(); //массив элементов конструкции  
            this.arr_of_winc(this.root, this.elemList);
            this.elemList.sort((a, b) => a.id - b.id);
            draw_elements(this); //рисуем конструкцию 

        } catch (e) {
            alert('Ошибка: ' + e.message);
        }
    }

    elements(owner, obj) {
//        try {
            let hm = new Map();
            for (let ob2 of obj.childs) {

                if (ob2.type == "FRAME_SIDE") {
                    let frm = new Frame(ob2, owner, this, ob2.param);
                    owner.frames.set(ob2.layout, frm);

                } else if (ob2.type == "STVORKA") {
                    let stv = new Stvorka(ob2, owner, this);
                    owner.childs.push(stv);
                    hm.set(stv, ob2);

                } else if (ob2.type == "AREA") {
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
//        } catch (e) {
//            alert('Ошибка: ' + e.message);
//        }
    }

    arr_of_winc(area, arr) {
        
        if (area.frames !== undefined) {
            arr.push(area);
            for (let frm of area.frames.values())
                arr.push(frm);
        }
        for (let com of area.childs) {
            if (com instanceof Area) {
                this.arr_of_winc(com, arr);
            } else {
                arr.push(com);
            }
        }
    }
}
