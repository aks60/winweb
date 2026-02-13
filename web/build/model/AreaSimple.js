
import {AreaArch, Com5t} from './model.js';
import {UCom} from '../../common/uCom.js';
import {UGeo} from './uGeo.js';
import {PKjson} from '/winweb/enums/PKjson.js';
import {Type} from '../../enums/enums.js';
import LineString from '../../lib-js/jsts-2.11.2/org/locationtech/jts/geom/LineString.js';

export class AreaSimple extends Com5t {

    frames = new Array(); //список рам 
    childs = new Array(); //дети

    constructor(winc, gson, owner) {
        try {
            super(winc, gson, owner);
            this.initConstructiv(gson.param);
            this.winc.listArea.push(this);
            this.winc.listAll.push(this);
        } catch (e) {
            errorLog('Error: AreaSimple.constructor() ' + e.message);
        }
    }
    /**
     * Профиль через параметр. PKjson_sysprofID пример створки:sysprofID:1121,
     * typeOpen:4, sysfurnID:2916} Этого параметра нет в интерфейсе программы,
     * он сделан для тестирования с ps4. Делегируется детьми см. класс ElemFrame
     */
    initConstructiv(param) {
        try {
            if (param !== undefined && param[PKjson.sysprofID] !== undefined) {//профили через параметр
                this.sysprofRec = eSysprof.find3(param[PKjson.sysprofID]);
            }//else if(this.owner.id === 0) {
            //    sysprofRec = eSysprof.list.find4(this.winc.nuni, UseType.FRAME.id, UseSide.ANY);
            //}
        } catch (e) {
            errorLog('Error: AreaSimple.initConstructiv() ' + e.message);
        }
    }

    setLocation() {
        try {
            let geoShell = this.area.getGeometryN(0);
            let geoInner = UGeo.bufferGeometry(geoShell, this.winc.listElem, 0, 0);
            let geoFalz = UGeo.bufferGeometry(geoShell, this.winc.listElem, 0, 1);
            this.area = Com5t.gf.createMultiPolygon([geoShell, geoInner, geoFalz]);

        } catch (e) {
            errorLog('Error: AreaSimple.setLocation() ' + e.message);
        }
    }

    //Прорисовка размерных линий и точек движения сегментов
    paint() {
        try {
            this.winc.ctx.save();
            if (this.winc.sceleton === false) {
                if (this.type !== Type.STVORKA) {

                    //Точки движения
                    for (let el of this.frames) {
                        if (el.passMask[1] > 0) {
                            
                            let SIZE = 20;
                            this.winc.ctx.strokeStyle = '#f00';
                            this.winc.ctx.fillStyle = '#f00';
                            this.winc.ctx.beginPath();

                            //Хвост вектора, точка круг
                            if (el.passMask[0] === 0) {
                                this.winc.ctx.arc(el.x1 - SIZE / 2, el.y1 - SIZE / 2, SIZE, 0, 2 * Math.PI);
                                this.winc.ctx.fill();

                                //Начало вектора. точка круг
                            } else if (el.passMask[0] === 1) {
                                this.winc.ctx.arc(el.x2 - SIZE / 2, el.y2 - SIZE / 2, SIZE, 0, 2 * Math.PI);
                                this.winc.ctx.fill();

                                //Середина вектора. точка квадрат
                            } else if (el.passMask[0] === 2) {
                                if (el.h !== undefined) { //арка
                                    let list = el.owner.area.getGeometryN(0).getCoordinates().filter(c => c.z == el.id);
                                    let i = list.length / 2; //index середины дуги
                                    let c1 = list[i], c2 = list[i + 1];
                                    let smid = LineSegment.new([c1.x, c1.y], [c2.x, c2.y]).midPoint();
                                    this.winc.ctx.fillRect(smid.x - SIZE / 2, smid.y - SIZE / 2, SIZE, SIZE);

                                } else {
                                    let smid = new LineSegment(el.x1, el.y1, el.x2, el.y2).midPoint();
                                    this.winc.ctx.fillRect(smid.x - SIZE / 2, smid.y - SIZE / 2, SIZE, SIZE);
                                }
                            }
                            this.winc.ctx.closePath();
                        }
                    }
                    
                    //Размерные линии
                    this.winc.ctx.strokeStyle = '#000000';
                    let frameEnvelope = this.winc.root.area.getGeometryN(0).getEnvelopeInternal();
                    let hsHor = new Set(), hsVer = new Set();
                    if (this.type !== Type.DOOR) {

                        for (let area5e of this.winc.listArea) {
                            let frameBox = (area5e.type === Type.STVORKA) ? area5e.area.getGeometryN(3) : area5e.area.getGeometryN(0);
                            let coo = frameBox.getCoordinates();

                            if (this instanceof AreaArch) {
                                let geo1 = this.area.getGeometryN(0);
                                let env = geo1.getEnvelopeInternal();
                                hsVer.add(env.getMinY());
                            }
                            for (let i = 1; i < coo.length; i++) {
                                let c1 = coo[i - 1], c2 = coo[i];

                                if (c2.z !== c1.z && Math.abs(c2.x - c1.x) > 0.09) {
                                    hsHor.add(c2.x);
                                }
                                if (c2.z !== c1.z && Math.abs(c2.y - c1.y) > 0.09) {
                                    hsVer.add(c2.y);
                                }
                            }

                        }
                    } else {
                        let geoShell = this.area.getGeometryN(0);
                        let cooShell = geoShell.getCoordinates();
                        for (let i = 1; i < cooShell.length; i++) {
                            let c1 = cooShell[i - 1], c2 = cooShell[i];

                            if (c2.z !== c1.z && Math.abs(c2.x - c1.x) > 0.09) {
                                hsHor.add(c2.x);
                            }
                            if (c2.z !== c1.z && Math.abs(c2.y - c1.y) > 0.09) {
                                hsVer.add(c2.y);
                            }
                        }
                        for (let elem5e of winc.listElem.filter(el => el.type === Type.IMPOST)) {
                            hsVer.add(elem5e.y1());
                        }
                    }
                    let listHor = [...hsHor];
                    let listVer = [...hsVer];
                    listHor.sort((a, b) => a - b);
                    listVer.sort((a, b) => a - b);

                    const sizeFont = UCom.scaleFont(this.winc.scale);
                    this.winc.ctx.font = `bold ${sizeFont}px sans-serif`; //размер шрифта
                    //let orig = this.winc.ctx.getTransform();
                    let metricTxt = this.winc.ctx.measureText("999.99");
                    const heightTxt = metricTxt.actualBoundingBoxAscent + metricTxt.actualBoundingBoxDescent;

                    //По горизонтали
                    for (let i = 1; i < listHor.length; ++i) {
                        let dx = listHor[i] - listHor[i - 1];
                        if (Math.abs(dx) > 0.04) {

                            const txt = dx.toFixed(1); //текст разм.линии
                            let metricNumb = this.winc.ctx.measureText(txt); //логические границы строки
                            let tail = [listHor[i - 1], listHor[i]]; //x1, x2 хвост вращения вектора
                            let len = Math.ceil((Number(dx) - (metricNumb.width + 10)) / 2); //длина до начала(конца) текста
                            let length = Math.round(dx); //длина вектора

                            //Размерные линии
                            let lineTip1 = UGeo.lineTip((i === 1), tail[0], frameEnvelope.getMaxY() + heightTxt, 180, len);
                            this.winc.paint(lineTip1.getGeometryN(0));
                            this.winc.paint(lineTip1.getGeometryN(1));

                            let lineTip2 = UGeo.lineTip((i === (listHor.length - 1)), tail[1], frameEnvelope.getMaxY() + heightTxt, 0, len);
                            this.winc.paint(lineTip2.getGeometryN(0));
                            this.winc.paint(lineTip2.getGeometryN(1));

                            //Текст на линии
                            let pxy = [listHor[i - 1] + len + 8, frameEnvelope.getMaxY() + heightTxt + 12];// * .86]; //точка начала текста
                            this.winc.ctx.fillStyle = "#000000";
                            if (length < metricTxt.width) {
                                pxy[1] = pxy[1] + heightTxt / 2;
                                this.winc.ctx.fillText(txt, pxy[0], pxy[1]);
                            } else {
                                this.winc.ctx.fillText(txt, pxy[0], pxy[1]);
                            }
                        }
                    }

                    //По вертикали
                    for (let i = 1; i < listVer.length; ++i) {
                        let dy = listVer[i] - listVer[i - 1];
                        if (Math.abs(dy) > 0.04) {

                            const txt = dy.toFixed(1); //текст разм.линии
                            let metricNumb = this.winc.ctx.measureText(txt); //логические границы строки
                            let tail = [listVer[i - 1], listVer[i]]; //y1, y2 хвост вращения вектора
                            let len = Math.ceil((Number(dy) - (metricNumb.width - 10)) / 2); //длина до начала(конца) текста
                            let length = Math.round(dy); //длина вектора

                            //Размерные линии
                            let lineTip1 = UGeo.lineTip((i === 1), frameEnvelope.getMaxX() + heightTxt, tail[0], -90, len);
                            this.winc.paint(lineTip1.getGeometryN(0));
                            this.winc.paint(lineTip1.getGeometryN(1));
                            let lineTip2 = UGeo.lineTip((i === (listVer.length - 1)), frameEnvelope.getMaxX() + heightTxt, tail[1], 90, len);
                            this.winc.paint(lineTip2.getGeometryN(0));
                            this.winc.paint(lineTip2.getGeometryN(1));

                            //Текст на линии
                            let pxy = [frameEnvelope.getMaxX() + heightTxt - 6, listVer[i] - len]; //точка врашения и начала текста                    
                            if (length < (metricNumb.width)) {
                                this.winc.ctx.fillText(txt, (pxy[0] + 4), pxy[1] - heightTxt / 2);
                            } else {
                                this.winc.ctx.translate(pxy[0], pxy[1]);
                                this.winc.ctx.rotate(Math.toRadians(-90));
                                this.winc.ctx.fillText(txt, 0, 20);
                            }
                        }
                    }
                }
            } else if (this.area !== null) {
                this.winc.ctx.strokeStyle = "#0000FF";
                for (let i = 0; i < 3; ++i) {
                    this.winc.paint(this.area.getGeometryN(i));
                }
            }
            this.winc.ctx.restore();
        } catch (e) {
            errorLog('Error: AreaSimple.paint() ' + e.message);
        }
    }
}


