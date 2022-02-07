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

//                var rowid = $("#table2").getGridParam('selrow');
//                var index = $("#table2").jqGrid('getInd', rowid);
//                var record = mapUch.uch[index - 1];
//                //запишем выбранную запись в src
//                src.attr('sp', record.id);
//                src.val(record.name);
//                $(this).dialog('close');
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
            {name: 'id', hidden: true, key: true},
            {name: 'name', width: 360}
        ],
        onSelectRow: function (rowid) {
            table2.jqGrid("clearGridData", true);
            let colgrpRec = table1.getRowData(rowid);
            if (product.colorArr.length == 0) {
                for (let i = 0; i < dbset.colorList.length; i++) {
                    let colorRec = dbset.colorList[i];
                    if (colgrpRec.id == colorRec[COLOR.colgrp_id]) {
                        table2.jqGrid('addRowData', i + 1, {
                            id: colorRec[COLOR.id],
                            name: colorRec[COLOR.name]
                        });
                    }
                }
            } else {
                for (let i = 0; i < product.colorArr.length; i++) {
                    let colorRec = product.colorArr[i];
                    if (colgrpRec.id == colorRec[COLOR.colgrp_id]) {
                        table2.jqGrid('addRowData', i + 1, {
                            id: colorRec[COLOR.id],
                            name: colorRec[COLOR.name]
                        });
                    }
                }
            }
            table2.jqGrid("setSelection", 1);
            color.resize();
        }
    });

    table2.jqGrid({
        datatype: "local",
        colNames: ['Код', 'Описание текстур'],
        colModel: [
            {name: 'id', width: 80, key: true},
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
    table2.jqGrid('clearGridData', true);
    if (product.groupSet.size > 0) {
        let groupList = dbset.groupList.filter(rec => product.groupSet.has(rec[GROUP.id]));
        for (let i = 0; i < groupList.length; i++) {
            let tr = groupList[i];
            table1.jqGrid('addRowData', i + 1, {
                id: tr[GROUP.id],
                name: tr[GROUP.name]
            });
        }
    }
    table1.jqGrid("setSelection", 1);
    color.resize();
};
//------------------------------------------------------------------------------
