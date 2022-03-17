//------------------------------------------------------------------------------
kits.init_table = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Артикул', 'Название', 'Основная', 'Внутренняя', 'Внешняя', 'Длина', 'Ширина', 'Кол-во'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'code', width: 80, sorttype: "text"},
            {name: 'name', width: 200, sorttype: "text"},
            {name: 'color1_id', width: 80, sorttype: "text"},
            {name: 'color2_id', width: 80, sorttype: "text"},
            {name: 'color3_id', width: 80, sorttype: "text"},
            {name: 'width', width: 60, sorttype: "text"},
            {name: 'height', width: 60, sorttype: "text"},
            {name: 'numb', width: 60, sorttype: "text"}
        ]
    });
}
//------------------------------------------------------------------------------
kits.load_table = function (table) {
    table.jqGrid('clearGridData', true);
    kits.prokitList = dbset.prokitList.filter(rec => order.prprodRec[PROPROD.id] == rec[PROKIT.proprod_id]);
    for (let i = 0; i < kits.prokitList.length; i++) {
        let tr = kits.prokitList[i];
        let artiklRec = findef(dbset.artiklList.find(rec => tr[KITS.artikl_id] == rec[ARTIKL.id]), dbset.artiklList);
        table.jqGrid('addRowData', i + 1, {
            id: tr[KITS.id],
            code: artiklRec[ARTIKL.code],
            name: artiklRec[ARTIKL.name],
            color1_id: findef(dbset.colorList.find(rec => tr[KITS.color1_id] == rec[KITS.id]), dbset.colorList)[COLOR.name],
            color2_id: findef(dbset.colorList.find(rec => tr[KITS.color2_id] == rec[KITS.id]), dbset.colorList)[COLOR.name],
            color3_id: findef(dbset.colorList.find(rec => tr[KITS.color3_id] == rec[KITS.id]), dbset.colorList)[COLOR.name],
            width: tr[KITS.width],
            height: tr[KITS.height],
            numb: tr[KITS.numb]
        });
    }
    kits.resize();
}
//------------------------------------------------------------------------------