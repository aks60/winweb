package cont5r;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Catalog;
import org.json.simple.JSONValue;

@WebServlet(name = "CatalogCont", urlPatterns = {"/catalog"})
public class CatalogCont extends HttpServlet {
    
// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">    
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
// </editor-fold>
    
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {
        response.setContentType("application/json; charset=UTF-8");
        String action = request.getParameter("action");

        if (action.equalsIgnoreCase("sysTree")) {
            Catalog dic = new Catalog();
            HashMap output = dic.sysTree(request, response);
            response.getWriter().write(JSONValue.toJSONString(output));

        } else if (action.equalsIgnoreCase("sysProd")) {
            Catalog dic = new Catalog();
            HashMap output = dic.sysProd(request, response);
            response.getWriter().write(JSONValue.toJSONString(output));

        } 
    }
}
