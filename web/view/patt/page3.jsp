<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <style>
            div {
                border: 1px solid black;
            }
        </style>
        <script type="text/javascript">
            $(document).ready(function () {
                upBody();
            });
            function upBody() {
                $(window).bind('resize', function () {
                    var height = window.innerHeight - 76;
                    $("#midl").css("height", height);
                }).trigger('resize');
            }
        </script>          
    </head>
    <body>
        <div style="width: 50%; height:400px; position:relative; background:green;">
            <div style="width: 200px; height:200px; position:absolute; left:0px; background:red;">
                Левый блок
            </div>
            <div style="width: 400px; height:200px; position:absolute; left:200px; background:blue;">
                Основной блок
            </div>
            <div style="width: 50%; height:200px; position:absolute; left:600px; background:red;">
                Правый блок
            </div>
        </div>       
    </body>
</html>
