
dataset.load_color = function () {
    $.ajax({
        url: 'color?action=colorList',
        success: function (data) {
            dataset.colorList = data.colorList;
        }
    });
};
