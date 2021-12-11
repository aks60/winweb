var plugin;
var http = create_object();
var err = [];
err[-1] = 'USB-токен не найден';
err[-2] = 'USB-токен не залогинен пользователем';
err[-3] = 'PIN-код не верен';
err[-4] = 'PIN-код не корректен';
err[-5] = 'PIN-код заблокирован';
err[-6] = 'Неправильная длина PIN-кода';
err[-7] = 'Отказ от ввода PIN-кода';
err[-10] = 'Неправильные аргументы функции';
err[-11] = 'Неправильная длина аргументов функции';
err[-12] = 'Открыто другое окно ввода PIN-кода';
err[-20] = 'Контейнер не найден';
err[-21] = 'Контейнер уже существует';
err[-22] = 'Контейнер поврежден';
err[-30] = 'ЭЦП не верна';
err[-40] = 'Не хватает свободной памяти чтобы завершить операцию';
err[-50] = 'Библиотека не загружена';
err[-51] = 'Библиотека находится в неинициализированном состоянии';
err[-52] = 'Библиотека не поддерживает расширенный интерфейс';
err[-53] = 'Ошибка в библиотеке rtpkcs11ecp';

//проверка корректности ввода учётной записи
function chk_login() {

    var att = [$('#pan2 .login:first').val(), $('#pan2 .password').val(), $('#pan2 .login:last').val()];
    var mes = ['Не введён логин администратора', 'Не введён пароль адмистратора', 'Не введён логин пользователя'];
    for (var i = 0; i < 3; i++) {
        if (att[i] == '') {
            alert(mes[i]);
            return;
        }
    }
    var login = att[2];
    var re = /^[a-zA-Z0-9]+$/;
    if (!re.test(login)) {
        alert('Логин может состоять только из букв английского алфавита и цифр');
        return false;
    }
    if (login.length < 3 || login.length > 16) {
        alert('Логин должен быть не меньше 3-х и не больше 16 символов');
        return false;
    }
    //login = login + '-rono';
    $.ajax({
        url: 'admin?action=rtwEmptyLogin',
        data: {'admname': att[0], 'password': att[1], 'login': login},
        success: function (data) {
            if (data.login == 'false') {
                alert(data.mes);
            } else {
                new_openkey(login);
            }
        }
    });
}

//создание учётной записи логин-пароль пользователя на сервере
function new_login() {

    var att = [$('#pan1 .login:first').val(), $('#pan1 .password:first').val(), $('#pan1 .login:last').val(), $('#pan1 .password:last').val(), $('#pan1 .fio').val(), $('#pan1 .desc').val()];
    var mes = ['Не введён логин администратора', 'Не введён пароль администратора', 'Не введён логин пользователя', 'Не введён пароль пользователя'];
    //console.log(att);
    for (var i = 0; i < 4; i++) {
        if (att[i] == '') {
            alert(mes[i]);
            return;
        }
    }
    var login = [att[2], att[3]];
    var re = /^[a-zA-Z0-9]+$/;
    for (var i = 0; i < 2; i++) {
        if (!re.test(login[i])) {
            alert('Логин и пароль пользователя может состоять только из букв английского алфавита и цифр');
            return false;
        }
    }
    if (login[0].length < 3 || login[0].length > 16) {
        alert('Логин и пароль должен быть не меньше 3-х и не больше 16 символов');
        return false;
    }
    $.ajax({
        url: 'admin?action=newLogin',
        data: {'username': att[0], 'password': att[1], 'username2': att[2], 'password2': att[3], 'fio': att[4], 'desc': att[5], 'role': 'DIALER_RW'},
        success: function (data) {
            load_users();
        },
        error: function () {
            alert('Ошибка создания нового пользователя');
        }
    });
}

//удаление учётной записи логин-пароль пользователя на сервере
function delete_login() {
    var rowId = $('#table1').jqGrid('getGridParam', 'selrow');
    var id = $('#table1').jqGrid('getCell', rowId, 'id');
    $.ajax({
        url: 'admin?action=deleteLogin',
        data: {'userID': id},
        success: function (data) {
            if (data.result == 'false') {
                alert(data.mes);
            } else {
                new_openkey(login);
            }
        },
        error: function () {
            alert('Ошибка удаления пользователя');
        }
    });
}

//создание учётной записи пользователя на сервере
function new_openkey(login) {
    plugin = document.getElementById("cryptoPlugin");
    if (!plugin.valid) {
        alert('Не установлен плагин для работы с USB-токеном');
        return;
    }
    var result = plugin.rtwIsTokenPresentAndOK();
    if (result < 0) {
        alert(err[result]);
        return;
    }
    result = plugin.rtwGenKeyPair(login);
    if (result < 0) {
        alert(err[result]);
    } else {
        var role = null;
        var uch = null;
        var element = document.getElementById('combo').value;
        for (var index = 0; index < regionList.length; ++index) {
            var record = regionList[index].name
            if (element == record) {

                uch = regionList[index].uch
                if (regionList[index].id == 599999) {
                    role = 'DIALER_RW';
                } else {
                    role = 'DIALER_RW';
                }
            }
        }
        $.ajax({
            url: 'admin?action=newToken',
            data: {'login': login, 'openkey': result, 'role': role, 'uch': uch},
            success: function (data) {
                alert('Логин пользователя создан!');
            },
            error: function () {
                alert('Ошибка регистрации токена на сервере');
            }
        });
    }
}

//отправим учётку, получим случайное сообщение
function token_random() {
    var login = document.getElementById('token_login').value;
    if (login == "none") {
        alert("Выберите учетную запись на USB-токене.");
    } else {
        $.ajax({
            url: 'admin?action=rtwRandom',
            data: {'login': login},
            error: function () {
                alert("Ошибка на сервере");
            },
            success: function (data) {
                token_sign(data.random)
            }
        });
    }
}

//подписание сообщения сервера закрытым ключём токена
function token_sign(random) {
    plugin = document.getElementById("cryptoPlugin");
    if (!plugin.valid) {
        alert('Не установлен плагин для работы с USB-токеном');
        return;
    }
    var random_hash = Sha256.hash(random);
    var pin = document.getElementById('token_login').value;
    var sign = plugin.rtwSign(pin, random_hash);
    if (sign != -7 && sign != -12) {
        if (sign < 0) {
            alert(err[sign]);
        } else {
            $.ajax({
                url: 'admin?action=rtwConnect',
                data: {'sign': sign},
                error: function () {
                    alert("Ошибка на сервере");
                },
                success: function (data) {
                    alert(data.result);
                    //token_sign(data.re)
                }
            });
        }
    }
}

//удаление логина из токена
function delete_openkey() {
    plugin = document.getElementById("cryptoPlugin");
    if (!plugin.valid) {
        alert('Не установлен плагин для работы с USB-токеном');
        return;
    }
    ltlog = document.getElementById('token_login');
    res = plugin.rtwDestroyContainer(ltlog.value);
    if (res != -7 && res != -12) {
        if (res < 0) {
            alert(err[res]);
        } else {
            alert('Контейнер ' + ltlog.value + ' успешно удалён');
            token_refresh();
        }
    }
}

//подучение списка учёных записей токена
function token_refresh() {
    plugin = document.getElementById("cryptoPlugin");
    log_list = document.getElementById("token_login");
    for (var i = log_list.options.length - 1; i >= 0; i--) {
        log_list.remove(i);
    }
    if (!plugin.valid) {
        alert("Не установлен плагин для работы с USB-токеном");
        return;
    }
    var ret = plugin.rtwIsTokenPresentAndOK();
    if (ret == true) {
        count_cont = plugin.rtwGetNumberOfContainers();
        for (i = 0; i < count_cont; i++) {
            cont_name = plugin.rtwGetContainerName(i);
            add_item(log_list, cont_name.replace("#%#", " - "), cont_name, 0, 0);
        }
    } else {
        alert(err[ret]);
    }
}

function add_item(oListbox, text, value, isDefaultSelected, isSelected) {
    var oOption = document.createElement("option");
    oOption.appendChild(document.createTextNode(text));
    oOption.setAttribute("value", value);
    if (isDefaultSelected)
        oOption.defaultSelected = true;
    else if (isSelected)
        oOption.selected = true;
    oListbox.appendChild(oOption);
}

function create_object() {
    var request_type;
    var browser = navigator.appName;
    if (browser == "Microsoft Internet Explorer") {
        request_type = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        request_type = new XMLHttpRequest();
    }
    return request_type;
}