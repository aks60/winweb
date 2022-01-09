package model;

import dataset.Query;
import dataset.Record;
import domain.eProject;
import domain.eProprod;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.App;
import model.sys.Att;
import org.json.simple.JSONObject;

public class Product {
    
        public JSONObject prodList(HttpServletRequest request, HttpServletResponse response) {
        
        ArrayList<List> list = new ArrayList();

        Query qProprod = new Query(Att.att(request).connect(), eProprod.id, eProprod.name, eProprod.script,
                eProprod.project_id, eProprod.systree_id).select(eProprod.up, "order by", eProprod.name);
        for (Record rec : qProprod) {
            list.add(Arrays.asList(
                    rec.get(eProject.id),  
                    rec.get(eProprod.name), 
                    rec.get(eProprod.script),
                    rec.get(eProprod.project_id), 
                    rec.get(eProprod.systree_id)));
        }       
        JSONObject output = new JSONObject(App.asMap("prodList", list));
        return output;    
    } 
        
    public JSONObject prodList1(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();

        Query qProprod = new Query(Att.att(request).connect(), eProprod.id, eProprod.name, eProprod.script,
                eProprod.project_id, eProprod.systree_id).select(eProprod.up, "order by", eProprod.name);
        for (Record rec : qProprod) {
            list.add(Arrays.asList(
                    rec.get(eProject.id), 
                    rec.get(eProprod.name), 
                    rec.get(eProprod.script),
                    rec.get(eProprod.project_id), 
                    rec.get(eProprod.systree_id)));
        }       
        JSONObject output = new JSONObject(App.asMap("prodList", list));
        return output;        
    }
    
    public JSONObject prodList2(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<JSONObject> list = new ArrayList();

        Query qProprod = new Query(Att.att(request).connect(), eProprod.values()).select(eProprod.up);
        for (Record rec : qProprod) {
            JSONObject rec2 = new JSONObject(App.asMap(
                    "id", rec.get(eProject.id),
                    "name", rec.get(eProprod.name),
                    "script", rec.get(eProprod.script),
                    "project_id", rec.get(eProprod.project_id),
                    "systree_id", rec.get(eProprod.systree_id)
            ));
            list.add(rec2);
        }
        JSONObject output = new JSONObject(App.asMap("prodList", list));
        return output;
    }
}
