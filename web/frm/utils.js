//------------------------------------------------------------------------------
//создание объекта маппинга 
utils.init_obj = function (selector_table) {

    Object.defineProperties(this, {
        //данные дата сервер
        table: {value: {}, enumerable: false, writable: true},
        //имя таблицы
        name_table: {value: selector_table, enumerable: false, writable: true},
        //имя враппера
        wrap_table: {value: '#wrap' + selector_table.substring(4), enumerable: false, writable: true},
        //имя карточки ввода
        card_table: {value: '#card' + selector_table.substring(4), enumerable: false, writable: true},
        //маппинг объектов html сраницы
        map: {value: function (_selectorHtml) {
                var mapobj = this;
                var arg = arguments.length;
                for (let index = 0; index < _selectorHtml.length; ++index) {
                    var selectorHtml = _selectorHtml[index];
                    $(selectorHtml + ' div2.tag2').each(function (indx, elem) {
                        var
                                width = $(this).attr('width'),
                                size2 = $(this).attr('size'),
                                label = $(this).attr('label'),
                                name2 = $(this).attr('name2'),
                                type2 = $(this).attr('type'),
                                key2 = mapobj.name_table.substr(1) + name2;

                        if (typeof (name2) == 'undefined') {
                            console.log("НЕУДАЧА! поле = " + $(this).html());
                        } else {
                            if ($(this).attr('nul') == '*') {
                                label = label + "<span class='nul'>*</span>";
                            }
                            if (type2 == 'ref') {
                                $(this).replaceWith("<input class='field2' type='text' name2='" + name2 + "' style='width: 40px; display: none;'>");

                            } else if (type2 == 'txt') {
                                var height = +$(this).attr('height');
                                var dx = (size2 == null) ? " dx='" + (+$(this).attr('dx') + 14) + "'" : "";
                                var readonly = ($(this).attr('nul') == 'r') ? 'readonly' : '';
                                $(this).replaceWith("<p class='field2' style='width: " + width + "px; height: " + height + "px;'>" + label
                                        + "</p><input class='field2' type='text' " + dx + "name2='" + name2 + "' style='width: " + size2 + "; height: " + height + "px;' " + readonly + ">");

                            } else if (type2 == 'btn') {
                                var dx = (size2 == null) ? " dx='" + (+$(this).attr('dx') + 42) + "'" : "";
                                var src = $(this).attr('click');
                                var readonly = ($(this).attr('nul') == 'w') ? '' : 'readonly';
                                $(this).replaceWith("<p class='field2' style='width: " + width + "px;'>" + label + "</p>"
                                        + "<input class='field2' type='text' " + dx + " name2='" + name2 + "' style='width: " + size2 + ";' sp='' " + readonly + ">"
                                        + "<input class='field2' type='button' style='height: 18px;' value='---' onclick=\" " + src + " \">");

                            } else if (type2 == 'btn2') { //background: #eee
                                var dx = (size2 == null) ? " dx='" + (+$(this).attr('dx') + 16) + "'" : "";
                                var src = $(this).attr('click');
                                var readonly = ($(this).attr('nul') == 'w') ? '' : 'readonly';
                                $(this).replaceWith("<p class='field2' style='width: " + width + "px;'>" + label + "</p>"
                                        + "<input class='field2' type='text' " + dx + " name2='" + name2 + "' style='width: " + size2 + ";' sp='' " + readonly + ">");
                            } else if (type2 == 'date') {
                                var src = $(this).attr('click');
                                $(this).replaceWith("<p class='field2' style='width: " + width + "px;'>" + label + "</p>"
                                        + "<input class='field2' type='text' name2='" + name2 + "' style='width: 80px;'>"
                                        + "<input class='field2' type='button' style='height: 18px;' value='---' onclick=\" " + src + " \">");

                            } else if (type2 == 'date2') {
                                var src = $(this).attr('click');
                                $(this).replaceWith("<p class='field2' style='width: " + width + "px;'>" + label + "</p>"
                                        + "<input id='" + key2 + "' class='field2' type='text' name2='" + name2 + "' style='width: 80px;'>");
                                $('#' + key2).datepicker({changeMonth: true, changeYear: true});

                            } else if (type2 == 'area') {
                                var dx = (size2 == null) ? " dx='" + (+$(this).attr('dx') + 8) + "'" : "";
                                var height = +$(this).attr('height');
                                if (typeof (label) == 'undefined') {
                                    $(this).replaceWith("<div><textarea class='field2' " + dx + " name2='" + name2 + "' style='width: " + size2 + "; height: " + height + "px;'></textarea></div>");
                                } else {
                                    $(this).replaceWith("<div><p class='field2' style='width: " + width + "px; height: " + (height + 1) + "px;'>" + label
                                            + "</p><textarea class='field2' " + dx + " name2='" + name2 + "' style='width: " + size2 + "; height: " + height + "px;'></textarea></div>");
                                }
                            }

                            //запишем селектор на компонент в html
                            mapobj['_' + name2] = {'selector': selectorHtml + " .field2[name2 = '" + name2 + "']"};
                            //теперь get-set
                            Object.defineProperty(mapobj, name2, {
                                get: function () {
                                    var ret = $(mapobj['_' + name2]['selector']).val();
                                    var dict = mapobj['_' + name2]['dict']
                                    if (typeof (dict) == 'undefined') {
                                        //если нет справочника   
                                        return (ret == '') ? null : ret;
                                    } else { //тогда это ссылка на спрвочник
                                        return (ret == '') ? null : $(mapobj['_' + name2]['selector']).attr('sp');
                                    }
                                },
                                set: function (v) {
                                    var dict = mapobj['_' + name2]['dict']
                                    if (typeof (dict) == 'undefined') {
                                        //если нет справочника
                                        $(mapobj['_' + name2]['selector']).val(v);
                                    } else { //тогда это ссылка на спрвочник
                                        var v2 = (v != null) ? dict[v] : v;
                                        $(mapobj['_' + name2]['selector']).attr('sp', v);
                                        $(mapobj['_' + name2]['selector']).val(v2);
                                    }
                                },
                                configurable: false
                            });
                        }
                    });
                }
            }, enumerable: false, configurable: true},
        //установить ссылку на справочник
        link: {
            value: function (fields) {
                for (let key in fields) {
                    if (this['_' + key]) {
                        this['_' + key]['dict'] = fields[key];
                    } else {
                        alert("Неудача link на " + key);
                    }
                }
            }, enumerable: false, configurable: true
        },
        //очистка html
        clear: {
            value: function () {
                for (let key in this) {
                    this[key.substring(1, key.length)] = null;
                }
            }, enumerable: false, configurable: true
        },
        //загрузка данных в теги html страницы
        loadField: {
            value: function () {
                var record2 = this.table[0];
                if (this.name_table.substr(0, 4) != '#nul') {
                    //найдём выделенную запись в таблице html
                    var rowid = $(this.name_table).getGridParam('selrow');
                    var record = $(this.name_table).getRowData(rowid);
                    //найдём запись в data сервер
                    for (let index = 0; index < this.table.length; ++index) {
                        record2 = this.table[index];
                        if (record.id == record2.id) {
                            //запишем value через set() в компонент html
                            for (let field in this) {
                                for (let field2 in record2) {
                                    //если ключи совпали
                                    if (field == '_' + field2) {
                                        this[field2] = record2[field2];
                                    }
                                }
                            }
                            return;
                        }
                    }
                }
            }, enumerable: false, configurable: true
        },
        //загрузка данных в строку html таблицы
        loadRecord: {
            value: function (indexData, indexTable) {
                var obj = {};
                for (let key in this.table[indexData]) {
                    var dict = (this['_' + key]) ? this['_' + key]['dict'] : undefined;
                    if (typeof (dict) == 'undefined') {
                        obj[key] = this.table[indexData][key];
                    } else {
                        obj[key] = dict[this.table[indexData][key]];
                    }
                }
                $(this.name_table).jqGrid('addRowData', indexTable, obj);
            }, enumerable: false, configurable: true
        },
        //локальное сохранение строки html таблицы и html тегов полей в data сервер
        saveLocal: {
            value: function () {
                var record = this.table[0];
                if (this.name_table.substr(0, 4) != '#nul') {
                    //найдём выделенную запись в таблице html страницы
                    var rowid = $(this.name_table).getGridParam('selrow');
                    record = $(this.name_table).getRowData(rowid);
                }
                //найдём запись в data сервер
                for (let index2 = 0; index2 < this.table.length; ++index2) {
                    var record2 = this.table[index2];
                    if (record.id == record2.id) {
                        //цыкл по полям field2[name2]
                        for (let field in this) {
                            //цыкл по полям data сервер
                            for (let field2 in record2) {
                                //если поля совпали
                                if (field == '_' + field2) {
                                    //если были изменения данных в field2[name2]
                                    if (this[field2] != record2[field2]) {
                                        //перезапишем дата сервер
                                        record2['up'] = (record2['up'] == 'SEL') ? 'UPD' : record2['up'];
                                        record2[field2] = this[field2];
                                        //если field2[name2] из карточки ввода есть в таблице, 
                                        //перезапишем значения в самой таблице
                                        if (this.name_table.substr(0, 4) != '#nul') {
                                            if (field2 in record) {
                                                if ('dict' in this[field]) {
                                                    $(this.name_table).jqGrid('setCell', rowid, field2, this[field]['dict'][this[field2]]);
                                                } else {
                                                    $(this.name_table).jqGrid('setCell', rowid, field2, this[field2]);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }, enumerable: false, configurable: true
        }
    });
    //перед вставкой
    this.beforeInsert = function () {
        //console.log('event -> prepareInsert()');
    }
    //перед вставкой
    this.beforeUpdate = function () {
        //console.log('event -> prepareInsert()');
    }
    //перед удалением записи
    this.beforeDelete = function () {
        //console.log('event -> beforeDelete()');
    }
    //перед вставкой
    this.prepareInsert = function (record) {
        //console.log('event -> prepareInsert()');
    }
    //подготовка карты
    this.prepareCard = function (type, record) {
        //console.log('event -> prepareCard()');
    }
    //после нажатия выбрать
    this.afterCard = function (type) {
        //console.log('event -> afterCard()');
    }
    //после сохранения на сервере
    this.afterSave = function (record) {
        //console.log('event -> afterSave()');
    }
    //после удаления записи
    this.afterDelete = function (record) {
        //console.log('event -> afterDelete()');
    }
    //статическая функция сохранение на сервере data сервер
    mapobj.saveServer = function (objList, url_path) {
        var data = {};
        objList.forEach(function (objItem) {
            var name_table = objItem.name_table.substr(5);
            data[name_table] = []; //объект для отправки на сервер
            //заполним объект дата если были изменения
            objItem.saveLocal();
            for (let index = 0; index < objItem.table.length; ++index) {
                if (objItem.table[index].up != 'SEL') {
                    data[name_table].push(objItem.table[index]);
                }
            }
        });
        var counter = 0;
        for (let key in data) {
            for (let index = 0; index < data[key].length; ++index) {
                counter++;
            }
        }
        if (counter == 0) {
            dialogSec("<p>Изменений данных не было");
        } else {
            $.ajax({
                url: url_path,
                data: {param: JSON.stringify(data)},
                success: function (data) {

                    if (data.result == 'ok') {
                        //запишем SEL
                        objList.forEach(function (item) {
                            for (let index = 0; index < item.table.length; ++index) {
                                item.table[index].up = 'SEL';
                            }
                        });
                        dialogPrg("<p>Данные успешно сохранены на сервере");
                        objList.forEach(function (item) {
                            //после сохранения записи
                            item.afterSave();
                        });
                    } else {
                        dialogMes('<p>' + data.result);
                    }
                },
                error: function () {
                    dialogMes("<p>Ошибка при сохранении данных на сервере");
                }
            });
        }
    }
    //статическая функция удаление выделенной записи
    mapobj.deleteRecord = function (objList, url_path) {
//TODO парамети objList теперь не нужен
        //перед удалением записи
        if (focusObj.mapobj.beforeDelete() != undefined) {
            return;
        }
        //найдём выделенную запись в таблице html
        var selectRowid = $(focusObj.name_table).getGridParam('selrow');
        var selectRecord = $(focusObj.name_table).getRowData(selectRowid);
        var focusTable = focusObj.mapobj.table;
        var data2 = {};
//        objList.forEach(function (item) {
//            var name_table = item.name_table.substr(5);
//            data2[name_table] = []; //объект для отправки на сервер
//        });
        //загрузим удаляемую запись
        for (let indexDel = 0; indexDel < focusTable.length; ++indexDel) {
            if (selectRecord.id == focusTable[indexDel].id) {

                if (confirm("Вы действительно хотите удалить текущую запись?")) {
                    focusTable[indexDel].up = 'DEL';
                    data2[focusObj.mapobj.name_table.substr(5)] = [focusTable[indexDel]];
                    $.ajax({
                        url: url_path,
                        data: {param: JSON.stringify(data2)},
                        success: function (data) {
                            if (data.result == 'ok') {

                                //удалим запись data server
                                focusTable.splice(indexDel, 1);

                                //после удаления записи
                                focusObj.mapobj.afterDelete(selectRecord);

                                dialogPrg("<p>Данные успешно удалены");
                            } else {
                                dialogMes('<p>' + data.result);
                            }
                        },
                        error: function () {
                            dialogMes("<p>Ошибка при удалении данных с сервера");
                        }
                    });
                    return;
                }
            }
        }
    }
}
//------------------------------------------------------------------------------
//маппинг карточки ввода
utils.focus_obj = {
    mapobj: {}, wrap_table: '', history_table: [], card_table: '', name_table: '',
    click: function (event) {
        //запишем объект карточки ввода
        focusObj.mapobj = (event.data) ? event.data['mapobj'] : null;
        //запишем селектора текущего выделения объекта html
        focusObj.wrap_table = '#' + event.currentTarget.id;
        focusObj.card_table = '#card' + event.currentTarget.id.substring(4);
        focusObj.name_table = '#tab' + event.currentTarget.id.substring(4);
        for (let i = 0; i < focusObj.history_table.length; i++) {
            //снимем все выделения бордер
            $(focusObj.history_table[i]).css('outline', '0');
        }
        //запишем бордер текушего выделения
        $(focusObj.wrap_table).css('outline', '1px solid #00f');
        //проверим историю
        for (let i = 0; i < focusObj.history_table.length; i++) {
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
//генератор ключей
utils.genId = function (name) {
    $.ajax({
        url: 'login?action=genId',
        data: {param: name},
        success: function (data) {
            alert(data.id);
        }
    });
}
//------------------------------------------------------------------------------
utils.format_date2 = function (d) {
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