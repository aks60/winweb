//------------------------------------------------------------------------------
export  function draw_line(winc, x1, y1, x2, y2, rgb) {
    let ctx = winc.ctx;
    ctx.save();
    ctx.strokeStyle = (rgb == undefined) ? 'rgb(0,0,0)' : '#' + rgb[COLOR.rgb].toString(16);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
//------------------------------------------------------------------------------
export  function draw_stroke_polygon(winc, x1, x2, x3, x4, y1, y2, y3, y4, rgb) {
    let ctx = winc.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.fillStyle = '#' + rgb[COLOR.rgb].toString(16);
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
//------------------------------------------------------------------------------
export function draw_stroke_arc(winc, x, y, r, ang1, ang2, rgb, fill) {
    let ctx = winc.ctx;
    ctx.save();
    //ctx.strokeStyle = '#' + rgb[COLOR.rgb].toString(16);
    ctx.fillStyle = '#' + rgb[COLOR.rgb].toString(16);
    //ctx.lineWidth = win.dh_frm;
    ctx.beginPath();
    ctx.arc(x, y, r, ang1, ang2);
    if (fill)
        ctx.fill();
    ctx.stroke();
    ctx.restore();
}
//------------------------------------------------------------------------------
export  function draw_full_polygon(winc, x1, x2, x3, x4, y1, y2, y3, y4, rgb) {

    let ctx = winc.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.fillStyle = '#' + rgb[COLOR.rgb].toString(16);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
//------------------------------------------------------------------------------
//export function draw_full_circle(winc) {
//
//    let ctx = winc.ctx;
//    ctx.beginPath();
//    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
//    ctx.stroke();
//}
//------------------------------------------------------------------------------
export function draw_text(winc) {

    let ctx = winc.ctx;
    ctx.font = "30px Arial";
    ctx.strokeText("Hello World", 10, 50);
}
//------------------------------------------------------------------------------
//Рисуем конструкцию
export function draw_elements(winc) {
    //try {
    let obj = winc.obj, cnv = winc.cnv, ctx = winc.ctx, arr = winc.elemList;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    //Настроим контекст
    let scale = (cnv.width / obj.width < cnv.height / obj.height) ? cnv.width / (obj.width + 80) : cnv.height / (obj.height + 80);
    ctx.scale(scale, scale);
    ctx.translate(80, 0);
    ctx.lineWidth = 5;
    //ctx.strokeStyle = "rgb(0,0,0)";

    //Прорисовка стеклопакетов
    let glass = arr.filter((v, i, arr) => v.type == "GLASS");
    glass.forEach((v, k, map) => v.paint());

    //Прорисовка импостов
    let cross = arr.filter((v, i, arr) => v.type == "IMPOST");
    cross.forEach((v, k, map) => v.paint());

//        //Прорисовка штульпов
//        LinkedList < ElemCross > elemShtulpList = UCom.listSortObj(winc.listSortEl, Type.SHTULP);
//        elemShtulpList.stream().forEach(el - > el.paint());
//        
//        //Прорисовка стоек
//        LinkedList < ElemCross > elemStoikaList = UCom.listSortObj(winc.listSortEl, Type.STOIKA);
//        elemStoikaList.stream().forEach(el - > el.paint());

    //Прорисовка рам
    winc.root.frames.forEach((frame, key, map) => {
        //ctx.strokeStyle = '#' + frame.color2Rec[COLOR.rgb].toString(16);
        frame.paint();
    });
    //ctx.strokeStyle = "rgb(0,0,0)";

    //Прорисовка створок
    let stv = arr.filter((v, i, arr) => v.type == "STVORKA");
    stv.forEach((v, k, map) => v.paint());

    ctx.restore();
//    } catch (e) {
//        console.error('Ошибка: ' + e.message);
//    }
}
//------------------------------------------------------------------------------
