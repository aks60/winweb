package model.sys;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

public class Att {

    private int region = 599999;
    private int uchone = 0;
    private String uchsel;
    private String user2 = "empty";
    private String password = "Platina6";
    private String role = "YO_HO1_RW";

    public ArrayList<Boolean> optionsPersFind = null;
    public ArrayList<Boolean> optionsPupsFind = null;

    public ArrayList paramsPersFind = null;
    public ArrayList paramsPupsFind = null;

    public Integer[] rangeStag = {3, 25};

    public static Att att(HttpServletRequest request) {

        HttpSession session = request.getSession();
        //если экземпляра ещё нет, создаём его
        if (session.getAttribute("att") == null) {
            Att att = new Att();
            session.setAttribute("att", att);
        }
        return (Att) session.getAttribute("att");
    }

    public Connection initConnect() {
        try {
            Context initContext = new InitialContext();
            DataSource dataSource = (DataSource) initContext.lookup("java:/comp/env/jdbc/winweb");
            Connection connection = dataSource.getConnection();
            connection.setAutoCommit(true);
            return connection;
            
        } catch (NamingException e) {
            System.err.println("Ошибка получения connect №1");
            e.printStackTrace();
            return null;
            
        } catch (SQLException e) {
            System.err.println("Ошибка получения connect №2");
            e.printStackTrace();
            return null;
        }
    }

    public Statement initStatement(Connection connection) {
        try {
            return connection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
        } catch (SQLException e) {
            System.out.println(e);
            return null;
        }
    }

    public int getRegion() {
        return region;
    }

    public void setRegion(int region) {
        this.region = region;
    }

    public void setUch(int uch) {
        this.uchone = uch;
    }

    public int getUch() {
        return uchone;
    }

    public String getUchList() {
        return uchsel;
    }

    public void setUchList(String uchSel) {
        this.uchsel = uchSel;
    }

    public void setUser2(String user2) {
        this.user2 = user2;
    }

    public String getUser2() {
        return user2;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
