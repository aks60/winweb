
import {UGeo} from './uGeo.js';
import {UCom} from '../../common/uCom.js';
import {Com5t, ElemFrame, AreaSimple} from './model.js'
import {Type, TypeOpen1, TypeOpen2, PKjson,
        LayoutHand, Layout, UseSide} from '../../enums/enums.js';
import Polygon from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Polygon.js';
import LineString from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineString.js';
import AffineTransformation from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/util/AffineTransformation.js';
import Centroid from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/Centroid.js';

export class AreaStvorka extends AreaSimple {

    spcRec = null; //спецификация москитки
    sysfurnRec = eSysfurn.vrec; //фурнитура
    handRec = eArtikl.vrec; //ручка
    loopRec = eArtikl.vrec; //подвес(петли)
    lockRec = eArtikl.vrec; //замок
    mosqRec = eArtikl.vrec; //москитка
    elementRec = eElement.vrec; //состав москидки 

    lineOpenHor = null; //линии горизонт. открывания
    lineOpenVer = null; //линии вертик. открывания
    handOpen = null; //ручка открывания    
    handColor = -3; //цвет ручки вирт...
    loopColor = -3; //цвет подвеса вирт...
    lockColor = -3; //цвет замка вирт...
    mosqColor = -3; //цвет москитки вирт...

    handHeight = 0; //высота ручки
    typeOpen = TypeOpen1.EMPTY; //направление открывания
    handLayout = LayoutHand.MIDL; //положение ручки на створке      
    offset = [0, 0, 0, 0];

    constructor(winc, gson, owner) {
        super(winc, gson, owner);
        this.initArtikle(gson.param);
    }

    initStvorka() {
        try {
            if (this.frames.length === 0) {
                //owner.area - если нет полигона створки в гл.окне, this.area  - получается при распиле owner.area импостом
                let frameBox = (this.winc.listElem.filter(elem => (elem.type === Type.IMPOST)).length === 0
                        || this.root.type === Type.DOOR) ? this.owner.area.getGeometryN(0) : this.area.getGeometryN(0);

                //Полигон створки с учётом нахлёста 
                let dh = this.winc.syssizRec[eSyssize.falz] + this.winc.syssizRec[eSyssize.naxl];
                let stvShell = UGeo.bufferGeometry(frameBox, this.winc.listElem, -dh, 0); //полигон векторов сторон створки с учётом нахл. 
                let coo = stvShell.getGeometryN(0).getCoordinates();
                for (let i = 0; i < coo.length - 1; i++) {

                    //Json координаты рам створок
                    let ID = this.gson.id + (0.1 + i / 10);
                    let gson = {id: ID, type: Type.STV_SIDE, x1: coo[i].x, y1: coo[i].y};
                    gson.param = UCom.getJson(this.gson.param, PKjson.stvorkaSide[i]); //впихнул параметры в gson

                    let sideStv = new ElemFrame(this.winc, gson, this);
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
     * Фурнитура выбирается вручную из списка системы либо первая в списке системы.
     * Ручка по умолчанию из сист. фурнитуры либо если есть подбирается из
     * детализации выбр. фурн. либо выбирается вручную из ручек фыбранной
     * фурнитуры. Цвет первая запись из текстуры артикулов или подбор из текстур
     * или вручную.
     */
    initArtikle(param) {
        try {
            //Поиск по параметру или первая запись из списка...
            //Фурнитура
            if (UCom.isFinite(param, PKjson.sysfurnID)) {
                this.sysfurnRec = eSysfurn.find2(param[PKjson.sysfurnID]);
            } else { //по умолчанию
                this.sysfurnRec = eSysfurn.find3(this.winc.nuni); //ищем первую в системе
            }
            //Ручка
            if (UCom.isFinite(param, PKjson.artiklHand)) {
                this.handRec = eArtikl.find(param[PKjson.artiklHand], false);
            } else { //по умолчанию
                this.handRec = eArtikl.find(this.sysfurnRec[eSysfurn.artikl_id1], false);
            }
            //Текстура ручки
            if (UCom.isFinite(param, PKjson.colorHand)) {
                this.handColor = param[PKjson.colorHand];
            } else if (this.handColor === -3) { //по умолчанию (первая в списке)
                this.handColor = eArtdet.find(this.handRec[eArtikl.id])[eArtdet.color_fk];
                if (this.handColor < 0) { //если все текстуры группы
                    let recordList = eColor.list.filter(rec => rec[eColor.groups_id] === this.handColor);
                    if (recordList.length === 0) {
                        this.handColor = eColor.list.find(this.handColor)[0][eColor.id];
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
                this.lockColor = param[PKjson.colorLock];
            }
            //Сторона открывания
            if (UCom.isFinite(param, PKjson.typeOpen)) {
                this.typeOpen = TypeOpen1.typeOpen(param[PKjson.typeOpen]);
            } else {
                let index = this.sysfurnRec[eSysfurn.side_open];
                this.typeOpen = (index === TypeOpen2.REQ[0]) ? this.typeOpen
                        : (index === TypeOpen2.LEF[0]) ? TypeOpen1.RIGH : TypeOpen1.LEFT;
            }
            //Положение ручки на створке, ручка задана параметром
            if (UCom.isFinite(param, PKjson.positionHand)) {
                let position = param[PKjson.positionHand];
                if (position === LayoutHand.VAR[0]) { //вариационная
                    this.handLayout = LayoutHand.VAR;
                    if (UCom.isFinite(param, PKjson.heightHand)) {
                        this.handHeight = param[PKjson.heightHand];
                        if (UCom.isFinite(param, PKjson.heightHand)) {
                            this.handHeight = param[PKjson.heightHand];
                        }
                    }
                } else { //по середине или константная
                    this.handLayout = (position === LayoutHand.MIDL[0]) ? LayoutHand.MIDL : LayoutHand.CONST;
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
                    || (this.root.type === Type.DOOR) ? this.owner.area.getGeometryN(0) : this.area.getGeometryN(0);
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
                if (UCom.isFinite(this.gson.param, PKjson.positionHand) === false) {

                    if (this.sysfurnRec[eSysfurn.hand_pos] === LayoutHand.MIDL.id) { //по середине
                        this.handLayout = LayoutHand.MIDL;
                        this.handHeight = this.area.getEnvelopeInternal().getHeight() / 2;
                    } else if (this.sysfurnRec[eSysfurn.hand_pos] === LayoutHand.CONST.id) { //константная
                        this.handLayout = LayoutHand.CONST;
                        this.handHeight = this.area.getEnvelopeInternal().getHeight() / 2;
                    }
                }

                //Линии гориз. открывания
                let stvside = TypeOpen1.getHand(this, this.typeOpen);
                let ind = UGeo.getIndex(this.area, stvside.id);
                let h = UGeo.getSegment(this.area, ind).midPoint(); //высота ручки по умолчанию
                let s1 = UGeo.getSegment(this.area, ind - 1);
                let s2 = UGeo.getSegment(this.area, ind + 1);
                this.lineOpenHor = LineString.new([[s1.p0.x, s1.p0.y], [h.x, h.y], [s2.p1.x, s2.p1.y], [h.x, h.y]]);

                //Линии вертик. открывания
                if (this.typeOpen === TypeOpen1.LEFTUP || this.typeOpen === TypeOpen1.RIGHUP) {
                    stvside = this.frames.find(el => el.layout === Layout.TOP);
                    ind = UGeo.getIndex(this.area, stvside.id);
                    let p2 = UGeo.getSegment(this.area, ind).midPoint();
                    s1 = UGeo.getSegment(this.area, ind - 1);
                    s2 = UGeo.getSegment(this.area, ind + 1);
                    this.lineOpenVer = LineString.new([[p2.x, p2.y], [s1.p0.x, s1.p0.y], [p2.x, p2.y], [s2.p1.x, s2.p1.y]]);
                }
                //Полигон ручки
                let DX = 10, DY = 60;
                if (this.handLayout === LayoutHand.VAR && this.handHeight !== 0) {
                    let lineSegm = UGeo.getSegment(this.area, ind);
                    h = lineSegm.pointAlong(this.handHeight / lineSegm.getLength()); //высота ручки на створке
                }
                let sysprofRec = eSysprof.find5(this.winc.nuni, stvside.type[1], UseSide.ANY[1], UseSide.ANY[1]); //ТАК ДЕЛАТЬ НЕЛЬЗЯ...
                let artiklRec = eArtikl.find(sysprofRec[eSysprof.artikl_id], false); //артикул
                let dx = artiklRec[eArtikl.height] / 2;
                if (this.typeOpen === TypeOpen1.UPPER) {
                    h.y = (this.typeOpen === TypeOpen1.LEFT || this.typeOpen === TypeOpen1.LEFTUP) ? h.y - 2 * dx : h.y + 2 * dx;
                } else {
                    h.x = (this.typeOpen === TypeOpen1.LEFT || this.typeOpen === TypeOpen1.LEFTUP) ? h.x - dx : h.x + dx;
                }
                if (this.root.type === Type.DOOR) {
                    this.handOpen = Polygon.new([[h.x - DX, h.y - DY], [h.x + DX, h.y - DY], [h.x + DX, h.y + DY], [h.x - DX, h.y + DY]]);
                } else {
                    this.handOpen = Polygon.new([[h.x - DX, h.y - DY], [h.x + DX, h.y - DY], [h.x + DX, h.y + DY], [h.x - DX, h.y + DY]]);
                }
                //Направление открывания
                if (this.typeOpen !== TypeOpen1.UPPER) {
                    let anglHoriz = UGeo.anglHor(stvside.x1, stvside.y1, stvside.x2, stvside.y2);
                    if (!(anglHoriz === 90 || anglHoriz === 270)) {
                        let aff = new AffineTransformation();
                        aff.setToRotation(UGeo.degToRad(anglHoriz),
                                Centroid.getCentroid(this.handOpen).getX(),
                                Centroid.getCentroid(this.handOpen).getY());
                        this.handOpen = aff.transform(this.handOpen);
                    }
                }
            }
        } catch (e) {
            errorLog("Error: AreaStvorka.setLocation() " + e.message);
        }
    }

    paint() {
        if (this.winc.sceleton === false) {
            this.winc.ctx.lineWidth = 4;

            if (this.handOpen !== null) {
                this.winc.ctx.strokeStyle = '#000000';

                if (this.lineOpenHor !== null) { //линии горизонт. открывания
                    this.winc.paint(this.lineOpenHor);
                }
                if (this.lineOpenVer !== null) { //линии вертик. открывания
                    this.winc.paint(this.lineOpenVer);
                }
                this.colorRec = eColor.find(this.handColor);
                let rgb = this.colorRec[eColor.rgb].toString(16);
                this.winc.ctx.fillStyle = '#' + rgb;
                this.winc.paint(this.handOpen);
            }
        } else {
            errorLog('Error: AreaStvorka.paint() ' + e.message);
        }
    }
}
