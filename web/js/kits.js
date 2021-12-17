kits.init_table1 = function (table) {
    $(function () {
        table.jqGrid({
            datatype: "local",
            rownumbers: true,
            colNames: ['id', 'Артикул', 'Название', 'Логин', 'Роль'],
            colModel: [
                {name: 'id', hidden: true},
                {name: 'artikl_id', width: 98, sorttype: "text"},
                {name: 'artikl_id', width: 200, sorttype: "text"},
                {name: 'login', width: 40, sorttype: "text"},
                {name: 'role', width: 40, sorttype: "text"},
            ],
            onSelectRow: function (rowid) {
                $('#pan4 .fio').val($(this).jqGrid('getRowData', rowid).fio);
                $('#pan4 .login').val($(this).jqGrid('getRowData', rowid).login);
            },
//                                onSelectRow: function (record) {
//                                    window.dialog_select = record
//                                }
        });
    });
}

kits.load_table1 = function (table) {

}