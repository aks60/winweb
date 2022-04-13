//------------------------------------------------------------------------------
function printScript(winc) {
    console.log(JSON.stringify(winc.root.obj, undefined, 4));
}
//------------------------------------------------------------------------------
function taqDeploy(selectors) {

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
function card_deploy2(taq, type) {
    let
            title2 = $(taq).attr('card_title'),
            width2 = $(taq).attr('card_width'),
            height2 = $(taq).attr('card_height');

    if (type == 'INS') {

        //focusObj.mapobj.beforeInsert(); //перед вставкой
        $.ajax({//получим ключь и образ строки с сервера
            url: 'dbset?action=genId',
            data: {param: focusObj.name_table.substr(5)},
            success: function (data) {
                let record = data.record[0];
                focusObj.mapobj.clear(); //очистим поля        
                focusObj.mapobj.prepareCard(type, record); //подготовка карты

                //Открытие диалога insert
                $(taq).dialog({title: title2, width: width2, height: height2, modal: true,
                    buttons: [
                        {text: "OK", click: function () {

                                focusObj.mapobj.prepareInsert(record); //подготовка записи
                                //Загрузим record данными из карточки
                                for (let field in focusObj.mapobj) {
                                    for (let field2 in record) {
                                        if (field == '_' + field2) {
                                            record[field2] = focusObj.mapobj[field2]
                                        }
                                    }
                                }
                                focusObj.mapobj.table.push(record); //добавим строку в data сервер
                                focusObj.mapobj.loadRecord(focusObj.mapobj.table.length - 1); //добавим строку в html таблицу
                                focusObj.mapobj.loadField(focusObj.name_table); //заполним поля обратно
                                $(this).dialog("close"); //закроем карточку
                                focusObj.mapobj.afterCard(type); //после закрытия карточки
                            }}
                    ],
                    resize: function (event, ui) {
                        resizes($(this).width());
                    }
                });
                resizes($(taq).dialog("option", "width") - 40);
            },
            error: function () {
                dialogMes("<p>Ошибка получения первичного ключа с сервера");
                return;
            }
        });

    } else if (type == 'UPD') {


        if (focusObj.mapobj.beforeUpdate() != undefined) { //перед изменениями
            return;
        }
        let rowid = $(focusObj.name_table).jqGrid('getGridParam', "selrow"); //если строка в таблице не выделена
        if (rowid == null) {
            return;
        }
        if (focusObj.mapobj.prepareCard(type) != undefined) { //подготовка карты
            return;
        }
        if (title2 == undefined) {
            title2 = "Карточка изменения текущей записи";
        }

        //открытие диалога update
        $(taq).dialog({title: title2, width: width2, height: height2, modal: true,
            buttons: [
                {text: "OK", click: function () {
                        focusObj.mapobj.saveLocal();
                        $(this).dialog("close");
                        if (focusObj.mapobj.afterCard(type) != undefined) { //после закрытия карточки
                            return;
                        }
                    }}
            ],
            resize: function (event, ui) {
                resizes($(this).width());
            }
        });
        resizes($(taq).dialog("option", "width") - 40);
    }

    function resizes(width) {
        $(taq + " .field2[dx]").each(function (index) {
            let width2 = $(this).attr('dx');
            $(this).width((width - width2 - 20) + 'px');
        });
    }
}
//------------------------------------------------------------------------------
function load_tabs(selector, record, fields) {

    for (let field of fields) {
        let value = record[field];
        $("#" + field).val(value);
    }
}
//------------------------------------------------------------------------------
function formatDate2(d) {

    let dd = d.getDate();
    let mm = d.getMonth() + 1;
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

    $("#btnOrder1").button({icons: {primary: "ui-icon-plus"}});
    $("#btnOrder2").button({icons: {primary: "ui-icon-pencil"}});
    $("#btnOrder3").button({icons: {primary: "ui-icon-trash"}});
    $("#btnProd1").button({icons: {primary: "ui-icon-plus"}});
    $("#btnProd3").button({icons: {primary: "ui-icon-trash"}});
    $("#btnKit1").button({icons: {primary: "ui-icon-plus"}});
    $("#btnKit2").button({icons: {primary: "ui-icon-plus"}});
    $("#btnKit3").button({icons: {primary: "ui-icon-pencil"}});
    $("#btnKit4").button({icons: {primary: "ui-icon-trash"}});
    $("#btnResiz").button({icons: {primary: "ui-icon-arrow-4-diag"}});
    //$("#menu").menu({items: "> :not(.ui-widget-header)"});
    //$("#tab-1").button({icons: {primary: "ui-icon-star"}});
    //$("#tab-2").button({icons: {primary: "ui-icon-star"}});
    //$("#tab-3").button({icons: {primary: "ui-icon-star"}});
}
//------------------------------------------------------------------------------
//Диалог окна  сообщений
function dialogSec(mes) {
    $("#dialog-mes").html(mes);
    $("#dialog-mes").dialog({
        modal: true
    });
    setTimeout("$('#dialog-mes').dialog('close');", 600);
}
//------------------------------------------------------------------------------
//Диалог окна  сообщений
function dialogMes(title, mes) {
    $("#dialog-mes").html("<p>" + mes);
    $("#dialog-mes").dialog({
        modal: true,
        height: "auto",
        title: title,
        buttons: [{
                text: "Ok", icon: "ui-icon-close",
                click: function () {
                    $(this).dialog("close");
                }}]});
}
//------------------------------------------------------------------------------
//Диалог окна прогрес сохранения
//TODO доработать прогресс
function dialogPrg2() {

    $("#dialog-mes").html("run " + " <div id='progressbar'><div class='progress-label'> Выполнение...</div></div>");
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
        let val = this.pgbar.progressbar("value") || 0;
        this.pgbar.progressbar("value", val + 2);

        if (val < 99) {
            setTimeout(foo_catch, 2000);
        } else {
            $('#dialog-mes').dialog('close');
        }
    }
}
//------------------------------------------------------------------------------
//Прогресс бар
function dialogPrg(mes) {
    $("#dialog-mes").html(mes + " <div id='progressbar'><div class='progress-label'> Выполнение...</div></div>");
    $("#dialog-mes").dialog({
        modal: true
    });
    $(function () {
        let pgbar = $("#progressbar"), pglab = $(".progress-label");

        pgbar.progressbar({
            value: false,
            change: function () {
                pglab.text(pgbar.progressbar("value") + "%");
            }
        });
        function progress() {
            let val = pgbar.progressbar("value") || 0;
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
function createVirtueRec(size, data) {
    let arr = new Array(size);
    for (let k in data)
        arr[k] = data[k];
    return arr;
}
//------------------------------------------------------------------------------            
function findef(find, def) {
    let ret = find;
    if (ret != undefined) {
        return ret;
    } else {
        if (def.virtualRec != undefined) {
            return def.virtualRec;
        } else {
            return new Array(def[0].length);
        }
    }
}
//------------------------------------------------------------------------------    
function getSelectedRow(table) {
    let rowid = table.jqGrid('getGridParam', "selrow");
    return (rowid) ? table.jqGrid('getRowData', rowid) : null;
}
//------------------------------------------------------------------------------            
