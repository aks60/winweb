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
        url: 'dbset?action=prokitList',
        success: function (data) {
            kits.prokitList = data.prokitList;
            for (let i = 0; i < kits.prokitList.length; i++) {
                let tr = kits.prokitList[i];
                table.jqGrid('addRowData', i + 1, {
                    id: tr[KITS.id],
                    artikl_id: tr[KITS.artikl_id],
                    artikl_id: tr[KITS.artikl_id],
                    color1_id: tr[KITS.color1_id],
                    color2_id: tr[KITS.color2_id],
                    color3_id: tr[KITS.color3_id],
                    width: tr[KITS.width],
                    height: tr[KITS.height],
                    numb: tr[KITS.numb],
                    angl1: tr[KITS.angl1],
                    angl2: tr[KITS.angl2]
                });
            }
            kits.resize();
        }
    });
}