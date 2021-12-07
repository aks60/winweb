
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

    var att = [$('#pan2 .login:first').val(), $('#pan2 .password').val(), $('pan2 .login.last').val()];
    var mes = ['Не введён логин администратора', 'Не введён пароль адмистратора', 'Не введён логин пользователя'];
    console.log(att);
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
    login = login + '-rono';
    $.ajax({
        url: 'admin?action=rtwLogin',
        data: {'admname': att[0], 'password': att[1], 'login': login},
        success: function (data) {
            if (data.login == 'false') {
                alert(data.mes);
            } else {
                token_link(login);
            }
        }
    });
}

//авторизация через логин-пароль
function user_connect() {
debugger;
    var att = [$('#pan1 .login').val(), $('#pan1 .password').val()];
    var mes = ['Не введён логин пользователя', 'Не введён пароль пользователя'];
    //console.log(att);
    for (var i = 0; i < 2; i++) {
        if (att[i] == '') {
            alert(mes[i]);
            return;
        }
    }
    $.ajax({
        url: 'admin?action=userConnect',
        data: {'username': att[0], 'password': att[1]},
        success: function (data) {
            //debugger;
            if (data.result == 'true') {
                if (data.role == 'RDB$ADMIN') {
                    $("#outbody").load('view/users.jsp');
                } else {
                    $("#outbody").load('view/dealer.jsp');
                }
            } else {
                alert(data.result);
            }
        },
        error: function () {
            alert('Ошибка авторизации пользователя');
        }
    });
}

//отправим учётку, получим случайное сообщение
function token_connect() {
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
                    alert("Ошибка авторизации токена");
                },
                success: function (data) {
                    if (data.result == 'true') {
                        $('#mainmenu').show();
                        if (data.role == 'YO_HO1_RW' || data.role == 'YO_HO2_RW') {
                            $('.manager').show();
                        }
                        loadBody('view/patt/simpl3.jsp')
                    } else {
                        alert(data.result);
                    }
                }
            });
        }
    }
}

//получение списка учёных записей токена
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
        document.all.mesCell.innerHTML = '';
        count_cont = plugin.rtwGetNumberOfContainers();
        for (i = 0; i < count_cont; i++) {
            cont_name = plugin.rtwGetContainerName(i);
            add_item(log_list, cont_name.replace("#%#", " - "), cont_name, 0, 0);
        }
    } else {
        document.all.mesCell.innerHTML = err[ret];
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