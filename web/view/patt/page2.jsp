<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <style>
            #north, #midl, #west, #south, #each, #centr {
                border-left: 2px solid #ccc;
                border-top: 2px solid #ccc;
                border-bottom: 2px solid #ccc;
            }
            #midl {
               padding-right:300px; 
               padding-left: 280px; 
            }
        </style>
        <script type="text/javascript">
            $(document).ready(function () {
                upBody();
            });
            function upBody() {
                $(window).bind('resize', function () {
                    var height = window.innerHeight - 76;
                    $("#midl").css("height", height);
                }).trigger('resize');
            }
        </script>          
    </head>
    <body>
        <div id="nord" style=" height: 40px">
            <h1>NORD</h1>
        </div>
        <div id="midl">
            <div id="west" style="display: inline-block; height: 100%; width: 300px; margin-left: -300px;">
                WEST
            </div>
            <div id="centr" style="display: inline-block; height: 100%; width: 90%">
                CENTR
            </div>                    
            <div id="each" style="display: inline-block; height: 100%; width: 300px; margin-right:-280px;">
                EACH
            </div>                    
        </div>
        <div id="south" style="height: 20px">
            <h1>SOUTH</h1>
        </div>        
    </body>
</html>
