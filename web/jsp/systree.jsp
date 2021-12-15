<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SYSTREE</title>
    </head>
    <style type="text/css"> 
        .ui-dialog { font-size: 8pt; font-family: "Verdana", sans-serif; } 
        .ui-dialog-title { font-size: lOpt; font-weight: bold;} 
        .ui-dialog-content { font-size: lOpt; } 
    </style>     
    <script type="text/javascript">
        $(document).ready(function () {
            $("#dialog").dialog({
                autoOpen: false, // Открыва.ть ли окно сразу 
                bgiframe: true, // Решение проблемы с IE6 
                closeOnEscape: true, // Закрывать ли при нажатии Esc 
                title: "Новый заголовок", // Заголовок 
                position: ["center", 250], // Местоположение окна 
                width: 500, // Ширина окна 
                height: "auto", // Высота окна 
                draggable: true, // Перемещение 
                resizable: true, // Изменение размера 
                modal: false, // Модальное окно или нет 
                show: null, // Эффект при открытии окна 
                hide: null, // Эффект при закрытии окна 
                buttons: {// Описание кнопок 
                    "Выбрать": function () {
                        $(this).dialog("close"); // Закрыть окно 
                    },
                    "Закрыть": function () {
                        $(this).dialog("close"); // Закрыть окно 
                    }
                }
            });
            //$(".ui-dialog-titlebar").hide(); // Спрятать заголовок 
            $(".ui-dialog-titlebar-close").hide(); // Спрятать крестик 
        });
    </script> 
</head> 
<body> 
    <div id="dialog" title="Зaгoлoвoк окна"> 
        Это текст внутри окна.<br><br> Новый текст заголовка:<br> 
    </div> 
    <input type="button" value="Открыть окно" id="btnl" onclick="$('#dialog').dialog('open');" > 
</body> 
</html> 

