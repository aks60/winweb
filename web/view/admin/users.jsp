<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">        
        <script src="js/token-ru/base64.js" type="text/javascript"></script>        
        <script src="js/token-ru/sha256.js" type="text/javascript"></script>        
        <script src="js/token-ru/utf8.js" type="text/javascript"></script>        
        <script src="js/token-ru/users.js" type="text/javascript"></script>  
        <title>Пользователи</title>

        <script type="text/javascript">
            var regionList = [];
            $(document).ready(function () {
                upBody();
                var rec = {'id': 599999, 'name': 'Все регионы', 'uch': 1};
                regionList.push(rec);
                $("#combo").append('<option>' + rec.name + '</option>');
                $("#combo2").append('<option>' + rec.name + '</option>');

                for (var index = 590000; index < 590100; index++) {

                    if (mapDic[index] != undefined) {
                        var record = {'id': index, 'name': mapDic[index], 'uch': index};
                        regionList.push(record);
                        $("#combo").append('<option>' + record.name + '</option>');
                        $("#combo2").append('<option>' + record.name + '</option>');
                    }
                }
            });
            function upBody() {
                $(window).bind('resize', function () {
                    var height = window.innerHeight - 120;
                    $(".content").css("height", height);
                }).trigger('resize');
            }
            function onPage(val) {
                $("#pan1, #pan2, #pan3").hide();
                $("#pan" + val).show();
            }
        </script>
        <style>
            #layout {
                padding-left:200px; 
                padding-right:150px;
            }
            #nav {
                margin-left:-200px; 
                width:200px;
            }
            #extra {
                width:150px;
                margin-right:-150px; 
            }
            .content {
                font-size: 12px;
            }            
        </style>
    </head>
    <body>
        <div style="height: 32px">    
            <p style="padding-left: 260px; margin-top: 8px; font-size: 20px;">Регистрация нового пользователя</p>
        </div>        
        <div id="layout" class="yui3-g">
            <div id="nav" class="yui3-u">
                <div class="content">
                    <button type="button" onClick="onPage('1');" style="width: 164px; margin: 12px;">Создание пользователя(пароль)</button>                    
                    <button type="button" onClick="onPage('2');" style="width: 164px; margin: 12px;">Создание пользователя(токен)</button>
                    <button type="button" onClick="onPage('3');" style="width: 164px; margin: 12px;">Удаление пользователя(токен)</button>                   
                </div>
            </div>
            <div id="main" class="yui3-u">
                <div class="content" style="padding-left: 8px">                    
                    <div id="pan1" class="yui3-u-1">                    
                        <p class="pantitle"><font size=3>Регистрация нового пользователя для входа через логин и пароль</font></p> 
                        <p>Для регистрации введите логин и пароль администратора, введите логин и пароль пользователя, 
                            нажмите кнопку «Зарегистрироваться». </p><br><br>    
                        <table height="150" width="440">
                            <tr>
                                <td>Логин администратора:</td>
                                <td><input id="adm_name2" placeholder='Введите логин' value='' type='text' size='16'></td>
                            </tr> 
                            <tr>
                                <td>Пароль администратора:</td>
                                <td><input name="login" id="adm_password2" placeholder='Введите пароль' value='' type='password' size='16'></td>
                            </tr>
                            <tr>
                                <td>Регион пользователя:</td>
                                <td> <select id="combo2" style="width: 264px;" onchange="editUser(1)"></select> </td>
                            </tr>                            
                            <tr>
                                <td>Логин пользователя:</td>
                                <td><input id="user_name2" placeholder='Введите логин' value='' type="text" size='16' style="width: 160px;"/></td>
                            </tr>
                            <tr>
                                <td>Пароль пользователя:</td>
                                <td><input name="login" id="user_password2" placeholder='Введите пароль' value='' type="password" style="width: 160px;"/></td>
                            </tr>
                            <tr>
                                <td></td><td><button type="button" onClick="new_login();" style="width: 164px;">Зарегистрироваться</button></td>
                            </tr>
                        </table>                       
                    </div>                    
                    <div id="pan2" class="yui3-u-1"  style="display: none;">                    
                        <p class="tabletitle"><font size=3>Регистрация нового пользователя для входа через токен</font></p> 
                        <p>Для регистрации введите логин и пароль администратора, введите логин пользователя и нажмите кнопку «Зарегистрироваться».
                            Внимание! Логин пользователя должен состоять из цифр и букв латинского алфавита 
                            (любого регистра), а также иметь длину не менее трех и не более шестнадцати символов.</p><br><br>                 
                        <table height="120" width="440">
                            <tr>
                                <td>Логин администратора:</td>
                                <td><input id="adm_name" placeholder='Введите логин' value='' type='text' size='16'></td>
                            </tr> 
                            <tr>
                                <td>Пароль администратора:</td>
                                <td><input id="adm_password" placeholder='Введите пароль' value='' type='password' size='16'></td>
                            </tr>
                            <tr>
                                <td>Регион пользователя:</td>
                                <td> <select id="combo" style="width: 264px;" onchange="editUser(2)"></select> </td>
                            </tr>                              
                            <tr>
                                <td>Логин пользователя:</td>
                                <td><input name="login" id="user_login" placeholder='Введите логин' value='rono0' type="text" style="width: 160px;"/></td>
                            </tr>                          
                            <tr>
                                <td></td><td><button type="button" onClick="chk_login();" style="width: 164px;">Зарегистрироваться</button></td>
                            </tr>
                        </table>                      
                    </div> 
                    <div id="pan3" class="yui3-u-1" style="display: none;"> 
                        <p class="tabletitle"><p class="tabletitle"><font size=3>Удаление логина USB-токена</font></p> 
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
            <div class="yui3-u" id="extra">
                <div class="content">
                </div>
            </div>
        </div>
        <object id="cryptoPlugin" type="application/x-rutoken" width="0" height="0">
            <param name="onload" value="pluginit" />
        </object>        
    </body>
</html>

