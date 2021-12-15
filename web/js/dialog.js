
//Инициализация таблицы
dialog.init_dict = function () {
    $(function () {
        $("#dialogDic").jqGrid({
            datatype: "local",
            multiselect: false,
            colNames: ['id', '№пп', 'Наименование'],
            colModel: [{name: 'id', hidden: true, key: true}, {name: 'npp', width: 10}, {name: 'cname'}],
            ondblClickRow: function (rowId) {
                dialogDic.reload();
            }
        });
        $("#dialogDic").jqGrid('bindKeys', {scrollingRows: true});
    });
}

dialog.init_tree = function () {
    $("#dialogTree").jqGrid({
        datatype: "local",
        colNames: ['id', 'Наименование'],
        colModel: [
            {name: 'id', key: true, width: 1, hidden: true, key: true},
            {name: 'name', width: 180}
        ],
        gridview: true,
        sortname: 'id',
        treeGrid: true,
        treeGridModel: 'adjacency',
        ExpandColumn: 'name',
        ExpandColClick: true,
        onSelectRow: function (rowid) {
//            loadTable(rowid);
        }
    });
}

//Диалог окна даты
dialog.open_date = function (src) {

    src.datepicker('dialog', null,
            function (d) {
                src.val(d);
            },
            {showButtonPanel: true, changeMonth: true, changeYear: true, yearRange: "1950:2020"}
    );
}

//Диалоговое окно справочников 
dialog.open_dict = function (sender, domain) {

    //this.sender = sender;
    $("#dialogDic").jqGrid("clearGridData", true);
    for (var i = 0; i < arrDic2.length; i++) {
        if (domain == arrDic2[i].spra_id) {
            var record = arrDic2[i];
            $("#dialogDic").addRowData(i, {
                id: record.sp,
                npp: record.npp,
                cname: record.cname
            });
        }
    }
    //открытие диалога
    $("#pan-dialogDic").dialog({title: "Справочник", width: 400, height: 560, modal: true,
        buttons: [
            {text: "Выбрать", click: function () {
                    dialogDic.reload();
                }},
            {text: "Закрыть", click: function () {
                    $(this).dialog("close");
                }}]
    });
    //сохраним запись и закроем окно
    dialogDic.reload = function () {

        var rowid = $("#dialogDic").getGridParam('selrow');
        var record = $("#dialogDic").getRowData(rowid);
        //запишем выбранную запись в src
        sender.attr('sp', record.id);
        sender.val(mapDic2[record.id]);
        $('#pan-dialogDic').dialog('close');
    }
    $(window).bind('resize', function () {
        $('#dialogDic').setGridWidth($("#pan-dialogDic").width() - 4);
        $('#dialogDic').setGridHeight($("#pan-dialogDic").height() - 26);
    }).trigger('resize');
}

//Диалоговое окно справочников 
dialog.open_tree = function () {
    alert("111");
}

//Диалог контекстного меню
dialog.open_submenu = function (selector1, selector2) {
    var contextMenu = $(selector1).jqxMenu({width: '200px', height: '60px', autoOpenPopup: false, mode: 'popup'});
    $(selector2).bind('mousedown', function (event) {
        var rightClick = isRightClick(event);
        if (rightClick) {
            var scrollTop = $(window).scrollTop();
            var scrollLeft = $(window).scrollLeft();
            contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
            return false;
        }
    });
    $(document).bind('contextmenu', function (e) {
        return false;
    });
    function isRightClick(event) {
        var rightclick;
        if (!event)
            var event = window.event;
        if (event.which)
            rightclick = (event.which == 3);
        else if (event.button)
            rightclick = (event.button == 2);
        return rightclick;
    }
}