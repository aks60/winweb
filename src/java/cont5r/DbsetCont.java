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

            if (action.equalsIgnoreCase("systreeList")) {
                JSONObject output = Dbset.systreeList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("sysprodList")) {
                JSONObject output = Dbset.sysprodList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("groupList")) {
                JSONObject output = Dbset.groupList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("colorList")) {
                JSONObject output = Dbset.colorList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("orderList")) {
                JSONObject output = Dbset.orderList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("artiklList")) {
                JSONObject output = Dbset.artiklList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("artdetList")) {
                JSONObject output = Dbset.artdetList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("furnitureList")) {
                JSONObject output = Dbset.furnitureList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("furndetList")) {
                JSONObject output = Dbset.furndetList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("prjprodList")) {
                JSONObject output = Dbset.prjprodList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("sysfurnList")) {
                JSONObject output = Dbset.sysfurnList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("sysprofList")) {
                JSONObject output = Dbset.sysprofList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("syspar1List")) {
                JSONObject output = Dbset.syspar1List(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("paramsList")) {
                JSONObject output = Dbset.paramsList(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("updateScript")) {
                JSONObject output = Dbset.updateScript(request, response);
                out.write(JSONObject.toJSONString(output));
                
            } else if (action.equalsIgnoreCase("insertPrjprod")) {
                JSONObject output = Dbset.insertPrjprod(request, response);
                out.write(JSONObject.toJSONString(output));
                
            } else if (action.equalsIgnoreCase("insertOrder")) {
                JSONObject output = Dbset.insertOrder(request, response);
                out.write(JSONObject.toJSONString(output));
                
            } else if (action.equalsIgnoreCase("insertKits")) {
                JSONObject output = Dbset.insertKits(request, response);
                out.write(JSONObject.toJSONString(output));
                
            } else if (action.equalsIgnoreCase("deleteProject")) {
                JSONObject output = Dbset.deleteProject(request, response);
                out.write(JSONObject.toJSONString(output));
                
            } else if (action.equalsIgnoreCase("deletePrjprod")) {
                JSONObject output = Dbset.deletePrjprod(request, response);
                out.write(JSONObject.toJSONString(output));

            } else if (action.equalsIgnoreCase("prjkitList")) {
                JSONObject output = Dbset.prjkitList(request, response);
                out.write(JSONObject.toJSONString(output)); 
                
            } else if (action.equalsIgnoreCase("userList")) {
                JSONObject output = Dbset.userList(request, response);
                out.write(JSONObject.toJSONString(output));                 
                
            } else if (action.equalsIgnoreCase("stvFields")) {
                JSONObject output = Dbset.stvFields(request, response);
                out.write(JSONObject.toJSONString(output));                 

            } else if (action.equalsIgnoreCase("dealerList")) {
                JSONObject output = Dbset.dealerList(request, response);
                out.write(JSONObject.toJSONString(output));    

            } else if (action.equalsIgnoreCase("kitsList")) {
                JSONObject output = Dbset.kitsList(request, response);
                out.write(JSONObject.toJSONString(output));    

            } else if (action.equalsIgnoreCase("kitdetList")) {
                JSONObject output = Dbset.kitdetList(request, response);
                out.write(JSONObject.toJSONString(output));    
            }
        }
    }
}
