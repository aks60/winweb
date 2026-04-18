
import {UGeo} from './uGeo.js';
import {UJson} from '../../common/uJson.js';
import {Com5t, ElemFrame, AreaSimple} from './model.js'
import {Type, TypeOpen1, TypeOpen2, PKjson,
        LayoutHand, Layout, UseSide} from '../../enums/enums.js';
import MultiPolygon from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/MultiPolygon.js';
import GeometryFactory from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/GeometryFactory.js';
import Polygon from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/Polygon.js';
import LineString from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineString.js';
import AffineTransformation from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/util/AffineTransformation.js';
import Centroid from '../../lib-js/jsts-2.11.2/org/locationtech/jts/algorithm/Centroid.js';

//import WKTReader from '../../lib-js/jsts-2.11.2/org/locationtech/jts/io/WKTReader.js'

export class AreaStvorka extends AreaSimple {

    spcRec = null; //спецификация москитки
    sysfurnRec = eSysfurn.vrec; //фурнитура
    handRec = [eArtikl.vrec, eArtikl.vrec]; //ручка 0-вручную. 1-авторасчёт
    loopRec = [eArtikl.vrec, eArtikl.vrec]; //подвес(петли) 0-вручную. 1-авторасчёт
    lockRec = [eArtikl.vrec, eArtikl.vrec]; //замок 0-вручную. 1-авторасчёт
    mosqRec = eArtikl.vrec; //москитка
    elementRec = eElement.vrec; //состав москидки 

    lineOpenHor = null; //линии горизонт. открывания
    lineOpenVer = null; //линии вертик. открывания
    handOpen = null; //ручка открывания    
    handColor = [-3, -3]; //цвет ручки 0-вручную. 1-авторасчёт
    loopColor = [-3, -3]; //цвет подвеса 0-вручную. 1-авторасчёт
    lockColor = [-3, -3]; //цвет замка 0-вручную. 1-авторасчёт
    mosqColor = -3; //цвет москитки вирт.
    areaHand = null;
    imageHand = new GeometryFactory().createMultiPolygon([
        Polygon.new([[-20, -20], [-20, 20], [-10, 20], [-10, -10], [10, -10], [10, 20], [20, 20], [20, -20]]),
        Polygon.new([[-10, -10], [-10, 120], [10, 120], [10, -10]])]); //ручка шаблон 
    handHeight = 0; //высота ручки
    typeOpen = TypeOpen1.EMPTY; //направление открывания
    handLayout = LayoutHand.MIDL; //положение ручки на створке      
    offset = [0, 0, 0, 0];

    constructor(winc, gson, owner) {
        super(winc, gson, owner);
        this.initArtikle();
    }

    initStvorka() {
        try {
            //Если нет полигона створки в гл.окне то 'owner.area', иначе 'this.area', получается при распиле owner.area импостом	
            let frameBox = (this.winc.listElem.filter(elem => (elem.type === Type.IMPOST)).length === 0
                    || this.root.type === Type.DOOR) ? this.owner.area.getGeometryN(0) : this.area.getGeometryN(0);

            //Полигон створки с учётом нахлёста 
            let dh = this.winc.syssizRec[eSyssize.falz] + this.winc.syssizRec[eSyssize.naxl];
            let stvShell = UGeo.bufferGeometry(frameBox, this.winc.listElem, -dh, 0); //полигон векторов сторон створки с учётом нахл. 
            let coo = stvShell.getGeometryN(0).getCoordinates();

            for (let i = 0; i < coo.length - 1; i++) {

                //Координаты рам створок
                let ID = this.gson.id + (0.1 + i / 10);
                let sideStv = this.frames.find(el => el.id === ID);

                if (sideStv !== undefined) {
                    sideStv.gson.param = UJson.getJsonParam(this.gson.param, PKjson.stvorkaSide[i]); //обновил параметры в gson 
                    sideStv.x1 = coo[i].x;
                    sideStv.y1 = coo[i].y;
                    coo[i].z = sideStv.id;
                } else {
                    let gson = {id: ID, type: Type.STV_SIDE, x1: coo[i].x, y1: coo[i].y};
                    gson.param = UJson.getJsonParam(this.gson.param, PKjson.stvorkaSide[i]); //впихнул параметры в gson  
                    let sideStv = new ElemFrame(this.winc, gson, this);
                    sideStv.type = Type.STV_SIDE;
                    this.frames.push(sideStv);
                    coo[i].z = sideStv.id;
                }
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    /**
     * Фурнитура выбирается вручную из списка системы либо первая в списке системы.
     * Ручка по умолчанию из сист. фурнитуры либо если есть подбирается из
     * детализации выбр. фурн. либо выбирается вручную из ручек фыбранной
     * фурнитуры. Цвет первая запись из текстуры артикулов или подбор из текстур
     * или вручную.
     */
    initArtikle() {
        try {
            this.handRec = [eArtikl.vrec, eArtikl.vrec];
            this.loopRec = [eArtikl.vrec, eArtikl.vrec];
            this.lockRec = [eArtikl.vrec, eArtikl.vrec];
            this.typeOpen = TypeOpen1.EMPTY;
            this.lineOpenHor = null;
            this.lineOpenVer = null;
            this.handColor = [-3, -3];
            this.loopColor = [-3, -3];
            this.lockColor = [-3, -3];

            super.initArtikle();

            //Поиск по параметру или первая запись из списка...
            //Фурнитура
            if (UJson.isFinite(this.gson.param, PKjson.sysfurnID)) {
                this.sysfurnRec = eSysfurn.find2(this.gson.param[PKjson.sysfurnID]);
            } else { //по умолчанию
                this.sysfurnRec = eSysfurn.find3(this.winc.nuni); //ищем первую в системе
            }
            //Сторона открывания
            if (UJson.isFinite(this.gson.param, PKjson.typeOpen)) {
                this.typeOpen = TypeOpen1.typeOpen(this.gson.param[PKjson.typeOpen]);
            } else {
                let index = this.sysfurnRec[eSysfurn.side_open];
                this.typeOpen = (index === TypeOpen2.REQ[0]) ? this.typeOpen
                        : (index === TypeOpen2.LEF[0]) ? TypeOpen1.LEFT : TypeOpen1.RIGH;
            }
            //Ручка
            if (UJson.isFinite(this.gson.param, PKjson.artiklHand)) {
                this.handRec[0] = eArtikl.find(this.gson.param[PKjson.artiklHand], false);
            } else { //по умолчанию
                this.handRec[0] = eArtikl.find(this.sysfurnRec[eSysfurn.artikl_id1], false);
            }
            //Текстура ручки
            if (UJson.isFinite(this.gson.param, PKjson.colorHand)) {
                this.handColor[0] = this.gson.param[PKjson.colorHand];
            } else if (this.handColor[0] === -3) { //по умолчанию (первая в списке)
                this.handColor[0] = eArtdet.find(this.handRec[0][eArtikl.id])[eArtdet.color_fk];
                if (this.handColor[0] < 0) { //если все текстуры группы
                    let recordList = eColor.list.filter(rec => rec[eColor.groups_id] === this.handColor[0]);
                    this.handColor[0] = recordList[0][eColor.id]; //первая в списке
                }
            }
            //Подвес (петли)
            if (UJson.isFinite(this.gson.param, PKjson.artiklLoop)) {
                this.loopRec[0] = eArtikl.find(this.gson.param[PKjson.artiklLoop], false);
            } else { //по умолчанию
                this.loopRec[0] = eArtikl.find(this.sysfurnRec[eSysfurn.artikl_id2], false);
            }
            //Текстура подвеса
            if (UJson.isFinite(this.gson.param, PKjson.colorLoop)) {
                this.loopColor[0] = this.gson.param[PKjson.colorLoop];
            } else if (this.handColor[0] === -3) { //по умолчанию (первая в списке)
                this.loopColor[0] = eArtdet.find(this.loopRec[0][eArtikl.id])[eArtdet.color_fk];
                if (this.handColor[0] < 0) { //если все текстуры группы
                    let recordList = eColor.list.filter(rec => rec[eColor.groups_id] === this.handColor[0]);
                    this.loopColor[0] = recordList[0][eColor.id]; //первая в списке
                }
            }
            //Замок
            if (UJson.isFinite(this.gson.param, PKjson.artiklLock)) {
                this.lockRec[0] = eArtikl.find(this.gson.param[PKjson.artiklLock], false);
            }
            //Текстура замка
            if (UJson.isFinite(this.gson.param, PKjson.colorLock)) {
                this.lockColor[0] = this.gson.param[PKjson.colorLock];
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    //Создание и коррекция сторон створки
    setLocation() {
        let frameBox = (this.winc.listElem.filter(el => el.type === Type.IMPOST).length === 0)
                || (this.root.type === Type.DOOR) ? this.owner.area.getGeometryN(0) : this.area.getGeometryN(0);
        try {
            //Полигон створки с учётом нахлёста 
            let dh = this.winc.syssizRec[eSyssize.falz] + this.winc.syssizRec[eSyssize.naxl];
            let stvShell = UGeo.bufferGeometry(frameBox, this.winc.listElem, -dh, 0); //полигон векторов сторон створки с учётом нахл.
            let coo = stvShell.getGeometryN(0).getCoordinates();
            for (let i = 0; i < coo.length - 1; i++) {
                let elem = this.frames[i];
                coo[i].z = elem.id;
                elem.gson.x1 = coo[i].x;
                elem.gson.y1 = coo[i].y;
                elem.gson.x2 = coo[i + 1].x;
                elem.gson.y2 = coo[i + 1].y;
            }
            coo[coo.length - 1].z = coo[0].z;  //т.к в цикле нет последней точки

            let stvInner = UGeo.bufferGeometry(stvShell, this.frames, 0, 0);
            let stvFalz = UGeo.bufferGeometry(stvShell, this.frames, 0, 1);
            this.area = Com5t.gf.createMultiPolygon([stvShell, stvInner, stvFalz, frameBox]);

            //Высота ручки
            if (this.typeOpen !== TypeOpen1.EMPTY) {

                let stvside = TypeOpen1.getHand(this, this.typeOpen);
                let indexSideOpen = UGeo.getIndex(this.area, stvside.id);
                let segment = UGeo.getSegment(this.area, indexSideOpen);
                let segmentHand = UGeo.offsetSegm(segment, -1 * this.artiklRec[eArtikl.height] / 2); //линия сегмента ручки
                this.handHeight = segmentHand.getLength() / 2;

                //Ручка задана параметром
                if (UJson.isFinite(this.gson.param, PKjson.positionHand)) {
                    let position = this.gson.param[PKjson.positionHand];
                    if (position === LayoutHand.VAR[0]) {  //установлена на высоте (вариационная)
                        this.handLayout = LayoutHand.VAR;
                        if (UJson.isFinite(this.gson.param, PKjson.heightHand)) {
                            this.handHeight = this.gson.param[PKjson.heightHand];
                            if (UJson.isFinite(this.gson.param, PKjson.heightHand)) {
                                this.handHeight = this.gson.param[PKjson.heightHand];
                            }
                        }
                    } else { //по середине или константная (конст.-настраивается в коструктиве)
                        this.handLayout = (position === LayoutHand.MIDL[0]) ? LayoutHand.MIDL : LayoutHand.CONST;
                    }
                }

                //Полигон ручки
                let cooHand = segmentHand.pointAlong(1 - (this.handHeight) / segmentHand.getLength()); //положение ручки на створке
                let aff = AffineTransformation.translationInstance(cooHand.x, cooHand.y);
                let imageHand2 = aff.transform(this.imageHand);
                let angle = segmentHand.angle();
                let angHand = (angle > 0) ? angle - Math.PI / 2 : angle + Math.PI / 2;
                aff.setToRotation(angHand, cooHand.x, cooHand.y);
                this.areaHand = aff.transform(imageHand2);

                //Линии гориз. открывания
                let h = UGeo.getSegment(this.area, indexSideOpen).midPoint(); //высота ручки по умолчанию
                let s1 = UGeo.getSegment(this.area, indexSideOpen - 1);
                let s2 = UGeo.getSegment(this.area, indexSideOpen + 1);
                this.lineOpenHor = LineString.new([[s1.p0.x, s1.p0.y], [h.x, h.y], [s2.p1.x, s2.p1.y], [h.x, h.y]]);

                //Линии вертик. открывания
                if (this.typeOpen === TypeOpen1.LEFTUP || this.typeOpen === TypeOpen1.RIGHUP) {
                    stvside = this.frames.find(el => el.layout === Layout.TOP);
                    indexSideOpen = UGeo.getIndex(this.area, stvside.id);
                    let p2 = UGeo.getSegment(this.area, indexSideOpen).midPoint();
                    s1 = UGeo.getSegment(this.area, indexSideOpen - 1);
                    s2 = UGeo.getSegment(this.area, indexSideOpen + 1);
                    this.lineOpenVer = LineString.new([[p2.x, p2.y], [s1.p0.x, s1.p0.y], [p2.x, p2.y], [s2.p1.x, s2.p1.y]]);
                }
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    paint() {
        if (this.winc.sceleton === false) {
            this.winc.ctx.lineWidth = 4;
            this.winc.ctx.strokeStyle = '#000000';

            if (this.lineOpenHor !== null) { //линии горизонт. открывания
                this.winc.paint(this.lineOpenHor);
            }
            if (this.lineOpenVer !== null) { //линии вертик. открывания
                this.winc.paint(this.lineOpenVer);
            }
            let colorHandl = (this.handColor[1] === -3) ? this.handColor[0] : this.handColor[1];
            let colorRec = eColor.find(colorHandl);
            let rgb = colorRec[eColor.rgb].toString(16);
            this.winc.ctx.fillStyle = '#' + rgb;
            this.winc.paint(this.areaHand.getGeometryN(0));
            this.winc.paint(this.areaHand.getGeometryN(1));
        } else {
            console.error('Error: AreaStvorka.paint()');
        }
    }
}
