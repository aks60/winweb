<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript" src="js/token-ru/login.js"></script>
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
                $('#pan1 .login').val('dealer');
                $('#pan1 .password').val('masterkey');
                debugger;
                user_connect();
            }
        </script>        
        <style>
            #gridID { 
                display: grid;
                grid-template-areas: 
                    "north north north"
                    "west cent east"
                    "south south south";
                grid-template-rows: 60px 1fr 60px;
                grid-template-columns: 280px 1fr 15%;
                grid-gap: 10px;
                height: 100vh;
                margin: 0;
            }
            #northID, #southID, #centID, #westID, #eastID {
                padding: 20px;
                background: #ddd;
            }
            #northID {
                grid-area: north;
            }
            #southID {
                grid-area: south;
            }
            #centID { 
                grid-area: cent;      
            }
            #westID { 
                grid-area: west; 
            }
            #eastID { 
                grid-area: east; 
            }
        </style>   
    </head>
    <body>
        <div id="gridID">
            <div id="northID">
                <p style="padding-left: 34%; margin-top: 8px; font-size: 22px; color: dodgerblue">Расчёт конструкций</p>            
            </div>
            <div id="centID">
                <div id="pan1">                   
                    <p class="pantitle"><font size=3>Авторизация через пароль доступа</font></p> 
                    <p>Введите логин, пароль доступа и нажмите кнопку 'Войти'.</p><br><br>                          
                    <table height="80" width="340">
                        <tr>
                            <td>Логин пользователя:</td>
                            <td><input class="login" placeholder='Введите логин' value='asd777'  type='text' size='16'></td>
                        </tr> 
                        <tr>
                            <td>Пароль пользователя:</td>
                            <td><input class="password" placeholder='Введите пароль' value='' type='password' size='16'></td>
                        </tr>
                        <td></td>
                        <td>
                            <button tabindex="2" type="button" onclick="user_connect()"style="width: 70px;">Войти</button>
                        </td>                            
                    </table>
                </div>                      
                <div id="pan2" style="display: none;"> 
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
            <div id="westID">
                <button id="btn1" type="button" onClick="onPage('2');" style="width: 164px; margin: 12px;">Авторизация пользователя(токен)</button>
                <button id="btn2" type="button" onClick="onPage('1');" style="width: 164px; margin: 12px;">Авторизация пользователя(пароль)</button>  
            </div>
            <div id="eastID">
                <p> E-mail:
                <p style="color: dodgerblue"> x-xxx@xxxx.ru

                <p> Телефон:
                <p style="color: dodgerblue">+7 (XXX) XXX-XX-XX<br>+7 (XXX) XXX-XX-XX

                <p class="copyright"><img src="images/tool/logotype3.png" height="30px" width="30px" style="padding-left: 34%;">
                    <br> <br> © ИП Аксёнов С. <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2021               
            </div>
            <div id="southID">Footer2</div>
        </div>
        <object id="cryptoPlugin" type="application/x-rutoken" width="0" height="0">
            <param name="onload" value="pluginit" />
        </object>          
    </body>
</html>
