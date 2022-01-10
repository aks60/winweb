package cont5r;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Dbset;
import org.json.simple.JSONObject;

@WebServlet(name = "DbsetCont", urlPatterns = {"/dbset"})
public class DbsetCont extends HttpServlet {

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json; charset=UTF-8");
        String action = request.getParameter("action");
        try (PrintWriter out = response.getWriter()) {

            if (action.equalsIgnoreCase("treeList")) {
                JSONObject output = Dbset.treeList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("colorGroup")) {
                JSONObject output = Dbset.colorGroup(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("colorList")) {
                JSONObject output = Dbset.colorList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("artiklList")) {
                JSONObject output = Dbset.artiklList(request, response);
                out.write(JSONObject.toJSONString(output));
                
            } else if (action.equalsIgnoreCase("artdetList")) {
                JSONObject output = Dbset.artdetList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("prodList")) {
                JSONObject output = Dbset.prodList(request, response);
                out.write(JSONObject.toJSONString(output));

            }
        }
    }
}
