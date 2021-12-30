
import {Root, Area, Stvorka, Cross, Frame, Glass, Com5t} from './model.js';
winc.build = function (canvasTag) {
    new Wincalc(canvasTag).parse();
}

class Wincalc {

    constructor(canvasTag) {
        this.ctx = canvasTag.getContext('2d');
    }

    parse() {
        //try {
        if (order.sel_table2 != undefined) {
            let script = order.sel_table2.script;
            let obj = JSON.parse(script);

            this.obj = obj;                  //объект калькуляции
            this.prj = obj.prj;              //номер тестируемого проекта, поле пока нужно только для тестов 
            this.ord = obj.ord;              //номер тестируемого заказа, поле пока нужно только для тестов 
            this.nuni = obj.nuni;            //nuni профиля   
            this.form = obj.form;            //форма конструкции
            this.width = obj.width;          //ширина окна, мм
            this.height = obj.height;        //высота окна, мм 
            this.heightAdd = obj.heightAdd;  //дополнительная высота, мм.                
            this.root = new Root(obj.id, null, this, obj.layout, obj.type, obj.width, obj.height); //главное окно

            this.ctx.save();
            let scale = (cnv.width / obj.width < cnv.height / obj.height) ? cnv.width / (obj.width + 80) : cnv.height / (obj.height + 80);
            this.ctx.scale(scale, scale);
            this.ctx.translate(80, 0);
            this.ctx.lineWidth = 5;
            this.ctx.strokeStyle = "rgb(0,0,0)";
            this.ctx.fillStyle = "rgb(120,150,10)";

            //Добавим рамы  
            for (let v of obj.childs) {
                if (v.type == 'FRAME_SIDE')
                    this.root.frames.set(v.layout, new Frame(v.id, this.root, this, v.layout, v.type, v.param));
            }
            let arr = new Array();

            //Всё остальное
            this.recursion(this.root, obj, arr);

            //Рисуем
            for (let v of this.root.frames.values()) {
                v.paint();
            }
            for (let v of arr) {
                if (v.type == "STVORKA") {
                    v.paint();
                }
            }

            this.ctx.restore();
        }
        //} catch (e) { console.error('Ошибка: ' + e.message); }
    }

    recursion(owner, obj, arr) {
        //try {
        let hm = new Map();
        for (let el of obj.childs) {

            if (el.type == "STVORKA") {
                let stv = new Stvorka(el.id, owner, this, el.layout, el.type, el.param);
                owner.childs.push(stv);
                hm.set(stv, el);
                arr.push(stv);

            } else if (el.type == "AREA") {
                let area = new Area(el.id, owner, this, el.layout, el.type, el.width, el.height);
                owner.childs.push(area);
                hm.set(area, el);

            } else if (el.type == "IMPOST" || el.type == "SHTULP" || el.type == "STOIKA") {
                let cross = new Cross(el.id, owner, this, el.layout, el.type, el.param);
                owner.childs.push(cross);
                arr.push(cross);

            } else if (el.type == "GLASS") {
                let glass = new Glass(el.id, owner, this, el.layout, el.type, el.param);
                owner.childs.push(glass);
                arr.push(glass);
            }
        }

        //Теперь вложенные элементы
        for (let k in hm) {
            recursion(k, hm[k], arr);
        }
        //} catch (e) {  console.error('Ошибка: ' + e.message);  }
    }
}


/*
 //Возможно пригодится!!!
 recursion(el, type, arr) {
 try {
 for (let key in el) {
 let val = el[key];
 if ((val instanceof Object) == false) {
 if (val == type) {
 arr.push(el);
 //console.log(key + ": " + val);
 }
 } else {
 this.recursion(val, type, arr);
 }
 }
 } catch (e) {
 console.error('Ошибка: ' + e.message);
 }
 }
 */
