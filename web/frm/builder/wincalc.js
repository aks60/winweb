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
            winc.context.lineWidth = 5;
            winc.context.strokeStyle = "rgb(0,0,0)";
            winc.context.fillStyle = "rgb(120,150,10)";

            if (winc.rootArea.type = "RECTANGL") {
                //winc.rectangl();
                winc.parse3(winc.rootArea);

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
        console.error('Ошибка: ' + e.message);
    }

}

winc.rectangl = function () {

    try {
        let korobka = winc.rootArea.childs;
        for (let frame in korobka) {
            korobka[frame].parent = winc.rootArea;

            if (korobka[frame].type == "FRAME_SIDE") {
                let w = winc.rootArea.width;
                let h = winc.rootArea.height;
                draw_frame_bott(0, h, w, h);
                draw_frame_right(w, h, w, h);
                draw_frame_top(w, 0, w, h);
                draw_frame_left(0, 0, w, h);

            } else if (korobka[frame].type == "STVORKA") {
//                let w = korobka[frame].parent.width;
//                let h = korobka[frame].parent.height;
//                let w2 = (korobka[frame].parent.width - 2 * h2) + 2 * n;
//                let h2 = (korobka[frame].parent.height - 2 * h2) + 2 * n;
//                draw_frame_bott(winc.dh_frame - winc.naxl, h - winc.dh_frame + winc.naxl, w, h);
//                draw_frame_right(w - h2 + n, h, w, h);
//                draw_frame_top(w - h2 + n, 0, w, h);
//                draw_frame_left(h2 - n, 0, w, h);
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

winc.parse3 = function (el) {
    for (let key in el) {
        let val = el[key];
        if ((val instanceof Object) == false) {
            console.log(key + ": " + val);
            
            
        } else {
           winc.parse3(val); 
        } 
    }
}

winc.parse2 = function () {
    for (let k1 in winc.rootArea) {
        let v1 = winc.rootArea[k1];
        if ((v1 instanceof Object) == false) {
            console.log("lev1 = " + k1 + "-" + v1);
        } else {

            for (let k2 in v1) {
                let v2 = v1[k2];
                if ((v2 instanceof Object) == false) {
                    console.log("lev2 = " + k2 + "-" + v2);
                } else {

                    for (let k3 in v2) {
                        let v3 = v2[k3];
                        if ((v3 instanceof Object) == false) {
                            console.log("lev3 = " + k3 + "-" + v3);
                        } else {

                            for (let k4 in v3) {
                                let v4 = v3[k4];
                                if ((v4 instanceof Object) == false) {
                                    console.log("lev4 = " + k4 + "-" + v4);
                                } else {

                                    for (let k5 in v4) {
                                        let v5 = v4[k5];
                                        if ((v5 instanceof Object) == false) {
                                            console.log("lev5 = " + k5 + "-" + v5);
                                        } else {

                                            for (let k6 in v5) {
                                                let v6 = v5[k6];
                                                if ((v6 instanceof Object) == false) {
                                                    console.log("lev6 = " + k6 + "-" + v6);
                                                } else {

                                                    for (let k7 in v6) {
                                                        let v7 = v6[k7];
                                                        if ((v7 instanceof Object) == false) {
                                                            console.log("lev7 = " + k7 + "-" + v7);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
