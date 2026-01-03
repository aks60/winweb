
import {UGeo} from './model/uGeo.js';
import {Type} from '../enums/enums.js';
import {UseType} from '../enums/UseType.js';
import {AreaSimple, AreaArch, AreaDoor, AreaRectangl, 
    AreaStvorka, ElemCross, ElemFrame, ElemGlass, Com5t} from './model/model.js';
import Polygon from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/Polygon.js';
import Coordinate from '../lib-js/jsts-2.12.1/org/locationtech/jts/geom/Coordinate.js';

win.build = function (canvas, script) {
    return new Wincalc(canvas).build(script);
};

export class Wincalc {
    id; //id конструкции
    nuni; //код системы  
    gson; //объектная модель конструкции
    mapPardef = new Map();  //пар. по умолчанию + наложенные пар. клиента
    listArea = new Array(); //список ареа.
    listElem = new Array(); //список элем.
    listJoin = new Array(); //список соед.
    listAll = new Array();  //список всех компонентов (area + elem)
    listKit = new Array();  //комплектация   
    scale = 1; //коэффициент сжатия
    syssizRec; //системные константы
    colorID1; //цвет базовый
    colorID2; //цвет внутр.
    colorID3; //цвет внещний 
    root; //объектная модель конструкции
    cnv; //канва рисования 2d
    sceleton = false; //см. paint
    ctx; //графический контекст 2d    

    constructor(canvas) {
        try {
            this.cnv = canvas;
            this.ctx = canvas.getContext('2d');
        } catch (e) {
            errorLog('Error: Wincalc.constructor() ' + e.message);
        }
    }

    build(script) {        
        try {
            //Инит свойств
            this.mapPardef.clear();
            for (var el of  [this.listArea, this.listElem, this.listJoin, this.listAll, this.listKit]) {
                el.length = 0;
            }
            this.gson = JSON.parse(script);      //объектная модель конструкции
            //this.setform(gson, this);             //форма конструкции, см. класс Area                   

            //Инит конструктива
            this.id = this.gson.id;
            this.nuni = (this.gson.nuni === undefined) ? -3 : this.gson.nuni;
            let sysprofRec = eSysprof.find2(this.nuni, UseType.FRAME[0]); //первая.запись коробки
            let artiklRec = eArtikl.find(sysprofRec[eSysprof.artikl_id], false); //артикул
            this.syssizRec = eSyssize.find(artiklRec); //системные константы
            this.colorID1 = findef(this.gson.color1, eColor.id, eColor)[eColor.id];
            this.colorID2 = findef(this.gson.color2, eColor.id, eColor)[eColor.id];
            this.colorID3 = findef(this.gson.color3, eColor.id, eColor)[eColor.id];

            //Главное окно
            if ('RECTANGL' === this.gson.type) {
                this.root = new AreaRectangl(this, this.gson, null);
                this.root.type = Type.RECTANGL;

            } else if ('TRAPEZE' === this.gson.type) {
                this.root = new AreaTrapeze(this, this.gson, null);
                this.root.type = Type.TRAPEZE;

            } else if ('ARCH' === this.gson.type) {
                this.root = new AreaArch(this, this.gson, null);
                this.root.type = Type.ARCH;

            } else if ('DOOR' === this.gson.type) {
                this.root = new AreaDoor(this, this.gson, null);
                this.root.type = Type.DOOR;
            }

            this.creator(this.root, this.gson); //создадим элементы конструкции    

            this.location(); //кальк. коорд. элементов конструкции    

            this.draw(); //прорисовка конструкции

            return this;

        } catch (e) {
            errorLog('Error: Wincalc.build(). ' + e.message);
        }
    }

    //Цыклическое заполнение root по содержимому gson 
    creator(owner, gson) {
        try {
            let hmDip = new Map();
            for (let js of gson.childs) {
                if (js.type === "BOX_SIDE") {
                    const box = new ElemFrame(this, js, owner);
                    box.type = Type.BOX_SIDE;
                    this.root.frames.push(box); //добавим ребёнка родителю

                } else if (js.type === "STVORKA") {
                    let stv = new AreaStvorka(this, js, owner);
                    stv.type = Type.STVORKA;
                    owner.childs.push(stv);
                    hmDip.set(stv, js);

                } else if (js.type === "AREA" || js.type === "ARCH" || js.type === "TRAPEZE" || js.type === "TRIANGL" || js.type === "DOOR") {
                    let area = new AreaSimple(this, js, owner);
                    if (js.type === "AREA")
                        area.type = Type.AREA;
                    else if (js.type === "ARCH")
                        area.type = Type.ARCH;
                    else if (js.type === "TRAPEZE")
                        area.type = Type.TRAPEZE;
                    else if (js.type === "TRIANGL")
                        area.type = Type.TRIANGL;
                    else if (js.type === "DOOR")
                        area.type = Type.DOOR;
                    owner.childs.push(area);
                    hmDip.set(area, js);

                } else if (js.type === "IMPOST" || js.type === "SHTULP" || js.type === "STOIKA") {
//                    const cross = new ElemCross(this, js, owner);
//                    if (js.type === "IMPOST")
//                        cross.type = Type.IMPOST;
//                    else if (js.type === "SHTULP")
//                        cross.type = Type.SHTULP;
//                    else if (js.type === "STOIKA")
//                        cross.type = Type.STOIKA;
//                    owner.childs.push(cross); //добавим ребёнка родителю
//                    hmDip.set(cross, js); //погружение ареа                    

                } else if (js.type === "GLASS") {
//                    let glass = new ElemGlass(js, this.root, this);
//                    glass.type = Type.GLASS;
//                    owner.childs.push(glass);
                }
            }
            //Теперь вложенные элементы
            for (let k of hmDip.keys()) {
                this.creator(k, hmDip.get(k));
            }
        } catch (e) {
            errorLog('Error: Wincalc.creator() ' + e.message);
        }
    }

    //Кальк.коорд. элементов конструкции
    location() {
        try {
            this.listElem.forEach(e => e.initArtikle()); //артиклы элементов            
            this.root.setLocation();

            //Исключая импост створки т.к. ств. ещё не создана
            for (let elem of this.listElem) {
                if (elem instanceof ElemFrame) {
                    elem.setLocation();
                } else if (elem instanceof ElemCross && elem.owner instanceof AreaStvorka == false) {
                    elem.setLocation();
                }
                for (let area of this.listArea) {
                    if (area.id != 0.0) {
                        if (area instanceof AreaStvorka == false && area.owner instanceof AreaStvorka == false) {
                            area.setLocation();
                        }
                    }
                }
            }

            //Создание створки
            this.listArea.filter(elem => elem.type === Type.STVORKA).forEach(e => e.initStvorka());
            this.listArea.filter(elem => elem.type === Type.STVORKA).forEach(e => e.initArtikle());
            this.listArea.filter(elem => elem.type === Type.STVORKA).forEach(e => e.setLocation());
            //UCom.filter(listElem, Type.STV_SIDE).forEach(e -> e.setLocation());
            
        } catch (e) {
            errorLog('Error: Wincalc.location() ' + e.message);
        }
    }

    //Рисуем конструкцию
    draw() {
        try {
            this.scale = (this.cnv.width / this.width() < this.cnv.height / this.height())
                    ? this.cnv.width / this.width() : this.cnv.height / this.height();
            this.ctx.scale(this.scale, this.scale);

            this.listArea.filter(el => el.type === Type.RECTANGL).forEach((el) => el.paint());
            this.listElem.filter(el => el.type === Type.BOX_SIDE).forEach((el) => el.paint());
            //this.listElem.filter(el => el.type === Type.IMPOST).forEach((el) => el.paint());

        } catch (e) {
            errorLog('Error: Wincalc.draw() ' + e.message);
        }
    }

    //Рисуем элем.констр.
    paint(element) {
        //this.ctx.save();
        if (element instanceof Polygon) {
            const coo = element.getCoordinates(); //это массив точек
            this.ctx.strokeStyle = 'blue';
            this.ctx.fillStyle = '#ff0000';
            this.ctx.lineWidth = 8;

            this.ctx.beginPath();
            this.ctx.moveTo(coo[0][0], coo[0][1]); //перемещаемся к первой точке
            for (let i = 1; i < coo.length; i++)
                this.ctx.lineTo(coo[i].x, coo[i].y); //рисуем линии
            this.ctx.closePath(); //замыкаем контур

            this.ctx.stroke(); //рисуем контур           
        } else {
            alert('Wincalc.paint()');
        }
        //this.ctx.restore();
    }

    // <editor-fold defaultstate="collapsed" desc="GET AND SET"> 
    width() {
        return this.root.area.getGeometryN(0).getEnvelopeInternal().getWidth();
    }

    height() {
        return this.root.area.getGeometryN(0).getEnvelopeInternal().getHeight();
    }
    // </editor-fold>     

// <editor-fold defaultstate="collapsed" desc="SUPPORT"> 
    arr_of_winc(area) {
        if (area.id == 0) {
            this.areaList.push(this.root);
        }
        if (area.frames !== null) {
            this.elemList.push(area);
            for (let frm of area.frames.values())
                this.elemList.push(frm);
        }
        for (let com of area.childs) {
            if (com instanceof Area) {
                this.areaList.push(com);
                this.arr_of_winc(com);
            } else {
                this.elemList.push(com);
            }
        }
    }

    //Поднять elem.form до Wincalc.form
    setform(gson, winc) {
        gson.childs.forEach(el => {
            if (el.form != null)
                winc.form = el.form;
            if (el.type === "AREA" || el.type === "ARCH" || el.type === "TRAPEZE" || el.type === "TRIANGL" || el.type === "DOOR")
                winc.setform(el, winc); //рекурсия 
        });
    }
// </editor-fold> 
}



