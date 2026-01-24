
import {Com5t} from './Com5t.js';
import {PKjson} from '/winweb/enums/PKjson.js';

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
            //console.log('Exec: AreaSimple.paint()');
        } catch (e) {
            errorLog('Error: AreaSimple.paint() ' + e.message);
        }
    }
}


