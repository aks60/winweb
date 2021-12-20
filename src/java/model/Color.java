package model;

import dataset.Query;
import dataset.Record;
import domain.eGroups;
import enums.TypeGroups;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.Att;

public class Color {

    public HashMap colorGroup(HttpServletRequest request, HttpServletResponse response) {
        HashMap<String, List<List>> output = new HashMap();
        output.put("colorGroup", new ArrayList());
        Query qGroup = new Query(Att.att(request).connect(), eGroups.values()).select(eGroups.up, "where", eGroups.grup, "=", TypeGroups.COLOR.id, "order by", eGroups.name);
        for (Record rec : qGroup) {
            ((List) output.get("colorGroup")).add(Arrays.asList(
                    rec.get(eGroups.id),
                    rec.get(eGroups.name)));
        }
        return output;
    }
}
