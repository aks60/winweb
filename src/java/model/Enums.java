package model;

import enums.UseSide;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.App;
import org.json.simple.JSONObject;

public class Enums {
  
    public static JSONObject enumList(HttpServletRequest request, HttpServletResponse response) {

       for(UseSide en: UseSide.values()) {
           
       }
        JSONObject output = new JSONObject(App.asMap(
                "UseSide", App.asMap(UseSide.ANY, UseSide.MANUAL, UseSide.HORIZ, UseSide.VERT, UseSide.BOT, UseSide.RIGHT, UseSide.TOP, UseSide.LEFT))
        );
        return output;
    }    
}
