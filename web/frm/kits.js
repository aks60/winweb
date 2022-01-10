kits.init_table1 = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Артикул', 'Название', 'Основная',
            'Внутренняя', 'Внешняя', 'Длина', 'Ширина', 'Кол-во', 'Угол1', 'Угол2'],
        colModel: [
            {name: 'id', hidden: true, key: true},
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
    table.jqGrid('clearGridData', true);
    $.ajax({
        url: 'kits?action=kitsList',
        success: function (data) {
            kits.kitsList = data.kitsList;
            for (i = 0; i < kits.kitsList.length; i++) {
                let tr = kits.kitsList[i];
                table.jqGrid('addRowData', i + 1, {
                    id: tr[0],
                    artikl_id: tr[1],
                    artikl_id: tr[2],
                    color1_id: tr[3],
                    color2_id: tr[4],
                    color3_id: tr[5],
                    width: tr[6],
                    height: tr[7],
                    numb: tr[8],
                    angl1: tr[9],
                    angl2: tr[10]
                });
            }
            kits.resize();
        }
    });
}