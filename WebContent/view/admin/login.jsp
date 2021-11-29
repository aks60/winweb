<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>Аутентификация</title>

        <!--        <script src="js/token-ru/base64.js" type="text/javascript"></script>        
                <script src="js/token-ru/sha256.js" type="text/javascript"></script>        
                <script src="js/token-ru/utf8.js" type="text/javascript"></script>        -->
        <script src="js/token-ru/login.js" type="text/javascript"></script>  

        <script type="text/javascript">

            $("button").button();
            $(document).ready(function () {
                $("#btn2").focus();
                upBody();
                
                //autoconnect();

            });
            function upBody() {
                $(window).bind('resize', function () {
                    var height = window.innerHeight - 80;
                    $(".content").css("height", height);
                }).trigger('resize');
            }            
            function onPage(val) {
                $("#pan1, #pan2").hide();
                $("#pan" + val).show();
            }
            function autoconnect() {
                $('#user_name').val('sysdba');
                $('#user_password').val('masterkey');
                user_connect();
            }
        </script>
        
        <style>
            .pan {
                padding-top: 40px;
                padding-left: 40px;
            }
            #layout {
                padding-left:200px; 
                padding-right:200px;
            }
            #nav {
                margin-left:-200px; 
                width:200px;
            }
            #extra {
                width:200px;
                margin-right:-200px; 
            }
            .content {
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div style="height: 34px">    
            <p style="padding-left: 34%; margin-top: 8px; font-size: 22px; color: dodgerblue">ИАС "Управление образованием"</p>
        </div>
        <div id="layout" class="yui3-g">
            <div id="nav" class="yui3-u">
                <div class="content">                 
                    <button id = "btn1" type="button" onClick="onPage('2');" style="width: 164px; margin: 12px; margin-top: 112px;">Авторизация пользователя(токен)</button>
                    <button id = "btn2" type="button" onClick="onPage('1');" style="width: 164px; margin: 12px;">Авторизация пользователя(пароль)</button>           
                </div>
            </div>
            <div id="main" class="yui3-u">
                <div class="content" style="padding-left: 8px">
                    <div id="pan1" class="yui3-u-1">                   
                        <p class="pantitle"><font size=3>Авторизация через пароль доступа</font></p> 
                        <p>Введите логин, пароль доступа и нажмите кнопку 'Войти'.</p><br><br>                          
                        <table height="80" width="340">
                            <tr>
                                <td>Логин пользователя:</td>
                                <td><input id="user_name" placeholder='Введите логин' value=''  type='text' size='16'></td>
                            </tr> 
                            <tr>
                                <td>Пароль пользователя:</td>
                                <td><input id="user_password" placeholder='Введите пароль' value='' type='password' size='16'></td>
                            </tr>
                            <td></td>
                            <td>
                                <button tabindex="2" type="button" onclick="user_connect()"style="width: 70px;">Войти</button>
                            </td>                            
                        </table>
                    </div>                      
                    <div id="pan2" class="yui3-u-1" style="display: none;"> 
                        <p class="tabletitle"><p class="tabletitle"><font size=3>Авторизация через USB токен</font></p> 
                        <p>Воспользуйтесь кнопкой «Обновить» для вывода актуального списка учетных записей, 
                            сохраненных на USB-токене. Для аутентификации выберите логин в выпадающем 
                            списке и нажмите кнопку «Войти». Далее потребуется ввести правильный PIN-код.</p><br>                          
                        <table height="50">
                            <tr><td></td><td id="mesCell" style="color: #0000ff"></td></tr>
                            <tr>
                                <td><label>Логин пользователя:</label></td>
                                <td>
                                    <select tabindex="1" name="list_log" id="token_login" style="width: 160px;">
                                        <option selected="selected" value="none"> — </option>
                                    </select>                                    
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <button class='refresh' tabindex="3" type="button" onclick="token_refresh()"style="width: 80px;">Обновить</button>
                                    <button tabindex="2" type="button" onclick="token_connect()"style="width: 76px;">Войти</button>
                                </td>
                            </tr>
                        </table>
                    </div>                   
                </div>
            </div>
            <div class="yui3-u" id="extra">
                <div class="content" style="padding-left: 20px">
                    <p> E-mail:
                    <p style="color: dodgerblue"> h-line@iicavers.ru

                    <p> Телефон:
                    <p style="color: dodgerblue">+7 (495) 909-03-60<br>+7 (903) 250-61-59

                    <p class="copyright"><img src="images/tool/logotype3.png" height="30px" width="30px" style="padding-left: 34%;">
                        <br> <br>
                        © Группа компаний «АВЕРС» <br> 2013-2014                    
                </div>
            </div>
        </div>
        <object id="cryptoPlugin" type="application/x-rutoken" width="0" height="0">
            <param name="onload" value="pluginit" />
        </object>  
    </body>
</html>

