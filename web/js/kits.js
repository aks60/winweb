kits.init_table1 = function (table) {
    table.jqGrid({
        datatype: "local",
        rownumbers: true,
        colNames: ['id', 'Артикул', 'Название', 'Основная',
            'Внутренняя', 'Внешняя', 'Ширина', 'Длина', 'Кол-во', 'Угол1', 'Угол2'],
        colModel: [
            {name: 'id', hidden: true},
            {name: 'artikl_id', width: 80, sorttype: "text"},
            {name: 'artikl_id', width: 200, sorttype: "text"},
            {name: 'color1_id', width: 80, sorttype: "text"},
            {name: 'color2_id', width: 80, sorttype: "text"},
            {name: 'color3_id', width: 80, sorttype: "text"},
            {name: 'width', width: 60, sorttype: "text"},
            {name: 'height', width: 60, sorttype: "text"},
            {name: 'numb', width: 60, sorttype: "text"},
            {name: 'angl1', width: 60, sorttype: "text"},
            {name: 'angl2', width: 60, sorttype: "text"}
        ]
    });
}

kits.load_table1 = function (table) {

}