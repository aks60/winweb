//------------------------------------------------------------------------------
dbset.load_colorList = function () {
    $.ajax({
        url: 'color?action=colorList',
        success: function (data) {
            dbset.colorList = data.colorList;
        }
    });
};
dbset.find_colorRec = function (id) {
    for (i = 0; i < dbset.colorList.length; i++) {
        if (id == dbset.colorList[i].id) {
            return dbset.colorList[i];
        }
    }
}

dbset.find_colorList = function (colgrp_id) {
    let list = new Array();
    for (i = 0; i < dbset.colorList.length; i++) {
        if (colgrp_id == dbset.colorList[i].colgrp_id) {
            list.push(dbset.colorList[i]);
        }
    }
    return list;
}
//------------------------------------------------------------------------------
dbset.load_productList = function () {
    $.ajax({
        url: 'prod?action=prodList',
        success: function (data) {
            dbset.productList = data.prodList;
        }
    });
}
//------------------------------------------------------------------------------
dbset.load_test = function () {

    let response = fetch('../prod?action=prodList');
    if (response.ok == true) {
        let json = response.json();
        console.log(json);
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}
//------------------------------------------------------------------------------
dbset.load_test2 = async function () {
    try {
        let response = await fetch('prod?action=prodList');
        let users = await response.json();
        console.log(users);
    } catch (error) {
        alert(error);
    }
}
//------------------------------------------------------------------------------
dbset.load_test3 = function () {
    fetch('prod?action=prodList')
            .then(response => response.json())
            .then(data => {
                console.log(data) // Prints result from `response.json()` in getRequest
            })
            .catch(error => console.error(error))
}
//------------------------------------------------------------------------------
dbset.load_test4 = async function () {
    fetch('prod?action=prodList')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
            });
}
//------------------------------------------------------------------------------
dbset.load_test5 = async function () {
    const url = 'https://example.com/profile';
    const data = {username: 'example'};

    try {
        const response = await fetch(url, {
            method: 'POST', // или 'PUT'
            body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        console.log('Успех:', JSON.stringify(json));
    } catch (error) {
        console.error('Ошибка:', error);
    }
}