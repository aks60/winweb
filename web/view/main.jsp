<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Main</title>
        <link rel="stylesheet" type="text/css" media="screen" href="css/yui3-3.18.1/cssgrids.css">
        <link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui-themes-1.13/themes/redmond/jquery-ui.min.css">       
        <link rel="stylesheet" type="text/css" media="screen" href="css/jqgrid-4.6.3/ui.jqgrid.css">

        <script type="text/javascript" src="js/jquery-3.6/jquery-3.6.0.min.js"></script>             
        <script type="text/javascript" src="js/jquery-ui-1.13/i18n/jquery.ui.datepicker-ru.min.js"></script>
        <script type="text/javascript" src="js/jquery-ui-1.13/jquery-ui.min.js"></script>        

        <script type="text/javascript"src="js/jqgrid-4.6.3/i18n/grid.locale-ru.js"></script>
        <script type="text/javascript"src="js/jqgrid-4.6.3/jquery.jqGrid.min.js"></script>

        <script type="text/javascript">

            //глобальные данные
            var dataProp = [];

            //глобальные настройки и параметры
            jQuery.extend(jQuery.jgrid.defaults, {rowNum: 60});
            $.ajaxSetup({type: "POST", dataType: "json", async: true, cache: false});
            //системные свойства
            $.ajax({
                url: 'dict?action=property',
                success: function (data) {
                    dataProp = data;
//                    dataProp['dateNow'] = formatDate2(new Date());
                }
            });
            function loadBody(url) {
                $('#outbody').load(url, function () {
                    //upBody();
                    //$("button").button();
                });
            }
        </script>        
    </head>
    <body>
        <div id="outbody"></div>
        <script type="text/javascript">
            $("#outbody").load('view/login.jsp');
            
//            var inBody = function () {            // Создаём анонимную функцию. Помещаем её в переменную "inBody"
//                var xhr = new XMLHttpRequest()    // Создаём локальную переменную XHR, которая будет объектом XMLHttpRequest
//                xhr.open('GET', 'view/login.jsp') // Задаём метод запроса и URL  запроса
//                xhr.onload = function () {        // Используем обработчик событий onload, чтобы поймать ответ сервера XMLHttpRequest
//                    console.log(xhr.response)     // Выводим в консоль содержимое ответа сервера. Это строка!
//                    document.body.innerHTML = xhr.response  // Содержимое ответа, помещаем внутрь элемент "body" 
//                }
//                xhr.send()  // Инициирует запрос. Посылаем запрос на сервер.
//            }
//            inBody()  // Запускаем выполнение функции получения содержимого файла     
            
        </script>         
    </body>
</html>
