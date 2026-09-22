<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>ABOUT</title>
        <style>
            .ui-dialog {
                background: #ebebeb !important; /* Замените на нужный цвет или картинку */
            }
        </style>
        <script  type="module">

            init_dialog();

            function init_dialog() {
                $("#dialog-jsp").dialog({
                    title: "О программе",
                    width: 280,
                    height: 310,
                    modal: true,
                    buttons: {
                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
        </script>       
    </head>
    <body>
        <h3 style="text-align: center;">SA-OKNA</h3>
        <div style='display: flex; gap: 10px;'>
            <img alt="О программе" src="lib-img/logotype2.png" />
            <p>Программа для рассчёта окон и дверей (менеджер, дилер)</p>                       
        </div>
        <p>Версия программы - 2.0</p>                        
        <p>Телефон: +7(903)124 7833 
            <br>E-mail: gonved60@gmail.com
            <br>Сайт продукта: <a href="http://sa-okna.ru/winaks" target="_blank">http:sa-okna.ru/winaks</a>
    </body>
</html>
