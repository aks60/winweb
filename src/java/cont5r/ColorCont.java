package cont5r;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Color;
import org.json.simple.JSONValue;

@WebServlet(name = "ColorCont", urlPatterns = {"/color"})
public class ColorCont extends HttpServlet {

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

            if (action.equalsIgnoreCase("colorGroup")) {
                Color dic = new Color();
                HashMap output = dic.colorGroup(request, response);
                out.write(JSONValue.toJSONString(output));

            } else if (action.equalsIgnoreCase("colorList")) {
                Color dic = new Color();
                HashMap output = dic.colorList(request, response);
                out.write(JSONValue.toJSONString(output));

            }
        }
    }
}
