import {AreaRectangl, AreaDoor, AreaTrapeze, AreaTriangl,
        AreaStvorka, ElemCross, ElemFrame, ElemGlass} from './model.js';

winc.init_gc2d = function (cnv) {
    winc.canvas = cnv;
    winc.context = cnv.getContext('2d');
}

export function test() {
    alert('pain');
}

export function draw_frame(x1, y1, x2, y2) {

    debugger;  
    winc.context.fillRect(x1 * winc.koefX, y1 * winc.koefY, x2 * winc.koefX, y2 * winc.koefY);
}

/*
 {
 "name": "KBE 58\\1 ОКНА\\Открывание внутрь (ств. Z77)",
 "prj": 601001,
 "ord": 1,
 "nuni": 8,
 "width": 900.0,
 "height": 1300.0,
 "heightAdd": 1300.0,
 "form": 0,
 "color1": 1009,
 "color2": 10009,
 "color3": 1009,
 "id": 0.0,
 "childs": [
 {
 "id": 1.0,
 "childs": [],
 "layout": "LEFT",
 "type": "FRAME_SIDE"
 },
 {
 "id": 2.0,
 "childs": [],
 "layout": "RIGHT",
 "type": "FRAME_SIDE"
 },
 {
 "id": 3.0,
 "childs": [],
 "layout": "TOP",
 "type": "FRAME_SIDE"
 },
 {
 "id": 4.0,
 "childs": [],
 "layout": "BOTT",
 "type": "FRAME_SIDE"
 },
 {
 "id": 5.0,
 "childs": [
 {
 "id": 6.0,
 "childs": [],
 "type": "GLASS"
 }
 ],
 "layout": "VERT",
 "type": "STVORKA",
 "param": "{'typeOpen':1, 'sysfurnID':1634}"
 }
 ],
 "layout": "VERT",
 "type": "RECTANGL"
 }
 */
