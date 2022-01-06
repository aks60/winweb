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
import org.json.simple.JSONObject;

public class Color {

    public JSONObject colorGroup(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();

        Query qGroup = new Query(Att.att(request).connect(), eGroups.values()).select(eGroups.up, "where", eGroups.grup, "=", TypeGroups.COLOR.id, "order by", eGroups.name);
        for (Record rec : qGroup) {
            list.add(Arrays.asList(
                    rec.get(eGroups.id),
                    rec.get(eGroups.name)));
        }
        JSONObject output = new JSONObject();
        output.put("colorGroup", list);
        return output;
    }

    public JSONObject colorList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();

        Query qColor = new Query(Att.att(request).connect(), eColor.values()).select(eColor.up, "where", eColor.id, " > 0", "order by", eColor.name);
        for (Record rec : qColor) {
            list.add(Arrays.asList(
                    rec.get(eColor.id),
                    rec.get(eColor.name),
                    rec.get(eColor.colgrp_id)));
        }
        JSONObject output = new JSONObject();
        output.put("colorList", list);
        return output;
    }
}
