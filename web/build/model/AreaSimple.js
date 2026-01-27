
import {Com5t} from './Com5t.js';
import {UCom} from '../../common/uCom.js';
import {UGeo} from './uGeo.js';
import {PKjson} from '/winweb/enums/PKjson.js';
import {Type} from '../../enums/enums.js';

export class AreaSimple extends Com5t {

    frames = new Array(); //список рам 
    childs = new Array(); //дети
    listenerPassEdit = null; //для прорисовки точек движения сегментов

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

    paint() {
        try {
            if (this.winc.sceleton === false) {
                if (this.type !== Type.STVORKA) {
                    //if (listenerPassEdit != null) {
                    //    listenerPassEdit.paint();
                    //}
                    this.winc.ctx.strokeStyle = '#000000';
                    let frameEnvelope = this.winc.root.area.getGeometryN(0).getEnvelopeInternal();
                    let hsHor = new Set(), hsVer = new Set();
                    if (this.type !== Type.DOOR) {

                        for (let area5e of this.winc.listArea) {
                            let frameBox = (area5e.type === Type.STVORKA) ? area5e.area.getGeometryN(3) : area5e.area.getGeometryN(0);
                            let coo = frameBox.getCoordinates();

                            //if (this instanceof AreaArch) {
                            //    Geometry geo1 = this.area.getGeometryN(0);
                            //    Envelope env = geo1.getEnvelopeInternal();
                            //    hsVer.add(env.getMinY());
                            //}
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
                        for (let elem5e of winc.listElem.filter(el =>el.type === Type.IMPOST)) {
                            hsVer.add(elem5e.y1());
                        }
                    }
                    let listHor = [...hsHor];
                    let listVer = [...hsVer];
                    listHor.sort((a, b) => b - a);
                    listVer.sort((a, b) => b - a);

                    //Font font = new Font("Dialog", 0, UCom.scaleFont(winc.scale)); //размер шрифта (см. canvas)
                    //winc.gc2d.setFont(font);
                    const sizeFont = UCom.scaleFont(this.winc.scale);
                    this.winc.ctx.font = `bold ${sizeFont}px sans-serif`; //размер шрифта
                    let orig = this.winc.ctx.getTransform();                   
                    let txt2D = this.winc.ctx.measureText("999.99"); //this.winc.ctx.font.getStringBounds("999.99", this.winc.ctx.getFontRenderContext());

                    //По горизонтали
                    for (let i = 1; i < listHor.length; ++i) {
                        let dx = listHor[i] - listHor[i - 1];
                        if (Math.abs(dx) > 0.04) {

                            const txt = dx.toFixed(1); //текст разм.линии
                            let rec2D = this.winc.ctx.measureText(txt); //font.getStringBounds(txt, winc.gc2d.getFontRenderContext()); //логические границы строки
                            let tail = [listHor[i - 1], listHor[i]]; //x1, x2 хвост вращения вектора
                            let len = Math.ceil((Number(dx) - (rec2D.width + 10)) / 2); //длина до начала(конца) текста
                            let length = Math.round(dx); //длина вектора
debugger;
                            //Размерные линии
                            let lineTip1 = UGeo.lineTip((i === 1), tail[0], frameEnvelope.getMaxY() + sizeFont / 2, 180, len);
                            this.winc.paint(lineTip1);
                            let lineTip2 = UGeo.lineTip((i === (listHor.length - 1)), tail[1], frameEnvelope.getMaxY() + sizeFont / 2, 0, len);
                            this.winc.paint(lineTip2);

                            //Текст на линии
                            let pxy = [listHor[i - 1] + len + 8, frameEnvelope.getMaxY() + sizeFont * .86]; //точка начала текста
                            if (length < txt2D.width) {
                                pxy[1] = pxy[1] + sizeFont / 2;
                                this.winc.ctx.fillText("Hello World!", 10, 50); 
                                //ctx.strokeText(text, x, y, [maxWidth])
                                //winc.gc2d.drawString(txt, (int) pxy[0], (int) (pxy[1]));
                            } else {
                                //winc.gc2d.drawString(txt, (int) pxy[0], (int) pxy[1]);
                            }
                            this.winc.ctx.setTransform(orig);
                        }
                    }

                    //По вертикали
                    /*for (int i = 1; i < listVer.size(); ++i) {
                        double dy = listVer.get(i) - listVer.get(i - 1);
                        if (Math.abs(dy) > 0.04) {

                            String txt = UCom.format(dy, -1); //текст разм.линии
                            Rectangle2D rec2D = font.getStringBounds(txt, winc.gc2d.getFontRenderContext()); //логические границы строки
                            int tail[] = {(int) Math.ceil(listVer.get(i - 1)), (int) Math.ceil(listVer.get(i))};  //y1, y2 хвост вращения вектора
                            int len = (int) Math.round((dy - rec2D.getWidth() - 10) / 2); //длина до начала(конца) текста
                            double length = Math.round(dy); //длина вектора

                            //Размерные линии
                            Geometry lineTip1 = UGeo.lineTip((i == 1), frameEnvelope.getMaxX() + rec2D.getHeight() / 2, tail[0], -90, len);
                            Shape shape = new ShapeWriter().toShape(lineTip1);
                            winc.gc2d.draw(shape);
                            Geometry lineTip2 = UGeo.lineTip((i == (listVer.size() - 1)), frameEnvelope.getMaxX() + rec2D.getHeight() / 2, tail[1], 90, len);
                            shape = new ShapeWriter().toShape(lineTip2);
                            winc.gc2d.draw(shape);

                            //Текст на линии
                            double pxy[] = {frameEnvelope.getMaxX() + txt2D.getHeight() - 6, listVer.get(i) - len}; //точка врашения и начала текста                    
                            if (length < (txt2D.getWidth())) {
                                winc.gc2d.drawString(txt, (int) (pxy[0] + 4), (int) (pxy[1] - txt2D.getHeight() / 2));
                            } else {
                                winc.gc2d.rotate(Math.toRadians(-90), pxy[0], pxy[1]);
                                winc.gc2d.drawString(txt, (int) pxy[0], (int) pxy[1]);
                            }
                            winc.gc2d.setTransform(orig);
                        }
                    }*/
                }
            } else if (this.area !== null) {
                /*winc.gc2d.setColor(new java.awt.Color(000, 000, 255));
                for (int i = 0; i < 3; ++i) {
                    Shape shape = new ShapeWriter().toShape(this.area.getGeometryN(i));
                    winc.gc2d.draw(shape);
                }*/
            }
        } catch (e) {
            errorLog('Error: AreaSimple.paint() ' + e.message);
        }
    }
}


