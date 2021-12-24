
export function test() {
    alert("module");
}

//------------------------------------------------------------------------------
export class GsonElem {

    genId = -1; //идентификатор    
    id = -1; //идентификатор
    owner = null; //владелец     
    //LinkedList < GsonElem > childs = new LinkedList(); //список детей
    layout = null; //сторона расположения эл. рамы
    type = null; //тип элемента
    param = null; //параметры элемента
    length = null; //ширина или высота добавляемой area (зависит от напрвления расположения) 

    constructor(layout, type, paramJson) {
        id = ++genId;
        layout = layout;
        type = type;
        param = paramJson; //параметры элемента
    }
}
//------------------------------------------------------------------------------
export class GsonRoot extends GsonElem {

    name = "Конструкция";
    prj = 1; //PNUMB - номер тестируемого проекта, поле пока нужно только для тестов 
    ord = 1; //ONUMB - номер тестируемого заказа, поле пока нужно только для тестов 
    nuni = -3; //nuni профиля (PRO4_SYSPROF.NUNI)
    width = null; //ширина area, мм
    height = null; //высота area, мм    
    heightAdd = 0; //дополнительная высота, мм.
    form = 0;
    color1 = -3; //основная текстура
    color2 = -3; //внутренняя текстура
    color3 = -3; //внешняя текстура 

    constructor(prj, ord, nuni, name, layout, type, width, height1, height2, color1, color2, color3, paramJson) {
        super.genId = 0;
        super.id = 0;
        this.prj = prj;
        this.ord = ord;
        this.nuni = nuni;
        this.name = name;
        this.layout = layout;
        this.type = type;
        this.width = width;
        this.height = height1;
        this.heightAdd = height2;
        this.length = null;
        this.color1 = color1;
        this.color2 = color2;
        this.color3 = color3;
        this.param = paramJson;
    }

}
//------------------------------------------------------------------------------
export class AreaRectangl {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }
}
//------------------------------------------------------------------------------
export class AreaDoor {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }
}
//------------------------------------------------------------------------------
export class AreaTrapeze {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }
}
//------------------------------------------------------------------------------
export class AreaTriangl {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }
}
//------------------------------------------------------------------------------
export class AreaStvorka {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }
}
//------------------------------------------------------------------------------
export class ElemCross {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }
}
//------------------------------------------------------------------------------
export class ElemFrame {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }
}
//------------------------------------------------------------------------------
export class ElemGlass {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }
}
//------------------------------------------------------------------------------

