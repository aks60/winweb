import {JsonRoot, JsonArea, Stvorka, ElemCross, ElemFrame, ElemGlass} from './model.js';
    
export let canvas;

export function draw_frame_bott(ctx, x, y, w, h) {

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(w, h);
    ctx.lineTo(w - winc.dh_frame, h - winc.dh_frame);
    ctx.lineTo(winc.dh_frame, h - winc.dh_frame);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

export function draw_frame_right(ctx, x, y, w, h) {

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(w, 0);
    ctx.lineTo(w - winc.dh_frame, winc.dh_frame);
    ctx.lineTo(w - winc.dh_frame, h - winc.dh_frame);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}
export function draw_frame_top(ctx, x, y, w, h) {

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(0, 0);
    ctx.lineTo(winc.dh_frame, winc.dh_frame);
    ctx.lineTo(w - winc.dh_frame, winc.dh_frame);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

export function draw_frame_left(ctx, x, y, w, h) {

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(0, h);
    ctx.lineTo(winc.dh_frame, h - winc.dh_frame);
    ctx.lineTo(winc.dh_frame, winc.dh_frame);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
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
