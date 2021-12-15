package model;

import dataset.Query;
import dataset.Record;
import domain.eSysprod;
import domain.eSystree;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.App;
import model.sys.Att;
import org.json.simple.JSONObject;

public class Catalog {

    //Дерево системы профилей
    public JSONObject sysTree(HttpServletRequest request, HttpServletResponse response) {

        ArrayList<HashMap> dict = new ArrayList<HashMap>();
        Query qDict = new Query(Att.att(request).connect(), eSystree.values()).select(eSystree.up);

        //Первый уровень
        for (Record rec1 : qDict) {
            if (rec1.getInt(eSystree.id) == rec1.getInt(eSystree.parent_id)) {
                HashMap hm1 = App.asMap("id", rec1.get(eSystree.id), "name", rec1.get(eSystree.name), "level", 0, "parent", rec1.get(eSystree.id), "isLeaf", false); 
                dict.add(hm1);

                //Второй уровень
                for (Record rec2 : qDict) {
                    if (rec1.getInt(eSystree.id) == rec2.getInt(eSystree.parent_id) && rec2.getInt(eSystree.id) != rec2.getInt(eSystree.parent_id)) {
                        HashMap hm2 = App.asMap("id", rec2.get(eSystree.id), "name", rec2.get(eSystree.name), "level", 1, "parent", rec2.get(eSystree.parent_id), "isLeaf", false);
                        dict.add(hm2);
                        hm1.put("isLeaf", true);

                        //Третий уровень
                        for (Record rec3 : qDict) {
                            if (rec2.getInt(eSystree.id) == rec3.getInt(eSystree.parent_id) && rec3.getInt(eSystree.id) != rec3.getInt(eSystree.parent_id)) {
                                HashMap hm3 = App.asMap("id", rec3.get(eSystree.id), "name", rec3.get(eSystree.name), "level", 1, "parent", rec3.get(eSystree.parent_id), "isLeaf", false);
                                dict.add(hm3);
                                hm2.put("isLeaf", true);

                                //Четвёртый уровень
                                for (Record rec4 : qDict) {
                                    if (rec3.getInt(eSystree.id) == rec4.getInt(eSystree.parent_id) && rec4.getInt(eSystree.id) != rec4.getInt(eSystree.parent_id)) {
                                        HashMap hm4 = App.asMap("id", rec4.get(eSystree.id), "name", rec4.get(eSystree.name), "level", 1, "parent", rec4.get(eSystree.parent_id), "isLeaf", false);
                                        dict.add(hm4);
                                        hm3.put("isLeaf", true);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        JSONObject output = new JSONObject(App.asMap("systree", dict));
        return output;
    }
    
    //Модели продукций систем профилей
    public JSONObject sysProd(HttpServletRequest request, HttpServletResponse response) {

        ArrayList<HashMap> dict = new ArrayList();
        Query qDict = new Query(Att.att(request).connect(), eSysprod.values()).select(eSysprod.up, "order by name");
        for (Record it : qDict) {
            dict.add(App.asMap("id", it.get(eSysprod.id), "name", it.get(eSysprod.name), "parent", it.get(eSysprod.systree_id)));
        }
        JSONObject output = new JSONObject(App.asMap("sysprod", dict));
        return output;
    }

    //общий справочник для клиента html
    public HashMap htmlDict(HttpServletRequest request, HttpServletResponse response) {

//        App app = new App();
//        HashMap output = app.asMap("rootDic", new HashMap(), "mapDic", new HashMap(), "arrDic", new ArrayList());
//        Query qDict1 = new Query(request, eDict1.values()).select("select a.* from spr_a a");
//        for (Record it : qDict1) {
//            ((HashMap) output.get("rootDic")).put(it.get(eDict1.id), it.get(eDict1.cname));
//        }
//        Query qDict2 = new Query(request, eDict2.values()).select("select a.* from spr_b a");
//        for (Record it : qDict2) {
//            ((HashMap) output.get("mapDic")).put(it.get(eDict2.sp), it.get(eDict2.cname));
//            ((ArrayList) output.get("arrDic")).add(app.asMap("id", it.get(eDict2.sp), "npp", it.get(eDict2.npp), "cname", it.get(eDict2.cname), "spraId", it.get(eDict2.spra_id)));
//        }
//        //HashMap output = new HashMap();
//        //System.out.println(output);
//        return output;
        return null;
    }

    public JSONObject sysTree2(HttpServletRequest request, HttpServletResponse response) {

        App app = new App();
        ArrayList<HashMap> dict = new ArrayList();
        Query qDict = new Query(Att.att(request).connect(), eSystree.values()).select(eSystree.up);

        //Первый уровень
        for (Record rec1 : qDict) {
            if (rec1.getInt(eSystree.id) == rec1.getInt(eSystree.parent_id)) {
                dict.add(app.asMap("id", rec1.get(eSystree.id), "name", rec1.get(eSystree.name), "level", 0, "parent", rec1.get(eSystree.id), "isLeaf", false));

                //Второй уровень
                for (Record rec2 : qDict) {
                    if (rec1.getInt(eSystree.id) == rec2.getInt(eSystree.parent_id) && rec2.getInt(eSystree.id) != rec2.getInt(eSystree.parent_id)) {
                        ArrayList<HashMap> tmp = new ArrayList();

                        //Третий уровень
                        for (Record rec3 : qDict) {
                            if (rec2.getInt(eSystree.id) == rec3.getInt(eSystree.parent_id) && rec3.getInt(eSystree.id) != rec3.getInt(eSystree.parent_id)) {
                                tmp.add(app.asMap("id", rec3.get(eSystree.id), "name", rec3.get(eSystree.name), "level", 2, "parent", rec3.get(eSystree.parent_id), "isLeaf", true));
                            }
                        }
                        if (tmp.size() > 0) {
                            dict.add(app.asMap("id", rec2.get(eSystree.id), "name", rec2.get(eSystree.name), "level", 1, "parent", rec2.get(eSystree.parent_id), "isLeaf", false));
                            dict.addAll(tmp); //если есть третий уровень    
                        } else {
                            dict.add(app.asMap("id", rec2.get(eSystree.id), "name", rec2.get(eSystree.name), "level", 1, "parent", rec2.get(eSystree.parent_id), "isLeaf", true));
                        }
                    }
                }
            }
        }
        JSONObject output = new JSONObject(App.asMap("systree", dict));
        return output;
    }    
}
