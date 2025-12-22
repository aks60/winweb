package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import controller.sys.Sys;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

@WebServlet(name = "LoginCont", urlPatterns = {"/login"})
public class LoginCont extends HttpServlet {

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
//        response.setHeader("Cache-Control", "no-cache, no-store");
//        response.setHeader("Pragma", "no-cache");
//        response.setHeader("Expires", "0");        
        String action = request.getParameter("action");
        
        try (PrintWriter out = response.getWriter()) {
            if (action == null) {
                RequestDispatcher dispatcher = getServletContext().getRequestDispatcher("/view/main.jsp");
                dispatcher.forward(request, response);

            } else if (action.equalsIgnoreCase("property")) {
                response.getWriter().write("{\"param\":\"999\"}");

            } else if (action.equalsIgnoreCase("rtwEmptyLogin")) {
//            AdmImp adm = new AdmImp();
//            HashMap output = adm.rtwEmptyLogin(request, response);
//            out.write(JSONValue.toJSONString(output));

            } else if (action.equalsIgnoreCase("listRegion")) {
//            AdmImp adm = new AdmImp();
//            ArrayList<HashMap> output = adm.listRegion(request, response);
//            out.write(JSONValue.toJSONString(output));

            } else if (action.equalsIgnoreCase("rtwRandom")) {
//            AdmImp adm = new AdmImp();
//            HashMap output = adm.rtwRandom(request, response);
//            response.getWriter().write(JSONValue.toJSONString(output));

            } else if (action.equalsIgnoreCase("rtwConnect")) {
//            AdmImp adm = new AdmImp();
//            menuDisplay(request, response);
//            Sys.initDatePass(request);
//
//            HashMap output = adm.rtwConnect(request, response);
//            menuDisplay(request, response);
//            out.write(JSONValue.toJSONString(output));

            } else if (action.equalsIgnoreCase("userConnect")) {

                Login adm = new Login();
                menuDisplay(request, response);
                Sys.initDatePass(request);

                HashMap output = adm.userConnect(request, response);
                //Entity.msserver(Att.att(request).getConnect(), "marks"); //Генерация Entity            
                out.write(JSONValue.toJSONString(output));

            } else if (action.equalsIgnoreCase("newToken")) {
//            AdmImp adm = new AdmImp();
//            HashMap output = adm.newToken(request, response);
//            out.write(JSONValue.toJSONString(output));

            } else if (action.equalsIgnoreCase("newLogin")) {
                Login adm = new Login();
                JSONObject output = adm.newLogin(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("deleteLogin")) {
                Login adm = new Login();
                String id = request.getParameter("userID");
                JSONObject output = adm.deleteUser(request, response, id);
                out.write(JSONObject.toJSONString(output));

            }
        }
    }

    private void menuDisplay(HttpServletRequest request, HttpServletResponse response) {

//        HttpSession session = request.getSession(true);
//        session.setAttribute("adm_display:", "style='display: none;'");      
//        if (Att.att(request).sys.get("login").equals("empty") == false
//                && Att.att(request).sys.get("role").equals("YO_HO1_RW")) {
//            session.setAttribute("adm_display:", "");
//
//        }
    }
}
