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
        HashMap<String, List<List>> output = new HashMap();
        ArrayList<List> list = new ArrayList();
        output.put("prodList", list);
        Query qProprod = new Query(Att.att(request).connect(), eProprod.id, eProprod.name, eProprod.script, eProprod.project_id, eProprod.systree_id)
                .select(eProprod.up, "where id > 0", "order by", eProprod.name);
        for (Record record : qProprod) {
            list.add(Arrays.asList(record.get(eProject.id), record.get(eProprod.name), record.get(eProprod.script),
                    record.get(eProprod.project_id), record.get(eProprod.systree_id)));
        }
        return output;
    }
}
