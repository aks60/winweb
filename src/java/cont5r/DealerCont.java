package cont5r;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.swing.JOptionPane;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

@WebServlet(name = "DealerCont", urlPatterns = {"/dealer"})
public class DealerCont extends HttpServlet {

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
    }
    // </editor-fold>    

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json; charset=UTF-8");
        String action = request.getParameter("action");
        try (PrintWriter out = response.getWriter()) {
            if (action.equalsIgnoreCase("dealer")) {
                JOptionPane.showMessageDialog(null, "XXXX", "ВНИМАНИЕ!", 1);
//            DictImp dic = new DictImp();
//            HashMap output = dic.dictSpr(request, response);
//            response.getWriter().write(JSONValue.toJSONString(output));

            }
        }
    }
}
