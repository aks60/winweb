package model;

import dataset.Query;
import dataset.Record;
import domain.*;
import java.io.UnsupportedEncodingException;
import model.sys.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.sql.Statement;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import java.sql.ResultSet;
import java.security.SecureRandom;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.Security;
import java.sql.Connection;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.annotation.WebServlet;

import org.bouncycastle.asn1.cryptopro.CryptoProObjectIdentifiers;
import org.bouncycastle.asn1.cryptopro.ECGOST3410NamedCurves;
import org.bouncycastle.crypto.params.ECDomainParameters;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECParameterSpec;
import org.bouncycastle.jce.spec.ECPublicKeySpec;
import org.bouncycastle.math.ec.ECAlgorithms;
import org.bouncycastle.math.ec.ECConstants;
import org.bouncycastle.math.ec.ECCurve;
import org.bouncycastle.math.ec.ECPoint;
import org.bouncycastle.util.encoders.Hex;
import org.json.simple.JSONObject;

//@WebServlet(name = "AdminCont", urlPatterns = {"/admin"})
public class Login {

    private static String algorithm = "DESede";
    private static byte[] encoded = {79, 12, 91, 62, 19, 71, 36, 84, 19, 63, 55, 89, 35, 27, 01, 82, 45, 64, 26, 95, 77, 83, 18, 90};
    static String rndstr = "";

    //новый токен, проверка отсутствия логина в базе
    public HashMap rtwEmptyLogin(HttpServletRequest request, HttpServletResponse response) {

        App app = new App();
        HashMap output = app.asMap("login", "true", "mes", "");
        String adm_name = request.getParameter("admname");
        char[] adm_password = request.getParameter("password").toCharArray();
        String login = request.getParameter("login");
        Att att = Att.att(request);
        try {
            Connection connect = att.connect();
            Statement statement = att.statement(connect);
            ResultSet rs = statement.executeQuery("select * from master.dbo.syslogins where name = '" + adm_name + "' and PWDCOMPARE('" + adm_password + "',password) = 1");
            rs.next();
            if ("sa".equals(rs.getString("name")) || "admin".equals(rs.getString("name"))) {

                Query qUser = new Query(connect, eSysuser.values());
                for (Record recordUser : qUser) {
                    if (login.equals(recordUser.get(eSysuser.login))) {
                        output.putAll(app.asMap("login", true, "mes", "Пользователь с таким именем уже существует в базе данных"));
                    }
                }
            }
            if (rs != null) {
                rs.close();
            }
            if (statement != null) {
                statement.close();
            }
            if (connect != null) {
                connect.close();
            }
            return output;

        } catch (SQLException e) {
            System.err.println(e);
            output.putAll(app.asMap("login", true, "mes", "Ошибка авторизации прав администратора"));
            return output;
        }
    }

    //новый токен, сохранение user, open key и role в базе данных
    public HashMap newToken(HttpServletRequest request, HttpServletResponse response) {

        App app = new App();
        String openkey = request.getParameter("openkey");
        String login = request.getParameter("login");
        String user_role = request.getParameter("role");
        String user_desc = request.getParameter("desc");

        HashMap output = app.asMap("login", login, "openkey", openkey);
        Query qSysuser = new Query(Att.att(request).connect(), eSysuser.values());
        Record record = eSysuser.up.newRecord(Query.INS);
        record.setNo(eSysuser.login, login);
        record.setNo(eSysuser.role, user_role);
        record.setNo(eSysuser.openkey, openkey);
        record.setNo(eSysuser.desc, user_desc);
        qSysuser.insert(record);
        return output;
    }

    //авторизация токен, генерация клиенту случ. последовательности
    public HashMap rtwRandom(HttpServletRequest request, HttpServletResponse response) {

        Att att = Att.att(request);
        App app = new App();
        HttpSession session = request.getSession();
        session.setAttribute("login", request.getParameter("login"));
        SecureRandom random = new SecureRandom();
        session.setAttribute("random", random);
        String rndstr = new BigInteger(130, random).toString(32);
        HashMap output = app.asMap("random", rndstr);
        return output;
    }

    //авторизация токен, проверка подписи
    public HashMap rtwConnect(HttpServletRequest request, HttpServletResponse response) {

        Att att = Att.att(request);
        App app = new App();
        HashMap output = app.asMap("result", "Ошибка авторизации", "role", "empty");
        try {
            HttpSession session = request.getSession();
            String loginToken = session.getAttribute("login").toString();
            Query qSysuser = new Query(att.connect(), eSysuser.values()).select("select * from uchusers a where a.user2 = " + loginToken);
            if (qSysuser == null) {
                session.setAttribute("login", request.getParameter("empty"));
                output.put("result", "Ошибка! Такой логин пользователя не зарегистрирован на сервере");
                return output;
            }
            //добавим провайдера
            Security.addProvider(new BouncyCastleProvider());
            String publicKey = qSysuser.getAs(0, eSysuser.openkey);
            String rndstr = session.getAttribute("rndstr").toString();
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(rndstr.getBytes("UTF-8"));
            byte[] digest = md.digest();
            String hash = new String(Hex.encode(digest));
            String sign = request.getParameter("sign");

            final BigInteger x = new BigInteger(publicKey.substring(0, 64), 16);
            final BigInteger y = new BigInteger(publicKey.substring(64), 16);
            final BigInteger r = new BigInteger(sign.substring(0, 64), 16);
            final BigInteger s = new BigInteger(sign.substring(64), 16);

            final ECDomainParameters parameters = ECGOST3410NamedCurves.getByOID(CryptoProObjectIdentifiers.gostR3410_2001_CryptoPro_A);
            final ECCurve curve = parameters.getCurve();
            final ECParameterSpec spec = new ECParameterSpec(curve, parameters.getG(), parameters.getN());
            final ECPublicKeySpec pubKey = new ECPublicKeySpec(curve.createPoint(x, y, false), spec);
            final BigInteger n = parameters.getN();
            final BigInteger aprE = new BigInteger(hash, 16).mod(n);
            final BigInteger e = aprE.compareTo(ECConstants.ZERO) == -1 ? aprE.add(n) : aprE;

            if (r.compareTo(ECConstants.ONE) < 0 || r.compareTo(n) >= 0
                    || s.compareTo(ECConstants.ONE) < 0 || s.compareTo(n) >= 0) {
                session.setAttribute("login", request.getParameter("empty"));
                output.put("result", "Ошибка №1 совпадения цифровой подписи");
                return output;
            }
            final BigInteger v = e.modInverse(n);
            final BigInteger z1 = s.multiply(v).mod(n);
            final BigInteger z2 = (n.subtract(r)).multiply(v).mod(n);
            final ECPoint G = parameters.getG();
            final ECPoint Q = pubKey.getQ();
            final ECPoint point = ECAlgorithms.sumOfTwoMultiplies(G, z1, Q, z2);

            if (point.isInfinity()) {

                session.setAttribute("login", request.getParameter("empty"));
                output.put("result", "Ошибка №2 совпадения цифровой подписи");
                return output;
            }
            final BigInteger R = point.getX().toBigInteger().mod(n);

            //если подписи совпали
            if (r.equals(R)) {

//                excludeAtt(request, user.user2, user.role)
//            
//                Att.att(request).sys.region = user.uchschool.uch_Ter_Sp   
//                Att.att(request).sys.login = user.user2
//                Att.att(request).sys.role = user.role            
//                output.role = user.role
//                output.result = 'true'
            }
        } catch (NoSuchAlgorithmException e) {
            System.err.println(e);
        } catch (UnsupportedEncodingException e) {
            System.err.println(e);
        } catch (NullPointerException e) {
            System.err.println(e);
        }
        return output;
    }

    //новый пользователь, сохранение user, password и role в базе данных
    public JSONObject newLogin(HttpServletRequest request, HttpServletResponse response) {

        Att att = Att.att(request);
        Connection connect = att.connect();
        String adm_name = request.getParameter("username");
        String adm_password = request.getParameter("password");
        String user_name = request.getParameter("username2");
        String user_password = request.getParameter("password2");
        String user_fio = request.getParameter("fio");
        String user_desc = request.getParameter("desc");
        String user_role = request.getParameter("role");
        JSONObject output = new JSONObject(App.asMap("login", true, "mes", "Новый пользователь создан"));
        try {
            if (adm_name.equals("admin") || adm_name.equals("sysdba")) {
                Query user = new Query(connect, eSysuser.values()).select(eSysuser.up, "where", eSysuser.login, "='" + user_name + "'");
                if (user.isEmpty() == true) { //если нет создаём его

                    Key key = new SecretKeySpec(encoded, algorithm); //зашифруем пароль
                    Cipher cipher = Cipher.getInstance(algorithm);
                    cipher.init(Cipher.ENCRYPT_MODE, key);
                    byte[] password3 = cipher.doFinal(user_password.getBytes());
                    String password4 = new String(password3);
                    Query qSysuser = new Query(connect, eSysuser.values());

                    Record record = eSysuser.up.newRecord(Query.INS);
                    record.set(eSysuser.id, att.genId(eSysuser.up));
                    record.set(eSysuser.login, user_name);
                    record.set(eSysuser.fio, user_fio);
                    record.set(eSysuser.desc, user_desc);
                    record.set(eSysuser.role, user_role);
                    record.set(eSysuser.openkey, password4);
                    qSysuser.insert(record);
                    output.put("result", "true");
                } else {
                    output.put("result", "Такой пользователь уже создан");
                }
                return output;
            }
            output.put("result", "Ошибка создания нового пользователя");
            return output;

        } catch (NoSuchAlgorithmException e) {
            output.put("result", "Ошибка создания нового пользователя №1");
            return output;
        } catch (NoSuchPaddingException e) {
            output.put("result", "Ошибка создания нового пользователя №2");
            return output;
        } catch (IllegalBlockSizeException e) {
            output.put("result", "Ошибка создания нового пользователя №3");
            return output;
        } catch (BadPaddingException e) {
            output.put("result", "Ошибка создания нового пользователя №4");
            return output;
        } catch (InvalidKeyException e) {
            output.put("result", "Ошибка создания нового пользователя №5");
            return output;
        } catch (Exception e) {
            output.put("result", "Ошибка создания нового пользователя №6");
            return output;
        }
    }

    public JSONObject deleteUser(HttpServletRequest request, HttpServletResponse response, String id) {
        JSONObject output = new JSONObject(App.asMap("result", "Ошибка удаления пользователя"));
        try {
            Query qUser = new Query(Att.att(request).connect(), eSysuser.values()).select(eSysuser.up, "where", eSysuser.id, "=", id);
            if(qUser.isEmpty() == false) {
                qUser.delete(qUser.get(0));
                output.put("result", true);
                output.put("mes", "Пользователь успешно удалён");
            } 
            return output;

        } catch (Exception e) {
            System.err.println("model.Admin.deleteUser()");
            return output;
        }
    }

    public HashMap userConnect(HttpServletRequest request, HttpServletResponse response) {

        Att att = Att.att(request);
        Connection connect = att.connect();
        Statement statement = att.statement(connect);
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        JSONObject output = new JSONObject();
        try {
            if (username.equals("admin") || username.equals("sysdba")) {

                if (username.equals("admin") || username.equals("sysdba")) {
                    att.login(username);
                    att.role("RDB$ADMIN");
                    output.put("role", "RDB$ADMIN");
                    output.put("user", username);
                    output.put("result", "true");
                } else {
                    output.put("result", "Ошибка ввода пароля администратора");
                }
                return output;

            } else {
                Query user = new Query(connect, eSysuser.values()).select("select * from sysuser a where a.login = '" + username + "'");
                if (user.isEmpty() == false) {
                    //декодируем пароль на сервере  
                    Key key = new SecretKeySpec(encoded, algorithm);
                    Cipher cipher = Cipher.getInstance(algorithm);
                    cipher.init(Cipher.DECRYPT_MODE, key);
                    byte[] openkey = user.get(0, eSysuser.openkey).toString().getBytes();
                    byte[] password2 = cipher.doFinal(openkey);
                    String password3 = new String(password2);
                    //если пароль клиента и сервера совпали
                    if (password.equals(password3)) {

                        att.login(user.getAs(0, eSysuser.login));
                        att.role(user.getAs(0, eSysuser.role));

                        output.put("role", user.get(0, eSysuser.role));
                        output.put("result", "true");

                    } else {
                        output.put("result", "Ошибка ввода пароля пользователя");
                    }
                } else {
                    output.put("result", "Ошибка! Такой логин пользователя не зарегистрирован на сервере");
                }
                return output;
            }

        } catch (NoSuchAlgorithmException e) {
            output.put("result", "Ошибка авторизации №1");
            return output;
        } catch (NoSuchPaddingException e) {
            output.put("result", "Ошибка авторизации №2");
            return output;
        } catch (IllegalBlockSizeException e) {
            output.put("result", "Ошибка авторизации №3");
            return output;
        } catch (BadPaddingException e) {
            output.put("result", "Ошибка авторизации №4");
            return output;
        } catch (InvalidKeyException e) {
            output.put("result", "Ошибка авторизации №5");
            return output;
        } catch (Exception e) {
            output.put("result", "Неизвестная ошибка");
            return output;
        }
    }

}
