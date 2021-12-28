import {draw_frame_bott, draw_frame_right, draw_frame_top, draw_frame_left} from "./drawing.js";
import {JsonRoot, JsonElem, Stvorka, ElemCross, ElemFrame, ElemGlass} from './model.js';


winc.build = function (canvasTag) {
    new Builder(canvasTag).init();
}

class Builder {

    constructor(canvasTag) {
        this.ctx = canvasTag.getContext('2d');
    }

    init() {
        try {
            if (order.sel_table2 != undefined) {
                let script = order.sel_table2.script;
                let rootObj = JSON.parse(script);
                this.ctx.save();

                let scale = (cnv.width / rootObj.width < cnv.height / rootObj.height)
                        ? cnv.width / (rootObj.width + 80) : cnv.height / (rootObj.height + 80);
                this.ctx.scale(scale, scale);
                this.ctx.translate(80, 0);
                this.ctx.lineWidth = 5;
                this.ctx.strokeStyle = "rgb(0,0,0)";
                this.ctx.fillStyle = "rgb(120,150,10)";

                //Главное окно
                let rootArea = new JsonRoot(rootObj.id, rootObj.prj, rootObj.ord, rootObj.nuni, rootObj.name, rootObj.layout,
                        rootObj.type, rootObj.width, rootObj.height, rootObj.heightAdd, rootObj.color1, rootObj.color2, rootObj.color3, rootObj.paramJson);

                let arr = new Array();
                this.recursion(rootObj, 'FRAME_SIDE', arr);

                //Добавим рамы
                for (let v of arr) {
                    rootArea.mapFrame.set(v.layout, new ElemFrame(rootArea, v.id, v.layout, v.param));
                }
                ElemFrame.draw(this.ctx, rootArea);


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
