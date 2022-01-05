sysprof.init_dialog = function (table) {
    table.dialog({
        title: "Профили системы",
        width: 500,
        height: 400,
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
    table.jqGrid({
        datatype: "local",
        gridview: true,
        autowidth: true,
        height: "auto",         
        colNames: ['id', 'Сторона', 'Код артикула', 'Наименование артикула'],
        colModel: [
            {name: 'id', hidden: true},
            {name: 'use_side', width: 60, sorttype: "text"},
            {name: 'artikl_id', width: 80, sorttype: "text"},
            {name: 'artikl_id', width: 200, sorttype: "text"}
        ]
    });   
}

sysprof.load_table1 = function(table) {
    table.jqGrid('clearGridData', true);
    $.ajax({
        url: 'sysprof?action=sysprofList',
        success: function (data) {
            sysprof.sysprofList = data.sysprofList;
            for (i = 0; i < sysprof.sysprofList.length; i++) {
                let tr = sysprof.sysprofList[i];
                table.addRowData(i + 1, {
                    id: tr[0], 
                    use_side: tr[1], 
                    artikl_id: tr[2], 
                    artikl_id: tr[2]
                });
            }
            sysprof.resize();
        }
    });   
}



