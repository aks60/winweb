import {AreaRectangl, AreaDoor, AreaTrapeze, AreaTriangl,
        AreaStvorka, ElemCross, ElemFrame, ElemGlass} from './model.js';

winc.init_gc2d = function (cnv) {
    winc.canvas = cnv;
    winc.context = cnv.getContext('2d');
}

export function test() {
    alert('pain');
}

export function draw_frame_bott(w, h) {

    winc.context.beginPath();
    winc.context.moveTo(0, h);
    winc.context.lineTo(w, h);
    winc.context.lineTo(w - winc.dh_frame, h - winc.dh_frame);
    winc.context.lineTo(winc.dh_frame, h - winc.dh_frame);
    winc.context.closePath();
    winc.context.stroke();
    winc.context.fill();
}

export function draw_frame_right(w, h) {

    winc.context.beginPath();
    winc.context.moveTo(w, h);
    winc.context.lineTo(w, 0);
    winc.context.lineTo(w - winc.dh_frame, winc.dh_frame);
    winc.context.lineTo(w - winc.dh_frame, h - winc.dh_frame);
    winc.context.closePath();
    winc.context.stroke();
    winc.context.fill();
}
export function draw_frame_top(w, h) {

    winc.context.beginPath();
    winc.context.moveTo(w, 0);
    winc.context.lineTo(0, 0);
    winc.context.lineTo(winc.dh_frame, winc.dh_frame);
    winc.context.lineTo(w - winc.dh_frame, winc.dh_frame);
    winc.context.closePath();
    winc.context.stroke();
    winc.context.fill();
}

export function draw_frame_left(w, h) {

    winc.context.beginPath();
    winc.context.moveTo(0, 0);
    winc.context.lineTo(0, h);
    winc.context.lineTo(winc.dh_frame, h - winc.dh_frame);
    winc.context.lineTo(winc.dh_frame, winc.dh_frame);
    winc.context.closePath();
    winc.context.stroke();
    winc.context.fill();
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
