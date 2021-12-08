<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <style>
            #north, #west, #midl, #south, #centr, #east {
                border: 2px solid #ccc;
            }
        </style>
        <script type="text/javascript">
            $(document).ready(function () {
                $(window).bind('resize', function () {
                    var height = window.innerHeight - 68;
                    $("#midl").css("height", height);
                }).trigger('resize');
            });
        </script>          
    </head>
    <body>
        <div id="north" style=" height: 20px;">
            <h1>NORTH</h1>
        </div>
        <div id="midl" style="position: relative; margin: 0 200px 0 300px;">
            <div id="west" style="position: absolute; height: 100%; width: 300px; margin-left: -300px;">
                <h1>WEST</h1>
            </div>                 
            <div id="centr" style="position: absolute; height: 100%; width: 100%;">
                <div>
                    CENTR ============ ============== ================= ============== ========
                </div>
            </div>  
            <div id="EAST" style="position: absolute; height: 100%; width: 198px; right: -200px;">
                <h1>EAST</h1>
            </div>             
        </div>
        <div id="south" style="height: 20px">
            <h1>SOUTH</h1>
        </div>        
    </body>
</html>

