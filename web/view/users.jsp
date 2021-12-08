<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <style>
            #north, #west, #west2, #midl, #south, #centr {
                border: 2px solid #ccc;
            }
        </style>
        <script type="text/javascript">
            $("button").button();
            $(document).ready(function () {
                $(window).bind('resize', function () {
                    var height = window.innerHeight - 68;
                    $("#midl").css("height", height);
                }).trigger('resize');
            });
        </script>          
    </head>
    <body>
        <div id="north" style=" height: 20px;">
            <h6 style="padding-left: 32%; margin-top: 1px; font-size: 16px;">Регистрация нового пользователя</h6>
        </div>
        <div id="midl" style="position: relative; margin: 0 2px 0 500px;">
            <div id="west" style="position: absolute; height: 100%; width: 500px; margin-left: -500px;">
                <div id="west2" style="height: 96px">
                    <button type="button" onClick="onPage('1');" style="width: 150px; margin-left: 8px; margin-top: 28px;">Создание пользователя(пароль)</button>                    
                    <button type="button" onClick="onPage('2');" style="width: 150px; margin-left: 8px; margin-top: 28px;">Создание пользователя(токен)</button>
                    <button type="button" onClick="onPage('3');" style="width: 150px; margin-left: 8px; margin-top: 28px;">Удаление пользователя(токен)</button>                                       
                </div>
                <div id="west3" style="height: 200px">
                    <div id="pan1">                     
                        <p class="pantitle"><font size=3>Регистрация нового пользователя для входа через логин и пароль</font></p> 
                        <p>Для регистрации введите логин и пароль администратора, введите логин и пароль пользователя, 
                            нажмите кнопку «Зарегистрироваться». </p><br><br>    
                        <table height="150" width="440">
                            <tr>
                                <td>Логин администратора:</td>
                                <td><input class="login" placeholder='Введите логин' value='admin' type='text' size='16'></td>
                            </tr> 
                            <tr>
                                <td>Пароль администратора:</td>
                                <td><input class="password" placeholder='Введите пароль' value='Tantal6' type='password' size='17'></td>
                            </tr>                            
                            <tr>
                                <td>Логин пользователя:</td>
                                <td><input class="login" placeholder='Введите логин' value='asd' type="text" size='16' style="width: 160px;"/></td>
                            </tr>
                            <tr>
                                <td>Пароль пользователя:</td>
                                <td><input class="password" placeholder='Введите пароль' value='qwerty' type="password" style="width: 160px;"/></td>
                            </tr>
                            <tr>
                                <td>Описание:</td>
                                <td><input class="desc" placeholder='Описание' value='' type="text" size='64' style="width: 260px;"/></select> </td>
                            </tr>                            
                            <tr>
                                <td></td><td><button type="button" onClick="new_login();" style="width: 164px;">Зарегистрироваться</button></td>
                            </tr>
                        </table>                       
                    </div>                    
                    <div id="pan2" style="display: none;">                    
                        <p class="pantitle"><font size=3>Регистрация нового пользователя для входа через токен</font></p> 
                        <p>Для регистрации введите логин и пароль администратора, введите логин пользователя и нажмите кнопку «Зарегистрироваться».
                            Внимание! Логин пользователя должен состоять из цифр и букв латинского алфавита 
                            (любого регистра), а также иметь длину не менее трех и не более шестнадцати символов.</p><br><br>                 
                        <table height="120" width="440">
                            <tr>
                                <td>Логин администратора:</td>
                                <td><input class="login" placeholder='Введите логин' value='' type='text' size='16'></td>
                            </tr> 
                            <tr>
                                <td>Пароль администратора:</td>
                                <td><input class="password" placeholder='Введите пароль' value='' type='password' size='17'></td>
                            </tr>                            
                            <tr>
                                <td>Логин пользователя:</td>
                                <td><input class="login" placeholder='Введите логин' value='rono0' type="text" style="width: 160px;"/></td>
                            </tr> 
                            <tr>
                                <td>Описание:</td>
                                <td><input class="desc" placeholder='Описание' value='' type="text" size='64' style="width: 260px;"/></select> </td>
                            </tr>                            
                            <tr>
                                <td></td><td><button type="button" onClick="chk_login();" style="width: 164px;">Зарегистрироваться</button></td>
                            </tr>
                        </table>                      
                    </div> 
                    <div id="pan3" style="display: none;"> 
                        <p class="pantitle"><font size=3>Удаление логина USB-токена</font></p> 
                        <p>Воспользуйтесь кнопкой «Обновить» для вывода актуального списка учетных записей, 
                            сохраненных на USB-токене. Для удаления выберите логин в выпадающем 
                            списке и нажмите кнопку «Удалить». Далее потребуется ввести правильный PIN-код.</p><br><br>                          
                        <table height="50">
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
                                    <button class='refresh' tabindex="3" type="button" onclick="token_refresh()" style="width: 80px;">Обновить</button>
                                    <button tabindex="2" type="button" onclick="delete_openkey()"style="width: 76px;">Удалить</button>
                                </td>
                            </tr>
                        </table>
                    </div> 
                </div>
            </div>                 
            <div id="centr" style="position: absolute; height: 100%; width: 100%;">
                <div>
                    CENTR ======== ========== ========== ========= ======== ========== ============    
                </div>
            </div>                 
        </div>
        <div id="south" style="height: 20px">
            <h1>SOUTH</h1>
        </div>  
        <object id="cryptoPlugin" type="application/x-rutoken" width="0" height="0">
            <param name="onload" value="pluginit" />
        </object>            
    </body>
</html>
