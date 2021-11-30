package model.sys;

import dataset.Field;
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
    
    private String login = "empty";
    private String password = "";
    private String role = "";
    private String desc = "";    

    public static Att att(HttpServletRequest request) {

        HttpSession session = request.getSession();
        //если экземпляра ещё нет, создаём его
        if (session.getAttribute("att") == null) {
            Att att = new Att();
            session.setAttribute("att", att);
        }
        return (Att) session.getAttribute("att");
    }

    public Connection connect() {
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

    public Statement statement(Connection connection) {
        try {
            return connection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
        } catch (SQLException e) {
            System.out.println(e);
            return null;
        }
    }

    public void login(String login) {
        this.login = login;
    }

    public String login() {
        return login;
    }

    public void password(String password) {
        this.password = password;
    }

    public String password() {
        return password;
    }

    public void role(String role) {
        this.role = role;
    }

    public String role() {
        return role;
    }
 
    public String desc() {
        return desc;
    }

    public void desc(String desc) {
        this.desc = desc;
    }
    
    //Генератор ключа ID
    public int genId(Field field) {
        try {
            int next_id = 0;
            Statement statement = connect().createStatement();
            String sql = "SELECT GEN_ID(gen_" + field.tname() + ", 1) FROM RDB$DATABASE";
            ResultSet rs = statement.executeQuery(sql);
            /*String mySeqv = table_name + "_id_seq";
            ResultSet rs = statement.executeQuery("SELECT nextval('" + mySeqv + "')");*/
            if (rs.next()) {
                next_id = rs.getInt("GEN_ID");
            }
            rs.close();
            return next_id;
        } catch (SQLException e) {
            System.err.println("Ошибка генерации ключа " + e);
            return 0;
        }
    }    
}
