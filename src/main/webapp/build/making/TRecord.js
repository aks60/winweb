
export class TRecord {

    spcList = []; //список составов, фурнитур и т. д.  
    mapParam = null; //параметры спецификации
    elem5e = null; //элемент пораждающий спецификацию (контейнер)
    variantRec = null; //вариант в конструктиве
    detailRec = null; //детализация в конструктиве

    artiklRec = null; //артикул элемента
    artdetRec = [null, null, null]; //текстуры артикула

    id = -1; //ID
    place = "---"; //Место размешения
    name = "-"; //Наименование
    artikl = "-"; //Артикул
    colorID1 = -3; //Осн.текстура
    colorID2 = -3; //Внутр.текстура
    colorID3 = -3; //Внешн.текстура
    width = 0; //Длина
    height = 0; //Ширина
    weight = 0; //Масса;
    anglCut0 = 0; //Угол1;
    anglCut1 = 0; //Угол2;
    anglHoriz = 0; // Угол к горизонту    ;
    count = 1; //Кол. единиц;
    unit = 0; //Ед.изм   ;;
    waste = 0; //Процент отхода см. eArtikl.otx_norm     
    quant1 = 0; //Количество без отхода
    quant2 = 0; //Количество (с отх./без отх.)
    costprice = 0; //Себестоимость   
    price = 0; //Цена за единицу измерения
    cost1 = 0; //Стоимость без технологической скидки
    cost2 = 0; //Стоимость с технологической скидкой  
    
    constructor(place, detailRec, artiklRec, areaSimple) {
        this.place = place;
        this.detailRec = detailRec;
        this.elem5e = areaSimple;
        this.article(artiklRec);
    }
    
    article(artiklRec) {
        this.artikl = artiklRec[eArtikl.code];
        this.name = artiklRec[eArtikl.name];
        this.waste = artiklRec[eArtikl.otx_norm];
        this.unit = artiklRec[eArtikl.unit];
        this.artiklRec = artiklRec;
    }
    
    color(colorID1, colorID2, colorID3) {
        this.colorID1 = colorID1;
        this.colorID2 = colorID2;
        this.colorID3 = colorID3;
    }    
}


