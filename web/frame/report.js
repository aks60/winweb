import {Wincalc} from '../build/Wincalc.js';
import {project} from './project.js';
//import {nameJsp} from './menu.jsp';

export function smeta(projectID) {
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
}

export  function load_check(name) {
    try {
        //progress(0);
        //nameJsp = name;
        $.ajax({
            url: 'dbset?action=checkProject',
            data: {'projectID': project.projectRec[eProject.id]},
            dataType: 'html',
            success: (data) => {
                debugger;
                let o1 = data.result;
                if (data.result === 'ok') {
                    $('#body-jsp').html(data.report);
                    //progress(1);
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
}

export function load_report(projectID) {
    document.getElementById('downloadBtn').addEventListener('click', function () {
        fetch('/api/download-file', {method: 'GET', })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка при скачивании файла');
                    }
                    return response.blob(); // Получаем ответ в виде Blob
                })
                .then(blob => {
                    // Создаем ссылку на объект Blob
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');

                    a.href = url;
                    // Задаем имя файла, которое предложит браузер при скачивании
                    a.download = 'report.html';

                    document.body.appendChild(a);
                    a.click(); // Имитируем клик по ссылке

                    // Очищаем память
                    a.remove();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
    });
}



