import {test as test3, draw_frame} from "./drawing.js";
import {AreaRectangl, AreaDoor, AreaTrapeze, AreaTriangl, AreaStvorka,
        ElemCross, ElemFrame, ElemGlass, test as test2} from './model.js';


winc.parse = function () {
    try {
        if (order.sel_table2 != undefined) {

            let script = order.sel_table2.script;
            winc.rootArea = JSON.parse(script);
            winc.koefX = winc.canvas.width / winc.rootArea.width;
            winc.koefY = winc.canvas.height / winc.rootArea.height;

            if (winc.rootAre.type = "RECTANGL") {
                winc.rectangl(winc.rootAre);

            } else if (winc.rootAre.type = "DOOR") {
                winc.rectangl();

            } else if (winc.rootAre.type = "TRAPEZE") {
                winc.rectangl();

            } else if (winc.rootAre.type = "TRIANGL") {
                winc.rectangl();

            } else if (winc.rootAre.type = "ARCH") {
                winc.rectangl();
            }
        }
    } catch (e) {
        //console.error('Ошибка: ', e.message);
    }

}

winc.rectangl = function (w) {
    debugger;
    try {
        let korobka = w.childs;
        for (let frame in korobka) {
            if (korobka[frame].layout == "BOTT") {
                //draw_frame(winc.dh_frame, w.height - winc.dh_frame, w.width, w.height);

            } else if (korobka[frame].layout == "RIGHT") {

            } else if (korobka[frame].layout == "TOP") {

            } else if (korobka[frame].layout == "LEFT") {

            }
        }
    } catch (e) {
        console.error('Ошибка: ', e.message);
    }
}

winc.door = function (windows) {
    try {
        let korobka = windows.childs;
        for (let frame in korobka) {
            if (frame.layout == "BOTT") {

            } else if (frame.layout == "RIGHT") {

            } else if (frame.layout == "TOP") {

            } else if (frame.layout == "LEFT") {

            }
        }
    } catch (e) {
        console.error('Ошибка: ', e.message);
    }
}
