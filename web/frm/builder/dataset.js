//------------------------------------------------------------------------------
dataset.load_colorList = function () {
    $.ajax({
        url: 'color?action=colorList',
        success: function (data) {
            //let data2 = JSON.parse(data.colorList);
            dataset.colorList = data.colorList;
        }
    });
};

dataset.find_colorRec = function (id) {
    for (i = 0; i < dataset.colorList.length; i++) {
        if (id == dataset.colorList[i].id) {
            return dataset.colorList[i];
        }
    }
}

dataset.find_colorList = function (colgrp_id) {
    let list = new Array();
    for (i = 0; i < dataset.colorList.length; i++) {
        if (colgrp_id == dataset.colorList[i].colgrp_id) {
            list.push(dataset.colorList[i]);
        }
    }
    return list;
}
//------------------------------------------------------------------------------
dataset.load_productList = function () {
    
    $.ajax({
        url: 'prod?action=prodList',
        success: function (data) {
//            debugger;
//            let data2 = JSON.parse(data.prodList);
//            dataset.productList = data2;
            
        }
    });
}
//------------------------------------------------------------------------------
