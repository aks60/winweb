package model;

import dataset.Query;
import dataset.Record;
import domain.eSysuser;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.sys.App;
import model.sys.Att;
import org.json.simple.JSONObject;

public class Users {

    public JSONObject userList(HttpServletRequest request, HttpServletResponse response) {
        ArrayList<List> list = new ArrayList();
        
        Query qSysuser = new Query(Att.att(request).connect(), eSysuser.values()).select(eSysuser.up, "order by", eSysuser.login);
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
