
export  function draw_stroke_polygon(iwin, x1, x2, x3, x4, y1, y2, y3, y4, rgd) {
    
    let ctx = iwin.ctx;
    ctx.fillStyle = iwin.RGB;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

export  function draw_full_polygon(iwin, x1, x2, x3, x4, y1, y2, y3, y4, rgd) {
    
    let ctx = iwin.ctx;
    ctx.fillStyle = 'blue';
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
    try {
        //Прорисовка стеклопакетов
        let glass = arr.filter((v, i, arr) => v.type == "GLASS");
        glass.forEach((v, k, map) => v.paint());

//        LinkedList < ElemGlass > elemGlassList = UCom.listSortObj(iwin.listSortEl, Type.GLASS);
//        elemGlassList.stream().forEach(el - > el.paint());
//        
//        //Прорисовка импостов
//        LinkedList < ElemCross > elemImpostList = UCom.listSortObj(iwin.listSortEl, Type.IMPOST);
//        elemImpostList.stream().forEach(el - > el.paint());
//        
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

    } catch (e) {
        console.error('Ошибка: ' + e.message);
    }
}
