<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>jQuery UI</title>
        <script type="text/javascript">
            $(function () {

                $('#tabs').tabs();
                $('button').button();

            });
        </script>
    </head>
    <body>
        <div id="tabs">
            <ul>
                <li><a href="#tab1">Заказы</a>
                <li><a href="#tab2">Изделия</a>
                <li><a href="#tab3">Комплектация</a>            
            </ul>
            <div id="tab1">
                <div class="yui3-g">
                    <div class="yui3-u-1">
                        <div class="content"></div>
                    </div>               
                </div>
                <div id="ft"></div>
            </div>
            <div id="tab2">

            </div>
            <div id="tab3">

            </div>         
        </div>                   
    </body>
</html>
