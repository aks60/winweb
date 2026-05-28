<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Выпадающее меню на CSS3</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    </head>
    <script type="module">
        import {project} from './frame/project.js';
        import {product} from './frame/product.js';
        import {state} from './frame/report.js';
        import {kits} from './frame/kits.js';

        function load_project(name) {
            state.nameJsp = name;
            if ($('#body-jsp title').text() !== 'PROJECT') {
                $('#body-jsp').load('frame/project.jsp');
            }
        }

        function load_product(name) {
            state.nameJsp = name;
            if ($('#body-jsp title').text() !== 'PRODUCT') {
                $('#body-jsp').load('frame/product.jsp');
            }
        }

        function load_kits(name) {
            state.nameJsp = name;
            if ($('#body-jsp title').text() !== 'KITS') {
                $('#body-jsp').load('frame/kits.jsp');
            }
        }

        function init_menu() {
            document.getElementById('m01').addEventListener('click', () => load_project('PROJECT'));
            document.getElementById('m11').addEventListener('click', () => project.insert_table1());
            document.getElementById('m21').addEventListener('click', () => project.update_table1());
            document.getElementById('m31').addEventListener('click', () => project.delete_table1());

            document.getElementById('m41').addEventListener('click', () => $('#dialog-jsp').load('frame/dialog/systree.jsp'));
            document.getElementById('m51').addEventListener('click', () => project.update_table3());
            document.getElementById('m61').addEventListener('click', () => project.delete_table3());
            document.getElementById('m71').addEventListener('click', () => project.update_table2());
            document.getElementById('m81').addEventListener('click', () => project.calculate_project());

            document.getElementById('m02').addEventListener('click', () => load_product('PRODUCT'));
            document.getElementById('m12').addEventListener('click', () => product.save_update_script());
            document.getElementById('m22').addEventListener('click', () => product.revert_update_script());

            document.getElementById('m03').addEventListener('click', () => load_kits('KITS'));
            document.getElementById('m13').addEventListener('click', () => $('#dialog-jsp').load('frame/dialog/kitcard.jsp'));
            document.getElementById('m23').addEventListener('click', () => $('#dialog-jsp').load('frame/dialog/artikl.jsp'));
            document.getElementById('m33').addEventListener('click', () => kits.update_table());
            document.getElementById('m43').addEventListener('click', () => kits.delete_table());

            document.getElementById('m14').addEventListener('click', () => state.load_tarif('TARIF'));
            document.getElementById('m24').addEventListener('click', () => state.load_smeta('Смета2'));
            document.getElementById('m34').addEventListener('click', () => state.load_check('Счёт2'));
            
            document.getElementById('m35').addEventListener('click', () => project.test());

            $("#nav2 > li > a").click(function (e) { // binding onclick

                if ($(this).parent().hasClass('selected')) {
                    $("#nav2 .selected div div").slideUp(100); // hiding popups
                    $("#nav2 .selected").removeClass("selected");
                } else {
                    $("#nav2 .selected div div").slideUp(100); // hiding popups
                    $("#nav2 .selected").removeClass("selected");

                    if ($(this).next(".subs").length) {

                        if ($('#body-jsp title').text() === state.nameJsp) {
                            $(this).parent().addClass("selected"); // display popup
                            $(this).next(".subs").children().slideDown(200);
                        }
                    }
                }
                e.stopPropagation();
            });

            $("body").click(function () { // binding onclick to body
                $("#nav2 .selected div div").slideUp(100); // hiding popups
                $("#nav2 .selected").removeClass("selected");
            });
        }

        init_menu();


    </script> 

    <body>
        <div class="menu">
            <img src='lib-img/logotype2.png' height="20px" width="20px" style="float: left; margin: 4px 4px">
            <span>
                <ul id="nav2">
                    <li><a id='m01'>Заказы</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a id='m11'>Добавить заказ</a></li>
                                            <li><a id='m21'>Изменить заказ</a></li>   
                                            <li><a id='m31'>Удалить заказ</a></li>    
                                            <li><a class="separator"></a></li>
                                            <li><a id='m41'>Добавить констр.</a></li>
                                            <li><a id='m51'>Изменить констр.</a></li>
                                            <li><a id='m61'>Удалить констр.</a></li>
                                            <li><a class="separator"></a></li>
                                            <li><a id='m71'>Установить скидки</a></li>
                                            <li><a id='m81'>Калькуляция заказа</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>                          
                    </li>
                    <li><a id='m02'>Изделия</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a id="m12">Сохранить констр.</a></li>
                                            <li><a id="m22">Отменить измен.</a></li>  
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>                      
                    </li>
                    <li><a id="m03">Комплекты</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a id="m13">Добавить комплект</a></li>
                                            <li><a id="m23">Добавить артикул</a></li>  
                                            <li><a id="m33">Изменить артикул</a></li>  
                                            <li><a id="m43">Удалить артикул</a></li>  
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>                     
                    </li>
                    <li><a id="m04">Отчеты</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a id="m14" onClick="">Тарификация</a></li>
                                            <li><a id="m24" onClick="">Смета подробная</a></li>
                                            <li><a id="m34" onClick="">Счёт-фактура</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>                                
                    </li>
                    <li><a>Сервис</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a id="m15">Сайт разработчика</a></li>
                                            <li><a id="m25">О программе</a></li>
                                            <li><a id="m35">TEST</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>  
                    </li> 
                </ul>
            </span>
        </div>
    </body>
</html>
