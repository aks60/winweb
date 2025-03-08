
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>YUI 3.x: CSS Grids Fixed carcass</title>
        <link rel="stylesheet" href="css/yui-yahoo-3.14.1/cssreset.css" type="text/css">
        <link rel="stylesheet" href="css/yui-yahoo-3.14.1/cssfonts.css" type="text/css">
        <link rel="stylesheet" href="css/yui-yahoo-3.14.1/cssgrids.css" type="text/css">


        <style>
/*            #doc {
                margin:auto; 
                //height: 600px; 
                width: 800; 
            }*/
            #hd, .yui3-g .content, #ft {
                border: 2px solid #ccc;
                height: 484px; 
                /*//margin-right: 10px;*/
            }
            #hd, #ft {
                height: 20px;
            }
        </style>

    </head>
    <body>
        <div id="doc">
            <div id="hd">
                <h1></h1>
            </div>
            <div class="yui3-g">
                <div class="yui3-u-1">
                    <div class="content"></div>
                </div>               
            </div>
            <div id="ft"></div>
        </div>
    </body>
</html>



