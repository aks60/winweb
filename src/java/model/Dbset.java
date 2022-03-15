package model;

import builder.Wincalc;
import builder.making.Furniture;
import builder.model.AreaStvorka;
import common.UCom;
import dataset.Conn;
import dataset.Query;
import dataset.Record;
import domain.eArtdet;
import domain.eArtikl;
import domain.eColor;
import domain.eFurndet;
import domain.eFurniture;
import domain.eGroups;
import domain.eKitdet;
import domain.eKits;
import domain.eParams;
import domain.eProject;
import domain.eProkit;
import domain.ePropart;
import domain.eProprod;
import domain.eSysfurn;
import domain.eSyspar1;
import domain.eSysprod;
import domain.eSysprof;
import domain.eSystree;
import domain.eSysuser;
import enums.Type;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.LinkedList;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.App;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

public class Dbset {

    private static SimpleDateFormat fd = new SimpleDateFormat("dd.MM.yyyy");

    private static String format(Object date) {
        if (date instanceof Date) {
            return fd.format(date);
        }
        return null;
    }

    public static JSONObject systreeList(HttpServletRequest request, HttpServletResponse response) {
        Query qSystree = new Query(eSystree.values()).select(eSystree.up);
        return new JSONObject(App.asMap("systreeList", qSystree));
    }

    public static JSONObject sysprodList(HttpServletRequest request, HttpServletResponse response) {
        Query qSysprod = new Query(eSysprod.values()).select(eSysprod.up);
        return new JSONObject(App.asMap("sysprodList", qSysprod));
    }

    public static JSONObject groupList(HttpServletRequest request, HttpServletResponse response) {
        Query qGroup = new Query(eGroups.values()).select(eGroups.up, "order by", eGroups.name);
        return new JSONObject(App.asMap("groupList", qGroup));
    }

    public static JSONObject colorList(HttpServletRequest request, HttpServletResponse response) {
        Query qColor = new Query(eColor.values()).select(eColor.up, "where", eColor.id, " > 0", "order by", eColor.name);
        return new JSONObject(App.asMap("colorList", qColor));
    }

    public static JSONObject artiklList(HttpServletRequest request, HttpServletResponse response) {
        Query qArtikl = new Query(eArtikl.values()).select(eArtikl.up);
        return new JSONObject(App.asMap("artiklList", qArtikl));
    }

    public static JSONObject artdetList(HttpServletRequest request, HttpServletResponse response) {
        Query qArtdet = new Query(eArtdet.values()).select(eArtdet.up);
        return new JSONObject(App.asMap("artdetList", qArtdet));
    }

    public static JSONObject furndetList(HttpServletRequest request, HttpServletResponse response) {
        Query qFurndet = new Query(eFurndet.values()).select(eFurndet.up);
        return new JSONObject(App.asMap("furndetList", qFurndet));
    }

    public static JSONObject furnitureList(HttpServletRequest request, HttpServletResponse response) {
        Query qFurniture = new Query(eFurniture.values()).select(eFurniture.up);
        return new JSONObject(App.asMap("furnitureList", qFurniture));
    }

    public static JSONObject proprodList(HttpServletRequest request, HttpServletResponse response) {
        Query qProprod = new Query(eProprod.values()).select(eProprod.up);
        return new JSONObject(App.asMap("proprodList", qProprod));
    }

    public static JSONObject sysfurnList(HttpServletRequest request, HttpServletResponse response) {
        Query qSysfurn = new Query(eSysfurn.values()).select(eSysfurn.up, "order by", eSysfurn.npp);
        return new JSONObject(App.asMap("sysfurnList", qSysfurn));
    }

    public static JSONObject sysprofList(HttpServletRequest request, HttpServletResponse response) {
        Query qSysprof = new Query(eSysprof.values()).select(eSysprof.up, "order by", eSysprof.prio);
        return new JSONObject(App.asMap("sysprofList", qSysprof));
    }

    public static JSONObject syspar1List(HttpServletRequest request, HttpServletResponse response) {
        Query qSyspar1 = new Query(eSyspar1.values()).select(eSyspar1.up);
        return new JSONObject(App.asMap("syspar1List", qSyspar1));
    }

    public static JSONObject paramsList(HttpServletRequest request, HttpServletResponse response) {
        Query qParams = new Query(eParams.values()).select(eParams.up);
        return new JSONObject(App.asMap("paramsList", qParams));
    }

    public static JSONObject updateScript(HttpServletRequest request, HttpServletResponse response) {
        JSONObject output = new JSONObject();
        String param = request.getParameter("param");
        JSONObject obj = (JSONObject) JSONValue.parse(param);

        try (Connection connection = Conn.connection()) {
            Statement statement = statement = connection.createStatement();
            String sql = "update proprod set script = '" + obj.get("script") + "' where id = " + obj.get("id");
            statement.executeUpdate(sql);
            output.put("result", "ok");
            connection.close();
            return output;

        } catch (SQLException e) {
            return output;
        }
    }

    public static JSONObject insertOrder(HttpServletRequest request, HttpServletResponse response) {
        JSONObject output = new JSONObject();
        String param = request.getParameter("param");
        JSONObject obj = (JSONObject) JSONValue.parse(param);

        Query qProject = new Query(eProject.values());
        Record record = eProject.up.newRecord("INS");
        record.set(eProject.id, Conn.genId(eProject.up));
        record.set(eProject.num_ord, obj.get(eProject.num_ord.name()));
        record.set(eProject.num_acc, obj.get(eProject.num_acc.name()));
        record.set(eProject.manager, obj.get(eProject.manager.name()));
        record.set(eProject.date4, obj.get(eProject.date4.name()));
        record.set(eProject.date6, obj.get(eProject.date6.name()));
        record.set(eProject.propart_id, obj.get(eProject.propart_id.name()));
        qProject.insert(record);
        output.put("result", "ok");
        output.put("id", record.getInt(eProject.id));
        return output;
    }

    public static JSONObject insertProprod(HttpServletRequest request, HttpServletResponse response) {
        JSONObject output = new JSONObject();
        String param = request.getParameter("param");
        JSONObject obj = (JSONObject) JSONValue.parse(param);

        Query qProprod = new Query(eProprod.values());
        Record record = new Record();
        record.add("INS");
        record.add(Conn.genId(eProprod.up));
        record.add(0);
        record.add(obj.get("name"));
        record.add(obj.get("script"));
        record.add(obj.get("projectID"));
        record.add(obj.get("systreeID"));
        qProprod.insert(record);
        output.put("result", "ok");
        output.put("id", record.getInt(eProprod.id));
        return output;
    }

    public static JSONObject deleteProject(HttpServletRequest request, HttpServletResponse response) {
        JSONObject output = new JSONObject();
        String param = request.getParameter("param");
        JSONObject obj = (JSONObject) JSONValue.parse(param);
        Query qProject = new Query(eProject.values());
        Record record = eProject.up.newRecord("DEL");
        record.set(eProject.id, obj.get("id"));
        qProject.delete(record);
        output.put("result", "ok");
        return output;
    }

    public static JSONObject deleteProprod(HttpServletRequest request, HttpServletResponse response) {
        JSONObject output = new JSONObject();
        String param = request.getParameter("param");
        JSONObject obj = (JSONObject) JSONValue.parse(param);
        Query qProprod = new Query(eProprod.values());
        Record record = eProprod.up.newRecord("DEL");
        record.set(eProprod.id, obj.get("id"));
        qProprod.delete(record);
        output.put("result", "ok");
        return output;
    }

    public static JSONObject prokitList(HttpServletRequest request, HttpServletResponse response) {
        Query qProkit = new Query(eProkit.values()).select(eProkit.up);
        JSONObject output = new JSONObject(App.asMap("prokitList", qProkit));
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
        Query qSysuser = new Query(eSysuser.values()).select(eSysuser.up, "order by", eSysuser.login);
        JSONObject output = new JSONObject(App.asMap("userList", qSysuser));
        return output;
    }

    public static JSONObject orderList(HttpServletRequest request, HttpServletResponse response) {        
        Query qProject = new Query(eProject.values()).select("select a.* from project a, propart b where a.propart_id = b.id and b.category = 'дилер' order by a.id desc");
        for (Record rec : qProject) {
            rec.setNo(eProject.date4, format(rec.get(eProject.date4)));
            rec.setNo(eProject.date5, format(rec.get(eProject.date5)));
            rec.setNo(eProject.date6, format(rec.get(eProject.date6)));
        }
        JSONObject output = new JSONObject(App.asMap("orderList", qProject));
        return output;
    }

    public static JSONObject dealerList(HttpServletRequest request, HttpServletResponse response) {
        Query qPropart = new Query(ePropart.values()).select(ePropart.up, "where", ePropart.category, "= 'дилер'", "order by", ePropart.manager);
        return new JSONObject(App.asMap("dealerList", qPropart));
    }    

    public static JSONObject kitsList(HttpServletRequest request, HttpServletResponse response) {
        Query qKits = new Query(eKits.values()).select(eKits.up, "order by", eKits.id);
        return new JSONObject(App.asMap("kitsList", qKits));
    }    

    public static JSONObject kitdetList(HttpServletRequest request, HttpServletResponse response) {
        Query qKitdet = new Query(eKitdet.values()).select(eKitdet.up, "order by", eKitdet.id);
        return new JSONObject(App.asMap("kitdetList", qKitdet));
    }    
}
