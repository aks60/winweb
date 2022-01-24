<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta name="viewport" content="width=device-width, initial-scale=1.0">        
        <script type="text/javascript" src="frm/login.js"></script>
        <title>Login</title>

        <script type="text/javascript">
            //системные свойства               
            $.ajax({
                url: 'login?action=property',
                success: function (data) {
                    utils.param = data.param;
//                    utils.dateNow = format_date2(new Date());
                }
            });

            login.resize = function () {
                var height = window.innerHeight;
                $("#context").css("height", height - 54);
            }

            function onPage(val) {
                $("#pan1, #pan2").hide();
                $("#pan" + val).show();
            }
            $(document).ready(function () {
                $("button").button();
                $("#btn2").focus();

                $(window).bind('resize', function () {
                    login.resize();
                }).trigger('resize');
            });


//            $('#pan1 .login').val('admin');
//            $('#pan1 .password').val('masterkey');
            $('#pan1 .login').val('asd');
            $('#pan1 .password').val('qwerty');
            login.user_connect();            
        </script>         
    </head>
    <body>
        <div id="north" style=" height: 20px;">
            <h6 style="padding-left: 32%; margin-top: 1px; font-size: 16px;">Расчёт конструкций</h6> 
        </div>
        <div id = "context">
            <div id="midl" style="position: relative; margin: 0 200px 0 200px; height: 100%;">
                <div id="west" style="position: absolute; height: 100%; width: 200px; margin-left: -202px;">
                    <button id="btn1"  type="button" onClick="onPage('2');" style="width: 164px; margin: 12px;">Авторизация пользователя(токен)</button>
                    <button id="btn2"  type="button" onClick="onPage('1');" style="width: 164px; margin: 12px;">Авторизация пользователя(пароль)</button>  
                </div>                 
                <div id="centr" style="position: absolute; height: 100%; width: 100%;">
                    <div id="pan1">                   
                        <p class="pantitle"><font size=3>Авторизация через пароль доступа</font></p> 
                        <p>Введите логин, пароль доступа и нажмите кнопку 'Войти'.</p><br><br> 

                        <table height="80" width="340">
                            <tr>
                                <td>Логин пользователя:</td>
                                <td><input class="login" placeholder='Введите логин' value=''  type='text' size='16'></td>
                            </tr> 
                            <tr>
                                <td>Пароль пользователя:</td>
                                <td><input class="password" placeholder='Введите пароль' value='' type='password' size='16'></td>
                            </tr>
                            <td></td>
                            <td>
                                <button tabindex="2" type="button" onclick="login.user_connect();"style="width: 106px;">Войти</button>
                            </td>                            
                        </table>

                    </div>                      
                    <div id="pan2" style="margin-left: 0px; display: none;"> 
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
                                    <button tabindex="2" type="button" onclick="token_connect()"style="width: 120px;">Войти</button>
                                </td>
                            </tr>
                        </table>                
                    </div> 
                </div>  
                <div id="east" style="position: absolute; height: 100%; width: 194px; right: -200px;">
                    <div style="margin-left: 20px">
                        <p> E-mail:
                        <p style="color: dodgerblue"> x-xxx@xxxx.ru
                        <p> Телефон:
                        <p style="color: dodgerblue">+7 (XXX) XXX-XX-XX<br>+7 (XXX) XXX-XX-XX
                        <p class="copyright"><img src="img/logotype3.png" height="30px" width="30px" style="padding-left: 34%;">
                            <br> <br> © ИП Аксёнов С. <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2021
                    </div>
                </div>            
            </div>
        </div>    
        <div id="south" style="height: 20px">
            <object id="cryptoPlugin" type="application/x-rutoken" width="0" height="0">
                <param name="onload" value="pluginit" />
            </object> 
        </div>    
    </body>
</html>
