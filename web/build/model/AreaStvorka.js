
import {AreaSimple} from './AreaSimple.js';
import {TypeOpen1} from '../../enums/TypeOpen1.js';
import {LayoutKnob} from '../../enums/LayoutKnob.js';

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
        this.initConstructiv();
    }

    addStvSide() {
        if (this.frames.size === 0) {
            //owner.area - если нет полигона створки в гл.окне 
            //this.area  - получатется при распиле owner.area импостом
  //          Geometry frameBox = (UCom.filter(winc.listElem, Type.IMPOST).isEmpty()) || (root.type == Type.DOOR) ? owner.area.getGeometryN(0) : this.area.getGeometryN(0);
//
//            //Полигон створки с учётом нахлёста 
//            double dh = winc.syssizRec.getDbl(eSyssize.falz) + winc.syssizRec.getDbl(eSyssize.naxl);
//            Polygon stvShell = buffer(frameBox, winc.listElem, -dh, 0); //полигон векторов сторон створки с учётом нахл. 
//            Coordinate[] coo = stvShell.getGeometryN(0).getCoordinates();
//            for (int i = 0; i < coo.length - 1; i++) {
//
//                //Координаты рам створок
//                GsonElem gson = new GsonElem(Type.STV_SIDE, coo[i].x, coo[i].y);
//                //Впихнул параметры в gson
//                if (isJson(this.gson.param, PKjson.stvorkaSide[i])) {
//                    gson.param = this.gson.param.getAsJsonObject(PKjson.stvorkaSide[i]);
//                }
//                ElemFrame sideStv = new ElemFrame(this.winc, this.id + (.1 + Double.valueOf(i) / 10), gson, this);
//                this.frames.add(sideStv);
//                coo[i].z = sideStv.id;
//            }
//            coo[coo.length - 1].z = coo[0].z;  //т.к в цикле нет последней точки  
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
//        try {
//            //Поиск по параметру или первая запись из списка...
//            //Фурнитура
//            if (isJson(param, PKjson.sysfurnID)) {
//                sysfurnRec = eSysfurn.find2(param.get(PKjson.sysfurnID).getAsInt());
//            } else { //по умолчанию
//                sysfurnRec = eSysfurn.find3(winc.nuni); //ищем первую в системе
//            }
//            //Ручка
//            if (isJson(param, PKjson.artiklKnob)) {
//                knobRec = eArtikl.find(param.get(PKjson.artiklKnob).getAsInt(), false);
//            } else { //по умолчанию
//                knobRec = eArtikl.find(sysfurnRec.getInt(eSysfurn.artikl_id1), false);
//            }
//            //Текстура ручки
//            if (isJson(param, PKjson.colorKnob)) {
//                knobColor = param.get(PKjson.colorKnob).getAsInt();
//            } else if (knobColor == -3) { //по умолчанию (первая в списке)
//                knobColor = eArtdet.find(knobRec.getInt(eArtikl.id)).getInt(eArtdet.color_fk);
//                if (knobColor < 0) { //если все текстуры группы
//                    List<Record> recordList = eColor.filter(knobColor);
//                    if (recordList.isEmpty() == false) {
//                        knobColor = eColor.filter(knobColor).get(0).getInt(eColor.id);
//                    }
//                }
//            }
//            //Подвес (петли)
//            if (isJson(param, PKjson.artiklLoop)) {
//                loopRec = eArtikl.find(param.get(PKjson.artiklLoop).getAsInt(), false);
//            }
//            //Текстура подвеса
//            if (isJson(param, PKjson.colorLoop)) {
//                loopColor = param.get(PKjson.colorLoop).getAsInt();
//            }
//            //Замок
//            if (isJson(param, PKjson.artiklLock)) {
//                lockRec = eArtikl.find(param.get(PKjson.artiklLock).getAsInt(), false);
//            }
//            //Текстура замка
//            if (isJson(param, PKjson.colorLock)) {
//                lockColor = param.get(PKjson.colorLock).getAsInt();
//            }
//            //Сторона открывания
//            if (isJson(param, PKjson.typeOpen)) {
//                typeOpen = TypeOpen1.get(param.get(PKjson.typeOpen).getAsInt());
//            } else {
//                int index = sysfurnRec.getInt(eSysfurn.side_open);
//                typeOpen = (index == TypeOpen2.REQ.id) ? typeOpen : (index == TypeOpen2.LEF.id) ? TypeOpen1.RIGH : TypeOpen1.LEFT;
//            }
//            //Положение ручки на створке, ручка задана параметром
//            if (isJson(param, PKjson.positionKnob)) {
//                int position = param.get(PKjson.positionKnob).getAsInt();
//                if (position == LayoutKnob.VAR.id) { //вариационная
//                    knobLayout = LayoutKnob.VAR;
//                    if (isJson(param, PKjson.heightKnob)) {
//                        knobHeight = param.get(PKjson.heightKnob).getAsInt();
//                        if (isJson(param, PKjson.heightKnob)) {
//                            knobHeight = param.get(PKjson.heightKnob).getAsInt();
//                        }
//                    }
//                } else { //по середине или константная
//                    knobLayout = (position == LayoutKnob.MIDL.id) ? LayoutKnob.MIDL : LayoutKnob.CONST;
//                    //knobHeight = owner.area.getEnvelopeInternal().getHeight() / 2;
//                }
//            }
//        } catch (Exception e) {
//            System.err.println("Ошибка:AreaStvorka.initArtikle() " + e);
//        }
    }

    //Создание и коррекция сторон створки
    setLocation() {
//        Geometry frameBox = (UCom.filter(winc.listElem, Type.IMPOST).isEmpty())
//                || (root.type == Type.DOOR) ? owner.area.getGeometryN(0) : this.area.getGeometryN(0);
//        try {
//            //Полигон створки с учётом нахлёста 
//            double dh = winc.syssizRec.getDbl(eSyssize.falz) + winc.syssizRec.getDbl(eSyssize.naxl);
//            Polygon stvShell = buffer(frameBox, winc.listElem, -dh, 0); //полигон векторов сторон створки с учётом нахл.
//            Coordinate[] coo = stvShell.getGeometryN(0).getCoordinates();
//            for (int i = 0; i < coo.length - 1; i++) {
//                ElemSimple elem = this.frames.get(i);
//                coo[i].z = elem.id;
//                elem.setDimension(coo[i].x, coo[i].y, coo[i + 1].x, coo[i + 1].y); //запишем координаты
//            }
//            coo[coo.length - 1].z = coo[0].z;  //т.к в цикле нет последней точки
//
//            Polygon stvInner = buffer(stvShell, this.frames, 0, 0);
//            Polygon stvFalz = buffer(stvShell, this.frames, 0, 1);
//            this.area = gf.createMultiPolygon(new Polygon[]{stvShell, stvInner, stvFalz, (Polygon) frameBox});
//
//            //Высота ручки, линии открывания
//            if (this.typeOpen != TypeOpen1.EMPTY) {
//                if (isJson(gson.param, PKjson.positionKnob) == false) {
//
//                    if (sysfurnRec.getInt(eSysfurn.hand_pos) == LayoutKnob.MIDL.id) { //по середине
//                        knobLayout = LayoutKnob.MIDL;
//                        knobHeight = this.area.getEnvelopeInternal().getHeight() / 2;
//                    } else if (sysfurnRec.getInt(eSysfurn.hand_pos) == LayoutKnob.CONST.id) { //константная
//                        knobLayout = LayoutKnob.CONST;
//                        knobHeight = this.area.getEnvelopeInternal().getHeight() / 2;
//                    }
//                }
//
//                //Линии гориз. открывания
//                ElemSimple stvside = TypeOpen1.getKnob(this, this.typeOpen);
//                int ind = UGeo.getIndex(this.area, stvside.id);
//                Coordinate h = UGeo.getSegment(area, ind).midPoint(); //высота ручки по умолчанию
//                LineSegment s1 = UGeo.getSegment(area, ind - 1);
//                LineSegment s2 = UGeo.getSegment(area, ind + 1);
//                lineOpenHor = gf.createLineString(UGeo.arrCoord(s1.p0.x, s1.p0.y, h.x, h.y, s2.p1.x, s2.p1.y, h.x, h.y));
//
//                //Линии вертик. открывания
//                if (typeOpen == TypeOpen1.LEFTUP || typeOpen == TypeOpen1.RIGHUP) {
//                    ElemSimple stv2 = UCom.layout(this.frames, Layout.TOP);
//                    ind = UGeo.getIndex(this.area, stv2.id);
//                    Coordinate p2 = UGeo.getSegment(area, ind).midPoint();
//                    s1 = UGeo.getSegment(area, ind - 1);
//                    s2 = UGeo.getSegment(area, ind + 1);
//                    lineOpenVer = gf.createLineString(UGeo.arrCoord(p2.x, p2.y, s1.p0.x, s1.p0.y, p2.x, p2.y, s2.p1.x, s2.p1.y));
//                }
//                //Полигон ручки
//                double DX = 10, DY = 60;
//                if (knobLayout == LayoutKnob.VAR && this.knobHeight != 0) {
//                    LineSegment lineSegm = UGeo.getSegment(area, ind);
//                    h = lineSegm.pointAlong((this.knobHeight / lineSegm.getLength())); //высота ручки на створке
//                }
//                Record sysprofRec = eSysprof.find5(winc.nuni, stvside.type.id2, UseSideTo.ANY, UseSideTo.ANY); //ТАК ДЕЛАТЬ НЕЛЬЗЯ...
//                Record artiklRec = eArtikl.find(sysprofRec.getInt(eSysprof.artikl_id), false); //артикул
//                double dx = artiklRec.getDbl(eArtikl.height) / 2;
//                if (typeOpen == TypeOpen1.UPPER) {
//                    h.y = (typeOpen == TypeOpen1.LEFT || typeOpen == TypeOpen1.LEFTUP) ? h.y - 2 * dx : h.y + 2 * dx;
//                } else {
//                    h.x = (typeOpen == TypeOpen1.LEFT || typeOpen == TypeOpen1.LEFTUP) ? h.x - dx : h.x + dx;
//                }
//                if (root.type == Type.DOOR) {
//                    this.knobOpen = gf.createPolygon(UGeo.arrCoord(h.x - DX, h.y - DY, h.x + DX, h.y - DY, h.x + DX, h.y + DY, h.x - DX, h.y + DY));
//                } else {
//                    this.knobOpen = gf.createPolygon(UGeo.arrCoord(h.x - DX, h.y - DY, h.x + DX, h.y - DY, h.x + DX, h.y + DY, h.x - DX, h.y + DY));
//                }
//                //Направление открывания
//                if (typeOpen != TypeOpen1.UPPER) {
//                    double anglHoriz = UGeo.anglHor(stvside.x1(), stvside.y1(), stvside.x2(), stvside.y2());
//                    if (!(anglHoriz == 90 || anglHoriz == 270)) {
//                        AffineTransformation aff = new AffineTransformation();
//                        aff.setToRotation(Math.toRadians(anglHoriz), this.knobOpen.getCentroid().getX(), this.knobOpen.getCentroid().getY());
//                        this.knobOpen = (Polygon) aff.transform(this.knobOpen);
//                    }
//                }
//            }
//        } catch (Exception e) {
//            System.err.println("Ошибка:AreaStvorka.setLocation " + e);
//        }
    }
    
    paint() {
    }
}
