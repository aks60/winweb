product.init_table1 = function (table) {
    $(function () {
        table.jqGrid({
            datatype: "local",
            //rownumbers: true,
            colNames: ['id', 'Наименование', 'Рисунок', 'project_id', 'systree_id'],
            colModel: [
                {name: 'id', hidden: true},
                {name: 'name', width: 120, sorttype: "text"},
                {name: 'scripl', width: 120, sorttype: "text"},
                {name: 'project_id', hidden: true},
                {name: 'systree_id', hidden: true}
            ]
        });
    });
}

product.load_table1 = function (table) {
//    //debugger;
//    let recno = 0;   
//    var j = 1;
//    table.jqGrid("clearGridData", true);
//    for (i = 0; i < order.prodList.length; i++) {
//        let tr = order.prodList[i];
//                        table.addRowData(++j, {
//                            //npp: spr.npp,
//                            //name: spr.name
//                        });          
////        console.log(tr);        
////        table.addRowData(++recno, {
////            id: tr[0],
////            name: tr[1],
////            script: tr[2],
////            project_id: tr[3],
////            systree_id: tr[4]
////        });
//    }
//    product.resize();
}


