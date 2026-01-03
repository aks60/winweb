
import {UGeo} from './uGeo.js';
import {UCom} from '../../common/uCom.js';
import {Com5t, ElemFrame, AreaSimple} from './model.js'
import {Type, TypeOpen1, TypeOpen2, PKjson, LayoutKnob} from '../../enums/enums.js';
import Polygon from '../../lib-js/jsts-2.12.1/org/locationtech/jts/geom/Polygon.js';

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
        this.initArtikle(gson.param);
    }

    initStvorka() {
        try {
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
                    let ID = this.gson.id + (0.1 + i/10);
                    let gson = {id: ID, type: Type.STV_SIDE, x1: coo[i].x, y1: coo[i].y};
                    gson.param = UCom.getJson(this.gson.param, PKjson.stvorkaSide[i]); //впихнул параметры в gson
                    let sideStv = new ElemFrame(this.winc, gson, this.owner);
                    sideStv.type = Type.STV_SIDE;

                    this.frames.push(sideStv);
                    coo[i].z = sideStv.id;
                }
            }
        } catch (e) {
            errorLog("Error: AreaStvorka.initStvorka() " + e.message);
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
        try {
            //debugger;
            //Поиск по параметру или первая запись из списка...
            //Фурнитура
            if (UCom.isFinite(param, PKjson.sysfurnID)) {
                this.sysfurnRec = eSysfurn.find2(param[PKjson.sysfurnID]);
            } else { //по умолчанию
                this.sysfurnRec = eSysfurn.find3(this.winc.nuni); //ищем первую в системе
            }
            //Ручка
            if (UCom.isFinite(param, PKjson.artiklKnob)) {
                this.knobRec = eArtikl.find(param[PKjson.artiklKnob], false);
            } else { //по умолчанию
                this.knobRec = eArtikl.find(this.sysfurnRec[eSysfurn.artikl_id1], false);
            }
            //Текстура ручки
            if (UCom.isFinite(param, PKjson.colorKnob)) {
                this.knobColor = param[PKjson.colorKnob];
            } else if (this.knobColor === -3) { //по умолчанию (первая в списке)
                this.knobColor = eArtdet.find(this.knobRec[eArtikl.id])[eArtdet.color_fk];
                if (this.knobColor < 0) { //если все текстуры группы
                    let recordList = eColor.list.filter(rec => rec[eColor.groups_id] === this.knobColor);
                    if (recordList.length === 0) {
                        this.knobColor = eColor.list.find(this.knobColor)[0][eColor.id];
                    }
                }
            }
            //Подвес (петли)
            if (UCom.isFinite(param, PKjson.artiklLoop)) {
                this.loopRec = eArtikl.find(param[PKjson.artiklLoop], false);
            }
            //Текстура подвеса
            if (UCom.isFinite(param, PKjson.colorLoop)) {
                this.loopColor = param[PKjson.colorLoop];
            }
            //Замок
            if (UCom.isFinite(param, PKjson.artiklLock)) {
                this.lockRec = eArtikl.find(param[PKjson.artiklLock], false);
            }
            //Текстура замка
            if (UCom.isFinite(param, PKjson.colorLock)) {
                tis.lockColor = param[PKjson.colorLock];
            }
            //Сторона открывания
            if (UCom.isFinite(param, PKjson.typeOpen)) {
                this.typeOpen = TypeOpen1[param[PKjson.typeOpen]];
            } else {
                let index = this.sysfurnRec[eSysfurn.side_open];
                this.typeOpen = (index === TypeOpen2.REQ[0]) ? this.typeOpen
                        : (index === TypeOpen2.LEF[0]) ? TypeOpen1.RIGH : TypeOpen1.LEFT;
            }
            //Положение ручки на створке, ручка задана параметром
            if (UCom.isFinite(param, PKjson.positionKnob)) {
                let position = param[PKjson.positionKnob];
                if (position === LayoutKnob.VAR[0]) { //вариационная
                    this.knobLayout = LayoutKnob.VAR;
                    if (UCom.isFinite(param, PKjson.heightKnob)) {
                        this.knobHeight = param[PKjson.heightKnob];
                        if (UCom.isFinite(param, PKjson.heightKnob)) {
                            this.knobHeight = param[PKjson.heightKnob];
                        }
                    }
                } else { //по середине или константная
                    this.knobLayout = (position === LayoutKnob.MIDL[0]) ? LayoutKnob.MIDL : LayoutKnob.CONST;
                }
            }
        } catch (e) {
            errorLog("Error: AreaStvorka.initArtikle() " + e.message);
        }
    }

    //Создание и коррекция сторон створки
    setLocation() {
        try {
            let frameBox = (this.winc.listElem.filter(el => el.type === Type.IMPOST).length === 0)
                    || (this.winc.root.type === Type.DOOR) ? this.owner.area.getGeometryN(0) : this.area.getGeometryN(0);
            //Полигон створки с учётом нахлёста 
            let dh = this.winc.syssizRec[eSyssize.falz] + this.winc.syssizRec[eSyssize.naxl];           
            let stvShell = UGeo.bufferGeometry(frameBox, this.winc.listElem, -dh, 0); //полигон векторов сторон створки с учётом нахл.
            let coo = stvShell.getGeometryN(0).getCoordinates();
            for (let i = 0; i < coo.length - 1; i++) {
                let elem = this.frames[i];
                coo[i].z = elem.id;
                elem.setDimension(coo[i].x, coo[i].y, coo[i + 1].x, coo[i + 1].y); //запишем координаты
            }
            coo[coo.length - 1].z = coo[0].z;  //т.к в цикле нет последней точки

            let stvInner = UGeo.bufferGeometry(stvShell, this.frames, 0, 0);
            let stvFalz = UGeo.bufferGeometry(stvShell, this.frames, 0, 1);
            this.area = Com5t.gf.createMultiPolygon([stvShell, stvInner, stvFalz, frameBox]);

            //Высота ручки, линии открывания
            if (this.typeOpen !== TypeOpen1.EMPTY) {
                if (UCom.isFinite(this.gson.param, PKjson.positionKnob) === false) {

                    if (this.sysfurnRec[eSysfurn.hand_pos] === LayoutKnob.MIDL.id) { //по середине
                        this.knobLayout = LayoutKnob.MIDL;
                        this.knobHeight = this.area.getEnvelopeInternal().getHeight() / 2;
                    } else if (this.sysfurnRec[eSysfurn.hand_pos] === LayoutKnob.CONST.id) { //константная
                        this.knobLayout = LayoutKnob.CONST;
                        this.knobHeight = this.area.getEnvelopeInternal().getHeight() / 2;
                    }
                }
debugger;
                //Линии гориз. открывания
                let stvside = TypeOpen1.getKnob(this, this.typeOpen);
                let ind = UGeo.getIndex(this.area, stvside.id);
                let h = UGeo.getSegment(area, ind).midPoint(); //высота ручки по умолчанию
                let s1 = UGeo.getSegment(area, ind - 1);
                let s2 = UGeo.getSegment(area, ind + 1);
                lineOpenHor = Com5t.gf.createLineString(UGeo.arrCoord(s1.p0.x, s1.p0.y, h.x, h.y, s2.p1.x, s2.p1.y, h.x, h.y));

//                //Линии вертик. открывания
//                if (typeOpen === TypeOpen1.LEFTUP || typeOpen === TypeOpen1.RIGHUP) {
//                    ElemSimple stv2 = UCom.layout(this.frames, Layout.TOP);
//                    ind = UGeo.getIndex(this.area, stv2.id);
//                    Coordinate p2 = UGeo.getSegment(area, ind).midPoint();
//                    s1 = UGeo.getSegment(area, ind - 1);
//                    s2 = UGeo.getSegment(area, ind + 1);
//                    lineOpenVer = gf.createLineString(UGeo.arrCoord(p2.x, p2.y, s1.p0.x, s1.p0.y, p2.x, p2.y, s2.p1.x, s2.p1.y));
//                }
//                //Полигон ручки
//                double DX = 10, DY = 60;
//                if (knobLayout === LayoutKnob.VAR && this.knobHeight != 0) {
//                    LineSegment lineSegm = UGeo.getSegment(area, ind);
//                    h = lineSegm.pointAlong((this.knobHeight / lineSegm.getLength())); //высота ручки на створке
//                }
//                Record sysprofRec = eSysprof.find5(winc.nuni, stvside.type.id2, UseSide.ANY, UseSide.ANY); //ТАК ДЕЛАТЬ НЕЛЬЗЯ...
//                Record artiklRec = eArtikl.find(sysprofRec.getInt(eSysprof.artikl_id), false); //артикул
//                double dx = artiklRec.getDbl(eArtikl.height) / 2;
//                if (typeOpen === TypeOpen1.UPPER) {
//                    h.y = (typeOpen === TypeOpen1.LEFT || typeOpen === TypeOpen1.LEFTUP) ? h.y - 2 * dx : h.y + 2 * dx;
//                } else {
//                    h.x = (typeOpen === TypeOpen1.LEFT || typeOpen === TypeOpen1.LEFTUP) ? h.x - dx : h.x + dx;
//                }
//                if (root.type === Type.DOOR) {
//                    this.knobOpen = gf.createPolygon(UGeo.arrCoord(h.x - DX, h.y - DY, h.x + DX, h.y - DY, h.x + DX, h.y + DY, h.x - DX, h.y + DY));
//                } else {
//                    this.knobOpen = gf.createPolygon(UGeo.arrCoord(h.x - DX, h.y - DY, h.x + DX, h.y - DY, h.x + DX, h.y + DY, h.x - DX, h.y + DY));
//                }
//                //Направление открывания
//                if (typeOpen != TypeOpen1.UPPER) {
//                    double anglHoriz = UGeo.anglHor(stvside.x1(), stvside.y1(), stvside.x2(), stvside.y2());
//                    if (!(anglHoriz === 90 || anglHoriz === 270)) {
//                        AffineTransformation aff = new AffineTransformation();
//                        aff.setToRotation(Math.toRadians(anglHoriz), this.knobOpen.getCentroid().getX(), this.knobOpen.getCentroid().getY());
//                        this.knobOpen = (Polygon) aff.transform(this.knobOpen);
//                    }
//                }
            }
        } catch (e) {
            errorLog("Error: AreaStvorka.setLocation() " + e.message);
        }
    }

    paint() {
    }
}
