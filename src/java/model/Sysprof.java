package model;

import dataset.Query;
import dataset.Record;
import domain.eProject;
import domain.eSysprof;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.Att;

public class Sysprof {

    public HashMap sysprofList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qSysprof = new Query(Att.att(request).connect(), eSysprof.id, eSysprof.use_side, eSysprof.artikl_id, eSysprof.systree_id)
                .select(eSysprof.up, "where", eSysprof.systree_id, "= 8", "order by", eSysprof.id);
        for (Record rec : qSysprof) {
            list.add(Arrays.asList(
                    rec.get(eSysprof.id),
                    rec.get(eSysprof.use_side),
                    rec.get(eSysprof.artikl_id),
                    rec.get(eSysprof.systree_id)));
        }
        HashMap<String, List<List>> output = new HashMap();
        output.put("sysprofList", list);
        return output;
    }
}
