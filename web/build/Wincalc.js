
import {UGeo} from './model/uGeo.js';
import {UCom} from '../common/uCom.js';
import {Type, PKjson} from '../enums/enums.js';
import {UseType} from '../enums/UseType.js';
import {AreaSimple, AreaArch, AreaDoor, AreaRectangl,
        AreaStvorka, ElemCross, ElemFrame, ElemGlass, Com5t} from './model/model.js';
import LineString from '../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineString.js';
import Polygon from '../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Polygon.js';
import Coordinate from '../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Coordinate.js';

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
    actionEvent = {};
    root; //объектная модель конструкции
    cnv; //канва рисования 2d
    dXY = 40; //коррекция разм. линий
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
            this.parametr(this.gson.param);

            this.creator(this.root, this.gson); //создадим элементы конструкции    

            this.location(); //кальк. коорд. элементов конструкции    

            this.draw(); //прорисовка конструкции

            return this;

        } catch (e) {
            errorLog('Error: Wincalc.build(). ' + e.message);
        }
    }

    //Параметры системы(технолога) + параметры менеджера
    parametr(param) {
        try {
            //Параметры системы конструкции
            eSyspar1.list.filter(rec => rec[eSyspar1.systree_id] == this.nuni)
                    .forEach(syspar1Rec => this.mapPardef.set(syspar1Rec[eSyspar1.groups_id], [...syspar1Rec]));

            if (UCom.isFinite(param, PKjson.ioknaParam)) {
                //Добавим к параметрам системы конструкции параметры конкретной конструкции
                let ioknaParamArr = param[PKjson.ioknaParam];
                for (const ioknaID of ioknaParamArr) { //цикл по параметрам менеджера
                    //Найдём record paramsRec и syspar1Rec;   
                    if (ioknaID < 0) {
                        let paramsRec = eParams.list.find(rec => rec[eParams.id] == ioknaID); //параметр менеджера
                        let syspar1Rec = this.mapPardef.get(paramsRec[eParams.groups_id]);
                        if (syspar1Rec !== undefined) { //ситуация если конструкция с nuni = -3, т.е. модели
                            syspar1Rec[eParams.text] = paramsRec[eParams.text]; //накладываем параметр менеджера
                        }
                    } else {
                        let paramsRec = eParams.find(ioknaID); //параметр менеджера
                        let syspar1Rec = this.mapPardef.get(paramsRec[eParams.groups_id]);
                        if (syspar1Rec !== undefined) { //ситуация если конструкция с nuni = -3, т.е. модели
                            let text = eColor.find(paramsRec[eParmap.color_id1])[eColor.name];
                            syspar1Rec[eParams.text] = text; //накладываем параметр менеджера
                        }
                    }
                }
            }
        } catch (e) {
            errorLog('Error: Wincalc.parametr() ' + e.message);
        }
    }

    //Цыклическое заполнение root по содержимому скрипта gson 
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
                    const cross = new ElemCross(this, js, owner);
                    if (js.type === "IMPOST")
                        cross.type = Type.IMPOST;
                    else if (js.type === "SHTULP")
                        cross.type = Type.SHTULP;
                    else if (js.type === "STOIKA")
                        cross.type = Type.STOIKA;
                    owner.childs.push(cross); //добавим ребёнка родителю                 

                } else if (js.type === "GLASS") {
                    let glass = new ElemGlass(this, js, owner);
                    glass.type = Type.GLASS;
                    owner.childs.push(glass);
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
                } else if (elem instanceof ElemCross && elem.owner instanceof AreaStvorka === false) {
                    elem.setLocation();
                }
            }
            //Исключая створку т.к. она не создана
            for (let area of this.listArea) {
                if (area.id != 0.0) {
                    if (area instanceof AreaStvorka === false && area.owner instanceof AreaStvorka === false) {
                        area.setLocation();
                    }
                }
            }

            //Создание створки
            this.listArea.filter(elem => elem.type === Type.STVORKA).forEach(e => e.initStvorka());
            this.listElem.filter(elem => elem.type === Type.STV_SIDE).forEach(e => e.initArtikle());
            this.listArea.filter(elem => elem.type === Type.STVORKA).forEach(e => e.setLocation());
            this.listElem.filter(elem => elem.type === Type.STV_SIDE).forEach(e => e.setLocation());

        } catch (e) {
            errorLog('Error: Wincalc.location() ' + e.message);
        }
    }

    //Рисуем конструкцию
    draw() {
        try {           
            if (this.cnv.width < 100 && this.cnv.height < 100) {
                this.scale = (this.cnv.width / this.height < this.cnv.height / this.height)
                        ? this.cnv.width / this.width : this.cnv.height / this.height;
            } else {
                this.scale = ((this.cnv.width - this.dXY) / this.height < (this.cnv.height - this.dXY) / this.height)
                        ? (this.cnv.width - this.dXY) / this.width : (this.cnv.height - this.dXY) / this.height;
            }
            this.ctx.scale(this.scale, this.scale);
            //this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
            

            //Прорисовка стеклопакетов
            this.listElem.filter(el => el.type === Type.GLASS).forEach((el) => el.paint());

            //Прорисовка импостов
            this.listElem.filter(el => el.type === Type.IMPOST).forEach((el) => el.paint());

            //Прорисовка рам
            let arr = this.listElem.filter(el => el.type === Type.BOX_SIDE);
            this.listElem.filter(el => el.type === Type.BOX_SIDE).forEach((el) => el.paint());

            //Прорисовка рам створок
            this.listElem.filter(el => el.type === Type.STV_SIDE).forEach((el) => el.paint());

            //Прорисока фурнитуры створок
            this.listArea.filter(el => el.type === Type.STVORKA).forEach((el) => el.paint());

            //Размерные линии
            if (this.scale > .1) {
                this.root.paint();
            }
        } catch (e) {
            errorLog('Error: Wincalc.draw() ' + e.message);
        }
    }

    //Рисуем элем.констр.
    paint(geometry) {
        this.ctx.save();
        //geometry = LineString.new([[0,300], [2000,300]]); //Test
        const coo = geometry.getCoordinates(); //это массив точек

        if (geometry instanceof LineString) {
            this.ctx.beginPath();
            this.ctx.moveTo(coo[0].x, coo[0].y); //перемещаемся к первой точке
            for (let i = 1; i < coo.length; i++)
                this.ctx.lineTo(coo[i].x, coo[i].y); //рисуем линии
            //this.ctx.closePath();

        } else if (geometry instanceof Polygon) {
            this.ctx.beginPath();
            this.ctx.moveTo(coo[0].x, coo[0].y); //перемещаемся к первой точке
            for (let i = 1; i < coo.length; i++)
                this.ctx.lineTo(coo[i].x, coo[i].y); //рисуем линии
            //this.ctx.closePath(); //замыкаем контур 
            this.ctx.fill();

        } else {
            //this.ctx.strokeStyle = 'blue';
            //this.ctx.fillStyle = "rgba(255, 165, 0, 0.5)";            
            alert('Wincalc.paint()');
        }
        this.ctx.stroke(); //рисуем контур 
        this.ctx.restore();
    }

    // <editor-fold defaultstate="collapsed" desc="GET AND SET"> 
    get width() {
        return this.root.area.getGeometryN(0).getEnvelopeInternal().getWidth();
    }

    get height() {
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

Wincalc.new = function (canvas, script) {
    return new Wincalc(canvas).build(script);
};



