package cont5r;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Systree;
import org.json.simple.JSONObject;

@WebServlet(name = "SystreeCont", urlPatterns = {"/systree"})
public class SystreeCont extends HttpServlet {

// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (SQLException ex) {
            Logger.getLogger(SystreeCont.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (SQLException ex) {
            Logger.getLogger(SystreeCont.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
// </editor-fold>

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, SQLException {
        
        response.setContentType("application/json; charset=UTF-8");
        String action = request.getParameter("action");
        try (PrintWriter out = response.getWriter()) {
            
            if (action.equalsIgnoreCase("sysTree")) {
                Systree dic = new Systree();
                JSONObject output = dic.sysTree(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("sysProd")) {
                Systree dic = new Systree();
                JSONObject output = dic.sysProd(request, response);
                out.write(JSONObject.toJSONString(output));

            }
        }
    }
}
