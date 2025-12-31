package controller;

import com.google.gson.Gson;
import dataset.Connect;
import dataset.Field;
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
import domain.ePrjkit;
import domain.ePrjpart;
import domain.ePrjprod;
import domain.eSysfurn;
import domain.eSyspar1;
import domain.eSysprod;
import domain.eSysprof;
import domain.eSystree;
import domain.eSysuser;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import controller.sys.App;
import domain.eElement;
import domain.eSyssize;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

public class Dbset {

    private static SimpleDateFormat fd = new SimpleDateFormat("dd.MM.yyyy");
    private static Gson gson = new Gson();

    private static String format2(Object date) {
        if (date instanceof Date) {
            return fd.format(date);
        }
        return null;
    }

    private static Object format3(JSONArray arr, Field field) {
        Object obj = arr.get(field.ordinal());
        return ("".equals(obj)) ? null : obj;
    }

    private static Object format4(JSONObject obj, Field field) {
        Object ob2 = obj.get(field.name());
        return (ob2 == null || ob2.equals("")) ? null : ob2;
    }

    public static String systreeList(HttpServletRequest request, HttpServletResponse response) {
        Query qSystree = new Query(eSystree.values()).select(eSystree.up);
        return gson.toJson(qSystree);
    }

    public static String sysprodList(HttpServletRequest request, HttpServletResponse response) {
        Query qSysprod = new Query(eSysprod.values()).select(eSysprod.up);
        return gson.toJson(qSysprod);
    }

    public static String groupList(HttpServletRequest request, HttpServletResponse response) {
        Query qGroup = new Query(eGroups.values()).select(eGroups.up, "order by", eGroups.name);
        return gson.toJson(qGroup);
    }

    public static String colorList(HttpServletRequest request, HttpServletResponse response) {
        Query qColor = new Query(eColor.values()).select(eColor.up, "where", eColor.id, " > 0", "order by", eColor.name);
        return gson.toJson(qColor);
    }

    public static String artiklList(HttpServletRequest request, HttpServletResponse response) {
        Query qArtikl = new Query(eArtikl.values()).select(eArtikl.up, "order by ", eArtikl.level1);
        return gson.toJson(qArtikl);
    }

    public static String artdetList(HttpServletRequest request, HttpServletResponse response) {
        Query qArtdet = new Query(eArtdet.values()).select(eArtdet.up);
        return gson.toJson(qArtdet);
    }

    public static String furndetList(HttpServletRequest request, HttpServletResponse response) {
        Query qFurndet = new Query(eFurndet.values()).select(eFurndet.up);
        return gson.toJson(qFurndet);
    }

    public static String furnitureList(HttpServletRequest request, HttpServletResponse response) {
        Query qFurniture = new Query(eFurniture.values()).select(eFurniture.up);
        return gson.toJson(qFurniture);
    }

    public static String prjprodList(HttpServletRequest request, HttpServletResponse response) {
        Query qPrjprod = new Query(ePrjprod.values()).select(ePrjprod.up);
        return gson.toJson(qPrjprod);
    }

    public static String sysfurnList(HttpServletRequest request, HttpServletResponse response) {
        Query qSysfurn = new Query(eSysfurn.values()).select(eSysfurn.up, "order by", eSysfurn.npp);
        return gson.toJson(qSysfurn);
    }

    public static String sysprofList(HttpServletRequest request, HttpServletResponse response) {
        Query qSysprof = new Query(eSysprof.values()).select(eSysprof.up, "order by", eSysprof.npp);
        return gson.toJson(qSysprof);
    }

    public static String syspar1List(HttpServletRequest request, HttpServletResponse response) {
        Query qSyspar1 = new Query(eSyspar1.values()).select(eSyspar1.up);
       return gson.toJson(qSyspar1);
    }

    public static String paramsList(HttpServletRequest request, HttpServletResponse response) {
        Query qParams = new Query(eParams.values()).select(eParams.up);
        return gson.toJson(qParams);
    }

    public static JSONObject updateScript(HttpServletRequest request, HttpServletResponse response) {
        String param = request.getParameter("param");
        JSONObject obj = (JSONObject) JSONValue.parse(param);

        try (Connection connection = Connect.getConnection()) {
            Statement statement = statement = connection.createStatement();
            String sql = "update prjprod set script = '" + obj.get("script") + "' where id = " + obj.get("id");
            statement.executeUpdate(sql);
            connection.close();
            return new JSONObject(App.asMap("result", "ok"));

        } catch (SQLException e) {
            return new JSONObject(App.asMap("result", "Ошибка: " + e));
        }
    }

    public static JSONObject insertOrder(HttpServletRequest request, HttpServletResponse response) {
        try {
            String param = request.getParameter("param");
            JSONObject obj = (JSONObject) JSONValue.parse(param);
            Query qProject = new Query(eProject.values());
            Record record = eProject.up.newRecord("INS");
            record.set(eProject.id, format4(obj, eProject.id));
            record.set(eProject.num_ord, format4(obj, eProject.num_ord));
            record.set(eProject.num_acc, format4(obj, eProject.num_acc));
            record.set(eProject.manager, format4(obj, eProject.manager));
            record.set(eProject.date4, (obj.get(eProject.date4.name()).equals("")) ? null : obj.get(eProject.date4.name()));
            record.set(eProject.date6, (obj.get(eProject.date6.name()).equals("")) ? null : obj.get(eProject.date6.name()));
            record.set(eProject.prjpart_id, format4(obj, eProject.prjpart_id));
            qProject.insert2(record);
            return new JSONObject(App.asMap("result", "ok"));

        } catch (SQLException e) {
            return new JSONObject(App.asMap("result", "Ошибка: " + e));
        }
    }

    public static JSONObject updateOrder(HttpServletRequest request, HttpServletResponse response) {
        try {
            String param = request.getParameter("param");
            JSONArray arr = (JSONArray) JSONValue.parse(param);
            int id = Integer.valueOf(arr.get(eProject.id.ordinal()).toString());
            Record record = eProject.find(id);
            record.set(eProject.up, "UPD");
            record.set(eProject.num_ord, format3(arr, eProject.num_ord));
            record.set(eProject.num_acc, format3(arr, eProject.num_acc));
            record.set(eProject.manager, format3(arr, eProject.manager));
            record.set(eProject.date4, (arr.get(eProject.date4.ordinal()).equals("")) ? null : arr.get(eProject.date4.ordinal()));
            record.set(eProject.date6, (arr.get(eProject.date6.ordinal()).equals("")) ? null : arr.get(eProject.date6.ordinal()));
            record.set(eProject.prjpart_id, format3(arr, eProject.prjpart_id));
            Query qProject = new Query(eProject.values());
            qProject.update2(record);
            return new JSONObject(App.asMap("result", "ok"));

        } catch (SQLException e) {
            return new JSONObject(App.asMap("result", "Ошибка: " + e));
        }
    }

    public static JSONObject insertKits(HttpServletRequest request, HttpServletResponse response) {
        try {
            String param = request.getParameter("param");
            JSONObject obj = (JSONObject) JSONValue.parse(param);
            Record artiklRec = eArtikl.find(Integer.parseInt(obj.get(ePrjkit.artikl_id.name()).toString()), true);
            Query qPrjkit = new Query(ePrjkit.values());
            Record record = ePrjkit.up.newRecord("INS");
            record.set(ePrjkit.id, Connect.genId(ePrjkit.up));
            record.set(ePrjkit.numb, 1);
            record.set(ePrjkit.width, artiklRec.get(eArtikl.len_unit));
            record.set(ePrjkit.height, artiklRec.get(eArtikl.height));
            record.set(ePrjkit.color1_id, format4(obj, ePrjkit.color1_id));
            record.set(ePrjkit.color2_id, format4(obj, ePrjkit.color2_id));
            record.set(ePrjkit.color3_id, format4(obj, ePrjkit.color3_id));
            record.set(ePrjkit.color3_id, format4(obj, ePrjkit.color3_id));
            record.set(ePrjkit.artikl_id, artiklRec.get(eArtikl.id));
            record.set(ePrjkit.prjprod_id, format4(obj, ePrjkit.prjprod_id));
            qPrjkit.insert2(record);
            return new JSONObject(App.asMap("result", "ok", "prjkitRec", record));

        } catch (SQLException e) {
            return new JSONObject(App.asMap("result", "Ошибка: " + e));
        }
    }

    public static JSONObject insertPrjprod(HttpServletRequest request, HttpServletResponse response) {
        try {
            String param = request.getParameter("param");
            JSONObject obj = (JSONObject) JSONValue.parse(param);

            Query qPrjprod = new Query(ePrjprod.values());
            Record record = new Record();
            record.add("INS");
            record.add(Connect.genId(ePrjprod.up));
            record.add(0);
            record.add(obj.get("name"));
            record.add(obj.get("script"));
            record.add(obj.get("projectID"));
            record.add(obj.get("systreeID"));
            qPrjprod.insert2(record);
            return new JSONObject(App.asMap("result", "ok", "id", record.getInt(ePrjprod.id)));

        } catch (SQLException e) {
            return new JSONObject(App.asMap("result", "Ошибка: " + e));
        }
    }

    public static JSONObject deleteOrder(HttpServletRequest request, HttpServletResponse response) {
        try {
            String param = request.getParameter("param");
            JSONObject obj = (JSONObject) JSONValue.parse(param);
            Query qProject = new Query(eProject.values());
            Record record = eProject.up.newRecord("DEL");
            record.set(eProject.id, obj.get("id"));
            qProject.delete2(record);
            return new JSONObject(App.asMap("result", "ok"));

        } catch (SQLException e) {
            return new JSONObject(App.asMap("result", "Ошибка: " + e));
        }
    }

    public static JSONObject deletePrjkit(HttpServletRequest request, HttpServletResponse response) {
        try {
            String param = request.getParameter("param");
            JSONObject obj = (JSONObject) JSONValue.parse(param);
            Query qPrjkit = new Query(ePrjkit.values());
            Record record = ePrjkit.up.newRecord("DEL");
            record.set(ePrjkit.id, obj.get("id"));
            qPrjkit.delete2(record);
            return new JSONObject(App.asMap("result", "ok"));

        } catch (SQLException e) {
            return new JSONObject(App.asMap("result", "Ошибка: " + e));
        }
    }

    public static JSONObject updatePrjkit(HttpServletRequest request, HttpServletResponse response) {
        try {
            String param = request.getParameter("param");
            JSONArray arr = (JSONArray) JSONValue.parse(param);
            int id = Integer.valueOf(arr.get(ePrjkit.id.ordinal()).toString());
            Record record = ePrjkit.find(id);
            record.set(ePrjkit.up, "UPD");
            record.set(ePrjkit.numb, format3(arr, ePrjkit.numb));
            record.set(ePrjkit.width, format3(arr, ePrjkit.width));
            record.set(ePrjkit.height, format3(arr, ePrjkit.height));
            record.set(ePrjkit.color1_id, format3(arr, ePrjkit.color1_id));
            record.set(ePrjkit.color2_id, format3(arr, ePrjkit.color2_id));
            record.set(ePrjkit.color3_id, format3(arr, ePrjkit.color3_id));
            record.set(ePrjkit.prjprod_id, format3(arr, ePrjkit.prjprod_id));
            Query qPrjkit = new Query(ePrjkit.values());
            qPrjkit.update2(record);
            return new JSONObject(App.asMap("result", "ok"));

        } catch (SQLException e) {
            return new JSONObject(App.asMap("result", "Ошибка: " + e));
        }
    }

    public static JSONObject deletePrjprod(HttpServletRequest request, HttpServletResponse response) {
        try {
            String param = request.getParameter("param");
            JSONObject obj = (JSONObject) JSONValue.parse(param);
            Query qPrjprod = new Query(ePrjprod.values());
            Record record = ePrjprod.up.newRecord("DEL");
            record.set(ePrjprod.id, obj.get("id"));
            qPrjprod.delete2(record);
            return new JSONObject(App.asMap("result", "ok"));

        } catch (SQLException e) {
            return new JSONObject(App.asMap("result", "Ошибка: " + e));
        }
    }

    public static String prjkitList(HttpServletRequest request, HttpServletResponse response) {
        Query qPrjkit = new Query(ePrjkit.values()).select(ePrjkit.up);
        return gson.toJson(qPrjkit);
    }

    public static JSONObject stvFields(HttpServletRequest request, HttpServletResponse response) {
//        HashMap<Integer, HashMap> hm = new HashMap();
//        String prjprodID = request.getParameter("prjprodID");
//        Query qPrjprod = new Query(ePrjprod.values()).select(ePrjprod.up, "where", ePrjprod.id, "=", prjprodID);
//        String script = qPrjprod.getAs(0, ePrjprod.script);
//        Wincalc winc = new Wincalc(script);
//        new TFurniture(winc, true);
//        LinkedList<AreaStvorka> stvList = UCom.listSortObj(winc.listArea, Type.STVORKA);
//        for (AreaStvorka areaStv : stvList) {
//            hm.put((int) areaStv.id(), App.asMap(
//                    "handleRec", areaStv.handleRec, "handleColor", areaStv.handleColor,
//                    "loopRec", areaStv.loopRec, "loopColor", areaStv.loopColor,
//                    "lockRec", areaStv.lockRec, "lockColor", areaStv.lockColor));
//        }
//        return new JSONObject(App.asMap("stvFields", hm));
        return null;
    }

    public static String userList(HttpServletRequest request, HttpServletResponse response) {
        Query qSysuser = new Query(eSysuser.values()).select(eSysuser.up, "order by", eSysuser.login);
        return gson.toJson(qSysuser);
    }

    public static String projectList(HttpServletRequest request, HttpServletResponse response) {
        Query qProject = new Query(eProject.values()).select("select a.* from project a, prjpart b where a.prjpart_id = b.id and b.category = 'дилер' order by a.id desc");
        for (Record rec : qProject) {
            rec.setNo(eProject.date4, format2(rec.get(eProject.date4)));
            rec.setNo(eProject.date5, format2(rec.get(eProject.date5)));
            rec.setNo(eProject.date6, format2(rec.get(eProject.date6)));
        }
        return gson.toJson(qProject);
    }

    public static String dealerList(HttpServletRequest request, HttpServletResponse response) {
        Query qPrjpart = new Query(ePrjpart.values()).select(ePrjpart.up, "where", ePrjpart.category, "= 'дилер'", "order by", ePrjpart.login);
        return gson.toJson(qPrjpart);
    }

    public static String kitsList(HttpServletRequest request, HttpServletResponse response) {
        Query qKits = new Query(eKits.values()).select(eKits.up, "order by", eKits.groups_id);
        return gson.toJson(qKits);
    }

    public static String kitdetList(HttpServletRequest request, HttpServletResponse response) {
        Query qKitdet = new Query(eKitdet.values()).select(eKitdet.up, "order by", eKitdet.id);
        return gson.toJson(qKitdet);
    }

    public static String elementList(HttpServletRequest request, HttpServletResponse response) {
        Query qElement = new Query(eElement.values()).select(eElement.up, "order by", eElement.id);
        return gson.toJson(qElement);
    }

    public static String syssizeList(HttpServletRequest request, HttpServletResponse response) {
        Query qSyssize = new Query(eSyssize.values()).select(eSyssize.up, "order by", eSyssize.id);
        return gson.toJson(qSyssize);
    }
}
