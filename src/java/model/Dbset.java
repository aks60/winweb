package model;

import dataset.Query;
import dataset.Record;
import domain.eArtdet;
import domain.eArtikl;
import domain.eColor;
import domain.eGroups;
import domain.eProject;
import domain.eProprod;
import enums.TypeGroups;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.App;
import model.sys.Att;
import org.json.simple.JSONObject;

public class Dbset {

    public static JSONObject colorGroup(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qGroup = new Query(Att.att(request).connect(), eGroups.values())
                .select(eGroups.up, "where", eGroups.grup, "=", TypeGroups.COLOR.id, "order by", eGroups.name);
        for (Record rec : qGroup) {
            list.add(Arrays.asList(
                    rec.get(eGroups.id),
                    rec.get(eGroups.name)));
        }
        JSONObject output = new JSONObject(App.asMap("colorGroup", list));
        return output;
    }

    public static JSONObject colorList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qColor = new Query(Att.att(request).connect(), 
                eColor.values()).select(eColor.up, "where", eColor.id, " > 0", "order by", eColor.name);
        for (Record rec : qColor) {
            list.add(Arrays.asList(
                    rec.get(eColor.id),
                    rec.get(eColor.name),
                    rec.get(eColor.rgb),
                    rec.get(eColor.colgrp_id)));
        }
        JSONObject output = new JSONObject(App.asMap("colorList", list));
        return output;
    }

    public static JSONObject artiklList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qArtikl = new Query(Att.att(request).connect(), eArtikl.id, 
                eArtikl.name, eArtikl.code, eArtikl.height).select(eArtikl.up);
        for (Record rec : qArtikl) {
            list.add(Arrays.asList(
                    rec.get(eArtikl.id),
                    rec.get(eArtikl.name),
                    rec.get(eArtikl.code),
                    rec.get(eArtikl.height)));
        }
        JSONObject output = new JSONObject(App.asMap("artiklList", list));
        return output;
    }

    public static JSONObject artdetList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qArtdet = new Query(Att.att(request).connect(), eArtdet.id,
                 eArtdet.color_fk, eArtdet.artikl_id).select(eArtikl.up);
        for (Record rec : qArtdet) {
            list.add(Arrays.asList(
                    rec.get(eArtdet.id),
                    rec.get(eArtdet.color_fk),
                    rec.get(eArtdet.artikl_id)));
        }
        JSONObject output = new JSONObject(App.asMap("artdetList", list));
        return output;
    }

    public static JSONObject prodList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qProprod = new Query(Att.att(request).connect(), eProprod.id, eProprod.name, eProprod.script,
                eProprod.project_id, eProprod.systree_id).select(eProprod.up);
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

}
