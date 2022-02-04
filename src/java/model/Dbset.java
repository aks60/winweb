package model;

import dataset.Query;
import dataset.Record;
import domain.eArtdet;
import domain.eArtikl;
import domain.eColor;
import domain.eFurniture;
import domain.eGroups;
import domain.eProject;
import domain.eProprod;
import domain.eSysfurn;
import domain.eSysprod;
import domain.eSysprof;
import domain.eSystree;
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

    public static JSONObject systreeList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qSystree = new Query(Att.att(request).connect(), eSystree.id, eSystree.glas, eSystree.parent_id).select(eSystree.up);
        for (Record rec : qSystree) {
            list.add(Arrays.asList(
                    rec.get(eSystree.id),
                    rec.get(eSystree.glas),
                    rec.get(eSystree.parent_id)));
        }
        JSONObject output = new JSONObject(App.asMap("systreeList", list));
        return output;
    }

    public static JSONObject sysprodList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qSysprod = new Query(Att.att(request).connect(), eSysprod.id, eSysprod.name, eSysprod.script, eSysprod.systree_id).select(eSysprod.up);
        for (Record rec : qSysprod) {
            list.add(Arrays.asList(
                    rec.get(eSysprod.id),
                    rec.get(eSysprod.name),
                    rec.get(eSysprod.script),
                    rec.get(eSysprod.systree_id)));
        }
        JSONObject output = new JSONObject(App.asMap("sysprodList", list));
        return output;
    }

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
                eArtikl.name, eArtikl.code, eArtikl.height, eArtikl.analog_id).select(eArtikl.up);
        for (Record rec : qArtikl) {
            list.add(Arrays.asList(
                    rec.get(eArtikl.id),
                    rec.get(eArtikl.name),
                    rec.get(eArtikl.code),
                    rec.get(eArtikl.height),
                    rec.get(eArtikl.analog_id)));
        }
        JSONObject output = new JSONObject(App.asMap("artiklList", list));
        return output;
    }

    public static JSONObject artdetList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qArtdet = new Query(Att.att(request).connect(), eArtdet.id,
                eArtdet.color_fk, eArtdet.artikl_id).select(eArtdet.up);
        for (Record rec : qArtdet) {
            list.add(Arrays.asList(
                    rec.get(eArtdet.id),
                    rec.get(eArtdet.color_fk),
                    rec.get(eArtdet.artikl_id)));
        }
        JSONObject output = new JSONObject(App.asMap("artdetList", list));
        return output;
    }

    public static JSONObject furnitureList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qFurniture = new Query(Att.att(request).connect(), eFurniture.id, eFurniture.name).select(eFurniture.up);
        for (Record rec : qFurniture) {
            list.add(Arrays.asList(
                    rec.get(eFurniture.id),
                    rec.get(eFurniture.name)));
        }
        JSONObject output = new JSONObject(App.asMap("furnitureList", list));
        return output;
    }
    
    public static JSONObject proprodList(HttpServletRequest request, HttpServletResponse response) {
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
        JSONObject output = new JSONObject(App.asMap("proprodList", list));
        return output;
    }

    public static JSONObject sysfurnList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qSysfurn = new Query(Att.att(request).connect(), eSysfurn.id, eSysfurn.side_open, 
                eSysfurn.hand_pos, eSysfurn.systree_id, eSysfurn.furniture_id, eSysfurn.artikl_id1, eSysfurn.artikl_id2)
                .select(eSysfurn.up, "order by", eSysfurn.npp);
        for (Record rec : qSysfurn) {
            list.add(Arrays.asList(
                    rec.get(eSysfurn.id),
                    rec.get(eSysfurn.side_open),
                    rec.get(eSysfurn.hand_pos),
                    rec.get(eSysfurn.systree_id),
                    rec.get(eSysfurn.furniture_id),
                    rec.get(eSysfurn.artikl_id1),
                    rec.get(eSysfurn.artikl_id2)));
        }
        JSONObject output = new JSONObject(App.asMap("sysfurnList", list));
        return output;
    }

    public static JSONObject sysprofList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qSysprof = new Query(Att.att(request).connect(), eSysprof.id, eSysprof.prio, eSysprof.use_type,
                eSysprof.use_side, eSysprof.artikl_id, eSysprof.systree_id).select(eSysprof.up, "order by", eSysprof.prio);
        for (Record rec : qSysprof) {
            list.add(Arrays.asList(
                    rec.get(eSysprof.id),
                    rec.get(eSysprof.prio),
                    rec.get(eSysprof.use_type),
                    rec.get(eSysprof.use_side),
                    rec.get(eSysprof.artikl_id),
                    rec.get(eSysprof.systree_id)));
        }
        JSONObject output = new JSONObject(App.asMap("sysprofList", list));
        return output;
    }
}


    /*public static JSONObject sysfurnList2(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qSysfurn = new Query(Att.att(request).connect(), eSysfurn.values(), eFurniture.values())
                .select(eSysfurn.up, "left join", eFurniture.up, "on", eSysfurn.furniture_id, "=", eFurniture.id);
        Query qFurniture = qSysfurn.table(eFurniture.up);
        for (int index = 0; index < qSysfurn.size(); ++index) {
            Record rec = qSysfurn.get(index);
            Record rec2 = qFurniture.get(index);
            list.add(Arrays.asList(
                    rec.get(eSysfurn.id),
                    rec.get(eSysfurn.side_open),
                    rec.get(eSysfurn.hand_pos),
                    rec.get(eSysfurn.systree_id),
                    rec2.get(eFurniture.name)));
        }
        JSONObject output = new JSONObject(App.asMap("sysfurnList", list));
        return output;
    }*/
