package model;

import dataset.Conn;
import dataset.Query;
import dataset.Record;
import domain.eSysuser;
import model.sys.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.sql.Statement;
import javax.crypto.Cipher;
import java.security.SecureRandom;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.SQLException;
//import java.security.spec.ECParameterSpec;
//import java.security.spec.ECPoint;
//import java.security.spec.ECPublicKeySpec;
import java.util.ArrayList;
import java.util.HashMap;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

public class AdmImp {

    private static String algorithm = "DESede";
    private static byte[] encoded = {79, 12, 91, 62, 19, 71, 36, 84, 19, 63, 55, 89, 35, 27, 01, 82, 45, 64, 26, 95, 77, 83, 18, 90};
    static String rndstr = "";

    //новый токен, проверка отсутствия логина в базе
    public HashMap rtwEmptyLogin(HttpServletRequest request, HttpServletResponse response) {

//        App app = new App();
//        HashMap output = app.asMap("login", "true", "mes", "");
//        String adm_name = request.getParameter("admname");
//        char[] adm_password = request.getParameter("password").toCharArray();
//        String login = request.getParameter("login");
//        Att att = Att.att(request);
//        try {
//            Connection connect = att.initConnect();
//            Statement statement = att.initStatement(connect);
//            ResultSet rs = statement.executeQuery("select * from master.dbo.syslogins where name = '" + adm_name + "' and PWDCOMPARE('" + adm_password + "',password) = 1");
//            rs.next();
//            if ("sa".equals(rs.getString("name")) || "admin".equals(rs.getString("name"))) {
//
//                Query qUser = new Query(request, eUchUsers.values());
//                for (Record recordUser : qUser) {
//                    if (login.equals(recordUser.get(eUchUsers.user2))) {
//                        output.putAll(app.asMap("login", true, "mes", "Пользователь с таким именем уже существует в базе данных"));
//                    }
//                }
//            }
//            if (rs != null) {
//                rs.close();
//            }
//            if (statement != null) {
//                statement.close();
//            }
//            if (connect != null) {
//                connect.close();
//            }
//            return output;
//
//        } catch (SQLException e) {
//            System.err.println(e);
//            output.putAll(app.asMap("login", true, "mes", "Ошибка авторизации прав администратора"));
//            return output;
//        }
        return null;
    }

//новый токен, сохранение user, open key и role в базе данных
    public HashMap newToken(HttpServletRequest request, HttpServletResponse response) {

//        App app = new App();
//        String openkey = request.getParameter("openkey");
//        String login = request.getParameter("login");
//        String user_role = request.getParameter("role");
//        String user_uch = request.getParameter("uch");
//
//        HashMap output = app.asMap("login", login, "openkey", openkey);
//        HttpSession sess = request.getSession();
//        Query qUch = new Query(request, eUchSchool.values()).select("select a.* from uchschool a where a.id = " + user_uch);
//        Query qUser = new Query(request, eUchUsers.values());
//        Record record = qUser.add();
//        record.setNo(eUchUsers.up, Query.INS);
//        record.setNo(eUchUsers.user2, login);
//        record.setNo(eUchUsers.role, user_role);
//        record.setNo(eUchUsers.openkey, openkey);
//        record.setNo(eUchUsers.uch, qUch.getStr(0, eUchSchool.id));
//        qUser.execute(record);
//        return output;
        return null;
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

//        Att att = Att.att(request);
//        App app = new App();
//        HashMap output = app.asMap("result", "Ошибка авторизации", "role", "empty");
//        try {
//            HttpSession session = request.getSession();
//            String loginToken = session.getAttribute("login").toString();
//            Query qUser = new Query(request, eUchUsers.values()).select("select * from uchusers a where a.user2 = " + loginToken);
//            if (qUser == null) {
//                session.setAttribute("login", request.getParameter("empty"));
//                output.put("result", "Ошибка! Такой логин пользователя не зарегистрирован на сервере");
//                return output;
//            }
//            //добавим провайдера
//            Security.addProvider(new BouncyCastleProvider());
//            String publicKey = qUser.getStr(0, eUchUsers.openkey);
//            String rndstr = session.getAttribute("rndstr").toString();
//            MessageDigest md = MessageDigest.getInstance("SHA-256");
//            md.update(rndstr.getBytes("UTF-8"));
//            byte[] digest = md.digest();
//            String hash = new String(Hex.encode(digest));
//            String sign = request.getParameter("sign");
//
//            final BigInteger x = new BigInteger(publicKey.substring(0, 64), 16);
//            final BigInteger y = new BigInteger(publicKey.substring(64), 16);
//            final BigInteger r = new BigInteger(sign.substring(0, 64), 16);
//            final BigInteger s = new BigInteger(sign.substring(64), 16);
//
//            final ECDomainParameters parameters = ECGOST3410NamedCurves.getByOID(CryptoProObjectIdentifiers.gostR3410_2001_CryptoPro_A);
//            final ECCurve curve = parameters.getCurve();
//            final ECParameterSpec spec = new ECParameterSpec(curve, parameters.getG(), parameters.getN());
//            final ECPublicKeySpec pubKey = new ECPublicKeySpec(curve.createPoint(x, y, false), spec);
//            final BigInteger n = parameters.getN();
//            final BigInteger aprE = new BigInteger(hash, 16).mod(n);
//            final BigInteger e = aprE.compareTo(ECConstants.ZERO) == -1 ? aprE.add(n) : aprE;
//
//            if (r.compareTo(ECConstants.ONE) < 0 || r.compareTo(n) >= 0
//                    || s.compareTo(ECConstants.ONE) < 0 || s.compareTo(n) >= 0) {
//                session.setAttribute("login", request.getParameter("empty"));
//                output.put("result", "Ошибка №1 совпадения цифровой подписи");
//                return output;
//            }
//            final BigInteger v = e.modInverse(n);
//            final BigInteger z1 = s.multiply(v).mod(n);
//            final BigInteger z2 = (n.subtract(r)).multiply(v).mod(n);
//            final ECPoint G = parameters.getG();
//            final ECPoint Q = pubKey.getQ();
//            final ECPoint point = ECAlgorithms.sumOfTwoMultiplies(G, z1, Q, z2);
//
//            if (point.isInfinity()) {
//
//                session.setAttribute("login", request.getParameter("empty"));
//                output.put("result", "Ошибка №2 совпадения цифровой подписи");
//                return output;
//            }
//            final BigInteger R = point.getX().toBigInteger().mod(n);
//
//            //если подписи совпали
//            if (r.equals(R)) {
//
////                excludeAtt(request, user.user2, user.role)
////            
////                Att.att(request).sys.region = user.uchschool.uch_Ter_Sp   
////                Att.att(request).sys.login = user.user2
////                Att.att(request).sys.role = user.role            
////                output.role = user.role
////                output.result = 'true'
//            }
//        } catch (NoSuchAlgorithmException e) {
//            System.err.println(e);
//        } catch (UnsupportedEncodingException e) {
//            System.err.println(e);
//        } catch (NullPointerException e) {
//            System.err.println(e);
//        }
//        return output;
        return null;
    }

    //новый пользователь, сохранение user, password и role в базе данных
    public HashMap newLogin(HttpServletRequest request, HttpServletResponse response) {

        Att att = Att.att(request);
        Connection connect = att.connect();
        String adm_name = request.getParameter("username");
        String adm_password = request.getParameter("password");
        String user_name = request.getParameter("username2");
        String user_password = request.getParameter("password2");
        String user_desc = request.getParameter("desc");
        String user_role = request.getParameter("role");
        HashMap output = new HashMap(new App().asMap("login", true, "mes", "Новый пользователь создан"));
        try {
            if (adm_name.equals("admin") || adm_name.equals("sysdba")) {               
                Query user = new Query(connect, eSysuser.values()).select("select * from sysuser a where a.login = '" + user_name + "'");              
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
                    record.set(eSysuser.desc, user_desc);
                    record.set(eSysuser.role, user_role);
                    record.set(eSysuser.openkey, password4);
                    record.set(eSysuser.fio, "fio");
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

    public HashMap userConnect(HttpServletRequest request, HttpServletResponse response) {

        Att att = Att.att(request);
        Connection connect = att.connect();
        Statement statement = att.statement(connect);
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        HashMap output = new HashMap();
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
                Query user = new Query(eSysuser.values()).select("select * from sysuser a where a.user2 = '" + username + "'");
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
            output.put("result", "Ошибка авторизации №6");
            return output;
        }
    }

    public HashMap genId(HttpServletRequest request, String name) {

//        App app = new App();
//        Att att = Att.att(request);
//        Connection connect = att.initConnect();
//        Statement statement = att.initStatement(connect);
//        Query query = null;
//
//        if (name.equalsIgnoreCase("person")) {
//            query = new Query(request, ePerson.values());
//        } else if (name.equalsIgnoreCase("pupil")) {
//            query = new Query(request, ePupil.values());
//        } else if (name.equalsIgnoreCase("educat")) {
//            query = new Query(request, eEducat.values());
//        } else if (name.equalsIgnoreCase("langemp")) {
//            query = new Query(request, eLangEmp.values());
//        } else if (name.equalsIgnoreCase("ranks")) {
//            query = new Query(request, eRanks.values());
//        } else if (name.equalsIgnoreCase("reward")) {
//            query = new Query(request, eReward.values());
//        } else if (name.equalsIgnoreCase("contract")) {
//            query = new Query(request, eContract.values());
//        } else if (name.equalsIgnoreCase("leaves")) {
//            query = new Query(request, eLeaves.values());
//        } else if (name.equalsIgnoreCase("qualific")) {
//            query = new Query(request, eQualific.values());
//        } else if (name.equalsIgnoreCase("rating")) {
//            query = new Query(request, eRating.values());
//        } else if (name.equalsIgnoreCase("family")) {
//            query = new Query(request, eFamily.values());
//        } else if (name.equalsIgnoreCase("fmhelp")) {
//            query = new Query(request, eFmHelp.values());
//        } else if (name.equalsIgnoreCase("crime")) {
//            query = new Query(request, eCrime.values());
//        } else if (name.equalsIgnoreCase("welfar")) {
//            query = new Query(request, eWelfar.values());
//        } else if (name.equalsIgnoreCase("vaccinal")) {
//            query = new Query(request, eVaccinal.values());
//        } else if (name.equalsIgnoreCase("morbidity")) {
//            query = new Query(request, eMorbidity.values());
//        } else if (name.equalsIgnoreCase("langpup")) {
//            query = new Query(request, eLangPup.values());
//        } else if (name.equalsIgnoreCase("yearrest")) {
//            query = new Query(request, eYearRest.values());
//        } else if (name.equalsIgnoreCase("subject")) {
//            query = new Query(request, eSubject.values());
//        } else if (name.equalsIgnoreCase("cabinets")) {
//            query = new Query(request, eCabinets.values());
//        } else if (name.equalsIgnoreCase("uchschool")) {
//            query = new Query(request, eUchSchool.values());
//        } else if (name.equalsIgnoreCase("uchakrprog")) {
//            query = new Query(request, eUchAkrprog.values());
//        } else if (name.equalsIgnoreCase("licenz")
//                || name.equalsIgnoreCase("akkredit")) {
//            query = new Query(request, eUchDocs.values());
//        } else if (name.equalsIgnoreCase("cabinets")) {
//            query = new Query(request, eCabinets.values());
//        } else if (name.equalsIgnoreCase("uchbanks")) {
//            query = new Query(request, eUchBanks.values());
//        } else if (name.equalsIgnoreCase("uchproject88")
//                || name.equalsIgnoreCase("uchproject89")
//                || name.equalsIgnoreCase("uchproject92")) {
//            name = "uchproject";
//            query = new Query(request, eUchProject.values());
//        } else if (name.equalsIgnoreCase("actperson")) {
//            query = new Query(request, eActPerson.values());
//        } else if (name.equalsIgnoreCase("actexperiment")) {
//            query = new Query(request, eActExperiment.values());
//        } else if (name.equalsIgnoreCase("actprepare")) {
//            query = new Query(request, eActPrepare.values());
//        } else if (name.equalsIgnoreCase("group2uch")) {
//            query = new Query(request, eGroup2Uch.values());
//        } else if (name.equalsIgnoreCase("group2sub")) {
//            query = new Query(request, eGroup2Sub.values());
//        } else if (name.equalsIgnoreCase("group2pup")) {
//            query = new Query(request, eGroup2Pup.values());
//        } else if (name.equalsIgnoreCase("staf1")
//                || name.equalsIgnoreCase("staf2")) {
//            name = "staffing";
//            query = new Query(request, eStaffing.values());
//        } else if (name.equalsIgnoreCase("stafperson")) {
//            query = new Query(request, eStafperson.values());
//        } else if (name.equalsIgnoreCase("actschool")) {
//            query = new Query(request, eActSchool.values());
//        } else if (name.equalsIgnoreCase("actpupil")) {
//            query = new Query(request, eActPupil.values());
//        } else if (name.equalsIgnoreCase("actperson")) {
//            query = new Query(request, eActPerson.values());
//        }
//        String next_id = "0";
//        try {
//            ResultSet rs = statement.executeQuery("SELECT nextval('" + name + "_id_seq')");
//            if (rs.next()) {
//                next_id = rs.getString(1);
//            }
//            rs.close();
//        } catch (SQLException e) {
//            System.err.println(e);
//        }
//        Record record = query.add();
//        record.setNo(0, "INS");
//        record.setNo(1, next_id);
//        HashMap hm = app.asMap("record", app.asMap(query));
//        //System.out.println(JSONObject.toJSONString(hm));
//        return hm;
        return null;
    }
}
