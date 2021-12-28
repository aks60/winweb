
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
