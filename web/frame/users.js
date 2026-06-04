
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

export let users = {};

users.onpage = (val) => {
    $("#pan1, #pan2, #pan3, #pan4").hide();
    $("#pan" + val).show();
};

users.resize = () => {
    var height = window.innerHeight;
    $("#context").css("height", height - 54);
    $(users.table1).jqGrid('setGridWidth', $("#centr").width() - 4);
    $(users.table1).jqGrid('setGridHeight', $("#centr").height() - 28);
};

users.init_table1 = () => {
    $(users.table1).jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        rownumWidth: 20,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'ФИО', 'Описание', 'Логин', 'Роль'],
        colModel: [
            {name: 'ID', hidden: true},
            {name: 'fio', width: 98, sorttype: "text"},
            {name: 'desc', width: 200, sorttype: "text"},
            {name: 'login', width: 40, sorttype: "text"},
            {name: 'role', width: 40, sorttype: "text"},
        ],
        onSelectRow: function (rowid, status, e) {
            users.userRow = $(users.table1).jqGrid('getRowData', rowid);
            users.usersRec = eSysuser.list.find(rec => Number(users.userRow.ID) === rec[eSysuser.id]);
            $('#u13').val(users.userRow.fio);
            $('#u18').val(users.userRow.login);
        }
    });
};

users.load_table1 = () => {
    $(users.table1).jqGrid('clearGridData', true);
    for (let i = 0; i < eSysuser.list.length; i++) {
        let usersRec = eSysuser.list[i];
        $(users.table1).jqGrid('addRowData', i + 1, {
            ID: usersRec[eSysuser.id],
            fio: usersRec[eSysuser.fio],
            desc: usersRec[eSysuser.desc],
            login: usersRec[eSysuser.login],
            role: usersRec[eSysuser.role]
        });
        //u13 u18
    }
    users.resize();
};

//Создание учётной записи логин-пароль пользователя на сервере
users.logim_create = () => {

    var att = [$('#pan1 .login:first').val(), $('#pan1 .password:first').val(), $('#pan1 .login:last').val(), $('#pan1 .password:last').val(), $('#pan1 .fio').val(), $('#pan1 .desc').val()];
    var mes = ['Не введён логин администратора', 'Не введён пароль администратора', 'Не введён логин пользователя', 'Не введён пароль пользователя'];
    for (let i = 0; i < 4; i++) {
        if (att[i] === '') {
            alert(mes[i]);
            return;
        }
    }
    var login = [att[2], att[3]];
    var re = /^[a-zA-Z0-9]+$/;
    for (let i = 0; i < 2; i++) {
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
        url: 'login?action=newLogin',
        data: {'username': att[0], 'password': att[1], 'username2': att[2], 'password2': att[3], 'fio': att[4], 'desc': att[5], 'role': 'DEALER_RW'},
        success: function (data) {
            debugger;
            if (data.result === 'ok') {
                eSysuser.list.push(data.sysuserRec);
                $('#pan1 .login:first').val('');
                $('#pan1 .password:first').val('');
                $('#pan1 .login:last').val('');
                $('#pan1 .password:last').val('');
                $('#pan1 .fio').val('');
                $('#pan1 .desc').val('');
                users.load_table1();
            }
        },
        error: function () {
            alert('Ошибка создания нового пользователя');
        }
    });
};

//Удаление учётной записи логин-пароль пользователя на сервере
users.login_delete = () => {
    debugger;
    let isDelete = confirm("Вы действительно хотите удалить текущую запись?");
    if (isDelete == true) {
        $.ajax({
            url: 'login?action=deleteLogin',
            data: {'userID': users.userRow.ID},
            success: function (data) {
                
                if (data.result === "true") {
                    for (let i = 0; i < eSysuser.list.length; i++) {
                        if (eSysuser.list[i][eSysuser.id] === Number(users.userRow.ID)) {
                            eSysuser.list.splice(i, 1);
                        }
                    }
                    users.load_table1();
                    
                } else {
                    alert(data.mes);
                }
            },
            error: function () {
                alert('Ошибка удаления пользователя');
            }
        });
    }
};

//Создание учётной записи пользователя на сервере
users.token_create = (login) => {
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
        for (let index = 0; index < regionList.length; ++index) {
            var record = regionList[index].name
            if (element == record) {

                uch = regionList[index].uch
                if (regionList[index].id == 599999) {
                    role = 'DEALER_RW';
                } else {
                    role = 'DEALER_RW';
                }
            }
        }
        $.ajax({
            url: 'login?action=newToken',
            data: {'login': login, 'openkey': result, 'role': role, 'uch': uch},
            success: function (data) {
                alert('Логин пользователя создан!');
            },
            error: function () {
                alert('Ошибка регистрации токена на сервере');
            }
        });
    }
};

//Проверка корректности ввода учётной записи
users.token_check = () => {

    var att = [$('#pan2 .login:first').val(), $('#pan2 .password').val(), $('#pan2 .login:last').val()];
    var mes = ['Не введён логин администратора', 'Не введён пароль адмистратора', 'Не введён логин пользователя'];
    for (let i = 0; i < 3; i++) {
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
        url: 'login?action=rtwEmptyLogin',
        data: {'admname': att[0], 'password': att[1], 'login': login},
        success: function (data) {
            if (data.login == 'false') {
                alert(data.mes);
            } else {
                new_openkey(login);
            }
        }
    });
};

//Отправим учётку, получим случайное сообщение
users.token_random = () => {
    var login = document.getElementById('token_login').value;
    if (login == "none") {
        alert("Выберите учетную запись на USB-токене.");
    } else {
        $.ajax({
            url: 'login?action=rtwRandom',
            data: {'login': login},
            error: function () {
                alert("Ошибка на сервере");
            },
            success: function (data) {
                token_sign(data.random)
            }
        });
    }
};

//Подписание сообщения сервера закрытым ключём токена
users.token_sign = (random) => {
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
                url: 'login?action=rtwConnect',
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
};

//Удаление логина из токена
users.token_delete = () => {
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
};

//Подучение списка учёных записей токена
users.token_refresh = () => {
    plugin = document.getElementById("cryptoPlugin");
    log_list = document.getElementById("token_login");
    for (let i = log_list.options.length - 1; i >= 0; i--) {
        log_list.remove(i);
    }
    if (!plugin.valid) {
        alert("Не установлен плагин для работы с USB-токеном");
        return;
    }
    var ret = plugin.rtwIsTokenPresentAndOK();
    if (ret == true) {
        count_cont = plugin.rtwGetNumberOfContainers();
        for (let i = 0; i < count_cont; i++) {
            cont_name = plugin.rtwGetContainerName(i);
            add_item(log_list, cont_name.replace("#%#", " - "), cont_name, 0, 0);
        }
    } else {
        alert(err[ret]);
    }
};

users.add_item = (oListbox, text, value, isDefaultSelected, isSelected) => {
    var oOption = document.createElement("option");
    oOption.appendChild(document.createTextNode(text));
    oOption.setAttribute("value", value);
    if (isDefaultSelected)
        oOption.defaultSelected = true;
    else if (isSelected)
        oOption.selected = true;
    oListbox.appendChild(oOption);
};