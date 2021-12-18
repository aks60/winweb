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

public class Users {

    public HashMap userList(HttpServletRequest request, HttpServletResponse response) {
        HashMap<String, List<List>> output = new HashMap();
        output.put("userList", new ArrayList());
        Query qSysuser = new Query(Att.att(request).connect(), eSysuser.values()).select(eSysuser.up, "order by", eSysuser.login);
        for (Record rec : qSysuser) {
            ((List) output.get("userList")).add(Arrays.asList(
                    rec.get(eSysuser.id), 
                    rec.get(eSysuser.fio), 
                    rec.get(eSysuser.desc), 
                    rec.get(eSysuser.login), 
                    rec.get(eSysuser.role)));
        }
        return output;
    }
}
