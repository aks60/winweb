export const UseColor = {
    MANUAL: 0, //Указанная вручную
    PROF: 11, //Профиль
    GLAS: 15, //Заполнение
    COL1: 1, //Основная
    COL2: 2, //Внутренняя
    COL3: 3, //Внешняя
    C1SE: 6, //Основная и серия
    C2SE: 7, //Внутренняя и серия
    C3SER: 8, //Внешняя и серия
    PARAM: 9, //Параметр
    PARSER: 10, //Параметр и серия
    //
    P04: 4, //Параметр №04
    P05: 5, //Параметр №05
    P12: 12, //Параметр №12
    P13: 13, //Параметр №13
    P14: 14, //Параметр №14
    isSeries(typesUS) {
        
        if ([this.C1SER, this.C2SER, this.C3SER, this.PARSER].includes(typesUS & 0x0000000f)
                || [this.C1SER, this.C2SER, this.C3SER, this.PARSER].includes((typesUS & 0x000000f0) >> 4)
                || [this.C1SER, this.C2SER, this.C3SER, this.PARSER].includes((typesUS & 0x00000f00) >> 8)) {
            return true;
        }
        return false;
    }    
};

