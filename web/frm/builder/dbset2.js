//------------------------------------------------------------------------------
dbset.find_rec = function (id, ds) {
    for (let i = 0; i < ds.length; i++) {
        if (id == ds[i][0]) {
            return ds[i];
        }
    }
}
dbset.find2_rec = function (key, val, ds) {
    for (let i = 0; i < ds.length; i++) {
        if (val == ds[i][key]) {
            return ds[i];
        }
    }
}
dbset.find_list = function (id, ds, fk) {
    let list = new Array();
    for (let i = 0; i < ds.length; i++) {
        if (id == ds[i][fk]) {
            list.push(ds[i]);
        }
    }
    return list;
}
//------------------------  SYSTREE  -------------------------------------------
dbset.load_systreeList = function () {
    return $.ajax({
        url: 'dbset?action=systreeList'
//        success: function (data) {
//            --login.que2_requests;  
//        }
    });
}
//------------------------  SYSPROD  -------------------------------------------
dbset.load_sysprodList = function () {
    return  $.ajax({
        url: 'dbset?action=sysprodList'
//        success: function (data) {
//            --login.que2_requests; 
//        }
    });
}
//-------------------------  COLOR  --------------------------------------------
dbset.load_colorList = function () {
    $.ajax({
        url: 'dbset?action=colorList',
        success: function (data) {
            --login.que2_requests;
        }
    });
}
//--------------------------  ARTIKL  ------------------------------------------
dbset.load_artiklList = function () {
    $.ajax({
        url: 'dbset?action=artiklList',
        success: function (data) {
            --login.que2_requests;
        }
    });
}
//---------------------------  ARTDET  -----------------------------------------
dbset.load_artdetList = function () {
    $.ajax({
        url: 'dbset?action=artdetList',
        success: function (data) {
            --login.que2_requests;
        }
    });
}
//---------------------------  PROPROD  ----------------------------------------
dbset.load_proprodList = function () {
    $.ajax({
        url: 'dbset?action=proprodList',
        success: function (data) {
            --login.que2_requests;
        }
    });
}
//----------------------------  SYSFURN  ---------------------------------------
dbset.load_sysfurnList = function () {
    $.ajax({
        url: 'dbset?action=sysfurnList',
        success: function (data) {
            --login.que2_requests;
        }
    });
}
//------------------------------------------------------------------------------
