artikl.init_dialog = function (table) {
    table.dialog({
        title: "Справочник артиклов",
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

artikl.init_table1 = function(table) {
    table.jqGrid({
        datatype: "local",
        gridview: true,
        autowidth: true,
        height: "auto",         
        colNames: ['id', 'Тип артикула', 'Код артикула', 'Наименование артикула'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'types', width: 60, sorttype: "text"},
            {name: 'artikl_id', width: 80, sorttype: "text"},
            {name: 'artikl_id', width: 200, sorttype: "text"}
        ]
    });   
}

artikl.load_table1 = function(table) {
    table.jqGrid('clearGridData', true);
    $.ajax({
        url: 'sysprof?action=sysprofList',
        success: function (data) {
            sysprof.sysprofList = data.sysprofList;
            for (let i = 0; i < sysprof.sysprofList.length; i++) {
                let tr = sysprof.sysprofList[i];
                table.jqGrid('addRowData', i + 1, {
                    id: tr[0], 
                    types: tr[1], 
                    artikl_id: tr[2], 
                    artikl_id: tr[2]
                });
            }
            //sysprof.resize();
            //setTimeout(function () {sysprof.resize();}, 500);
        }
    });   
}



