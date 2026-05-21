import {project} from './project.js';
//import {nameObj} from './menu.jsp';
//import {nameJsp} from './menu.jsp';

export let state = {nameJsp : 'PROJECT'};

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

