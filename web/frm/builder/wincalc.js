//------------------------------------------------------------------------------
import {draw_elements} from './drawing.js';
import {Root, Area, Stvorka, Cross, Frame, Glass, Com5t} from './model.js';
//------------------------------------------------------------------------------

winc.build = function (canvas, script) {
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
            this.RGB = '#' + dbset.find_rec(obj.color2, dbset.colorList)[COLOR.rgb].toString(16);

            this.root = new Root(obj, null, this); //главное окно

            this.elemList = new Array(); //массив элементов конструкции            
            this.elements(this.root, obj, this.elemList); //создадим элементы конструкции
            this.elemList.sort((a, b) => a.id - b.id);
            draw_elements(this, this.elemList); //рисуем конструкцию            
            
        } catch (e) { alert('Ошибка: ' + e.message); }
    }

    elements(owner, obj, arr) {
        try {
            let hm = new Map();
            for (let ob2 of obj.childs) {

                if (ob2.type == "FRAME_SIDE") {
                    let frm = new Frame(ob2, owner, this);
                    owner.frames.set(ob2.layout, frm);
                    arr.push(frm, ob2);
                    
                } else if (ob2.type == "STVORKA") {
                    let stv = new Stvorka(ob2, owner, this);
                    owner.childs.push(stv);
                    hm.set(stv, ob2);
                    arr.push(stv);
//                    arr.push(stv.frames.get("BOTT"));
//                    arr.push(stv.frames.get("RIGHT"));
//                    arr.push(stv.frames.get("TOP"));
//                    arr.push(stv.frames.get("LEFT"));

                } else if (ob2.type == "AREA") {
                    let area = new Area(ob2, owner, this);
                    owner.childs.push(area);
                    hm.set(area, ob2);

                } else if (ob2.type == "IMPOST" || ob2.type == "SHTULP" || ob2.type == "STOIKA") {
                    let cross = new Cross(ob2, owner, this);
                    owner.childs.push(cross);
                    arr.push(cross);

                } else if (ob2.type == "GLASS") {
                    let glass = new Glass(ob2, owner, this);
                    owner.childs.push(glass);
                    arr.push(glass);
                }
            }
            //Теперь вложенные элементы
            for (let k of hm.keys()) {
                this.elements(k, hm.get(k), arr);
            }
        } catch (e) {
            alert('Ошибка: ' + e.message);
        }
    }
}
