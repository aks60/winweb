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
export function load_systreeList() {
  return  $.ajax({
        url: 'dbset?action=systreeList',
//        success: function (data) {
//            dbset.systreeList = data.systreeList;  
//            --login.que_requests;
//        }
    });
}
//------------------------  SYSPROD  -------------------------------------------
export function load_sysprodList() {
    return  $.ajax({
        url: 'dbset?action=sysprodList',
//        success: function (data) {
//            dbset.sysprodList = data.sysprodList; 
//            --login.que_requests;
//        }
    });
}
//-------------------------  COLOR  --------------------------------------------
export function load_colorList() {
    return  $.ajax({
        url: 'dbset?action=colorList',
//        success: function (data) {
//            dbset.colorList = data.colorList;
//            --login.que_requests;
//        }
    });
}
//--------------------------  ARTIKL  ------------------------------------------
export function load_artiklList() {
    return  $.ajax({
        url: 'dbset?action=artiklList',
//        success: function (data) {
//            dbset.artiklList = data.artiklList;
//            --login.que_requests;
//        }
    });
}
//---------------------------  ARTDET  -----------------------------------------
export function load_artdetList() {
    return  $.ajax({
        url: 'dbset?action=artdetList',
//        success: function (data) {
//            dbset.artdetList = data.artdetList; 
//            --login.que_requests;
//        }
    });
}
//---------------------------  PROPROD  ----------------------------------------
export function load_proprodList() {
    return  $.ajax({
        url: 'dbset?action=proprodList',
//        success: function (data) {
//            dbset.proprodList = data.proprodList;
//            --login.que_requests;
//        }
    });
}
//----------------------------  SYSFURN  ---------------------------------------
export function load_sysfurnList() {
    return  $.ajax({
        url: 'dbset?action=sysfurnList',
//        success: function (data) {
//            dbset.sysfurnList = data.sysfurnList;
//            --login.que_requests;
//        }
    });
}
//------------------------------------------------------------------------------
