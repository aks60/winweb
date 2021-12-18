package model;

import dataset.Query;
import dataset.Record;
import domain.eProject;
import domain.eProprod;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.Att;

public class Product {

    public HashMap prodList(HttpServletRequest request, HttpServletResponse response, String prodID) {
        ArrayList<List> list = new ArrayList();

        Query qProprod = new Query(Att.att(request).connect(), eProprod.id, eProprod.name, eProprod.script,
                eProprod.project_id, eProprod.systree_id).select(eProprod.up, "where id > 0", "order by", eProprod.name);
        for (Record rec : qProprod) {
            list.add(Arrays.asList(
                    rec.get(eProject.id), 
                    rec.get(eProprod.name), 
                    rec.get(eProprod.script),
                    rec.get(eProprod.project_id), 
                    rec.get(eProprod.systree_id)));
        }
        HashMap<String, List<List>> output = new HashMap();
        output.put("prodList", list);
        return output;
    }
}
