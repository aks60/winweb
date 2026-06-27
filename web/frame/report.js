import {project} from './project.js';
//import {nameObj} from './menu.jsp';
//import {nameJsp} from './menu.jsp';

export let state = {nameJsp: 'PROJECT'};

state.test = function () {
    debugger;
    let html_code = document.getElementById('body-jsp').innerHTML;
    state.download_html(html_code, 'page.html');
};

state.load_tarif = function (name) {
    progress(0);
    state.nameJsp = name;
    $('#body-jsp').load('frame/tarific.jsp');
};

state.load_smeta = function (name) {

    try {
        progress(0);
        state.nameJsp = name;
        $.ajax({
            url: 'dbset?action=smetaProject',
            data: {'projectID': project.projectRec[eProject.id]},
            success: (data) => {

                if (data.result === 'ok') {
                    $('#body-jsp').html(data.report);
                    progress(1);
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error("AJAX Error: " + textStatus, errorThrown);
                dialogMes('Сообщение', "<p>Ошибка при построении отчёта на сервере");
            }
        });
    } catch (e) {
        console.error(e.message);
    }
};

state.load_check = function (name) {
    try {
        progress(0);
        state.nameJsp = name;
        $.ajax({
            url: 'dbset?action=checkProject',
            data: {'projectID': project.projectRec[eProject.id]},
            success: (data) => {

                if (data.result === 'ok') {
                    $('#body-jsp').html(data.report);
                    progress(1);
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error("AJAX Error: " + textStatus, errorThrown);
                dialogMes('Сообщение', "<p>Ошибка при построении отчёта на сервере");
            }
        });
    } catch (e) {
        console.error(e.message);
    }
};

// Генерация и скачивание из строки 
//пример: downloadHTML('<h1>Привет, мир!</h1>', 'page.html');
state.download_html = function (htmlContent, filename) {
    // Создаем Blob с типом text/html
    const blob = new Blob([htmlContent], {type: 'text/html'});

    // Создаем временную ссылку
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename; // Имя файла для сохранения

    // Добавляем в DOM (требуется для Firefox), кликаем и удаляем
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Освобождаем память
    URL.revokeObjectURL(link.href);
};

//Сохранение текущей страницы (или её части)
state.save_current_page = function () {
    // Получаем весь HTML-код страницы
    const htmlContent = document.documentElement.outerHTML;
    
    // Скачиваем его
    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "page_save.html";
    link.click();
};

//async state.save_native_picker = function (htmlContent) {
//    try {
//        // Запрашиваем доступ к файловой системе
//        const handle = await window.showSaveFilePicker({
//            suggestedName: 'index.html',
//            types: [{
//                description: 'HTML документы',
//                accept: { 'text/html': ['.html'] },
//            }],
//        });
//        
//        // Создаем поток для записи
//        const writable = await handle.createWritable();
//        await writable.write(htmlContent);
//        await writable.close();
//        
//        console.log('Файл успешно сохранен!');
//    } catch (err) {
//        console.error('Пользователь отменил сохранение или произошла ошибка:', err);
//    }
//};
