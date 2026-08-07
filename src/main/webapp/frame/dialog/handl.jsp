<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>HANDL</title>

        <script type="module">

            init_dialog();

            function init_dialog() {

                $("#dialog-jsp").dialog({
                    title: "Справочник",
                    width: 240,
                    height: 170,
                    modal: true,
                    buttons: {
                        "Выбрать": function () {
                            $("#dialog-jsp").dialog("close");
                        },
                        "Закрыть": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }

            function init_table() {
            }

            function load_table() {
            }

        </script>        
    </head>
    <body>
        <div>
            <input type="radio" id="r1" name="drone" value="r1" checked><label for="r1">По середине</label>
        </div>
        <div>
            <input type="radio" id="r2" name="drone" value="r2"><label for="r2">Константная</label>
        </div>
        <div>
            <input type="radio" id="r3" name="drone" value="r3"><label for="r3">Установлена на высоте</label>&nbsp;<input type="text" size="3">
        </div>
    </body>
</html>