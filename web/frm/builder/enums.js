//------------------------------------------------------------------------------
load_enumtList = function () {  
    $.ajax({
        url: 'enum?action=enumList',
        success: function (data) {
            var UseSide = data.UseSide;  
        }
    });
}


