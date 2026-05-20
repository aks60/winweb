

export function load_tarif(name) {
    progress(0);
    nameJsp = name;
    $('#body-jsp').load('frame/tarific.jsp');
}

export function load_smeta(name) {

    try {
        progress(0);
        nameJsp = name;
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
}

export function load_check(name) {
    try {
        progress(0);
        nameJsp = name;
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
}

