//------------------------------------------------------------------------------
dbset.load_colorList = function () {
    $.ajax({
        url: 'color?action=colorList',
        success: function (data) {
            dbset.colorList = data.colorList;
        }
    });
};

dbset.find_colorRec = function (id) {
    for (i = 0; i < dbset.colorList.length; i++) {
        if (id == dbset.colorList[i].id) {
            return dbset.colorList[i];
        }
    }
}

dbset.find_colorList = function (colgrp_id) {
    let list = new Array();
    for (i = 0; i < dbset.colorList.length; i++) {
        if (colgrp_id == dbset.colorList[i].colgrp_id) {
            list.push(dbset.colorList[i]);
        }
    }
    return list;
}
//------------------------------------------------------------------------------
dbset.load_productList = function () {  
    $.ajax({
        url: 'prod?action=prodList',
        success: function (data) {
            dbset.productList = data.prodList;  
            debugger;
        }
    });
}
//------------------------------------------------------------------------------
