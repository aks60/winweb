package model;

import dataset.Query;
import dataset.Record;
import domain.eColor;
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

    public HashMap colorList(HttpServletRequest request, HttpServletResponse response) {
        HashMap<String, List<List>> output = new HashMap();
        output.put("colorList", new ArrayList());
        Query qColor = new Query(Att.att(request).connect(), eColor.values()).select(eColor.up, "where", eColor.id, " > 0", "order by", eColor.name);
        for (Record rec : qColor) {
            ((List) output.get("colorList")).add(Arrays.asList(
                    rec.get(eColor.id),
                    rec.get(eColor.name)));
        }
        return output;
    }
}
