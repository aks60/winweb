
import {Com5t} from './Com5t.js';

export class AreaSimple extends Com5t {

    constructor(winc, id, ownerId) {
        try {
            super(winc, id, ownerId);
            winc.listArea.push(this);
            winc.listAll.push(this);
            this.frames = new Array(); //список рам 
        } catch (e) {
            errorLog('Error:AreaSimple.constructor() ' + e.message);
        }
    }

    setLocation() {
        try {
            consoleLog('Exec:AreaSimple.setLocation()');
        } catch (e) {
            errorLog('Error:AreaSimple.setLocation() ' + e.message);
        }
    }

    /*    constructor(winc, gson, owner) {
     alrt('new AreaSimple');
     super(winc, gson, owner);
     if (gson.form != undefined) {
     this.form = gson.form;
     }
     
     this.childs = new Array(0); //список детей 
     
     //Коробка
     if (gson.length == undefined && (owner == null || owner == winc.root)) {
     this.dimension(0, 0, winc.width(), winc.height());
     
     //Створка
     } else if (this.typeForm() == 'STVORKA') {
     this.dimension(owner.x1, owner.y1, owner.x2, owner.y2);
     
     //Аrеа
     } else {
     let height = (owner.layout == "VERT") ? gson.length : owner.height;
     let width = (owner.layout == "HORIZ") ? gson.length : owner.width;
     
     if (owner.childs.length == 0) { //если owner.childs.length == 0 то prevArea искать нет смысла
     if (owner.layout == "VERT") { //сверху вниз
     let Y2 = (owner.y1 + height > owner.y2) ? owner.y2 : owner.y1 + height;
     this.dimension(owner.x1, owner.y1, owner.x2, Y2);
     
     } else if (owner.layout == "HORIZ") { //слева направо
     let X2 = (owner.x1 + width > owner.x2) ? owner.x2 : owner.x1 + width;
     this.dimension(owner.x1, owner.y1, X2, owner.y2);
     }
     } else {
     for (let index = owner.childs.length - 1; index >= 0; --index) { //т.к. this area ёщё не создана начнём с конца
     if (owner.childs[index] instanceof Area) {
     let prevArea = owner.childs[index];
     
     if (owner.layout == "VERT") { //сверху вниз                            
     let Y2 = (prevArea.y2 + height > owner.y2) ? owner.y2 : prevArea.y2 + height;
     this.dimension(owner.x1, prevArea.y2, owner.x2, Y2);
     
     } else if (owner.layout == "HORIZ") { //слева направо
     let X2 = (prevArea.x2 + width > owner.x2) ? owner.x2 : prevArea.x2 + width;
     this.dimension(prevArea.x2, owner.y1, X2, owner.y2);
     }
     break;
     }
     }
     }
     }
     }*/

    paint() {
        try {
            consoleLog('Exec:AreaSimple.paint()');
        } catch (e) {
            errorLog('Error:AreaSimple.paint() ' + e.message);
        }
    }

    /*    //Форма контура
     typeForm() {
     if (this.id != 0 && this.form != undefined) {
     return this.winc.root.type;
     }
     return this.type;
     }
     
     lineCross(cross) {
     let arr = [];
     this.winc.listElem.forEach(e => {
     if (e.id == cross.id) {
     e.owner.childs.forEach((e2, i) => {
     if (e2.id == cross.id)
     arr = [e.owner.childs[i - 1], e.owner.childs[i + 1]];
     });
     }
     });
     return arr;
     }*/
}


