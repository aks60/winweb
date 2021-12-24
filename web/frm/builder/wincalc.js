import {test as test3} from "./drawing.js";
import {AreaRectangl, AreaDoor, AreaTrapeze, AreaTriangl, AreaStvorka,
        ElemCross, ElemFrame, ElemGlass, test as test2} from './model.js';


wincalc.parse = function () {
    //debugger;
    try {
        if (order.sel_table2 != undefined) {

            let script = order.sel_table2.script;
            let win = JSON.parse(script);

            if (win.type = "RECTANGL") {
                wincalc.rectangl(win);

            } else if (win.type = "DOOR") {
                wincalc.rectangl();

            } else if (win.type = "TRAPEZE") {
                wincalc.rectangl();

            } else if (win.type = "TRIANGL") {
                wincalc.rectangl();

            } else if (win.type = "ARCH") {
                wincalc.rectangl();
            }
        }
    } catch (e) {
        console.log(e);
    }

}

wincalc.rectangl = function (windows) {
    debugger;
    let korobka = windows.childs;
    for (let frame in korobka) {
        if (frame.layout == "BOTT") {

        } else if (frame.layout == "RIGHT") {

        } else if (frame.layout == "TOP") {

        } else if (frame.layout == "LEFT") {

        }
    }
}

wincalc.door = function (windows) {
    let korobka = windows.childs;
    for (let frame in korobka) {
        if (frame.layout == "BOTT") {

        } else if (frame.layout == "RIGHT") {

        } else if (frame.layout == "TOP") {

        } else if (frame.layout == "LEFT") {

        }
    }
}
