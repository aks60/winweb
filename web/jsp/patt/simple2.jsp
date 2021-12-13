
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>YUI 3.x: CSS Grids Fluid carcass</title>
<!--        <link rel="stylesheet" href="css/yui3-3.18.1/cssreset.css" type="text/css">
        <link rel="stylesheet" href="css/yui3-3.18.1/cssfonts.css" type="text/css">
        <link rel="stylesheet" href="css/yui3-3.18.1/cssgrids.css" type="text/css">    -->

        <style>
            #layout {
                padding-left:300px; 
                padding-right:150px; 
            }
            #nav {
                margin-left:-300px; 
                width:300px;          
            }
            #extra {
                width:150px;
                margin-right:-150px; 
            }
            #main {
                width:100%;
            }
            #hd, #nav .content, #main .content, #extra .content, #ft {
                border: 2px solid #ccc;
                height: 484px; 
            }
        </style>

    </head>
    <body>
        <div id="hd" style="height: 40px">
            <h6>Fluid Layout Template JSP</h6>
        </div>

        <div class="yui3-g" id="layout">
            <div class="yui3-u" id="nav">
                <div class="content">
                </div>
            </div>

            <div class="yui3-u" id="main">
                <div class="content" id="mc">
                </div>
            </div>

            <div class="yui3-u" id="extra">
                <div class="content">
                </div>
            </div>
        </div>

        <div id="ft" style="height: 20px"></div>
    </body>
</html>
