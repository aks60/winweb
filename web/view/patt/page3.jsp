<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <style>
            #north, #midl, #west, #west2, #centr, #centr2, #soth {
                border: 2px solid #ccc;
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
            <div id="west" style="display: inline-block; height: 100%; width: 300px">
                WEST
            </div>
            <div id="centr" style="display: inline-flex;">
                <div id="west2" style="height: 100%; width: 200px">
                    WEST2
                </div>
                <div id="centr2" style="width: 100px">
                    CENTR2
                </div>                
            </div>                    
        </div>
        <div id="south" style="height: 20px">
            <h1>SOUTH</h1>
        </div>        
    </body>
</html>
