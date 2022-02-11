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
        ArrayList<List> list = new ArrayList();
        Query qProject = new Query(Att.att(request).connect(), eProject.values()).select("select first(60) * from " + eProject.up.tname() + " order by date4 desc");
        for (Record rec : qProject) {
            list.add(Arrays.asList(
                    rec.get(eProject.id),
                    rec.get(eProject.num_ord),
                    rec.get(eProject.num_acc),
                    format(rec.get(eProject.date4)),
                    format(rec.get(eProject.date6)),
                    rec.get(eProject.propart_id),
                    rec.get(eProject.manager)));
        }
        JSONObject output = new JSONObject(App.asMap("orderList", list));
        return output;
    }

   private String format(Object date) {
       if(date instanceof Date) {
           return fd.format(date);
       }
       return null;
   } 
}
