<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>SYSTREE</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="js/systree.js"></script> 
    </head>
    <style type="text/css"> 
    </style>     
    <script type="text/javascript">
        $(document).ready(function () {
            $(window).bind('resize', function () {
                systree.resize();
            }).trigger('resize');

            $("#dialog").dialog({
                autoOpen: false, // Открывать ли окно сразу 
                width: 600,
                height: 600,
                modal: false,
                buttons: {
                    "Выбрать": function () {
                        $(this).dialog("close"); // Закрыть окно 
                    },
                    "Закрыть": function () {
                        $(this).dialog("close"); // Закрыть окно 
                    }
                }
            });
        });

        systree.resize = function () {
//            var height = window.innerHeight - 108;
//            $("#dialog").css("height", height);
            $("#table-tree").jqGrid('setGridWidth', $("#west").width());
            $("#table-tree").jqGrid('setGridHeight', $("#west").height() - 28);
            $("#table-grid").jqGrid('setGridWidth', $("#east").width());
            $("#table-grid").jqGrid('setGridHeight', $("#east").height() - 28);
        }
    </script> 
</head> 
<body> 
    <div id="dialog" title="Системы профилей" style="padding: 0"> 
        <div id="west" style="display: inline-block;  height: 99%; width: 48%">
            <table id="table-tree"  class="ui-jqgrid-btable"></table> 
            <script type="text/javascript">
                $("#table-tree").jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Категория'],
                    colModel: [{name: 'id', index: 'id', width: 1, hidden: true, key: true},
                        {name: 'name', index: 'cname', width: 180}],
                    gridview: true,
                    sortname: 'id',
                    treeGrid: true,
                    treeGridModel: 'adjacency',
                    ExpandColumn: 'name',
                    ExpandColClick: true,
                    onSelectRow: function (rowid) {
                        loadTable(rowid);
                    }
                });
            </script>
        </div>
        <div id="east" style="display: inline-block;  height: 99%; width: 49%">
            <table id="table-grid"  class="ui-jqgrid-btable"></table>
            <script type="text/javascript">
                $("#table-grid").jqGrid({
                    datatype: "local",
                    colNames: ['№пп', 'Наименование'],
                    colModel: [{name: 'npp', width: 40}, {name: 'name', width: 80}]
                });
            </script>  
        </div>
    </div> 
    <input type="button" value="Открыть окно" id="btnl" onclick="$('#dialog').dialog('open');" > 
</body> 
</html> 

