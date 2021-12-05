<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>TODO 111</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            #gridID { 
                display: grid;
                grid-template-areas: 
                    "header header header"
                    "nav article ads"
                    "footer footer footer";
                grid-template-rows: 60px 1fr 60px;
                grid-template-columns: 20% 1fr 15%;
                grid-gap: 10px;
                height: 100vh;
                margin: 0;
            }
            header, footer, article, nav, div {
                padding: 20px;
                background: gold;
            }
            #pageHeader {
                grid-area: header;
            }
            #pageFooter {
                grid-area: footer;
            }
            #mainArticle { 
                grid-area: article;      
            }
            #mainNav { 
                grid-area: nav; 
            }
            #siteAds { 
                grid-area: ads; 
            }
        </style>        
    </head>
    <body>
        <div id="gridID">
            <header id="pageHeader">Header</header>
            <article id="mainArticle">Article</article>
            <nav id="mainNav">Nav</nav>
            <div id="siteAds">Ads</div>
            <footer id="pageFooter">Footer*</footer>
        </div>
    </body>
</html>
