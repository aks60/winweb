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

login.init_login = function (src) {
    --login.que_requests;
    if (login.que_requests == 0 && login.data != undefined) {
        if (login.data.result == 'true') {
            if (login.data.role == 'RDB$ADMIN') {
                $("#outbody").load('frm/users.jsp');
            } else {
                $("#mainmenu").load('frm/menu.jsp');
                $("#outbody").load('frm/order.jsp');
            }
        } else {
            login.que_requests = 1;
            dialogMes("Неудача", login.data.result, 168);
        }
    }
}

//авторизация через логин-пароль
login.user_connect = function () {
    var att = [$('#pan1 .login').val(), $('#pan1 .password').val()];
    var mes = ['Не введён логин пользователя', 'Не введён пароль пользователя'];
    for (let i = 0; i < 2; i++) {
        if (att[i] == '') {
            dialogMes("Ошибка", mes[i], 160);
            return;
        }
    }
    $.ajax({
        url: 'login?action=userConnect',
        data: {'username': att[0], 'password': att[1]},
        success: function (data) {
            login.data = data;
            login.init_login('log');
        },
        error: function () {
            dialogMes('Сообщение', 'Ошибка авторизации пользователя', 168);
        }
    });
}

//проверка корректности ввода учётной записи
login.token_check = function () {

    var att = [$('#pan2 .login:first').val(), $('#pan2 .password').val(), $('pan2 .login.last').val()];
    var mes = ['Не введён логин администратора', 'Не введён пароль адмистратора', 'Не введён логин пользователя'];
    console.log(att);
    for (let i = 0; i < 3; i++) {
        if (att[i] == '') {
            dialogMes('Сообщение', mes[i], 168);
            return;
        }
    }
    var login = att[2];
    var re = /^[a-zA-Z0-9]+$/;
    if (!re.test(login)) {
        dialogMes('Сообщение', 'Логин может состоять только из букв английского алфавита и цифр', 168);
        return false;
    }
    if (login.length < 3 || login.length > 16) {
        dialogMes('Сообщение', 'Логин должен быть не меньше 3-х и не больше 16 символов', 168);
        return false;
    }
    login = login + '-rono';
    $.ajax({
        url: 'login?action=rtwLogin',
        data: {'admname': att[0], 'password': att[1], 'login': login},
        success: function (data) {
            if (data.login == 'false') {
                dialogMes('Сообщение', data.mes, 168);
            } else {
                token_link(login);
            }
        }
    });
}

//отправим учётку, получим случайное сообщение
login.token_connect = function () {
    var login = document.getElementById('token_login').value;
    if (login == "none") {
        dialogMes('Сообщение', 'Выберите учетную запись на USB-токене.', 168);
    } else {
        $.ajax({
            url: 'login?action=rtwRandom',
            data: {'login': login},
            error: function () {
                dialogMes('Сообщение', 'Ошибка на сервере', 128);
            },
            success: function (data) {
                token_sign(data.random)
            }
        });
    }
}

//подписание сообщения сервера закрытым ключём токена
login.token_sign = function (random) {
    plugin = document.getElementById("cryptoPlugin");
    if (!plugin.valid) {
        dialogMes('Сообщение', 'Не установлен плагин для работы с USB-токеном', 168);
        return;
    }
    var random_hash = Sha256.hash(random);
    var pin = document.getElementById('token_login').value;
    var sign = plugin.rtwSign(pin, random_hash);
    if (sign != -7 && sign != -12) {
        if (sign < 0) {
            dialogMes('Сообщение', err[sign], 168);
        } else {
            $.ajax({
                url: 'login?action=rtwConnect',
                data: {'sign': sign},
                error: function () {
                    dialogMes('Сообщение', 'Ошибка авторизации токена', 168);
                },
                success: function (data) {
                    if (data.result == 'true') {
                        $('#mainmenu').show();
                        if (data.role == 'YO_HO1_RW' || data.role == 'YO_HO2_RW') {
                            $('.manager').show();
                        }
                        loadBody('frm/patt/simpl3.jsp')
                    } else {
                        dialogMes('Сообщение', data.result, 168);
                    }
                }
            });
        }
    }
}

//получение списка учёных записей токена
login.token_refresh = function () {
    plugin = document.getElementById("cryptoPlugin");
    log_list = document.getElementById("token_login");
    for (let i = log_list.options.length - 1; i >= 0; i--) {
        log_list.remove(i);
    }
    if (!plugin.valid) {
        dialogMes('Сообщение', 'Не установлен плагин для работы с USB-токеном', 168);
        return;
    }
    var ret = plugin.rtwIsTokenPresentAndOK();
    if (ret == true) {
        document.all.mesCell.innerHTML = '';
        count_cont = plugin.rtwGetNumberOfContainers();
        for (let i = 0; i < count_cont; i++) {
            cont_name = plugin.rtwGetContainerName(i);
            add_item(log_list, cont_name.replace("#%#", " - "), cont_name, 0, 0);
        }
    } else {
        document.all.mesCell.innerHTML = err[ret];
    }
}

login.add_item = function (oListbox, text, value, isDefaultSelected, isSelected) {
    var oOption = document.createElement("option");
    oOption.appendChild(document.createTextNode(text));
    oOption.setAttribute("value", value);
    if (isDefaultSelected)
        oOption.defaultSelected = true;
    else if (isSelected)
        oOption.selected = true;
    oListbox.appendChild(oOption);
}