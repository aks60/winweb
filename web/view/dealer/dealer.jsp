<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>jQuery UI</title>
<!--        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="//ajax.aspnetcdn.com/ajax/jquery.ui/1.10.3/jquery-ui.min.js"></script>
        <link rel="stylesheet" href="http://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.3/themes/sunny/jquery-ui.css">-->
        <script type="text/javascript">
            $(function () {

                $('#tabs').tabs();
                $('button').button();

            });
        </script>
    </head>
    <body>
        <h1>Заказ конструкций</h1>
        <form method="post" action="phphandler.php">
            <div id="tabs">
                <ul>
                    <li><a href="#tab1">Ряд 1</a>
                    <li><a href="#tab2">Ряд 2</a>
                    <li><a href="#tab3">Ряд 3</a>            
                </ul>
                <div id="tab1">
                    <div class="dcell">
                        <img src="http://professorweb.ru/downloads/jquery/astor.png"/>
                        <label for="astor">Астра:</label>
                        <input name="astor" value="0" required>
                    </div>
                    <div class="dcell">
                        <img src="http://professorweb.ru/downloads/jquery/daffodil.png"/>
                        <label for="daffodil">Нарцисс:</label>
                        <input name="daffodil" value="0" required >
                    </div>
                    <div class="dcell">
                        <img src="http://professorweb.ru/downloads/jquery/rose.png"/>
                        <label for="rose">Роза:</label>
                        <input name="rose" value="0" required>
                    </div>
                </div>
                <div id="tab2">
                    <div class="dcell">
                        <img src="http://professorweb.ru/downloads/jquery/peony.png"/>
                        <label for="peony">Пион:</label>
                        <input name="peony" value="0" required>
                    </div>
                    <div class="dcell">
                        <img src="http://professorweb.ru/downloads/jquery/primula.png"/>
                        <label for="primula">Примула:</label>
                        <input name="primula" value="0" required>
                    </div>            
                    <div class="dcell">
                        <img src="http://professorweb.ru/downloads/jquery/snowdrop.png"/>
                        <label for="snowdrop">Подснежник:</label>
                        <input name="snowdrop" value="0" required>
                    </div>
                </div>
                <div id="tab3">
                    <div class="dcell">
                        <img src="http://professorweb.ru/downloads/jquery/carnation.png"/>
                        <label for="carnation">Гвоздика:</label>
                        <input name="carnation" value="0" required>
                    </div>
                    <div class="dcell">
                        <img src="http://professorweb.ru/downloads/jquery/lily.png"/>
                        <label for="lily">Лилия:</label>
                        <input name="lily" value="0" required>
                    </div>            
                    <div class="dcell">
                        <img src="http://professorweb.ru/downloads/jquery/orchid.png"/>
                        <label for="orchid">Орхидея:</label>
                        <input name="orchid" value="0" required>
                    </div> 
                </div>         
            </div>
            <div id="buttonDiv"><button type="submit">Заказать</button></div>                    
        </form>
    </body>
    <style>
        h1 {
            min-width: 70px; border: thick double black; margin-left: auto;
            margin-right: auto; text-align: center; font-size: x-large; padding: .5em;
            color: darkgreen; background-image: url("http://professorweb.ru/downloads/jquery/border.png");
            background-size: contain; margin-top: 0;
        }     
        .dcell {display: table-cell; padding: 10px;}
        .dcell > * {vertical-align: middle}
        input {width: 2em; text-align: right; border: thin solid black; padding: 2px;}
        label {width: 6em;  padding-left: .5em; display: inline-block;}
        #buttonDiv {text-align: center; margin-top:12px;}
        button {padding: 12px;}
        #oblock {display: block; margin-left: auto; margin-right: auto; min-width: 700px; }
    </style>
</html>
