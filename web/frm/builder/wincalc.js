import {test as test3} from "./drawing.js";
import {AreaRectangl, AreaDoor, AreaTrapeze, AreaTriangl, AreaStvorka,
        ElemCross, ElemFrame, ElemGlass, test as test2} from './model.js';


wincalc.parse = function () {
    debugger;
    try {
        if (order.sel_table2 != undefined) {

            let script = order.sel_table2.script;
            let win = JSON.parse(script);
            let rootGson = new GsonRoot(win.org, win.ord, iwin.nuni, iwin, iwin.name, 
                 iwin.layout, iwin.type, iwin.width, iwin.height, iwin.heightAdd, iwin.color1, iwin.color2,iwin.color3)
            //console.log(win);
            console.dir(win);
        }
    } catch (e) {
        console.log(e);
    }

}

wincalc.rectangl = function  () {
    
}
