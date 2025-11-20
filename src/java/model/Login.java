package model;

import dataset.Conn;
import dataset.Query;
import dataset.Record;
import domain.*;
import java.io.ByteArrayInputStream;
import java.io.UnsupportedEncodingException;
import model.sys.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.crypto.spec.SecretKeySpec;
import java.sql.Statement;
import javax.crypto.Cipher;
import java.sql.ResultSet;
import java.security.SecureRandom;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.Security;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
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

    private static String transformation = "AES/ECB/PKCS5Padding";
    private static byte[] bytkey = {79, 12, 91, 62, 19, 71, 36, 84, 19, 63, 55, 89, 35, 27, 01, 82, 45, 64, 26, 95, 77, 83, 18, 90};

    //новый токен, проверка отсутствия логина в базе
    public HashMap rtwEmptyLogin(HttpServletRequest request, HttpServletResponse response) {

        HashMap output = App.asMap("login", "true", "mes", "");
        String adm_name = request.getParameter("admname");
        char[] adm_password = request.getParameter("password").toCharArray();
        String login = request.getParameter("login");
        try {
            Connection connect = Conn.connection();
            Statement statement = connect.createStatement();
            ResultSet rs = statement.executeQuery("select * from master.dbo.syslogins where name = '" + adm_name + "' and PWDCOMPARE('" + adm_password + "',password) = 1");
            rs.next();
            if ("sa".equals(rs.getString("name")) || "admin".equals(rs.getString("name"))) {

                Query qUser = new Query(eSysuser.values());
                for (Record recordUser : qUser) {
                    if (login.equals(recordUser.get(eSysuser.login))) {
                        output.putAll(App.asMap("login", true, "mes", "Пользователь с таким именем уже существует в базе данных"));
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
            output.putAll(App.asMap("login", true, "mes", "Ошибка авторизации прав администратора"));
            return output;
        }
    }

    //новый токен, сохранение user, open key и role в базе данных
    public HashMap newToken(HttpServletRequest request, HttpServletResponse response) {

        String openkey = request.getParameter("openkey");
        String login = request.getParameter("login");
        String user_role = request.getParameter("role");
        String user_desc = request.getParameter("desc");

        HashMap output = App.asMap("login", login, "openkey", openkey);
        Query qSysuser = new Query(eSysuser.values());
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

        HttpSession session = request.getSession();
        session.setAttribute("login", request.getParameter("login"));
        SecureRandom random = new SecureRandom();
        session.setAttribute("random", random);
        String rndstr = new BigInteger(130, random).toString(32);
        HashMap output = App.asMap("random", rndstr);
        return output;
    }

    //авторизация токен, проверка подписи
    public HashMap rtwConnect(HttpServletRequest request, HttpServletResponse response) {

        HashMap output = App.asMap("result", "Ошибка авторизации", "role", "empty");
        try {
            HttpSession session = request.getSession();
            String loginToken = session.getAttribute("login").toString();
            Query qSysuser = new Query(eSysuser.values()).select("select * from uchusers a where a.user2 = " + loginToken);
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
        
        String adm_name = request.getParameter("username");
        String adm_password = request.getParameter("password");
        String user_name = request.getParameter("username2");
        String user_password = request.getParameter("password2");
        String user_fio = request.getParameter("fio");
        String user_desc = request.getParameter("desc");
        String user_role = request.getParameter("role");
        JSONObject output = new JSONObject(App.asMap("login", true, "mes", "Новый пользователь создан"));
        try {
            if (adm_name.equalsIgnoreCase("admin") || adm_name.equalsIgnoreCase("sysdba")) {
                Query user = new Query(eSysuser.values()).select(eSysuser.up, "where", eSysuser.login, "='" + user_name + "'");

                if (user.isEmpty() == true) { //если нет создаём его
                    SecretKeySpec secretkey = createSecretKey();
                    byte[] bytOpenPas = encrypt(secretkey, user_password.getBytes());
                    String strOpenPas = Base64.getEncoder().encodeToString(bytOpenPas); 

                    Query qSysuser = new Query(eSysuser.values());
                    Record record = eSysuser.up.newRecord(Query.INS);
                    record.set(eSysuser.id, Conn.genId(eSysuser.up));
                    record.set(eSysuser.login, user_name);
                    record.set(eSysuser.fio, user_fio);
                    record.set(eSysuser.desc, user_desc);
                    record.set(eSysuser.role, user_role);
                    record.set(eSysuser.openkey, strOpenPas);
                    qSysuser.insert(record);

                    output.put("result", "true");
                } else {
                    output.put("result", "Такой пользователь уже создан");
                }
                return output;
            }
            output.put("result", "Ошибка создания нового пользователя");
            return output;

        } catch (Exception e) {
            System.err.println(e);
            output.put("result", "Ошибка создания нового пользователя №6");
            return output;
        }
    }

    public JSONObject deleteUser(HttpServletRequest request, HttpServletResponse response, String id) {
        JSONObject output = new JSONObject(App.asMap("result", "Ошибка удаления пользователя"));
        try {
            Query qUser = new Query(eSysuser.values()).select(eSysuser.up, "where", eSysuser.id, "=", id);
            if (qUser.isEmpty() == false) {
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

        Connection connect = Conn.connection();
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        JSONObject output = new JSONObject();
        try {
            if (username.equalsIgnoreCase("admin") || username.equals("sysdba")) {
                try {
                    Class.forName("org.firebirdsql.jdbc.FBDriver");
                    DatabaseMetaData metadata = connect.getMetaData();
                    String url = metadata.getURL();
                    Connection con = DriverManager.getConnection(url, username, password);
                    con.close();
                    connect.close();

                } catch (Exception e) {
                    output.put("result", "Ошибка ввода пароля или имени администратора");
                    return output;
                }
                output.put("role", "RDB$ADMIN");
                output.put("user_name", username);
                output.put("user_fio", "admin");
                output.put("result", "true");
                return output;

            } else {
                Query user = new Query(eSysuser.values()).select("select * from sysuser a where a.login = '" + username + "'");
                if (user.isEmpty() == false) {
                    
                    SecretKeySpec secretkey = createSecretKey();
                    String user_fio = user.getAs(0, eSysuser.fio);
                    String strOpenKey = user.get(0, eSysuser.openkey).toString();
                    byte[] bytOpenKey = Base64.getDecoder().decode(strOpenKey);

                    byte[] bytPas = decrypt(secretkey, bytOpenKey);
                    String password2 = new String(bytPas, StandardCharsets.UTF_8);

                    //если пароль клиента и сервера совпали
                    if (password.equalsIgnoreCase(password2)) {

                        output.put("role", user.get(0, eSysuser.role));
                        output.put("user_name", username);
                        output.put("user_fio", user_fio);
                        output.put("result", "true");

                    } else {
                        output.put("result", "Ошибка ввода пароля пользователя");
                    }
                } else {
                    output.put("result", "Ошибка! Такой логин пользователя не зарегистрирован на сервере");
                }
                return output;
            }
        } catch (Exception e) {
            System.err.println(e);
            output.put("result", "Неизвестная ошибка");
            return output;
        }
    }

    public byte[] encrypt(SecretKeySpec secretKey, byte[] bytPas) {
        try {
            Cipher cipher = Cipher.getInstance(transformation);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            return cipher.doFinal(bytPas);
        } catch (Exception e) {
            System.err.println(e);
        }
        return null;
    }

    public byte[] decrypt(SecretKeySpec secretKey, byte[] openPas) {
        try {
            Cipher cipher = Cipher.getInstance(transformation);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            return cipher.doFinal(openPas);
        } catch (Exception e) {
            System.err.println(e);
        }
        return null;
    }

    private SecretKeySpec createSecretKey() {
        SecretKeySpec sks = null;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] key = md.digest(bytkey);
            key = Arrays.copyOf(key, 24);
            sks = new SecretKeySpec(key, "AES");
        } catch (NoSuchAlgorithmException e) {
            System.err.println(e);
        }
        return sks;
    }
}
