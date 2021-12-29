
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

export  function draw_stroke_polygon(ctx, x1, x2, x3, x4, y1, y2, y3, y4, rgd) {

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
