import {project} from './project.js';
//import {nameObj} from './menu.jsp';
//import {nameJsp} from './menu.jsp';

export let state = {nameJsp: 'PROJECT'};

state.test = function () {
};

state.reportWin = function (title) {
    progress(0);
    $.ajax({url: 'dbset?action=reportProject',
        data: {'title': title, 'prjprodID': project.prjprodRec[ePrjprod.id]},
        dataType: 'html',
        success: (data) => {
            $('#body-jsp').html(data);
            //$('#body-jsp title').val('REPORT');
            progress(1);
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error("AJAX Error: " + textStatus, errorThrown);
            dialogMes('Сообщение', "<p>Ошибка при построении отчёта на сервере");
        }
    });
};

state.reportPrj = function (title) {
    progress(0);
    $.ajax({url: 'dbset?action=reportProject',
        data: {'title': title, 'projectID': project.projectRec[eProject.id]},
        dataType: 'html',
        success: (data) => {
            $('#body-jsp').html(data);
            //$('#body-jsp title').val('REPORT');
            progress(1);
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error("AJAX Error: " + textStatus, errorThrown);
            dialogMes('Сообщение', "<p>Ошибка при построении отчёта на сервере");
        }
    });
};

state.smeta = function (projectID) {
    try {
        $.ajax({
            url: 'dbset?action=smetaProject',
            data: {'projectID': project.projectRec[eProject.id]},
            dataType: 'html',
            success: (data) => {
                debugger;
                $('#body-jsp').html(data);
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

state.schet_faktura = function (projectID) {
    try {
        $.ajax({
            url: 'dbset?action=smetaProject',
            data: {'projectID': project.projectRec[eProject.id]},
            success: (data) => {
                if (data.result === 'ok') {

                } else
                    dialogMes('Сообщение', "<p>" + data.result);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error("AJAX Error: " + textStatus, errorThrown);
                dialogMes('Сообщение', "<p>Ошибка при калькуляции заказа на сервере");
            }
        });
    } catch (e) {
        console.error(e.message);
    }
};

// <editor-fold defaultstate="collapsed" desc="XLAM"> 
/*
 
 state.report = function (title) {
 progress(0);
 if (title === 'Tarif') {
 $.ajax({url: 'dbset?action=reportProject',
 data: {'title': title, 'prjprodID': project.prjprodRec[ePrjprod.id]},
 success: (data) => {
 progress(1);
 }});
 } else if (title === 'Material1') {
 $.ajax({url: 'dbset?action=reportProject',
 data: {'title': title, 'prjprodID': project.prjprodRec[ePrjprod.id]},
 success: (data) => {
 progress(1);
 }});
 } else if (title === 'Target1') {
 $.ajax({url: 'dbset?action=reportProject',
 data: {'title': title, 'prjprodID': project.prjprodRec[ePrjprod.id]},
 success: (data) => {
 progress(1);
 }});
 } else if (title === 'Material2') {
 $.ajax({url: 'dbset?action=reportProject',
 data: {'title': title, 'projectID': project.projectRec[eProject.id]},
 success: (data) => {
 progress(1);
 }});
 } else if (title === 'Target2') {
 $.ajax({url: 'dbset?action=reportProject',
 data: {'title': title, 'projectID': project.projectRec[eProject.id]},
 success: (data) => {
 progress(1);
 }});
 } else if (title === 'Smeta1') {
 $.ajax({url: 'dbset?action=reportProject',
 data: {'title': title, 'projectID': project.projectRec[eProject.id]},
 success: (data) => {
 progress(1);
 }});
 } else if (title === 'Smeta1') {
 $.ajax({url: 'dbset?action=reportProject',
 data: {'title': title, 'projectID': project.projectRec[eProject.id]},
 success: (data) => {
 progress(1);
 }});
 } else if (title === 'Check1') {
 $.ajax({url: 'dbset?action=reportProject',
 data: {'title': title, 'projectID': project.projectRec[eProject.id]},
 success: (data) => {
 progress(1);
 }});
 } else if (title === 'Check2') {
 $.ajax({url: 'dbset?action=reportProject',
 data: {'title': title, 'projectID': project.projectRec[eProject.id]},
 success: (data) => {
 progress(1);
 }});
 } else if (title === 'Offer') {
 $.ajax({url: 'dbset?action=reportProject',
 data: {'title': title, 'projectID': project.projectRec[eProject.id]},
 success: (data) => {
 progress(1);
 }});
 }
 }; 
 state.load_tarif = function (name) {
 
 try {
 progress(0);
 state.nameJsp = name;
 $.ajax({
 url: 'dbset?action=specifikProject',
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
 const blob = new Blob([htmlContent], {type: "text/html"});
 const link = document.createElement("a");
 link.href = URL.createObjectURL(blob);
 link.download = "page_save.html";
 link.click();
 };
 */
// </editor-fold> 
