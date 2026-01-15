import {virtualRec} from './domain.js';
eArtikl = {
    up: 0, //Материальные ценности
    id: 1, //Идентификатор
    code: 2, //Артикул
    level1: 3, //Главный тип
    level2: 4, //Подтип артикула
    name: 5, //Название
    supplier: 6, //У поставщика
    tech_code: 7, //Технолог.код контейнера
    size_furn: 8, //Фальц внешний или Фурнитурный паз
    size_falz: 9, //Фальц внутренний или наплав(полка)
    size_tech: 10, //Размер технолог. или толщина наплава(полки)
    size_centr: 11, //B - Смещение оси от центра
    size_frez: 12, //Толщина фрезы
    len_unit: 13, //Длина ед. поставки
    height: 14, //Ширина
    depth: 15, //Толщина
    unit: 16, //Ед. измерения
    density: 17, //Удельный вес
    section: 18, //Сечение
    noopt: 19, //Не оптимизировать
    ost_delov: 20, //Деловой остаток
    cut_perim: 21, //Периметр сечения
    min_rad: 22, //Мин.радиус гиба
    nokom: 23, //Доступ для выбора
    noskl: 24, //Не для склада
    sel_color: 25, //Подбор текстур
    with_seal: 26, //С уплотнением
    otx_norm: 27, //Норма отхода
    groups1_id: 28, //Группы наценок
    groups2_id: 29, //Группы скидок
    groups3_id: 30, //Категория профилей
    groups4_id: 31, //Серия профиля
    syssize_id: 32, //Системные константы
    currenc1_id: 33, //Основная валюта
    currenc2_id: 34, //Неосновная валюта
    analog_id: 35, //Аналог профиля
    vrec: virtualRec(36, {1: -3, 2: '@', 5: 'virtual', 9: 20, 11: 0, 14: 64, 15: 4, 32: -3, 35: -3}),
    find(ID, analog) {
        try {
            if (ID === -3) {
                return this.vrec;
            }
            let artiklRec = this.list.find(rec => ID === rec[this.id]);
            if (artiklRec === undefined) {
                artiklRec = this.vrec;
            }
            if (analog === true && artiklRec[this.analog_id] !== null) {
                const _analog_id = artiklRec[this.analog_id];
                artiklRec = this.list.find(rec => _analog_id === rec[this.id]);
            }
            return artiklRec;
        } catch (e) {
            errorLog('Error: eArtikl.find() ' + e.message);
        }
    },
    find2(code) {
        try {
            if ("0x0x0x0" === code) {
                return this.vrec();
            }
            let artiklRec = this.list.find(rec => code === rec[this.code]);
            if (artiklRec === undefined) {
                artiklRec = this.vrec;
            }
            return artiklRec;
        } catch (e) {
            errorLog('Error: eArtikl.find() ' + e.message);
        }
    }
};