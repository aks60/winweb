import {test as test3, draw_frame_bott, draw_frame_right, draw_frame_top, draw_frame_left} from "./drawing.js";
import {AreaRectangl, AreaDoor, AreaTrapeze, AreaTriangl, AreaStvorka,
        ElemCross, ElemFrame, ElemGlass, test as test2} from './model.js';


winc.parse = function () {
    try {
        if (order.sel_table2 != undefined) {
            let script = order.sel_table2.script;
            winc.rootArea = JSON.parse(script);
            winc.context.save();

            winc.scale = (winc.canvas.width / winc.rootArea.width < winc.canvas.height / winc.rootArea.height)
                    ? winc.canvas.width / (winc.rootArea.width + 80) : winc.canvas.height / (winc.rootArea.height + 80);
            winc.context.scale(winc.scale, winc.scale);
            winc.context.translate(80, 0);
            winc.context.lineWidth = 8;
            winc.context.strokeStyle = "rgb(0,0,0)";
            winc.context.fillStyle = "rgb(120,150,10)";

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
            winc.context.restore();
        }
    } catch (e) {
        //console.error('Ошибка: ', e.message);
    }

}

winc.rectangl = function () {

    try {
        let korobka = winc.rootArea.childs;
        for (let frame in korobka) {
            if (korobka[frame].layout == "BOTT") {
                draw_frame_bott(winc.rootArea.width, winc.rootArea.height);

            } else if (korobka[frame].layout == "RIGHT") {
                draw_frame_right(winc.rootArea.width, winc.rootArea.height);                

            } else if (korobka[frame].layout == "TOP") {
                draw_frame_top(winc.rootArea.width, winc.rootArea.height);                

            } else if (korobka[frame].layout == "LEFT") {
                draw_frame_left(winc.rootArea.width, winc.rootArea.height);

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
