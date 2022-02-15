//------------------------------------------------------------------------------
function taq_deploy(selectors) {

    let mapobj = this;
    for (let selector of selectors) {

        $(selector + ' jst').each(function (index, elem) {

            let  width = $(elem).attr('width'), width2 = $(elem).attr('width2'),
                    label = $(elem).attr('label'), num = $(elem).attr('id'), type = $(elem).attr('type');
            if (typeof (num) == 'undefined') {
                console.log("НЕУДАЧА! поле = " + $(elem).html());
            } else {
                if ($(elem).attr('nul') == '*') {
                    label = label + "<span class='nul'>*</span>";
                }
                if (type == 'ref') {
                    $(elem).replaceWith("<input id='" + num + "' class='field' type='text' style='width: 40px; display: none;'>");

                } else if (type == 'txt') {
                    let height = +$(elem).attr('height');
                    let dx = (width2 == null) ? " dx='" + (+$(elem).attr('dx') + 14) + "'" : "";
                    let readonly = ($(elem).attr('nul') == 'r') ? 'readonly' : '';
                    $(elem).replaceWith("<p class='field' style='width: " + width + "px; height: " + height + "px;'>" + label
                            + "</p><input id='" + num + "' class='field' type='text' " + dx + " style='width: " + width2 + "px; height: " + height + "px;' " + readonly + ">");

                } else if (type == 'btn') {
                    let dx = (width2 == null) ? " dx='" + (+$(elem).attr('dx') + 42) + "'" : "";
                    let src = $(elem).attr('click');
                    let readonly = ($(elem).attr('nul') == 'w') ? '' : 'readonly';
                    $(elem).replaceWith("<p class='field' style='width: " + width + "px;'>" + label + "</p>"
                            + "<input id='" + num + "' class='field' type='text' " + dx + " style='width: " + width2 + "px;' sp='' " + readonly + ">"
                            + "<input class='field' type='button' style='height: 18px;' value='---' onclick=\" " + src + " \">");

                } else if (type == 'btn2') { //background: #eee
                    let dx = (width2 == null) ? " dx='" + (+$(elem).attr('dx') + 16) + "'" : "";
                    let src = $(elem).attr('click');
                    let readonly = ($(elem).attr('nul') == 'w') ? '' : 'readonly';
                    $(elem).replaceWith("<p class='field' style='width: " + width + "px;'>" + label + "</p>"
                            + "<input id='" + num + "' class='field' type='text' " + dx + " style='width: " + width2 + "px;' sp='' " + readonly + ">");

                } else if (type == 'date') {
                    let src = $(elem).attr('click');
                    $(elem).replaceWith("<p class='field' style='width: " + width + "px;'>" + label + "</p>"
                            + "<input id='" + num + "' class='field' type='text' style='width: 80px;'>"
                            + "<input class='field' type='button' style='height: 18px;' value='---' onclick=\" " + src + " \">");

                } else if (type == 'area') {
                    let dx = (width2 == null) ? " dx='" + (+$(elem).attr('dx') + 8) + "'" : "";
                    let height = +$(elem).attr('height');
                    if (typeof (label) == 'undefined') {
                        $(elem).replaceWith("<div><textarea id='" + num + "' class='field' " + dx + " style='width: " + width2 + "px; height: " + height + "px;'></textarea></div>");
                    } else {
                        $(elem).replaceWith("<div><p class='field' style='width: " + width + "px; height: " + (height + 1) + "px;'>" + label
                                + "</p><textarea id='" + num + "' class='field' " + dx + " style='width: " + width2 + "px; height: " + height + "px;'></textarea></div>");
                    }
                }
            }
        });
    }
}

//------------------------------------------------------------------------------
function load_fields(selector, record, fields) {

    for (let field of fields) {
        let value = record[field];
        $("#" + field).val(value);
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
function prepareToolBar() {

    $("#btnIns").button({icons: {primary: "ui-icon-document"}});
    $("#btnUpdate").button({icons: {primary: "ui-icon-pencil"}});
    $("#btnSave").button({icons: {primary: "ui-icon-disk"}});
    $("#btnDelit").button({icons: {primary: "ui-icon-trash"}});
    $("#btnReport").button({icons: {primary: "ui-icon-print"}});
    $("#btnFind").button({icons: {primary: "ui-icon-search"}});
    $("#menu").menu({items: "> :not(.ui-widget-header)"});
}
//------------------------------------------------------------------------------
//диалог окна  сообщений
function dialogSec(mes) {
    $("#dialog-mes").html(mes);
    $("#dialog-mes").dialog({
        modal: true
    });
    setTimeout("$('#dialog-mes').dialog('close');", 600);
}
//------------------------------------------------------------------------------
//диалог окна  сообщений
function dialogMes(mes) {
    $("#dialog-mes").html(mes);
    $("#dialog-mes").dialog({
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });
}
//------------------------------------------------------------------------------
//диалог окна прогрес сохранения
//TODO доработать прогресс
function dialogPrg2() {

    $("#dialog-mes").html("AKS " + " <div id='progressbar'><div class='progress-label'> Выполнение...</div></div>");
    $("#dialog-mes").dialog({modal: true});
    this.pgbar = $("#progressbar");
    this.pglab = $(".progress-label");

    this.pgbar.progressbar({
        value: false,
        change: function () {
            $("this.pglab").text(this.pgbar.progressbar("value") + "%");
        },
        complete: function () {
            $("this.pglab").text("Complete!");
        }
    });
    this.progressloop();

    this.progressloop = function () {
        var val = this.pgbar.progressbar("value") || 0;
        this.pgbar.progressbar("value", val + 2);

        if (val < 99) {
            setTimeout(foo_catch, 2000);
        } else {
            $('#dialog-mes').dialog('close');
        }
    }
}
//------------------------------------------------------------------------------
//прогресс бар
function dialogPrg(mes) {
    $("#dialog-mes").html(mes + " <div id='progressbar'><div class='progress-label'> Выполнение...</div></div>");
    $("#dialog-mes").dialog({
        modal: true
    });
    $(function () {
        var pgbar = $("#progressbar"), pglab = $(".progress-label");

        pgbar.progressbar({
            value: false,
            change: function () {
                pglab.text(pgbar.progressbar("value") + "%");
            }
        });
        function progress() {
            var val = pgbar.progressbar("value") || 0;
            pgbar.progressbar("value", val + 4);

            if (val < 99) {
                setTimeout(progress, 0);
            }
        }
        progress();
    });
    setTimeout("$('#dialog-mes').dialog('close');", 2600);
}
//------------------------------------------------------------------------------
//1;79-10;0-10 => [1,1,79,10,0,10]
function  parserInt(txt) {
    if (txt == undefined || txt == null) {
        return [];
    }
    let arrList = new Array();
    txt = (txt[txt.length - 1] == '@') ? txt.slice(0, txt.length() - 1) : txt;
    let arr = txt.split(";");
    if (arr.length == 1) {
        arr = arr[0].split("-");
        if (arr.length == 1) {
            arrList.push(arr[0]);
            arrList.push(arr[0]);
        } else {
            arrList.push(arr[0]);
            arrList.push(arr[1]);
        }
    } else {
        for (let index = 0; index < arr.length; index++) {
            let arr2 = arr[index].split("-");
            if (arr2.length == 1) {
                arrList.push(arr2[0]);
                arrList.push(arr2[0]);
            } else {
                arrList.push(arr2[0]);
                arrList.push(arr2[1]);
            }
        }
    }
    return arrList;
}
//------------------------------------------------------------------------------     
 function isEmpty(v) {
     
        if (v === "" || v === undefined || v === null)
            return undefined;
        else {
            if (typeof v === 'object' && Object.keys(v).length === 0)
                return undefined;
            else
                return v;
        }
    }       
//------------------------------------------------------------------------------            
