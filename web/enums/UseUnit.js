export const UseUnit = {
    METR: [1, "пог.м."],
    METR2: [2, "кв.м."],
    PIE: [3, "шт."],
    ML: [4, "мл."],
    KIT: [5, "комп."],
    GRAM: [6, "грамм."],
    KG: [7, "кг."],
    LITER: [8, "литр"],
    DOSE: [10, "доза"],
    PAIR: [11, "пара"],
    MONTH: [12, "месяц"],
    name(numb) {
        for(let key in UseUnit) {
            if (UseUnit[key][0] == numb) {
              return UseUnit[key][1];
            }
        }
    }
};
Object.defineProperty(UseUnit, 'name', {
  enumerable: false, // Исключает из перечисления
});

