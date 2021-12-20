sysprof.init_dialog = function (table) {
    table.dialog({
        title: "Справочник текстур",
        width: 400,
        height: 500,
        modal: false,
        buttons: {
            "Выбрать": function () {
                sysprof.resize();
            },
            "Закрыть": function () {
                $(this).dialog("close");
            }
        }
    });
}

sysprof.init_table1 = function(table) {
    
}

sysprof.load_table1 = function(table) {
    
}



