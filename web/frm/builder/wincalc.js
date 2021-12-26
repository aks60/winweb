import {test as test3, draw_frame} from "./drawing.js";
import {AreaRectangl, AreaDoor, AreaTrapeze, AreaTriangl, AreaStvorka,
        ElemCross, ElemFrame, ElemGlass, test as test2} from './model.js';


winc.parse = function () {
    try {
        if (order.sel_table2 != undefined) {
            let script = order.sel_table2.script;
            winc.rootArea = JSON.parse(script);
            winc.scale = (winc.canvas.width / winc.rootArea.width > winc.canvas.height / winc.rootArea.height)
                    ? winc.canvas.width / winc.rootArea.width : winc.canvas.height / winc.rootArea.height;
            winc.context.scale(winc.scale, winc.scale);

            if (winc.rootArea.type = "RECTANGL") {
                winc.rectangl();

            } else if (winc.rootArea.type = "DOOR") {
                winc.rectangl();

            } else if (winc.rootArea.type = "TRAPEZE") {
                winc.rectangl();

            } else if (winc.rootArea.type = "TRIANGL") {
                winc.rectangl();

            } else if (winc.rootArea.type = "ARCH") {
                winc.rectangl();
            }
        }
    } catch (e) {
        //console.error('Ошибка: ', e.message);
    }

}

winc.rectangl = function () {
    debugger;
    try {
        let korobka = winc.rootArea.childs;
        for (let frame in korobka) {
            if (korobka[frame].layout == "BOTT") {
                draw_frame(0, winc.rootArea.height, winc.rootArea.width, winc.dh_frame);

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
