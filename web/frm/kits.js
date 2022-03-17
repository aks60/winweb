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
kits.color_to_kits = function (btnSrc) {
    let groupSet = new Set();
    let colorSet = new Set();
    try {
        //Все текстуры артикула элемента конструкции
        for (let rec of dbset.artdetList) {
            if (rec[ARTDET.artikl_id] == kits.rec_tab2_kitcard[ARTDET.artikl_id]) {
                if (rec[ARTDET.color_fk] < 0) { //все текстуры групы color_fk

                    dbset.colorList.forEach(colorRec => {
                        if (colorRec[COLOR.colgrp_id] == Math.abs(rec[ARTDET.color_fk])) {

                            groupSet.add(Math.abs(colorRec[COLOR.colgrp_id]));
                            colorSet.add(colorRec);
                        }
                    });
                } else { //текстура color_fk 
                    let color2Rec = dbset.colorList.find(rec3 => rec[ARTDET.color_fk] == rec3[COLOR.id]);
                    groupSet.add(color2Rec[COLOR.colgrp_id]);
                    colorSet.add(color2Rec);
                }
            }
        }
        color.parent = 'kits';
        kits.groupSet = groupSet;
        kits.colorArr = Array.from(colorSet);
        kits.buttonSrc = btnSrc;

        $('#dialog-dic').load('frm/dialog/color.jsp');

    } catch (e) {
        console.error("Ошибка: kits.color_to_kits() " + e.message);
    }
}
//------------------------------------------------------------------------------