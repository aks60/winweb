<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Выпадающее меню на CSS3</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" media="screen" href="css/menu.css">

        <script type="text/javascript">

            $(document).ready(function () {
//                $(".admin").show();
            });
            function loadBody(url) {
                $('#outbody').load(url, function () {
                    upBody();
                    $("button").button();
                });
            }
        </script> 
    </head>
    <body>
        <div class="menu" style="margin-top: -6px; margin-left: 2px; margin-right: 2px;">
            <img src='img/tool/logotype3.png' height="20px" width="20px" style="padding-top: 2px;">
            <span>
                <ul id="nav2">
                    <li><a href="#">Информация</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a href="#" onClick="loadBody('view/uch/uch.jsp')">Учреждение</a></li>
                                            <li><a href="#" onClick="loadBody('view/dict/dict.jsp')">Справочники общие</a></li>
                                            <li><a href="#" onClick="loadBody('view/dict/kladr.jsp')">Справочники адресов</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                    </li>
                    <li><a href="#">Сотрудники</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a href="#"onClick="loadBody('view/pers/persLd.jsp');">Личные дела сотрудников</a></li>
                                            <li><a href="#"onClick="loadBody('view/pers/persStaf.jsp');">Штатное расписание</a></li>
                                            <li><a href="#"onClick="loadBody('view/pers/persAct.jsp');">Личные достижения</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li><a href="#">Учащиеся</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a href="#" onClick="loadBody('view/pupil/pupilLd.jsp')">Личные дела учеников</a></li>                                          
                                            <li><a href="#" onClick="loadBody('view/pupil/pupilLs.jsp');">Списки объединений</a></li>
                                            <li><a href="#" onClick="loadBody('view/pupil/pupilAct.jsp');">Личные достижения</a></li>

                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li><a href="#">Планирование</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a href="#" onClick="loadBody('view/plan/subj.jsp');">Обр. программы</a></li>
                                            <li><a href="#" onClick="loadBody('view/plan/group.jsp');">Объединения</a></li>
                                            <li><a href="#" onClick="loadBody('view/plan/plan.jsp');">Учебный план</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>

                    <li><a href="#">Отчеты</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a href="#" onClick="loadBody('view/report/pupDo1.jsp');">Данные для отчета № 1-ДО</a></li>
                                            <li><a href="#" onClick="loadBody('view/report/pupMonit.jsp');">Мониторинг по учащимся</a></li>
                                            <li><a href="#" onClick="loadBody('view/report/persMonit.jsp');">Мониторинг по сотрудникам</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>                                
                    </li>
                    <li><a href="#">Сервис</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a href="#" onClick="loadBody('');">Качество заполнения бд</a></li>
                                            <li class="manager" style="display: none;"><a href="#" onClick="loadBody('view/admin/users.jsp');">Пользователи</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>  
                    </li> 
                    <li><a href="#">Справка</a>
                        <div class="subs">
                            <div>
                                <ul>
                                    <li>
                                        <ul>
                                            <li><a href="#" onClick="loadBody('');">Справка по программе</a></li>
                                            <li><a href="#" onClick="loadBody('');">Часто задаваемые вопросы</a></li>
                                            <li><a href="#" onClick="loadBody('view/patt/simpl4.jsp');">О программе</a></li>
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
        function onMenu() {
            //alert('click1');
            $("#nav2 > li > a").click(function (e) { // binding onclick
                //alert('click2');
                if ($(this).parent().hasClass('selected')) {
                    //alert('click3');
                    $("#nav2 .selected div div").slideUp(100); // hiding popups
                    $("#nav2 .selected").removeClass("selected");
                } else {
                    $("#nav2 .selected div div").slideUp(100); // hiding popups
                    $("#nav2 .selected").removeClass("selected");

                    if ($(this).next(".subs").length) {
                        //alert('click4');
                        $(this).parent().addClass("selected"); // display popup
                        $(this).next(".subs").children().slideDown(200);
                    }
                }
                e.stopPropagation();
            });

            $("body").click(function () { // binding onclick to body
                //alert('click5');
                $("#nav2 .selected div div").slideUp(100); // hiding popups
                $("#nav2 .selected").removeClass("selected");
            });
        }
        </script> 
</body>
</html>
