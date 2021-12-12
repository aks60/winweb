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
        ((List) output.get("userList")).add(Arrays.asList(eSysuser.id.ordinal(), eSysuser.fio.ordinal(), eSysuser.desc.ordinal(), eSysuser.login.ordinal(), eSysuser.role.ordinal()));
        for (Record record : qSysuser) {
            ((List) output.get("userList")).add(record);
        }
        return output;
    }
}
