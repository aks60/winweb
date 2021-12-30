
export  function draw_stroke_polygon(iwin, x1, x2, x3, x4, y1, y2, y3, y4, rgd) {
    
    let ctx = iwin.ctx;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}
