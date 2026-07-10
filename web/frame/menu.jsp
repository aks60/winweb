<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Выпадающее меню на CSS3</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    </head>

    <script type="module">
        import {partner} from './frame/partner.js';
        import {project} from './frame/project.js';
        import {product} from './frame/product.js';
        import {state} from './frame/report.js';
        import {kits} from './frame/kits.js';

        function init_menu() {

            document.getElementById('m00').addEventListener('click', (e) => {
                state.nameJsp = 'PROJECT';
                if ($('#body-jsp title').text() !== 'PROJECT') {
                    $('#body-jsp').load('frame/project.jsp');
                }
            });
            document.getElementById('m02').addEventListener('click', () => project.insert_table1());
            document.getElementById('m03').addEventListener('click', () => project.update_table1());
            document.getElementById('m04').addEventListener('click', () => project.delete_table1());
            document.getElementById('m05').addEventListener('click', () => $('#dialog-jsp').load('frame/dialog/systree.jsp'));
            document.getElementById('m06').addEventListener('click', () => project.update_table3());
            document.getElementById('m07').addEventListener('click', () => project.delete_table3());
            document.getElementById('m08').addEventListener('click', () => project.update_table2());
            document.getElementById('m09').addEventListener('click', () => project.calculate_project());

            document.getElementById('m10').addEventListener('click', () => {
                state.nameJsp = 'PRODUCT';
                if ($('#body-jsp title').text() !== 'PRODUCT') {
                    $('#body-jsp').load('frame/product.jsp');
                }
            });
            document.getElementById('m12').addEventListener('click', () => product.save_update_script());
            document.getElementById('m13').addEventListener('click', () => product.revert_update_script());

            document.getElementById('m20').addEventListener('click', () => {
                state.nameJsp = 'KITS';
                if ($('#body-jsp title').text() !== 'KITS') {
                    $('#body-jsp').load('frame/kits.jsp');
                }
            });
            document.getElementById('m21').addEventListener('click', () => $('#dialog-jsp').load('frame/dialog/kitcard.jsp'));
            document.getElementById('m23').addEventListener('click', () => $('#dialog-jsp').load('frame/dialog/artikl.jsp'));
            document.getElementById('m24').addEventListener('click', () => kits.update_table());
            document.getElementById('m25').addEventListener('click', () => kits.delete_table());

            document.getElementById('m30').addEventListener('click', () => {
                state.nameJsp = 'PARTNER';
                if ($('#body-jsp title').text() !== 'PARTNER') {
                    $('#body-jsp').load('frame/partner.jsp');
                }
            });
            document.getElementById('m31').addEventListener('click', () => partner.insert_table1());
            document.getElementById('m32').addEventListener('click', () => partner.update_table1());
            document.getElementById('m33').addEventListener('click', () => partner.delete_table1());

            document.getElementById('m41').addEventListener('click', () => state.reportWin('Tarif'));
            document.getElementById('m42').addEventListener('click', () => state.reportWin('Material'));
            document.getElementById('m43').addEventListener('click', () => state.reportWin('Target'));
            document.getElementById('m44').addEventListener('click', () => state.reportPrj('Material'));
            document.getElementById('m45').addEventListener('click', () => state.reportPrj('Target'));
            document.getElementById('m46').addEventListener('click', () => state.reportPrj('Smeta1'));
            document.getElementById('m47').addEventListener('click', () => state.reportPrj('Smeta2'));
            document.getElementById('m48').addEventListener('click', () => state.reportPrj('Check1'));
            document.getElementById('m49').addEventListener('click', () => state.reportPrj('Check2'));
            document.getElementById('m49.').addEventListener('click', () => state.reportPrj('Offer'));

            document.getElementById('m53').addEventListener('click', () => state.test());

            $('.main-nav a').on('click', function (e) {
                var $this = $(this);
                var $parentLi = $this.parent();
                var $submenu = $this.next('ul');

                //Если подменю существует
                if ($submenu.length > 0) {
                    e.preventDefault(); //отменяем переход по ссылке

                    //Если кликнули по уже открытому меню — закрываем его
                    if ($submenu.hasClass('active')) {
                        $submenu.removeClass('active');
                        $submenu.find('ul').removeClass('active'); //закрываем вложенные (3 уровень)
                    } else {
                        //Закрываем другие открытые подменю на этом же уровне
                        $parentLi.siblings().find('ul').removeClass('active');
                        $parentLi.siblings().children('ul').removeClass('active');

                        //Открываем нужное подменю
                        if ($submenu.length) {
                            if ($('#body-jsp title').text() === state.nameJsp
                                    || $this[0].id === 'm40' || $this[0].id === 'm40a' || $this[0].id === 'm40b') {
                                $submenu.addClass("active"); // display popup 
                            }
                        }
                        e.stopPropagation(); //предотвращает всплытие события вверх по дереву DOM
                    }
                } else {
                    $('.main-nav ul ul').removeClass('active');
                }
            });

            //Закрываем меню при клике в пустом месте на странице
            $(document).on('click', function (e) {
                if (!$(e.target).closest('.main-nav').length) {
                    $('.main-nav ul ul').removeClass('active');
                }
            });
        }

        init_menu();


    </script> 

    <body>
        <nav class="main-nav">
            <ul class="menu-level-1">
                <img src='lib-img/logotype2.png' height="20px" width="20px" style="float: left; margin: 4px 4px">
                <li>
                    <a id='m00' href="#">Проекты</a>
                    <ul class="menu-level-2">
                        <li><a id='m02'>Добавить проект</a></li>
                        <li><a id='m03'>Изменить проект</a></li>   
                        <li><a id='m04'>Удалить проект</a></li>    
                        <li><a class="separator"></a></li>
                        <li><a id='m05'>Добавить констр.</a></li>
                        <li><a id='m06'>Изменить констр.</a></li>
                        <li><a id='m07'>Удалить констр.</a></li>
                        <li><a class="separator"></a></li>
                        <li><a id='m08'>Установить скидки</a></li>
                        <li><a id='m09'>Рассчитать проект</a></li>
                    </ul>
                </li>
                <li>
                    <a id='m10'>Изделия</a>
                    <ul class="menu-level-2">
                        <li><a id="m12">Сохранить констр.</a></li>
                        <li><a id="m13">Отменить измен.</a></li>
                    </ul>
                </li>
                <li>
                    <a id="m20">Комплекты</a>
                    <ul class="menu-level-2">
                        <li><a id="m21">Добавить комплект</a></li>
                        <li><a id="m23">Добавить артикул</a></li>  
                        <li><a id="m24">Изменить артикул</a></li>  
                        <li><a id="m25">Удалить артикул</a></li>
                    </ul>
                </li> 
                <li>
                    <a id='m30'>Заказчики</a>
                    <ul class="menu-level-2">
                        <li><a id="m31">Добавить</a></li>
                        <li><a id="m32">Изменить</a></li>  
                        <li><a id="m33">Удалить</a></li>  
                    </ul>
                </li>                
                <li>
                    <a id="m40">Отчеты</a>
                    <ul class="menu-level-2">

                        <li>
                            <a id="m40a">Изделие</a>
                            <ul class="menu-level-3">
                                <li><a id="m41">Тарификация</a></li>
                                <li><a id="m42">Расход материалов</a></li>
                                <li><a id="m43">Задание в цех</a></li>
                            </ul>
                        </li>
                        <li>
                            <a id="m40b">Проект</a>
                            <ul class="menu-level-3">
                                <li><a id="m44">Расход материалов</a></li>
                                <li><a id="m45">Задание в цех</a></li>
                                <li><a class="separator"></a></li>
                                <li><a id="m46">Смета</a></li>
                                <li><a id="m47">Смета подробная</a></li>
                                <li><a class="separator"></a></li>
                                <li><a id="m48">Счёт</a></li> 
                                <li><a id="m49">Счёт-фактура</a></li> 
                                <li><a class="separator"></a></li>
                                <li><a id="m49.">Ком.предложение</a></li> 
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>
                <li><a id="m50">Сервис</a>
                    <ul class="menu-level-2">
                        <li><a id="m51">Сайт разработчика</a></li>
                        <li><a id="m52">О программе</a></li>                                           
                        <li><a id="m53">TEST()</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    </body>
</html>
