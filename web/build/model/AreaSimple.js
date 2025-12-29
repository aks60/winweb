
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
            this.initParametr(gson.param);
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
                sysprofRec = dbset.sysprof.list.find3(param[PKjson.sysprofID]);
            }//else if(this.owner.id === 0) {
            //    sysprofRec = dbset.sysprof.list.find4(this.winc.nuni, UseArtiklTo.FRAME.id, UseSideTo.ANY);
            //}
        } catch (e) {
            errorLog('Error: AreaSimple.initConstructiv() ' + e.message);
        }
    }
    /**
     * Параметры системы(технолога) + параметры менеджера В таблице syspar1 для
     * каждой системы лежат параметры по умолчанию от технолога. К параметрам от
     * технолога замешиваем параметры от менеджера см. скрирт, например
     * {"ioknaParam": [-8252]}. При этом в winc.mapPardef будут изменения с
     * учётом менеджера.
     */
    initParametr(param) {
        try {
            if (param !== undefined && param[PKjson.ioknaParam] !== undefined) {
                //Добавим к параметрам системы конструкции параметры конкретной конструкции
                let ioknaParamArr = param[PKjson.ioknaParam];
                for (const ioknaID of ioknaParamArr) { //цикл по пааметрам менеджера
                    //Найдём record paramsRec и syspar1Rec;   
                    if (ioknaID < 0) {
                        let paramsRec = dbset.params.find(ioknaID); //параметр менеджера
                        let syspar1Rec = this.winc.mapPardef[paramsRec[eParams.groups_id]];
                        if (syspar1Rec !== null && syspar1Rec !== undefined) { //ситуация если конструкция с nuni = -3, т.е. модели
                            syspar1Rec[eParams.text] = paramsRec[eParams.text]; //накладываем параметр менеджера
                        }
                    } else {
                        let paramsRec = dbset.params.find(ioknaID); //параметр менеджера
                        let syspar1Rec = this.winc.mapPardef[paramsRec[eParams.groups_id]];
                        if (syspar1Rec !== null && syspar1Rec !== undefined) { //ситуация если конструкция с nuni = -3, т.е. модели
                            let text = dbset.color.list.find(paramsRec[eParmap.color_id1])[eColor.name];
                            syspar1Rec[eParams.text] = text; //накладываем параметр менеджера
                        }
                    }
                }
            }
        } catch (e) {
            errorLog("Error: AreaSimple.initParametr() " + e);
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


