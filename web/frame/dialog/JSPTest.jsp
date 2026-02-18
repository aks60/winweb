<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>jQuery UI</title>
<!--        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="//ajax.aspnetcdn.com/ajax/jquery.ui/1.10.3/jquery-ui.min.js"></script>
        <link rel="stylesheet" href="http://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.3/themes/sunny/jquery-ui.css">-->
        <script type="text/javascript">

            $(document).ready(function () {
                //alert('$(document).ready-1');
                const myButton = document.getElementById('btnTest');
                myButton.addEventListener('click', function () {
                    alert('Кнопка нажата!');
                });
            });
        </script>   
    </head>
    <body>
        <button id="btnTest">TEST</button>
        Содержимое, которое будет отображаться в диалоговом окне. 
        К этому <b>содержимому</b> могут применяться <em>стили</em>.
    </body>
</html>

