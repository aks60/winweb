package model;

import dataset.Query;
import dataset.Record;
import domain.eProject;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.App;
import model.sys.Att;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

public class Order {

    private static SimpleDateFormat fd = new SimpleDateFormat("dd.MM.yyyy");

    public JSONObject orderList(HttpServletRequest request, HttpServletResponse response) {
        Query qProject = new Query(eProject.values()).select("select first(60) * from " + eProject.up.tname() + " order by date4 desc");
        return new JSONObject(App.asMap("orderList", qProject));
    }

   private String format(Object date) {
       if(date instanceof Date) {
           return fd.format(date);
       }
       return null;
   } 
}
