<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">                       
        <title>USERS</title>

        <script type="module">
            import {users} from './frame/users.js';
           
            users.table1 = document.getElementById('table1');
            users.init_table1();
            users.load_table1();
            $(window).unbind('resize').bind('resize', users.resize).trigger('resize');
            
            $('button').button();           
            document.getElementById('u01').addEventListener('click', () => users.onpage('1'));
            document.getElementById('u02').addEventListener('click', () => users.onpage('2'));
            document.getElementById('u03').addEventListener('click', () => users.onpage('4'));
            document.getElementById('u04').addEventListener('click', () => users.onpage('3'));
            document.getElementById('u05').addEventListener('click', () => users.logim_create());
            document.getElementById('u06').addEventListener('click', () => users.token_check());
            document.getElementById('u07').addEventListener('click', () => users.token_refresh());
            document.getElementById('u08').addEventListener('click', () => users.delete_openkey());
            document.getElementById('u09').addEventListener('click', () => users.login_delete());

        </script>          
    </head>
    <body>
        <div id="north">
            <h6 style="padding-left: 32%; margin-top: 1px; font-size: 16px;">Регистрация нового пользователя</h6>
        </div>        
        <div id = "context" style=" background: #efeffb">
            <div id="midl" style="position: relative; margin: 0 2px 0 500px; height: 100%;">
                <div id="west" style="position: absolute; height: 100%; width: 500px; margin-left: -500px;">
                    <div id="west2" style="height: 112px">
                        <button id="u01" type="button" style="width: 160px; margin: 6px 32px;">Создание пользователя(пароль)</button>                    
                        <button id="u02" type="button" style="width: 160px; margin: 6px 0px;">Создание пользователя(токен)</button>
                        <button id="u03" type="button" style="width: 160px; margin: 6px 32px;">Удаление пользователя(пароль)</button>                                       
                        <button id="u04" type="button" style="width: 160px; margin: 6px 0px;">Удаление пользователя(токен)</button>                                       
                    </div>
                    <div id="west3" style="height: 200px">
                        <div id="pan1" style="display: none;">                     
                            <p class="pantitle"><font size=3>Регистрация нового пользователя для входа через логин и пароль</font></p> 
                            <p>Для регистрации введите логин и пароль администратора, введите логин и пароль пользователя, 
                                нажмите кнопку «Зарегистрировать». </p><br><br>    
                            <table height="180" width="440">
                                <tr>
                                    <td>Логин администратора:</td>
                                    <td><input id="u14" class="login" placeholder='Введите логин' value='sysdba' type='text' size='16'></td>
                                </tr> 
                                <tr>
                                    <td>Пароль администратора:</td>
                                    <td><input class="password" placeholder='Введите пароль' value='masterkey' type='password' size='17'></td>
                                </tr>                            
                                <tr>
                                    <td>Логин пользователя:</td>
                                    <td><input id="u15" class="login" placeholder='Введите логин' value='DEALER' type="text" size='16' style="width: 160px;"/></td>
                                </tr>
                                <tr>
                                    <td>Пароль пользователя:</td>
                                    <td><input class="password" placeholder='Введите пароль' value='masterkey' type="password" style="width: 160px;"/></td>
                                </tr>
                                <tr>
                                    <td>ФИО:</td>
                                    <td><input id="u11" class="fio" placeholder='Введите ФИО' value='Дилер Г.Д' type="text" size='64' style="width: 260px;"/></select> </td>
                                </tr>                            
                                <tr>
                                    <td>Описание:</td>
                                    <td><input class="desc" placeholder='Описание ФИО' value='Мастер' type="text" size='64' style="width: 260px;"/></select> </td>
                                </tr>                            
                                <tr>
                                    <td></td><td><button id="u05" type="button" style="width: 164px;">Зарегистрировать</button></td>
                                </tr>
                            </table>                       
                        </div>                    
                        <div id="pan2" style="display: none;">                    
                            <p class="pantitle"><font size=3>Регистрация нового пользователя для входа через токен</font></p> 
                            <p>Для регистрации введите логин и пароль администратора, введите логин пользователя и нажмите кнопку «Зарегистрировать».
                                Внимание! Логин пользователя должен состоять из цифр и букв латинского алфавита 
                                (любого регистра), а также иметь длину не менее трех и не более шестнадцати символов.</p><br><br>                 
                            <table height="140" width="440">
                                <tr>
                                    <td>Логин администратора:</td>
                                    <td><input id="u16" class="login" placeholder='Введите логин' value='' type='text' size='16'></td>
                                </tr> 
                                <tr>
                                    <td>Пароль администратора:</td>
                                    <td><input class="password" placeholder='Введите пароль' value='' type='password' size='17'></td>
                                </tr>                            
                                <tr>
                                    <td>Логин пользователя:</td>
                                    <td><input id="u17" class="login" placeholder='Введите логин' value='rono0' type="text" style="width: 160px;"/></td>
                                </tr> 
                                <tr>
                                    <td>ФИО:</td>
                                    <td><input id="u12" class="fio" placeholder='Введите ФИО' value='' type="text" size='64' style="width: 260px;"/></select> </td>
                                </tr>                              
                                <tr>
                                    <td>Описание:</td>
                                    <td><input class="desc" placeholder='Описание ФИО' value='' type="text" size='64' style="width: 260px;"/></select> </td>
                                </tr>                            
                                <tr>
                                    <td></td><td><button id="u06" type="button" style="width: 164px;">Зарегистрировать</button></td>
                                </tr>
                            </table>                      
                        </div> 
                        <div id="pan3" style="display: none;"> 
                            <p class="pantitle"><font size=3>Удаление логина USB-токена</font></p> 
                            <p>Воспользуйтесь кнопкой «Обновить» для вывода актуального списка учетных записей, 
                                сохраненных на USB-токене. Для удаления выберите логин в выпадающем 
                                списке и нажмите кнопку «Удалить». Далее потребуется ввести правильный PIN-код.</p><br><br>                          
                            <table height="60">
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
                                        <button id="u07" class='refresh' tabindex="3" type="button" style="width: 80px;">Обновить</button>
                                        <button id="u08" tabindex="2" type="button" style="width: 76px;">Удалить</button>
                                    </td>
                                </tr>
                            </table>
                        </div> 
                        <div id="pan4" style="display: none;"> 
                            <p class="pantitle"><font size=3>Удаление логина пользователя</font></p> 
                            <p>Для удаления выберите логин в списке пользователей и нажмите кнопку «Удалить».</p><br><br>                          
                            <table height="80">
                                <tr>
                                    <td>ФИО пользователя:</td>
                                    <td><input id="u13" class="fio" value='' type="text" size='64' style="width: 260px;"/></td>
                                </tr>
                                <tr>
                                    <td>Логин пользователя:</td>
                                    <td><input id="u18" class="login" value='' type="text" size='16' style="width: 160px;"/></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <button id="u09" tabindex="2" type="button" style="width: 76px;">Удалить</button>
                                    </td>
                                </tr>
                            </table>
                        </div> 
                    </div>
                </div>                 
                <div id="centr" style="position: absolute; height: 100%; width: 100%;">
                    <div>
                        <table id="table1"  class="ui-jqgrid-btable"></table> 
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
