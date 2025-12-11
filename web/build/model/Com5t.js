
export class Com5t {

    constructor(wson, owner, winc) {
        this.wson = (wson);
        this.id = (wson).id;//идентификатор 
        this.owner = owner;//владелец
        this.winc = winc;//главный класс калькуляции   
        this.layout = (wson).layout;//напрвление расположения
        this.type = (wson).type;//тип элемента
        this.color1Rec = winc.color1Rec;
        this.color2Rec = winc.color2Rec;
        this.color3Rec = winc.color3Rec;
    }

    dimension(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    //Форма компонента
    typeForm() {
        return this.type;
    }

    get width() {
        return (this.x2 > this.x1) ? this.x2 - this.x1 : this.x1 - this.x2;
    }

    get height() {
        return (this.y2 > this.y1) ? this.y2 - this.y1 : this.y1 - this.y2;
    }

    get lengthX() {
        return (this.id === 0) ? this.winc.width(wson) : this.wson.length;
    }

    get lengthY() {
        return (this.id === 0) ? this.wson.height : this.wson.length;
    }

    //Изменение размера
    set lengthX(v) {

        if (this.id == 0) {
            var k = v / this.wson.width; //коэффициент
            this.wson.width = v;
            this.winc.listArea.forEach(e => {
                if (e.layout == 'HORIZ') {
                    e.childs.forEach(e2 => { //изменение всех по ширине
                        e2.obj.length = k * e2.obj.length;
                    });
                }
            });
        } else {
            let k = v / this.wson.length; //коэффициент
            this.wson.length = v;
            this.childs.forEach(e => {
                if (e.owner.layout == 'HORIZ' && (e.typeForm() == 'AREA' || e.typeForm() == 'STVORKA')) {
                    e.lengthX = k * e.lengthX; //рекурсия изменение детей

                } else if (e.childs != null) {
                    e.childs.forEach(e2 => {
                        if (e2.owner.layout == 'HORIZ' && (e2.typeForm() == 'AREA' || e2.typeForm() == 'STVORKA')) {
                            e2.lengthX = k * e2.lengthX; //рекурсия изменение детей
                        }
                    });
                }
            });
        }
    }

    //Изменение размера
    set lengthY(v) {

        if (this.id == 0) {
            var k = v / this.wson.height; //коэффициент
            this.wson.height = v;
            this.wson.heightAdd = k * this.wson.heightAdd;
            this.winc.listArea.forEach(e => {
                if (e.layout == 'VERT') {
                    e.childs.forEach(e2 => { //изменение всех по высоте
                        e2.wson.length = k * e2.wson.length;
                    });
                }
            });
        } else {
            let k = v / this.wson.length; //коэффициент            
            this.wson.length = v;
            if (this.typeForm() == 'ARCH' || this.typeForm() == 'TRAPEZE') {
                this.winc.wson.heightAdd = this.winc.wson.height - v;
            }
            this.childs.forEach(e => {
                if (e.owner.layout == 'VERT' && (e.typeForm() == 'AREA' || e.typeForm() == 'STVORKA')) {
                    e.lengthY = k * e.lengthY; //рекурсия изменение детей

                } else if (e.childs != null) {
                    e.childs.forEach(e2 => {
                        if (e2.owner.layout == 'VERT' && (e2.typeForm() == 'AREA' || e2.typeForm() == 'STVORKA')) {
                            e2.lengthY = k * e2.lengthY; //рекурсия изменение детей
                        }
                    });
                }
            });
        }
    }

    //Точка попадает в контур элемента
    inside(X, Y)
    {
        if ((this.x2 | this.y2) < 0) {
            return false;
        }
        if (X < this.x1 || Y < this.y1) {
            return false;
        }
        return ((this.x2 >= X) && (this.y2 >= Y));
    }
}