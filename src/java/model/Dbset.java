package model;

import builder.Wincalc;
import builder.making.Furniture;
import builder.model.AreaStvorka;
import common.UCom;
import dataset.Query;
import dataset.Record;
import domain.eArtdet;
import domain.eArtikl;
import domain.eColor;
import domain.eFurniture;
import domain.eGroups;
import domain.eParams;
import domain.eProject;
import domain.eProkit;
import domain.eProprod;
import domain.eSysfurn;
import domain.eSyspar1;
import domain.eSysprod;
import domain.eSysprof;
import domain.eSystree;
import domain.eSysuser;
import enums.Type;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.App;
import model.sys.Att;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

public class Dbset {

    public static JSONObject systreeList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qSystree = new Query(eSystree.id, eSystree.name, eSystree.glas, eSystree.depth,
                eSystree.col1, eSystree.col2, eSystree.col3, eSystree.cgrp, eSystree.types, eSystree.parent_id).select(eSystree.up);
        for (Record rec : qSystree) {
            list.add(Arrays.asList(
                    rec.get(eSystree.id),
                    rec.get(eSystree.name),
                    rec.get(eSystree.glas),
                    rec.get(eSystree.depth),
                    rec.get(eSystree.col1),
                    rec.get(eSystree.col2),
                    rec.get(eSystree.col3),
                    rec.get(eSystree.cgrp),
                    rec.get(eSystree.types),
                    rec.get(eSystree.parent_id)));
        }
        JSONObject output = new JSONObject(App.asMap("systreeList", list));
        return output;
    }

    public static JSONObject sysprodList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qSysprod = new Query(eSysprod.id, eSysprod.name, eSysprod.script, eSysprod.systree_id).select(eSysprod.up);
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

    public static JSONObject groupList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qGroup = new Query(eGroups.values()).select(eGroups.up, "order by", eGroups.name);
        for (Record rec : qGroup) {
            list.add(Arrays.asList(
                    rec.get(eGroups.id),
                    rec.get(eGroups.grup),
                    rec.get(eGroups.name),
                    rec.get(eGroups.val)));
        }
        JSONObject output = new JSONObject(App.asMap("groupList", list));
        return output;
    }

    public static JSONObject colorList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qColor = new Query(eColor.values()).select(eColor.up, "where", eColor.id, " > 0", "order by", eColor.name);
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
        Query qArtikl = new Query(eArtikl.id, eArtikl.code, eArtikl.level1,
                eArtikl.level2, eArtikl.name, eArtikl.height, eArtikl.depth, eArtikl.analog_id).select(eArtikl.up);
        for (Record rec : qArtikl) {
            list.add(Arrays.asList(
                    rec.get(eArtikl.id),
                    rec.get(eArtikl.code),
                    rec.get(eArtikl.level1),
                    rec.get(eArtikl.level2),
                    rec.get(eArtikl.name),
                    rec.get(eArtikl.height),
                    rec.get(eArtikl.depth),
                    rec.get(eArtikl.analog_id)));
        }
        JSONObject output = new JSONObject(App.asMap("artiklList", list));
        return output;
    }

    public static JSONObject artdetList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qArtdet = new Query(eArtdet.id, eArtdet.color_fk, eArtdet.artikl_id).select(eArtdet.up);
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
        Query qFurniture = new Query(eFurniture.id, eFurniture.name).select(eFurniture.up);
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
        Query qProprod = new Query(eProprod.id, eProprod.name, eProprod.script,
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
        Query qSysfurn = new Query(eSysfurn.id, eSysfurn.side_open,
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
        Query qSysprof = new Query(eSysprof.id, eSysprof.prio, eSysprof.use_type,
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

    public static JSONObject syspar1List(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qSyspar1 = new Query(eSyspar1.id, eSyspar1.text, eSyspar1.params_id, eSyspar1.fixed, eSyspar1.systree_id).select(eSyspar1.up);
        for (Record rec : qSyspar1) {
            list.add(Arrays.asList(
                    rec.get(eSyspar1.id),
                    rec.get(eSyspar1.text),
                    rec.get(eSyspar1.params_id),
                    rec.get(eSyspar1.fixed),
                    rec.get(eSyspar1.systree_id)));
        }
        JSONObject output = new JSONObject(App.asMap("syspar1List", list));
        return output;
    }

    public static JSONObject paramsList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        Query qParams = new Query(eParams.id, eParams.text, eParams.params_id).select(eParams.up);
        for (Record rec : qParams) {
            list.add(Arrays.asList(
                    rec.get(eParams.id),
                    rec.get(eParams.text),
                    rec.get(eParams.params_id)));
        }
        JSONObject output = new JSONObject(App.asMap("paramsList", list));
        return output;
    }

    public static JSONObject saveScript(HttpServletRequest request, HttpServletResponse response) {
        JSONObject output = new JSONObject();
        String param = request.getParameter("param");
        JSONObject obj = (JSONObject) JSONValue.parse(param);

        try (Connection connection = Att.att(request).connect()) {
            Statement statement = statement = connection.createStatement();
            String sql = "update proprod set script = '" + obj.get("script") + "' where id = " + obj.get("id");
            statement.executeUpdate(sql);
            output.put("result", "ok");
            return output;

        } catch (SQLException e) {
            return output;
        }
    }

    public static JSONObject kitsList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();

        Query qProkit = new Query(eProkit.values()).select(eProkit.up);
        for (Record rec : qProkit) {
            list.add(Arrays.asList(
                    rec.get(eProkit.id),
                    rec.get(eProkit.artikl_id),
                    rec.get(eProkit.artikl_id),
                    rec.get(eProkit.color1_id),
                    rec.get(eProkit.color2_id),
                    rec.get(eProkit.color3_id),
                    rec.get(eProkit.width),
                    rec.get(eProkit.height),
                    rec.get(eProkit.numb),
                    rec.get(eProkit.angl1),
                    rec.get(eProkit.angl2)));
        }
        JSONObject output = new JSONObject(App.asMap("kitsList", list));
        return output;
    }

    public static JSONObject stvFields(HttpServletRequest request, HttpServletResponse response) {
        HashMap<Integer, HashMap> hm = new HashMap();
        String proprodID = request.getParameter("proprodID");
        Query qProprod = new Query(eProprod.values()).select(eProprod.up, "where", eProprod.id, "=", proprodID);
        String script = qProprod.getAs(0, eProprod.script);
        Wincalc winc = new Wincalc(script);
        new Furniture(winc, true);
        LinkedList<AreaStvorka> stvList = UCom.listSortObj(winc.listSortAr, Type.STVORKA);
        for (AreaStvorka areaStv : stvList) {
            hm.put((int) areaStv.id(), App.asMap(
                    "handleRec", areaStv.handleRec, "handleColor", areaStv.handleColor,
                    "loopRec", areaStv.loopRec, "loopColor", areaStv.loopColor,
                    "lockRec", areaStv.lockRec, "lockColor", areaStv.lockColor));
        }
        JSONObject output = new JSONObject(App.asMap("stvFields", hm));
        return output;
    }

    public static JSONObject userList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();

        Query qSysuser = new Query(eSysuser.values()).select(eSysuser.up, "order by", eSysuser.login);
        for (Record rec : qSysuser) {
            list.add(Arrays.asList(
                    rec.get(eSysuser.id),
                    rec.get(eSysuser.fio),
                    rec.get(eSysuser.desc),
                    rec.get(eSysuser.login),
                    rec.get(eSysuser.role)));
        }
        JSONObject output = new JSONObject(App.asMap("userList", list));
        return output;
    }
}
