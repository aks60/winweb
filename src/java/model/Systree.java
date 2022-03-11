package model;

import dataset.Query;
import dataset.Record;
import domain.eSysprod;
import domain.eSystree;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.App;
import model.sys.Att;
import org.json.simple.JSONObject;

public class Systree {

    //Дерево системы профилей
    public JSONObject sysTree(HttpServletRequest request, HttpServletResponse response) {

        ArrayList<HashMap> dict = new ArrayList<HashMap>();
        Query qDict = new Query(eSystree.values()).select(eSystree.up);

        //Первый уровень
        for (Record rec1 : qDict) {
            if (rec1.getInt(eSystree.id) == rec1.getInt(eSystree.parent_id)) {
                HashMap hm1 = App.asMap("id", rec1.get(eSystree.id), "name", rec1.get(eSystree.name), "level", 0, "parent", null, "isLeaf", true);
                dict.add(hm1);

                //Второй уровень
                for (Record rec2 : qDict) {
                    if (rec1.getInt(eSystree.id) == rec2.getInt(eSystree.parent_id) && rec2.getInt(eSystree.id) != rec2.getInt(eSystree.parent_id)) {
                        HashMap hm2 = App.asMap("id", rec2.get(eSystree.id), "name", rec2.get(eSystree.name), "level", 1, "parent", rec2.get(eSystree.parent_id), "isLeaf", true);
                        dict.add(hm2);
                        hm1.put("isLeaf", false);

                        //Третий уровень
                        for (Record rec3 : qDict) {
                            if (rec2.getInt(eSystree.id) == rec3.getInt(eSystree.parent_id) && rec3.getInt(eSystree.id) != rec3.getInt(eSystree.parent_id)) {
                                HashMap hm3 = App.asMap("id", rec3.get(eSystree.id), "name", rec3.get(eSystree.name), "level", 2, "parent", rec3.get(eSystree.parent_id), "isLeaf", true);
                                dict.add(hm3);
                                hm2.put("isLeaf", false);

                                //Четвёртый уровень
                                for (Record rec4 : qDict) {
                                    if (rec3.getInt(eSystree.id) == rec4.getInt(eSystree.parent_id) && rec4.getInt(eSystree.id) != rec4.getInt(eSystree.parent_id)) {
                                        HashMap hm4 = App.asMap("id", rec4.get(eSystree.id), "name", rec4.get(eSystree.name), "level", 3, "parent", rec4.get(eSystree.parent_id), "isLeaf", true);
                                        dict.add(hm4);
                                        hm3.put("isLeaf", false);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        JSONObject output = new JSONObject(App.asMap("sysTree", dict));
        return output;
    }

    //Модели продукций систем профилей
    public JSONObject sysProd(HttpServletRequest request, HttpServletResponse response) {

        List<List> prod = new ArrayList();
        Query qSysprod = new Query(eSysprod.values()).select(eSysprod.up, "order by name");
        for (Record rec : qSysprod) {
            prod.add(Arrays.asList(
                    rec.get(eSysprod.id), 
                    rec.get(eSysprod.name),
                    rec.get(eSysprod.script), 
                    rec.get(eSysprod.systree_id)));
        }
        JSONObject output = new JSONObject(App.asMap("sysProd", prod));
        return output;
    }

    //общий справочник для клиента html
    public HashMap htmlDict(HttpServletRequest request, HttpServletResponse response) {
        return null;
    }
}
