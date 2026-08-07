<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="module" src="frame/partner.js"></script> 
        <title>PARTNER</title>
        <style>
        </style>        
        <script type="module">
            import {partner} from './frame/partner.js';

            partner.table1 = document.getElementById('table1');
            $(window).unbind('resize').bind('resize', partner.resize);
            partner.init_table();
            partner.load_table1();
            deployTaq(['#east', '#tabs']);
            $('#dialog-card1').tabs();
//            $("#dialog-card1").tabs({
//                active: 0, // открывает первую вкладку по умолчанию
//                heightStyle: "content" // высота карточки подстроится под текущий контент
//            });
            $(partner.table1).jqGrid("setSelection", 1);
        </script>         
    </head>   
    <body>
        <div id = "context">           
            <div id="dialog-card1" card_width="600" card_height="540" style="background: #efeffb; display: none;"> 
                <div id="tabs">
                    <jst id="k11" type='txt' label='Заказчик' width='120' width2="436"></jst><br><br>
                    <ul>
                        <li><a href="#tab1">Частное лицо</a>
                        <li><a href="#tab2">Организация</a>           
                    </ul>                      
                    <div id="tab1" style="height: 160px;">
                        <jst id="k12" type='txt' label='Телефон' width='120' width2="400"></jst><br>
                        <jst id="k13" type='txt' label='E-mail' width='120' width2="400"></jst><br>
                        <jst id="k14" type='txt' label='Адрес 1го уровня' width='120' width2="400"></jst><br>
                        <jst id="k15" type='txt' label='Адрес 2го уровня' width='120' width2="400"></jst><br>
                        <jst id="k16" type='txt' label='Примечание' width='120' width2="400"></jst><br>
                    </div>
                    <div id="tab2" style="height: 160px;">
                        <jst id="k18" type='txt' label='Контакт. лицо' width='120' width2="400"></jst><br>
                        <jst id="k19" type='txt' label='Телефон' width='120' width2="400"></jst><br>
                        <jst id="k20" type='txt' label='E-mail' width='120' width2="400"></jst><br>
                        <jst id="k21" type='txt' label='Адрес 1го уровня' width='120' width2="400"></jst><br>
                        <jst id="k22" type='txt' label='Адрес 2го уровня' width='120' width2="400"></jst><br>
                        <jst id="k23" type='txt' label='Примечание' width='120' width2="400"></jst><br>
                    </div>
                    <div id="tab3" style="height: 100%; margin-left: 18px; background: #efeffb;"> 
                        <jst id="k24" type='txt' label='Банк' width='120' width2="400"></jst><br>
                        <jst id="k25" type='txt' label='ИНН' width='120' width2="400"></jst><br>
                        <jst id="k26" type='txt' label='Р/С' width='120' width2="400"></jst><br>
                        <jst id="k27" type='txt' label='БИК' width='120' width2="400"></jst><br>
                        <jst id="k28" type='txt' label='К/С' width='120' width2="400"></jst><br>
                        <jst id="k29" type='txt' label='КПП' width='120' width2="400"></jst><br>
                        <jst id="k30" type='txt' label='ОГРН' width='120' width2="400"></jst><br>
                    </div>                
                </div>
            </div>
            <div id="midl" style="position: relative; margin-right: 550px; height: 100%"> 

                <div id="centr" style="height: 100%; width: 100%; margin-top: 0px;">
                    <table id="table1"  class="ui-jqgrid-btable"></table> 
                </div>
                <div id="east" style="position: absolute; width: 554px; height: 100%; top: 0; right: -550px;">
                    <div id="east1" style="height: 170px; background: #efeffb">
                        &nbsp;&nbsp;&nbsp;<label>Частное лицо</label><br>
                        <jst id="p11" type='txt' label='Заказчик' width='120' width2="400" nul='r'></jst><br>
                        <jst id="p12" type='txt' label='Телефон' width='120' width2="400" nul='r'></jst><br>
                        <jst id="p13" type='txt' label='E-mail' width='120' width2="400" nul='r'></jst><br>
                        <jst id="p14" type='txt' label='Адрес 1го уровня' width='120' width2="400" nul='r'></jst><br>
                        <jst id="p15" type='txt' label='Адрес 2го уровня' width='120' width2="400" nul='r'></jst><br>
                    </div>
                    <div id="east2" style="height: 170px; background: #efeffb">
                        &nbsp;&nbsp;&nbsp;<label>Организация</label><br>
                        <jst id="p17" type='txt' label='Заказчик' width='120' width2="400" nul='r'></jst><br>
                        <jst id="p18" type='txt' label='Контакт. лицо' width='120' width2="400" nul='r'></jst><br>
                        <jst id="p19" type='txt' label='Телефон' width='120' width2="400" nul='r'></jst><br>
                        <jst id="p20" type='txt' label='E-mail' width='120' width2="400" nul='r'></jst><br>
                        <jst id="p21" type='txt' label='Адрес 1го уровня' width='120' width2="400" nul='r'></jst><br>
                        <jst id="p22" type='txt' label='Адрес 2го уровня' width='120' width2="400" nul='r'></jst><br>
                    </div>
                    <div id="east3" style="height: calc(100% - 170px); background: #efeffb;"> 
                        <jst id="p24" type='txt' label='Банк' width='80' width2="440" nul='r'></jst><br>
                        <jst id="p25" type='txt' label='ИНН' width='80' width2="440" nul='r'></jst><br>
                        <jst id="p26" type='txt' label='Р/С' width='80' width2="440" nul='r'></jst><br>
                        <jst id="p27" type='txt' label='БИК' width='80' width2="440" nul='r'></jst><br>
                        <jst id="p28" type='txt' label='К/С' width='80' width2="440" nul='r'></jst><br>
                        <jst id="p29" type='txt' label='КПП' width='80' width2="440" nul='r'></jst><br>
                        <jst id="p30" type='txt' label='ОГРН' width='80' width2="440" nul='r'></jst><br>
                        <jst id="p16" type='txt' label='Примечание' width='80' width2="440" nul='r'></jst><br>
                    </div>
                </div>
            </div>
        </div>
        <div id="south"></div> 
    </body>
</html>
