package model.sys;

import dataset.Field;
import dataset.Query;
import dataset.Record;
import dataset.Table;
import domain.eSetting;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public class Sys {

    public static DateFormat dateFormat = DateFormat.getDateInstance(DateFormat.MEDIUM);
    public static SimpleDateFormat dateFormat2 = new SimpleDateFormat("dd.MM.yyyy");
    public static SimpleDateFormat dateFormat3 = new SimpleDateFormat("yyyy-MM-dd");
    //текущая дата
    private static GregorianCalendar appCalendar = new GregorianCalendar();
    //день и месяц перехода на новый уч. год
    private static int dayPasSchool = 0;
    private static int mothPasSchool = 0;

    public static Sys init() {
        return new Sys();
    }

    public static GregorianCalendar getCalendar() {
        return appCalendar;
    }

    //учебный год на дату
    public static int getYearSchool(Date date) {

        int year;
        if (date == null) {
            year = appCalendar.get(Calendar.YEAR);
        } else {
            GregorianCalendar calendar = new GregorianCalendar();
            calendar.setTime(date);
            year = calendar.get(Calendar.YEAR);
        }
        GregorianCalendar schCalendar = new GregorianCalendar(year, mothPasSchool - 1, dayPasSchool);
        if (appCalendar.before(schCalendar)) {
            --year;
        }
        return year;
    }

    //текушая дата + dxYear
    public static Date getDateNow(int dxYear) {
        if (dxYear == 0) {
            return appCalendar.getTime();
        }
        int year = appCalendar.get(Calendar.YEAR) + dxYear;
        int month = appCalendar.get(Calendar.MONTH);
        int day_of_month = appCalendar.get(Calendar.DAY_OF_MONTH);
        return getDate(year, month, day_of_month);
    }

    //текушая дата
    public static String getNowDateStr(int dxYear) {
        return dateFormat2.format(getDateNow(dxYear));
    }

    //init месяц и день перехода
    public static void initDatePass(HttpServletRequest request) {

//        Record recordSys = new Query(request, eSystem.values()).select("select * from sys_m where sp = 1").get(0);
//        mothPasSchool = recordSys.getInt(eSystem.val1);
//        dayPasSchool = recordSys.getInt(eSystem.val2);
    }

    //дата перехода на новый уч. год
    public static Date getDatePass(HttpServletRequest request, int dxYear) {

//        Record recordSys = new Query(request, eSystem.values()).select("select * from sys_m where sp = 1").get(0);
//        int year = getYearSchool(null) + dxYear;
//        int month = recordSys.getInt(eSystem.val1) - 1;
//        int day = recordSys.getInt(eSystem.val2);
//        GregorianCalendar schoolCalendar = new GregorianCalendar(year, month, day);
//        return schoolCalendar.getTime();
        return null;
    }

    public static Date getDate(int year, int month, int day) {
        GregorianCalendar calendar = new GregorianCalendar(year, month, day);
        return calendar.getTime();
    }

    //начальная нулевая дата
    public static Date getNullDate() {
        return new Date(0);
    }

    public static SimpleDateFormat getDateFormat2() {
        return dateFormat2;
    }

    //преобразование даты в строку
    public static String getDateStr(Object obj) {
        if (obj instanceof Date) {
            GregorianCalendar gk = new GregorianCalendar();
            gk.setTime((Date) obj);
            int index = gk.get(GregorianCalendar.MONTH);
            String monthName[] = {"января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"};
            return "'" + String.valueOf(gk.get(GregorianCalendar.DAY_OF_MONTH)) + "' "
                    + monthName[index] + "    " + String.valueOf(gk.get(GregorianCalendar.YEAR)) + " г.";
        } else {
            return "";
        }
    }

    //преобразование string в date
    public static Date StrToDate(String str) {
        try {
            return (Date) dateFormat.parse(str);
        } catch (java.text.ParseException e) {
            return null;
        }
    }

    //преобразование date в string
    public static String DateToStr(Object date) {
        if (date instanceof java.util.Date) {
            return dateFormat2.format(date);
        } else {
            return "";
        }
    }

    //возраст
    public static int ageEmp(GregorianCalendar birthDay, GregorianCalendar checkDay) {

        int years = checkDay.get(GregorianCalendar.YEAR) - birthDay.get(GregorianCalendar.YEAR);
        // корректируем, если текущий месяц в дате проверки меньше месяца даты рождения
        int checkMonth = checkDay.get(GregorianCalendar.MONTH);
        int birthMonth = birthDay.get(GregorianCalendar.MONTH);
        if (checkMonth < birthMonth) {
            years--;
        } else if (checkMonth == birthMonth
                && checkDay.get(GregorianCalendar.DAY_OF_MONTH) < birthDay.get(GregorianCalendar.DAY_OF_MONTH)) {
            // отдельный случай - в случае равенства месяцев,
            // но меньшего дня месяца в дате проверки - корректируем
            years--;
        }
        return years;
    }
}
