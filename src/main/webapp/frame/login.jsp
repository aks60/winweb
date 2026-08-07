<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta name="viewport" content="width=device-width, initial-scale=1.0">        
        <title>Login</title>

        <script type="module">
            import {login} from './frame/login.js'

            function resize() {
                var height = window.innerHeight;
                $("#context").css("height", height - 54);
            }

            function onPage(val) {
                $("#pan1, #pan2").hide();
                $("#pan" + val).show();
            }

            $("#btn2").focus();
            $(window).unbind('resize').bind('resize', () => resize()).trigger('resize');
            $("button").button();
            
            document.getElementById('L01').addEventListener('click', () => login.user_connect());
            document.getElementById('L02').addEventListener('click', () => login.token_refresh());
            document.getElementById('L03').addEventListener('click', () => login.token_connect());            
        </script>         
    </head>
    <body>
        <div id="north">
            <h6 style="padding-left: 32%; margin-top: 1px; font-size: 16px;">Расчёт конструкций</h6> 
        </div>
        <div id = "context" style="background: #efeffb">
            <div id="midl" style="position: relative; margin: 0 200px 0 200px; height: 100%;">
                <div id="west" style="position: absolute; height: 100%; width: 200px; margin-left: -202px;">
                    <button id="btn1"  type="button" onClick="onPage('2');" style="width: 164px; margin: 12px;">Авторизация пользователя(токен)</button>
                    <button id="btn2"  type="button" onClick="onPage('1');" style="width: 164px; margin: 12px;">Авторизация пользователя(пароль)</button>  
                </div>                 
                <div id="centr" style="position: absolute; height: 100%; width: 100%;">
                    <form id="pan1">                   
                        <p class="pantitle"><font size=3>Авторизация через пароль доступа</font></p> 
                        <p>Введите логин, пароль доступа и нажмите кнопку 'Войти'.</p><br><br> 

                        <table height="80" width="340">
                            <tr>
                                <td>Логин пользователя:</td>
                                <td><input class="login" placeholder='Введите логин' value='DEALER'  type='text' size='16'></td>
                            </tr> 
                            <tr>
                                <td>Пароль пользователя:</td>
                                <td><input class="password" placeholder='Введите пароль' value='masterkey' type='password' autocomplete='username' size='16'></td>
                            </tr>
                            <td></td>
                            <td>
                                <button id="L01" tabindex="2" type="button" style="width: 106px;">Войти</button>
                            </td>                            
                        </table>

                    </form>                      
                    <form id="pan2" style="margin-left: 0px; display: none;"> 
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
                                    <button id="L02" class='refresh' tabindex="3" type="button" style="width: 80px;">Обновить</button>
                                    <button id="L03" tabindex="2" type="button" style="width: 120px;">Войти</button>
                                </td>
                            </tr>
                        </table>                
                    </form> 
                </div>  
                <div id="east" style="position: absolute; height: 100%; width: 194px; right: -200px;">
                    <div style="margin-left: 20px">
                        <p> E-mail:
                        <p style="color: dodgerblue"> gonved60@gmail.com</p>
                        <p> Телефон:
                        <p style="color: dodgerblue">+7 (903) 124-78-33<br>+7 (000) 000-00-00</p>
                        <p class="copyright"><img src="lib-img/logotype.png" height="30px" width="30px" style="padding-left: 34%;">
                            <br> <br> © ИП Аксёнов С. <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2026
                    </div>
                </div>            
            </div>
        </div>    
        <div id="south">
            <object id="cryptoPlugin" type="application/x-rutoken" width="0" height="0">
                <param name="onload" value="pluginit" />
            </object> 
        </div>    
    </body>
</html>
