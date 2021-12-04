<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                display: grid;
                grid-template-areas: 
                    "north north north"
                    "west cent east"
                    "south south south";
                grid-template-rows: 60px 1fr 60px;
                grid-template-columns: 20% 1fr 15%;
                grid-gap: 10px;
                height: 100vh;
                margin: 0;
            }
            #northID, #southID, #centID, #westID, #eastID {
                padding: 20px;
                background: #ddd;
            }
            #northID {
                grid-area: north;
            }
            #southID {
                grid-area: south;
            }
            #centID { 
                grid-area: cent;      
            }
            #westID { 
                grid-area: west; 
            }
            #eastID { 
                grid-area: east; 
            }
        </style>        
    </head>
    <body>
        <div id="northID">Header2</div>
        <div id="centID">Article2</div>
        <div id="westID">Nav2</div>
        <div id="eastID">Ads2</div>
        <div id="southID">Footer2</div>
    </body>
</html>

