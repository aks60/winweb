
export class GsonElem {
    static gsonId = 0;  //идентификатор  

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
    set childs(childs) {
        this.obj.childs = childs;
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
            console.log("Ошибка:GeoElem.setOwnerAndForm() " + e);
        }
    }
}