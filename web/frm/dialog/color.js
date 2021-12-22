
color.init_dialog = function (table) {
    table.dialog({
        title: "Справочник текстур",
        width: 400,
        height: 500,
        modal: false,
        buttons: {
            "Выбрать": function () {
                color.resize();
            },
            "Закрыть": function () {
                $(this).dialog("close");
            }
        }
    });
}

color.init_table1 = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        autowidth: true,
        height: "auto",        
        colNames: ['id', 'Группы текстур'],
        colModel: [
            {name: 'id', hidden: true},
            {name: 'name', width: 180}
        ]
    });
};

color.init_table2 = function (table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        autowidth: true,
        height: "auto",        
        colNames: ['Код', 'Описание текстур'],
        colModel: [
            {name: 'id', width: 80},
            {name: 'name', width: 180}
        ]
    });
};

color.load_table1 = function (table) {
    table.jqGrid("clearGridData", true);
    $.ajax({
        url: 'color?action=colorGroup',
        success: function (data) {
            color.colorGroup = data.colorGroup;
            for (i = 0; i < color.colorGroup.length; i++) {
                let tr = color.colorGroup[i];
                table.addRowData(i + 1, {
                    id: tr[0],
                    name: tr[1]
                });
            }
            color.resize();
        }
    });
};

color.load_table2 = function (table) {
    table.jqGrid("clearGridData", true);
    $.ajax({
        url: 'color?action=colorList',
        success: function (data) {
            color.colorList = data.colorList;
            for (i = 0; i < color.colorList.length; i++) {
                let tr = color.colorList[i];
                table.addRowData(i + 1, {
                    id: tr[0],
                    name: tr[1]
                });
            }
            color.resize();
        }
    });
};

