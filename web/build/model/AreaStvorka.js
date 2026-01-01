
import {UGeo} from './uGeo.js';
import {UCom} from '../../common/uCom.js';
import {Com5t, ElemFrame, AreaSimple} from './model.js'
import {Type, TypeOpen1, PKjson, LayoutKnob} from '../../enums/enums.js';

export class AreaStvorka extends AreaSimple {

    spcRec = null; //спецификация москитки
    sysfurnRec = eSysfurn.vrec; //фурнитура
    knobRec = eArtikl.vrec; //ручка
    loopRec = eArtikl.vrec; //подвес(петли)
    lockRec = eArtikl.vrec; //замок
    mosqRec = eArtikl.vrec; //москитка
    elementRec = eElement.vrec; //состав москидки 

    lineOpenHor = null; //линии горизонт. открывания
    lineOpenVer = null; //линии вертик. открывания
    knobOpen = null; //ручка открывания    
    knobColor = -3; //цвет ручки вирт...
    loopColor = -3; //цвет подвеса вирт...
    lockColor = -3; //цвет замка вирт...
    mosqColor = -3; //цвет москитки вирт...

    knobHeight = 0; //высота ручки
    typeOpen = TypeOpen1.EMPTY; //направление открывания
    knobLayout = LayoutKnob.MIDL; //положение ручки на створке      
    offset = [0, 0, 0, 0];

    constructor(winc, gson, owner) {
        super(winc, gson, owner);
    }

    initStvorka() {
        try {
            debugger;
            if (this.frames.length === 0) {
                //owner.area - если нет полигона створки в гл.окне 
                //this.area  - получатется при распиле owner.area импостом
                let frameBox = (this.winc.listElem.filter(elem => (elem.type === Type.IMPOST)).length === 0
                        || this.root.type === Type.DOOR) ? this.owner.area.getGeometryN(0) : this.area.getGeometryN(0);

                //Полигон створки с учётом нахлёста 
                let dh = this.winc.syssizRec[eSyssize.falz] + this.winc.syssizRec[eSyssize.naxl];
                let stvShell = UGeo.bufferGeometry(frameBox, this.winc.listElem, -dh, 0); //полигон векторов сторон створки с учётом нахл. 
                let coo = stvShell.getGeometryN(0).getCoordinates();
                for (let i = 0; i < coo.length - 1; i++) {

                    //Json координаты рам створок
                    let gson = {id: this.jsonID, type: Type.STV_SIDE, x1: coo[i].x, y1: coo[i].y};
                    gson.param = UCom.getJson(this.gson.param, PKjson.stvorkaSide[i]); //впихнул параметры в gson
                    let sideStv = new ElemFrame(this.winc, gson, this.owner);
                    sideStv.type = Type.STV_SIDE;
                    
                    this.frames.push(sideStv);
                    coo[i].z = sideStv.id;
                }
                coo[coo.length - 1].z = coo[0].z;  //т.к в цикле нет последней точки  
            }
        } catch (e) {
            errorLog("Error: AreaStvorka.initStvorka() " + e);
        }
    }

    /**
     * Фурнитура выбирается вручную из списка системы либо первая в списке
     * системы.
     *
     * Ручка по умолчанию из сист. фурнитуры либо если есть подбирается из
     * детализации выбр. фурн. либо выбирается вручную из ручек фыбранной
     * фурнитуры. Цвет первая запись из текстуры артикулов или подбор из текстур
     * или вручную.
     *
     */
    initArtikle(param) {

    }

    //Создание и коррекция сторон створки
    setLocation() {

    }

    paint() {
    }
}
