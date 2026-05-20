<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Выпадающее меню на CSS3</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    </head>
    <script type="module">
        import {insert_table1 as project_insert_table1,
                update_table1 as project_update_table1,
                delete_table1 as project_delete_table1,
                update_table2 as project_update_table2,
                update_table3 as project_update_table3,
                delete_table3 as project_delete_table3,
                calculate_project, project} from './frame/project.js';

        import {test1, test2} from './frame/product.js';

        import {update_table as kits_update_table,
                delete_table as kits_delete_table,
                color_to_kit} from './frame/kits.js';

        let nameJsp = 'PROJECT';

        function load_project(name) {
            nameJsp = name;
            if ($('#body-jsp title').text() !== 'PROJECT') {
                $('#body-jsp').load('frame/project.jsp');
            }
        }

        function load_product(name) {
            nameJsp = name;
            if ($('#body-jsp title').text() !== 'PRODUCT') {
                $('#body-jsp').load('frame/product.jsp');
            }
        }

        function load_kits(name) {
            nameJsp = name;
            if ($('#body-jsp title').text() !== 'KITS') {
                $('#body-jsp').load('frame/kits.jsp');
            }
        }

        function load_smeta(name) {
            nameJsp = name;
            try {
                $.ajax({
                    url: 'dbset?action=smetaProject',
                    data: {'projectID': project.projectRec[eProject.id]},
                    dataType: 'html',
                    success: (data) => {
                        $('#body-jsp').html(data);
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        console.error("AJAX Error: " + textStatus, errorThrown);
                        dialogMes('Сообщение', "<p>Ошибка при построении отчёта на сервере");
                    }
                });
            } catch (e) {
                console.error(e.message);
            }
        }

        function load_check(name) {
            nameJsp = name;
            try {
                $.ajax({
                    url: 'dbset?action=checkProject',
                    data: {'projectID': project.projectRec[eProject.id]},
                    dataType: 'html',
                    success: (data) => {
                        $('#body-jsp').html(data);
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        console.error("AJAX Error: " + textStatus, errorThrown);
                        dialogMes('Сообщение', "<p>Ошибка при построении отчёта на сервере");
                    }
                });
            } catch (e) {
                console.error(e.message);
            }
        }
        
        function load_tarif(name) {
            nameJsp = name;
            $('#body-jsp').load('frame/tarific.jsp');
        }

        function init_menu() {
            document.getElementById('m01').addEventListener('click', () => load_project('PROJECT'));
            document.getElementById('m11').addEventListener('click', () => project_insert_table1());
            document.getElementById('m21').addEventListener('click', () => project_update_table1());
            document.getElementById('m31').addEventListener('click', () => project_delete_table1());

            document.getElementById('m41').addEventListener('click', () => $('#dialog-jsp').load('frame/dialog/systree.jsp'));
            document.getElementById('m51').addEventListener('click', () => project_update_table3());
            document.getElementById('m61').addEventListener('click', () => project_delete_table3());
            document.getElementById('m71').addEventListener('click', () => project_update_table2());
            document.getElementById('m81').addEventListener('click', () => calculate_project());

            document.getElementById('m02').addEventListener('click', () => load_product('PRODUCT'));

            document.getElementById('m03').addEventListener('click', () => load_kits('KITS'));
            document.getElementById('m13').addEventListener('click', () => $('#dialog-jsp').load('frame/dialog/kitcard.jsp'));
            document.getElementById('m23').addEventListener('click', () => $('#dialog-jsp').load('frame/dialog/artikl.jsp'));
            document.getElementById('m33').addEventListener('click', () => kits_update_table());
            document.getElementById('m43').addEventListener('click', () => kits_delete_table());

            document.getElementById('m14').addEventListener('click', () => load_tarif('TARIF'));
            document.getElementById('m24').addEventListener('click', () => load_smeta('Смета2'));
            document.getElementById('m34').addEventListener('click', () => load_check('Счёт2'));

            $("#nav2 > li > a").click(function (e) { // binding onclick
                
                if ($(this).parent().hasClass('selected')) {
                    $("#nav2 .selected div div").slideUp(100); // hiding popups
                    $("#nav2 .selected").removeClass("selected");
                } else {
                    $("#nav2 .selected div div").slideUp(100); // hiding popups
                    $("#nav2 .selected").removeClass("selected");

                    if ($(this).next(".subs").length) {
                        if ($('#body-jsp title').text() === nameJsp) {
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
                                            <li><a onClick="alert('01')">TEST3</a></li>
                                            <li><a onClick="alert('02')">TEST4</a></li>  
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
                                            <li><a onClick="">Сайт разработчика</a></li>
                                            <li><a onClick="wincalc.test();">О программе</a></li>
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
