package controller;

import com.google.gson.Gson;
import dataset.Connect;
import domain.eProject;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import controller.sys.App;
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
            try {               
                if (action.equalsIgnoreCase("systreeList")) {
                    out.write(Dbset.systreeList(request, response));

                } else if (action.equalsIgnoreCase("sysprodList")) {
                    out.write(Dbset.sysprodList(request, response));

                } else if (action.equalsIgnoreCase("groupList")) {
                    out.write(Dbset.groupList(request, response));

                } else if (action.equalsIgnoreCase("colorList")) {
                    out.write(Dbset.colorList(request, response));

                } else if (action.equalsIgnoreCase("projectList")) {
                    out.write(Dbset.projectList(request, response));

                } else if (action.equalsIgnoreCase("artiklList")) {
                    out.write(Dbset.artiklList(request, response));

                } else if (action.equalsIgnoreCase("artdetList")) {
                    out.write(Dbset.artdetList(request, response));

                } else if (action.equalsIgnoreCase("furnitureList")) {
                    out.write(Dbset.furnitureList(request, response));

                } else if (action.equalsIgnoreCase("furndetList")) {
                    out.write(Dbset.furndetList(request, response));

                } else if (action.equalsIgnoreCase("prjprodList")) {
                    out.write(Dbset.prjprodList(request, response));

                } else if (action.equalsIgnoreCase("sysfurnList")) {
                    out.write(Dbset.sysfurnList(request, response));

                } else if (action.equalsIgnoreCase("sysprofList")) {
                    out.write(Dbset.sysprofList(request, response));

                } else if (action.equalsIgnoreCase("syspar1List")) {
                    out.write(Dbset.syspar1List(request, response));

                } else if (action.equalsIgnoreCase("paramsList")) {
                    out.write(Dbset.paramsList(request, response));

                } else if (action.equalsIgnoreCase("updateScript")) {
                    JSONObject output = Dbset.updateScript(request, response);
                    out.write(JSONObject.toJSONString(output));

                } else if (action.equalsIgnoreCase("insertPrjprod")) {
                    JSONObject output = Dbset.insertPrjprod(request, response);
                    out.write(JSONObject.toJSONString(output));

                } else if (action.equalsIgnoreCase("genidOrder")) {
                    out.write(JSONObject.toJSONString(
                            new JSONObject(Map.of("result", "ok", "id", Connect.genId(eProject.up)))));

                } else if (action.equalsIgnoreCase("insertOrder")) {
                    JSONObject output = Dbset.insertOrder(request, response);
                    out.write(JSONObject.toJSONString(output));

                } else if (action.equalsIgnoreCase("updateOrder")) {
                    JSONObject output = Dbset.updateOrder(request, response);
                    out.write(JSONObject.toJSONString(output));

                } else if (action.equalsIgnoreCase("insertKits")) {
                    JSONObject output = Dbset.insertKits(request, response);
                    out.write(JSONObject.toJSONString(output));

                } else if (action.equalsIgnoreCase("deleteOrder")) {
                    JSONObject output = Dbset.deleteOrder(request, response);
                    out.write(JSONObject.toJSONString(output));

                } else if (action.equalsIgnoreCase("updatePrjkit")) {
                    JSONObject output = Dbset.updatePrjkit(request, response);
                    out.write(JSONObject.toJSONString(output));

                } else if (action.equalsIgnoreCase("deletePrjkit")) {
                    JSONObject output = Dbset.deletePrjkit(request, response);
                    out.write(JSONObject.toJSONString(output));

                } else if (action.equalsIgnoreCase("deletePrjprod")) {
                    JSONObject output = Dbset.deletePrjprod(request, response);
                    out.write(JSONObject.toJSONString(output));

                } else if (action.equalsIgnoreCase("prjkitList")) {
                    out.write(Dbset.prjkitList(request, response));

                } else if (action.equalsIgnoreCase("userList")) {
                    out.write(Dbset.userList(request, response));

                } else if (action.equalsIgnoreCase("stvFields")) {
                    JSONObject output = Dbset.stvFields(request, response);
                    out.write(JSONObject.toJSONString(output));

                } else if (action.equalsIgnoreCase("dealerList")) {
                    out.write(Dbset.dealerList(request, response));

                } else if (action.equalsIgnoreCase("kitsList")) {
                    out.write(Dbset.kitsList(request, response));

                } else if (action.equalsIgnoreCase("kitdetList")) {
                    out.write(Dbset.kitdetList(request, response));
                }
            } catch (Exception e) {
                System.err.println("request - " + action + "   " + e);
            }
        }
    }
}
