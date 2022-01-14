
export  function draw_line(iwin, x1, y1, x2, y2, rgb) {

    let ctx = iwin.ctx;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

export  function draw_stroke_polygon(iwin, x1, x2, x3, x4, y1, y2, y3, y4, rgb) {

    let ctx = iwin.ctx;
    ctx.fillStyle = rgb;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

export  function draw_full_polygon(iwin, x1, x2, x3, x4, y1, y2, y3, y4, rgb) {

    let ctx = iwin.ctx;
    ctx.fillStyle = rgb;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
}

//Рисуем конструкцию
export function draw_elements(iwin, arr) {
    //try {
        iwin.ctx.save();
        
        let obj = iwin.obj, cnv = iwin.cnv, ctx = iwin.ctx;        
        ctx.fillStyle = '#ffffff';
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        //Настроим контекст
        let scale = (cnv.width / obj.width < cnv.height / obj.height) ? cnv.width / (obj.width + 80) : cnv.height / (obj.height + 80);
        ctx.scale(scale, scale);
        ctx.translate(80, 0);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "rgb(0,0,0)";

        //Прорисовка стеклопакетов
        let glass = arr.filter((v, i, arr) => v.type == "GLASS");
        glass.forEach((v, k, map) => v.paint());
        
        //Прорисовка импостов
        let cross = arr.filter((v, i, arr) => v.type == "IMPOST");
        cross.forEach((v, k, map) => v.paint());
        
//        //Прорисовка штульпов
//        LinkedList < ElemCross > elemShtulpList = UCom.listSortObj(iwin.listSortEl, Type.SHTULP);
//        elemShtulpList.stream().forEach(el - > el.paint());
//        
//        //Прорисовка стоек
//        LinkedList < ElemCross > elemStoikaList = UCom.listSortObj(iwin.listSortEl, Type.STOIKA);
//        elemStoikaList.stream().forEach(el - > el.paint());

        //Прорисовка рам
        iwin.root.frames.forEach((val, key, map) => val.paint());

        //Прорисовка створок
        let stv = arr.filter((v, i, arr) => v.type == "STVORKA");
        stv.forEach((v, k, map) => v.paint());

        ctx.restore();
//    } catch (e) {
//        console.error('Ошибка: ' + e.message);
//    }
}
