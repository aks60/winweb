package model;

import dataset.Query;
import dataset.Record;
import domain.eSysprod;
import domain.eSystree;
import java.util.ArrayList;
import java.util.HashMap;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.App;
import model.sys.Att;
import org.json.simple.JSONObject;

public class Catalog {

    //Дерево системы профилей
    public JSONObject dictSpr(HttpServletRequest request, HttpServletResponse response) {

        App app = new App();
        ArrayList<HashMap> dict1 = new ArrayList();
        ArrayList<HashMap> dict2 = new ArrayList();
        Query qDict1 = new Query(Att.att(request).connect(), eSystree.values()).select(eSystree.up);
        
        //Первый уровень
        for (Record rec1 : qDict1) {           
            
            if (rec1.getInt(eSystree.id) == rec1.getInt(eSystree.parent_id)) {

                dict1.add(app.asMap("id", rec1.get(eSystree.id), "name", rec1.get(eSystree.name), "level", 0, "parent", rec1.get(eSystree.id), "isLeaf", false));
                
                //Второй уровень
                for (Record rec2 : qDict1) {
                    if (rec1.getInt(eSystree.id) == rec2.getInt(eSystree.parent_id) && rec2.getInt(eSystree.id) != rec2.getInt(eSystree.parent_id)) {
                        ArrayList<HashMap> tmp = new ArrayList();
                        
                        //Третий уровень
                        for (Record rec3 : qDict1) {
                            if (rec2.getInt(eSystree.id) == rec3.getInt(eSystree.parent_id) && rec3.getInt(eSystree.id) != rec3.getInt(eSystree.parent_id)) {
                                tmp.add(app.asMap("id", rec3.get(eSystree.id), "name", rec3.get(eSystree.name), "level", 2, "parent", rec3.get(eSystree.parent_id), "isLeaf", true));
                            }
                        }
                        if (tmp.size() > 0) {
                            dict1.add(app.asMap("id", rec2.get(eSystree.id), "name", rec2.get(eSystree.name), "level", 1, "parent", rec2.get(eSystree.parent_id), "isLeaf", false));
                            dict1.addAll(tmp); //если есть третий уровень    
                        } else {
                            dict1.add(app.asMap("id", rec2.get(eSystree.id), "name", rec2.get(eSystree.name), "level", 1, "parent", rec2.get(eSystree.parent_id), "isLeaf", true));
                        }
                    }
                }
            }
        }
        Query qDict2 = new Query(Att.att(request).connect(), eSysprod.values()).select(eSysprod.up, "order by a.npp, a.cname");
        for (Record it : qDict2) {
            dict2.add(app.asMap("id", it.get(eSysprod.id), "npp", it.get(eSysprod.id), "name", it.get(eSysprod.name), "parent", it.get(eSysprod.systree_id)));
        }
        JSONObject output = new JSONObject(App.asMap("dict1", dict1, "dict2", dict2));

        //System.out.println(output.toJSONString());
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

}
