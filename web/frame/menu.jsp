<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Выпадающее меню на CSS3</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    </head>
    <body>
        <div class="menu">
            <img src='lib-img/logotype2.png' height="20px" width="20px" style="float: left; margin: 4px 4px">
            <span>
                <ul id="nav2">
                    <li><a onClick="$('#body-jsp').load('frame/project.jsp');">Заказы</a></li>
                    <li><a onClick="$('#body-jsp').load('frame/product.jsp');">Изделия</a></li>
                    <li><a onClick="$('#body-jsp').load('frame/kits.jsp');">Комплекты</a></li>
                    <li><a>Отчеты конст-ции</a>
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
                    <li><a>Отчеты заказа</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a>Спецификация</a></li>
                                            <ul>
                                                <li><a href="#">HTML</a></li>
                                                <li><a href="#">CSS</a></li>
                                            </ul>
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

        <script type="text/javascript">
            function init_menu() {
                $("#nav2 > li > a").click(function (e) { // binding onclick
                    if ($(this).parent().hasClass('selected')) {
                        $("#nav2 .selected div div").slideUp(100); // hiding popups
                        $("#nav2 .selected").removeClass("selected");
                    } else {
                        $("#nav2 .selected div div").slideUp(100); // hiding popups
                        $("#nav2 .selected").removeClass("selected");

                        if ($(this).next(".subs").length) {
                            $(this).parent().addClass("selected"); // display popup
                            $(this).next(".subs").children().slideDown(200);
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
    </body>
</html>
