//------------------------------------------------------------------------------
artikl.init_dialog = function () {

    $("#dialog-list").dialog({
        title: "Справочник-", 
        width: 600, 
        height: 500, 
        modal: true,
        buttons: {
            "Выбрать": function () {
            },
            "Закрыть": function () {
                $(this).dialog("close");
            }
        }
    });

    $(window).bind('resize', function () {
        $('#dtable').setGridWidth($("#dialog-list").width() - 4);
        $('#dtable').setGridHeight($("#dialog-list").height() - 26);
    }).trigger('resize');
}
//------------------------------------------------------------------------------
artikl.init_table = function () {

    $("#dtable").jqGrid({
        datatype: "local",
        multiselect: false,
        autowidth: true,
        height: ($("#dialog-list").height() - 26),
        colNames: ['id', 'Код артикула', 'Наименование артикула'],
        colModel: [
            {name: 'id', hidden: true, key: true},
            {name: 'code', width: 200, sorttype: "text"},
            {name: 'name', width: 400, sorttype: "text"}
        ],
        ondblClickRow: function (rowId) {
        }
    });
    $("#dtable").jqGrid('bindKeys', {scrollingRows: true});
}
//------------------------------------------------------------------------------
artikl.load_table = function () {

    $("#dtable").jqGrid('clearGridData', true);
    for (let i = 0; i < product.artiklArr.length; i++) {
        let tr = product.artiklArr[i];
        $("#dtable").jqGrid('addRowData', i + 1, {
            id: tr[ARTIKL.id],
            code: tr[ARTIKL.code],
            name: tr[ARTIKL.name]
        });
    }
    //sysprof.resize();
    //setTimeout(function () {sysprof.resize();}, 500);  
}
//------------------------------------------------------------------------------


