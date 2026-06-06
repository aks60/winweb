import {virtualRec} from './domain.js';

ePrjpart = {
    up: 0, //Контрагент
    id: 1, //Идентификатор
    npp: 2, //Номер п/п
    partner: 3, //Контрагент
    login: 4, //Login
    category: 5, //Категория
    note: 6, //Примечание
    flag2: 7, //Физ.лицо/Организация

    addr_leve: 8, //Адрес 1го уровня
    addr_leve: 9, //Адрес 2го уровня
    addr_phon: 10, //Телефон
    addr_emai: 11, //E-mail

    org_conta: 12, //Контактное лицо
    org_leve1: 13, //Адрес 1го уровня
    org_leve2: 14, //Адрес 2го уровня
    org_phone: 15, //Телефон
    org_email: 16, //E-mail
    org_fax: 17, //Факс

    bank_name: 18, //Банк
    bank_inn: 19, //ИНН
    bank_rs: 20, //Р/С
    bank_bik: 21, //БИК
    bank_ks: 22, //К/С
    bank_kpp: 23, //КПП
    bank_ogrn: 24, //ОГРН

    flag1: 25, //Скидка менеджера
    disc1: 26, //Скидки на профиль %
    disc2: 27, //Скидки на аксессуары
    disc3: 28, //Скидка на уплотнение
    disc5: 29, //Скидка на заполнение
    disc6: 30, //Скидки по умолчанию
    vrec: virtualRec(30)
};

