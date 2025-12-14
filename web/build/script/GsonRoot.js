
import {GsonElem} from './GsonElem.js';

export class GsonRoot extends GsonElem {

    constructor(jsonObj) {
        super(jsonObj);
    }
    get version() {
        return this.obj.version; //версия 
    }
    get ord() {
        return this.obj.ord; //номер тестируемого заказа,
    }
    get nuni() {
        return this.obj.nuni; //nuni профиля 
    }
    get name() {
        return this.obj.name;
    }
    get color1() {
        return  this.obj.color1; //основная текстура
    } 
    get color2() {
        return  this.obj.color2; //внутренняя текстура
    } 
    get color3() {
        return  this.obj.color3; //внешняя текстура
    } 
}



