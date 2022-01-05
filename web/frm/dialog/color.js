//------------------------------------------------------------------------------
color.init_dialog = function (dialogTag) {
    
    dialogTag.dialog({
        title: "Справочник текстур*",
        width: 400,
        height: 500,
        modal: false,
        buttons: {
            "Выбрать": function () {
                //color.resize();
                //$('#tab2-dic').jqGrid('clearGridData', true);
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
        gridview: true,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Группы текстур'],
        colModel: [
            {name: 'id', hidden: true},
            {name: 'name', width: 180}
        ],
        onSelectRow: function (rowid) {
            table2.jqGrid('clearGridData', true);
            let colgrpRec = table1.getRowData(rowid);
            for (i = 0; i < dataset.colorList.length; i++) {
                let tr = dataset.colorList[i];
                if (colgrpRec.id == tr[2]) {
                    table2.addRowData(i + 1, {
                        id: tr[0],
                        name: tr[1]
                    });
                }
            }
            color.resize();
        }
    });

    table2.jqGrid({
        datatype: "local",
        gridview: true,
        autowidth: true,
        height: "auto",
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
                table1.addRowData(i + 1, {
                    id: tr[0],
                    name: tr[1]
                });
            }
            color.resize();
            table1.setSelection(1);
        }
    });
};

