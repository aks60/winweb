//------------------------------------------------------------------------------
export class Draw {

    static line(winc, x1, y1, x2, y2, rgb) {
        let ctx = winc.ctx;
        ctx.save();
        ctx.strokeStyle = "blue"; //(rgb == undefined) ? 'rgb(0,0,0)' : '#' + rgb[eColor.rgb].toString(16);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    static polygon(winc, polygon) {
        
        let ctx = winc.ctx;
        ctx.save();
        const coo = polygon.getCoordinates(); //это массив точек
        ctx.beginPath();  
        ctx.moveTo(coo[0][0], coo[0][1]); //перемещаемся к первой точке
        for (let i = 1; i < coo.length; i++) {
            ctx.lineTo(coo[i].x, coo[i].y); //рисуем линии
        }
       ctx.closePath(); //замыкаем контур
       ctx.lineWidth = 8;
        //ctx.strokeStyle = 'blue';
        //ctx.fillStyle = 'blue';
        ctx.stroke(); //рисуем контур
        ctx.restore();
    }

    static polygon_stroke(winc, x1, x2, x3, x4, y1, y2, y3, y4, rgb) {
        let ctx = winc.ctx;
        ctx.save();
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.fillStyle = '#' + rgb[eColor.rgb].toString(16);
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

    static polygon_full(winc, x1, x2, x3, x4, y1, y2, y3, y4, rgb) {

        let ctx = winc.ctx;
        ctx.save();
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.fillStyle = '#' + rgb[eColor.rgb].toString(16);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    static arc_full(winc, x, y, r, ang1, ang2, lineWidth, strokeStyle, fillStyle, fill) {
        let ctx = winc.ctx;
        ctx.save();
        ctx.strokeStyle = (strokeStyle) ? '#' + strokeStyle[eColor.rgb].toString(16) : 'rgb(0,0,0)';
        ctx.fillStyle = (fillStyle) ? '#' + fillStyle[eColor.rgb].toString(16) : ctx.fillStyle;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(x, y, r, ang1, ang2);
        if (fill)
            ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    static text(winc) {

        let ctx = winc.ctx;
        ctx.font = "30px Arial";
        ctx.strokeText("Hello World", 10, 50);
    }

    static elements(winc) {
        try {
            let gson = winc.gson, cnv = winc.cnv, ctx = winc.ctx, arr = winc.elemList;

            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.clearRect(0, 0, cnv.width, cnv.height);

            //Настроим контекст
            winc.scale = (cnv.width / gson.width < cnv.height / gson.height) ? cnv.width / gson.width : cnv.height / gson.height;
            ctx.scale(winc.scale, winc.scale);
            ctx.lineWidth = 4;

            //Прорисовка стеклопакетов
            let glass = arr.filter((v, i, arr) => v.typeForm() == "GLASS");
            glass.forEach((v, k, map) => v.paint());

            //Прорисовка импостов
            let cross = arr.filter((v, i, arr) => v.typeForm() == "IMPOST");
            cross.forEach((v, k, map) => v.paint());

//        //Прорисовка штульпов
//        LinkedList < ElemCross > elemShtulpList = UCom.listSortObj(winc.listSortEl, Type.SHTULP);
//        elemShtulpList.stream().forEach(el - > el.paint());
//        
//        //Прорисовка стоек
//        LinkedList < ElemCross > elemStoikaList = UCom.listSortObj(winc.listSortEl, Type.STOIKA);
//        elemStoikaList.stream().forEach(el - > el.paint());


            //Прорисовка рам
            winc.root.frames.get('TOP').paint();
            winc.root.frames.get('BOTT').paint();
            winc.root.frames.get('LEFT').paint();
            winc.root.frames.get('RIGHT').paint();


            //Прорисовка створок
            let stv = arr.filter((v, i, arr) => v.typeForm() == "STVORKA");
            stv.forEach((v, k, map) => v.paint());

            ctx.restore();
        } catch (e) {
            console.error('Error: drawing.draw_elements() ' + e.message);
        }
    }
}