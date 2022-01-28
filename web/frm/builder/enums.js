//------------------------------------------------------------------------------
load_enumtList = function () {  
    $.ajax({
        url: 'enum?action=enumList',
        success: function (data) {
            var UseSide = data.UseSide;  
        }
    });
}
//var UseSide = {'ANY': -1, 'HORIZ': -2, 'VERT': -3, 'BOT': 1, 'RIGHT': 2, 'TOP': 3, 'LEFT': 4}; //сторона использования  


