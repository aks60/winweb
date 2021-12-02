package model.dict;

import java.util.HashMap;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.simple.JSONObject;

public class DictImp {

    //общий справочник tree view
    public JSONObject dictSpr(HttpServletRequest request, HttpServletResponse response) {

//        App app = new App();
//        ArrayList<HashMap> dict1 = new ArrayList();
//        ArrayList<HashMap> dict2 = new ArrayList();
//        Query qDict1 = new Query(request, eDict1.values()).select("select a.* from spr_a a order by a.npp");
//        //первый уровень
//        for (Record it1 : qDict1) {           
//            
//            if (it1.getInt(eDict1.id) == it1.getInt(eDict1.spra_id) && it1.getInt(eDict1.id) < 10000) {
//
//                dict1.add(app.asMap("id", it1.get(eDict1.id), "name", it1.get(eDict1.cname), "level", 0, "parent", it1.get(eDict1.id), "isLeaf", false));
//                //второй уровень
//                for (Record it2 : qDict1) {
//                    if (it1.getInt(eDict1.id) == it2.getInt(eDict1.spra_id) && it2.getInt(eDict1.id) != it2.getInt(eDict1.spra_id)) {
//                        ArrayList<HashMap> tmp = new ArrayList();
//                        //третий уровень
//                        for (Record it3 : qDict1) {
//                            if (it2.getInt(eDict1.id) == it3.getInt(eDict1.spra_id) && it3.getInt(eDict1.id) != it3.getInt(eDict1.spra_id)) {
//                                tmp.add(app.asMap("id", it3.get(eDict1.id), "name", it3.get(eDict1.cname), "level", 2, "parent", it3.get(eDict1.spra_id), "isLeaf", true));
//                            }
//                        }
//                        if (tmp.size() > 0) {
//                            dict1.add(app.asMap("id", it2.get(eDict1.id), "name", it2.get(eDict1.cname), "level", 1, "parent", it2.get(eDict1.spra_id), "isLeaf", false));
//                            dict1.addAll(tmp); //если есть третий уровень    
//                        } else {
//                            dict1.add(app.asMap("id", it2.get(eDict1.id), "name", it2.get(eDict1.cname), "level", 1, "parent", it2.get(eDict1.spra_id), "isLeaf", true));
//                        }
//                    }
//                }
//            }
//        }
//        Query qDict2 = new Query(request, eDict2.values()).select("select a.* from spr_b a order by a.npp, a.cname");
//        for (Record it : qDict2) {
//            dict2.add(app.asMap("id", it.get(eDict2.sp), "npp", it.get(eDict2.npp), "name", it.get(eDict2.cname), "parent", it.get(eDict2.spra_id)));
//        }
//        JSONObject output = new JSONObject(app.asMap("dict1", dict1, "dict2", dict2));
//
//        //System.out.println(output.toJSONString());
//        return output;
return null;
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

    //справочник КЛАДР
    public HashMap kladrSpr(HttpServletRequest request, HttpServletResponse response) {

//        App app = new App();
//        ArrayList<HashMap> listKladr1 = new ArrayList();
//        ArrayList<HashMap> listKladr2 = new ArrayList();
//
//        Query qKladr1 = new Query(request, eKladr1.values()).select("select * from ter_b a order by a.code");
//        for (Record it : qKladr1) {
//            if (it.get(eKladr1.code) != null && (it.getStr(eKladr1.code).length() == 13 || it.getStr(eKladr1.code).substring(12).equals("0"))) {
//                int level = 0;
//                if (!(it.getStr(eKladr1.code).indexOf("000", 8) == 8)) {
//                    ++level;
//                }
//                if (!(it.getStr(eKladr1.code).indexOf("000", 5) == 5)) {
//                    ++level;
//                }
//                if (!(it.getStr(eKladr1.code).indexOf("000", 2) == 2)) {
//                    ++level;
//                }
//                listKladr1.add(app.asMap("id", it.get(eKladr1.id), "name", it.get(eKladr1.mname), "code", it.get(eKladr1.code), "level", level, "parent", null, "isLeaf", true));
//            }
//        }
//        HashMap<Object, Integer> hmId = new HashMap();
//        for (int index = 0; index < listKladr1.size(); index++) {
//
//            HashMap it = listKladr1.get(index);
//            hmId.put(it.get("level"), Integer.valueOf(it.get("id").toString()));
//
//            if (Integer.valueOf(it.get("level").toString()) > 0) {
//                it.put("parent", hmId.get(Integer.valueOf(it.get("level").toString()) - 1));
//            }
//            if (index < listKladr1.size() - 1 && Integer.valueOf(it.get("level").toString()) < Integer.valueOf(listKladr1.get(index + 1).get("level").toString())) {
//                it.put("isLeaf", false);
//            }
//        }
//        Query qKladr2 = new Query(request, eKladr2.values()).select("select * from ter_c a order by a.npp, a.lname");
//        for (Record it : qKladr2) {
//            listKladr2.add(app.asMap("id", it.get(eKladr2.id), "npp", it.get(eKladr2.npp), "name", it.get(eKladr2.lname), "parent", it.get(eKladr2.terb_id)));
//        }
//        JSONObject output = new JSONObject(app.asMap("kladr1", listKladr1, "kladr2", listKladr2));
//
//        //System.out.println(output.toJSONString());
//        return output;
return null;
    }

}
