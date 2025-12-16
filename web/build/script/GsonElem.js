
export class GsonElem {
    static gsonId = 0;  //идентификатор  

    constructor(jsonObj) {
        this.obj = jsonObj;
        this.owner = null;
        this.x1 = null, this.y1 = null, this.h = null, this.x2 = null, this.y2 = null;
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

    get id() {
        return this.obj.id;
    }
    get owner() {
        return this.obj.owne;
    }
    set owner(owner) {
        this.obj.owner = owner;
    }
    get childs() {
        return this.obj.childs;
    }
    get param() {
        return this.obj.param;
    }
    set param(param) {
        this.obj.param = param;
    }
    get type() {
        return this.obj.type;
    }
    set type(type) {
        this.obj.type = type;
    }

    /**
     * Назначить родителей всем детям
     */
    setOwner(winc) {
        try {
            this.childs.forEach(el => {
                el.owner = this;
                if (el.childs != null) {
                    el.setOwner(winc);
                }
            });
        } catch (e) {
            errorLog('Error:GeoElem.setOwnerAndForm()  ' + e.message);
        }
    }
}