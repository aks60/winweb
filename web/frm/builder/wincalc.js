
import {draw_elements} from './drawing.js';
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
            //this.RGB = "rgb(120,150,10)";
            this.RGB = dbset.find_colorRec(1009)[2];
            let arr = new Array(); //массив элементов конструкции
            
            this.elements(this.root, obj, arr); //создадим элементы конструкции
            arr.sort((a, b) => a.id - b.id);
            draw_elements(this, arr); //рисуем конструкцию
            this.ctx.restore();
        }
        //} catch (e) { console.error('Ошибка: ' + e.message); }
    }

    elements(owner, obj, arr) {
        //try {
        let hm = new Map();
        for (let ob2 of obj.childs) {

            if (ob2.type == "FRAME_SIDE") {
                owner.frames.set(ob2.layout, new Frame(ob2.id, owner, this, ob2.layout, ob2.type, ob2.param));
            } else if (ob2.type == "STVORKA") {
                let stv = new Stvorka(ob2.id, owner, this, ob2.layout, ob2.type, ob2.param);
                owner.childs.push(stv);
                hm.set(stv, ob2);
                arr.push(stv);

            } else if (ob2.type == "AREA") {
                let area = new Area(ob2.id, owner, this, ob2.layout, ob2.type, ob2.width, ob2.height);
                owner.childs.push(area);
                hm.set(area, ob2);

            } else if (ob2.type == "IMPOST" || ob2.type == "SHTULP" || ob2.type == "STOIKA") {
                let cross = new Cross(ob2.id, owner, this, ob2.layout, ob2.type, ob2.param);
                owner.childs.push(cross);
                arr.push(cross);

            } else if (ob2.type == "GLASS") {
                let glass = new Glass(ob2.id, owner, this, ob2.layout, ob2.type, ob2.param);
                owner.childs.push(glass);
                arr.push(glass);
            }
        }

        //Теперь вложенные элементы
        for (let k of hm.keys()) {
            this.elements(k, hm.get(k), arr);
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
