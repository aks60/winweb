<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <style>
            #north, #west, #west2, #midl, #south, #centr {
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
            <h1>NORD</h1>
        </div>
        <div id="midl" style="position: relative; margin: 0 2px 0 500px;">
            <div id="west" style="position: absolute; height: 100%; width: 500px; margin-left: -500px;">
                <div id="west2" style="height: 200px">
                    <h1>WEST-2</h1>
                </div>
                <div id="west3" style="height: 200px">
                    <h1>WEST-3</h1>
                </div>
            </div>                 
            <div id="centr" style="position: absolute; height: 100%; width: 100%;">
                <div>
                    CENTR ============ ============== ================= ============== ========
                </div>
            </div>                 
        </div>
        <div id="south" style="height: 20px">
            <h1>SOUTH</h1>
        </div>        
    </body>
</html>
