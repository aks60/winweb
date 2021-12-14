package model;

import dataset.Query;
import dataset.Record;
import domain.eProject;
import domain.eSysuser;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.Att;

public class Order {
    private static SimpleDateFormat fd = new SimpleDateFormat("dd.MM.yyyy");

    public HashMap orderList(HttpServletRequest request, HttpServletResponse response) {
        HashMap<String, List<List>> output = new HashMap();
        ArrayList<List> list = new ArrayList();
        output.put("orderList", list);
        Query qProject = new Query(Att.att(request).connect(), eProject.id, eProject.num_ord, eProject.num_acc, eProject.date4, eProject.date6, 
                eProject.propart_id, eProject.manager).select(eProject.up, "where id > 17400", "order by", eProject.date4, ",", eProject.date6);
        for (Record record : qProject) {
            list.add(Arrays.asList(record.get(eProject.id), record.get(eProject.num_ord), record.get(eProject.num_acc),
                    fd.format(record.get(eProject.date4)), fd.format(record.get(eProject.date6)), record.get(eProject.propart_id), 
                    record.get(eProject.manager)));
        }
        return output;
    }    
}
