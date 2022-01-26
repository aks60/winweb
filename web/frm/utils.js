//------------------------------------------------------------------------------
function taq_deploy(_selectorHtml) {

    let mapobj = this;
    for (let index = 0; index < _selectorHtml.length; ++index) {

        let selectorHtml = _selectorHtml[index];
        $(selectorHtml + ' div2.tag2').each(function (index, elem) {

            let  width = $(elem).attr('width'), wid1h = $(elem).attr('wid1h'),
                    label = $(elem).attr('label'), name2 = $(elem).attr('name2'), type2 = $(elem).attr('type');

            if (typeof (name2) == 'undefined') {
                console.log("НЕУДАЧА! поле = " + $(elem).html());
            } else {
                if ($(elem).attr('nul') == '*') {
                    label = label + "<span class='nul'>*</span>";
                }
                if (type2 == 'ref') {
                    $(elem).replaceWith("<input class='field2' type='text' name2='" + name2 + "' style='width: 40px; display: none;'>");

                } else if (type2 == 'txt') {
                    let height = +$(elem).attr('height');
                    let dx = (wid1h == null) ? " dx='" + (+$(elem).attr('dx') + 14) + "'" : "";
                    let readonly = ($(elem).attr('nul') == 'r') ? 'readonly' : '';
                    $(elem).replaceWith("<p class='field2' style='width: " + width + "px; height: " + height + "px;'>" + label
                            + "</p><input class='field2' type='text' " + dx + " name2='" + name2 + "' style='width: " + wid1h + "px; height: " + height + "px;' " + readonly + ">");

                } else if (type2 == 'btn') {
                    let dx = (wid1h == null) ? " dx='" + (+$(elem).attr('dx') + 42) + "'" : "";
                    let src = $(elem).attr('click');
                    let readonly = ($(elem).attr('nul') == 'w') ? '' : 'readonly';
                    $(elem).replaceWith("<p class='field2' style='width: " + width + "px;'>" + label + "</p>"
                            + "<input class='field2' type='text' " + dx + " name2='" + name2 + "' style='width: " + wid1h + "px;' sp='' " + readonly + ">"
                            + "<input class='field2' type='button' style='height: 18px;' value='---' onclick=\" " + src + " \">");

                } else if (type2 == 'btn2') { //background: #eee
                    let dx = (wid1h == null) ? " dx='" + (+$(elem).attr('dx') + 16) + "'" : "";
                    let src = $(elem).attr('click');
                    let readonly = ($(elem).attr('nul') == 'w') ? '' : 'readonly';
                    $(elem).replaceWith("<p class='field2' style='width: " + width + "px;'>" + label + "</p>"
                            + "<input class='field2' type='text' " + dx + " name2='" + name2 + "' style='width: " + wid1h + "px;' sp='' " + readonly + ">");

                } else if (type2 == 'date') {
                    let src = $(elem).attr('click');
                    $(elem).replaceWith("<p class='field2' style='width: " + width + "px;'>" + label + "</p>"
                            + "<input class='field2' type='text' name2='" + name2 + "' style='width: 80px;'>"
                            + "<input class='field2' type='button' style='height: 18px;' value='---' onclick=\" " + src + " \">");

                } else if (type2 == 'area') {
                    let dx = (wid1h == null) ? " dx='" + (+$(elem).attr('dx') + 8) + "'" : "";
                    let height = +$(elem).attr('height');
                    if (typeof (label) == 'undefined') {
                        $(elem).replaceWith("<div><textarea class='field2' " + dx + " name2='" + name2 + "' style='width: " + wid1h + "px; height: " + height + "px;'></textarea></div>");
                    } else {
                        $(elem).replaceWith("<div><p class='field2' style='width: " + width + "px; height: " + (height + 1) + "px;'>" + label
                                + "</p><textarea class='field2' " + dx + " name2='" + name2 + "' style='width: " + wid1h + "px; height: " + height + "px;'></textarea></div>");
                    }
                }
            }
        });
    }
}

//------------------------------------------------------------------------------
//маппинг карточки ввода
var focusObj = {
    mapobj: {}, wrap_table: '', history_table: [], card_table: '', name_table: '',
    click: function (event) {
        //запишем объект карточки ввода
        focusObj.mapobj = (event.data) ? event.data['mapobj'] : null;
        //запишем селектора текущего выделения объекта html
        focusObj.wrap_table = '#' + event.currentTarget.id;
        focusObj.card_table = '#card' + event.currentTarget.id.substring(4);
        focusObj.name_table = '#tab' + event.currentTarget.id.substring(4);
        for (var i = 0; i < focusObj.history_table.length; i++) {
            //снимем все выделения бордер
            $(focusObj.history_table[i]).css('outline', '0');
        }
        //запишем бордер текушего выделения
        $(focusObj.wrap_table).css('outline', '1px solid #00f');
        //проверим историю
        for (var i = 0; i < focusObj.history_table.length; i++) {
            if (focusObj.history_table[i] == focusObj.wrap_table)
                return;
        }
        //если в истории нет, запишем в историю
        focusObj.history_table.push(focusObj.wrap_table);
        return this;
    },
    fire: function (mapobj) {
        //запишем объект карточки ввода
        focusObj.mapobj = mapobj;
        if (mapobj != null) {
            //запишем селектора текущего выделения объекта html
            focusObj.wrap_table = mapobj.wrap_table;
            focusObj.card_table = mapobj.card_table;
            focusObj.name_table = mapobj.name_table;
        }
        return this;
    }
}

//------------------------------------------------------------------------------
function formatDate2(d) {
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    return dd + '.' + mm + '.' + d.getFullYear();
}
//------------------------------------------------------------------------------
