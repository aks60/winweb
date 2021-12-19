
color.init_dialog = function (table) {
    table.dialog({
        autoOpen: true, // Открывать ли окно сразу 
        width: 600,
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
        colNames: ['id', 'Группы текстур'],
        colModel: [
            {name: 'id', hidden: true},
            {name: 'name', width: 80}
        ]
    });
};

color.load_table1 = function () {

};

color.init_table2 = function (table) {
    table.jqGrid({
        datatype: "local",
        colNames: ['id', 'Название текстур'],
        colModel: [
            {name: 'id', hidden: true},
            {name: 'name', width: 80}
        ]
    });
};

color.load_table2 = function () {

};

