
import {Root, Area, Stvorka, Cross, Frame, Glass, Com5t} from './model.js';


winc.build = function (canvasTag) {
    new Wincalc(canvasTag).parse();
}

class Wincalc {

    constructor(canvasTag) {
        this.ctx = canvasTag.getContext('2d');
    }

    parse() {
        try {
            if (order.sel_table2 != undefined) {
                let script = order.sel_table2.script;
                let obj = JSON.parse(script);

                this.prj = obj.prj;              //номер тестируемого проекта, поле пока нужно только для тестов 
                this.ord = obj.ord;              //номер тестируемого заказа, поле пока нужно только для тестов 
                this.nuni = obj.nuni;            //nuni профиля   
                this.form = obj.form;            //форма конструкции
                this.width = obj.width;          //ширина окна, мм
                this.height = obj.height;        //высота окна, мм 
                this.heightAdd = obj.heightAdd;  //дополнительная высота, мм.
                //Главное окно
                this.root = new Root(obj.id, null, this, obj.layout, obj.type,
                        obj.color1, obj.color2, obj.color3, obj.width, obj.height);

                this.ctx.save();
                let scale = (cnv.width / obj.width < cnv.height / obj.height)
                        ? cnv.width / (obj.width + 80) : cnv.height / (obj.height + 80);
                this.ctx.scale(scale, scale);
                this.ctx.translate(80, 0);
                this.ctx.lineWidth = 5;
                this.ctx.strokeStyle = "rgb(0,0,0)";
                this.ctx.fillStyle = "rgb(120,150,10)";

                //Добавим рамы
                let arr = new Array();
                this.recursion(obj, 'FRAME_SIDE', arr);
                for (let v of arr) {
                    this.root.mapFrame.set(v.layout, new Frame(this.root, v.id, v.layout, v.param));
                }
                Frame.draw(this.ctx, this.root);


                this.ctx.restore();
            }
        } catch (e) {
            console.error('Ошибка: ' + e.message);
        }
    }

    recursion(el, type, arr) {
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
    }
}
