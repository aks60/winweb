package cont5r;

import java.io.IOException;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

@WebServlet(name = "CatalogCont", urlPatterns = {"/dict"})
public class CatalogCont extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (SQLException ex) {
            Logger.getLogger(CatalogCont.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (SQLException ex) {
            Logger.getLogger(CatalogCont.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {
        response.setContentType("application/json; charset=UTF-8");
        String action = request.getParameter("action");

        if (action.equalsIgnoreCase("property")) {
            //String yearSchool2 = String.valueOf(Sys.getYearSchool(null));
            //String datePass2 = Sys.getDateFormat2().format(Sys.getDatePass(request, 0));
            JSONObject output = new JSONObject();
            output.put("yearSchool", 2021);
            //output.put("datePass", datePass2);
            response.getWriter().write(JSONValue.toJSONString(output));

        } else if (action.equalsIgnoreCase("dictSpr")) {
//            DictImp dic = new DictImp();
//            HashMap output = dic.dictSpr(request, response);
//            response.getWriter().write(JSONValue.toJSONString(output));

        } else if (action.equalsIgnoreCase("htmlDict")) {
//            DictImp dic = new DictImp();
//            HashMap output = dic.htmlDict(request, response);
//            response.getWriter().write(JSONValue.toJSONString(output));

        } else if (action.equalsIgnoreCase("kladrSpr")) {
//            DictImp dic = new DictImp();
//            HashMap output = dic.kladrSpr(request, response);
//            response.getWriter().write(JSONValue.toJSONString(output));

        }
    }
}
