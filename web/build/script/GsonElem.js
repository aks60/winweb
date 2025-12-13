
export class GsonElem {

    constructor(jsonObj) {
        this.obj = jsonObj;
        this.owner = null;
        this.childs = new Array(); //список детей
        
        //alert("create GsonElem")
    }

    addArea(area) {
        area.owner = this;
        this.childs.push(area);
        return area;
    }

    addElem(elem) {
        elem.owner = this;
        this.childs.push(elem);
        return this;
    }
}


