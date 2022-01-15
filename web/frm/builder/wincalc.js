
import {draw_elements} from './drawing.js';
import {Root, Area, Stvorka, Cross, Frame, Glass, Com5t} from './model.js';
import {SYS, CGR, COL, ART, ADET, PROD} from './dbset.js';

winc.build = function (canvasTag) {
    new Wincalc(canvasTag).parse();
}

class Wincalc {

    constructor(canvasTag) {
        this.cnv = canvasTag;
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
            this.RGB = '#' + dbset.find_rec(obj.color2, dbset.colorList)[COL.rgb].toString(16);
          
            this.root = new Root(obj, null, this); //главное окно

            let arr = new Array(); //массив элементов конструкции            
            this.elements(this.root, obj, arr); //создадим элементы конструкции
            arr.sort((a, b) => a.id - b.id);
            draw_elements(this, arr); //рисуем конструкцию            
        }
        //} catch (e) { alert('Ошибка: ' + e.message); }
    }

    elements(owner, obj, arr) {
        //try {
        let hm = new Map();
        for (let ob2 of obj.childs) {

            if (ob2.type == "FRAME_SIDE") {
                owner.frames.set(ob2.layout, new Frame(ob2, owner, this));
                
            } else if (ob2.type == "STVORKA") {
                let stv = new Stvorka(ob2, owner, this);
                owner.childs.push(stv);
                hm.set(stv, ob2);
                arr.push(stv);

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
        //} catch (e) {  alert('Ошибка: ' + e.message);  }
    }
}
