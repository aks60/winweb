//------------------------------------------------------------------------------
export function load_colorList() {
    $.ajax({
        url: 'color?action=colorList',
        success: function (data) {
            dbset.colorList = data.colorList;
        }
    });
}
//------------------------------------------------------------------------------
export function load_productList() {
    $.ajax({
        url: 'prod?action=prodList',
        success: function (data) {
            dbset.productList = data.prodList;
        }
    });
}