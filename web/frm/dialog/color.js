//------------------------------------------------------------------------------
color.init_dialog = function (dialogTag) {

    dialogTag.dialog({
        title: "Справочник текстур*",
        width: 400,
        height: 500,
        modal: false,
        buttons: {
            "Выбрать": function () {
//                    var rowid = $("#dialogBol").getGridParam('selrow');
//                    var record = $("#dialogBol").getRowData(rowid);
//                    //запишем выбранную запись в src
//                    src.val(record.id);
//                    $(this).dialog('close');

//                    var rowid = $("#dialogGrp").getGridParam('selrow');
//                    var index = $("#dialogGrp").jqGrid('getInd', rowid);
//                    var record = mapUch.group2[index - 1];
//                    //запишем выбранную запись в src
//                    src.attr('sp', record.id);
//                    src.val(record.name);
//                    src.next().next().next().val(record.nyear_calc);
//                    $(this).dialog('close');
                    
                    var rowid = $("#table2").getGridParam('selrow');
                    var index = $("#table2").jqGrid('getInd', rowid);
                    var record = mapUch.uch[index - 1];
                    //запишем выбранную запись в src
                    src.attr('sp', record.id);
                    src.val(record.name);
                    $(this).dialog('close');                    
            },
            "Закрыть": function () {
                $(this).dialog("close");
            }
        }
    });
}
//------------------------------------------------------------------------------
color.init_table = function (table1, table2) {

    table1.jqGrid({
        datatype: "local",
        colNames: ['id', 'Группы текстур'],
        colModel: [
            {name: 'id', hidden: true},
            {name: 'name', width: 180}
        ],
        onSelectRow: function (rowid) {
            table2.jqGrid("clearGridData", true);
            let colgrpRec = table1.getRowData(rowid);
            for (i = 0; i < dataset.colorList.length; i++) {
                let colorRec = dataset.colorList[i];
                if (colgrpRec.id == colorRec[2]) {
                    table2.jqGrid('addRowData', i + 1, {
                        id: colorRec[0],
                        name: colorRec[1]
                    });
                }
            }
            color.resize();
        }
    });

    table2.jqGrid({
        datatype: "local",    
        colNames: ['Код', 'Описание текстур'],
        colModel: [
            {name: 'id', width: 80},
            {name: 'name', width: 180}
        ],
        ondblClickRow: function (rowId) {
            alert("2 click");
        }
    });
};
//------------------------------------------------------------------------------
color.load_table = function (table1, table2) {

    table1.jqGrid('clearGridData', true);
    $.ajax({
        url: 'color?action=colorGroup',
        success: function (data) {
            color.colorGroup = data.colorGroup;
            for (i = 0; i < color.colorGroup.length; i++) {
                let tr = color.colorGroup[i];
                table1.jqGrid('addRowData', i + 1, {
                    id: tr[0],
                    name: tr[1]
                });
            }
            table1.jqGrid("setSelection", 1);
        }
    });
};
//------------------------------------------------------------------------------
