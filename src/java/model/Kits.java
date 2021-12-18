package model;

import dataset.Query;
import dataset.Record;
import domain.eProkit;
import domain.eSysuser;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.Att;

public class Kits {
    
    public HashMap kitsList(HttpServletRequest request, HttpServletResponse response) {
        HashMap<String, List<List>> output = new HashMap();
        output.put("kitsList", new ArrayList());
        Query qProkit = new Query(Att.att(request).connect(), eProkit.values()).select(eProkit.up);
        for (Record rec : qProkit) {
            ((List) output.get("kitsList")).add(Arrays.asList(
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
        return output;
    }   
}
