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
                delete_table1 as project_delete_table1} from './frame/project.js';

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

        function init_menu() {
            document.getElementById('m01').addEventListener('click', () => load_project('PROJECT'));
            document.getElementById('m11').addEventListener('click', () => project_insert_table1());
            document.getElementById('m21').addEventListener('click', () => project_update_table1());
            document.getElementById('m31').addEventListener('click', () => project_delete_table1());

            document.getElementById('m61').addEventListener('click', () => project_delete_table1());
            document.getElementById('m71').addEventListener('click', () => project_delete_table1());
            
            document.getElementById('m02').addEventListener('click', () => load_product('PRODUCT'));

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
                                            <li><a id='m51' onClick="$('#dialog-jsp').load('frame/dialog/systree.jsp')">Добавить конст.</a></li>
                                            <li><a id='m61'>Изменить конст.</a></li>
                                            <li><a id='m71'>Удалить конст.</a></li>
                                            <li><a class="separator"></a></li>
                                            <li><a id='m81'>Кальк. заказа</a></li>
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
                                            <li><a onClick="alert('01')">Добавить</a></li>
                                            <li><a onClick="alert('02')">Изменить</a></li>
                                            <li><a onClick="alert('03')">Удалить</a></li>    
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>                      
                    </li>
                    <li><a onClick="$('#body-jsp').load('frame/kits.jsp');">Комплекты</a></li>
                    <li><a>Отчеты</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a onClick="$('#body-jsp').load('frame/tarific.jsp');">Спецификация</a></li>
                                            <li><a onClick="">Смета</a></li>
                                            <li><a onClick="">Счёт-фактура</a></li>
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
