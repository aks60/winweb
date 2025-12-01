package model.sys;

import dataset.Field;
import dataset.Record;
import dataset.Table;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;
import static model.sys.Sys.dateFormat2;

public class App {

    //Накопление результата
    public static void inc(Map hm, Integer val, Object... keys) {
        try {
            hm = map(hm, Arrays.copyOf(keys, keys.length - 1));

            if (hm.get(keys[keys.length - 1]) == null) {
                hm.put(keys[keys.length - 1], val);
            } else {
                hm.put(keys[keys.length - 1], (val + (Integer) hm.get(keys[keys.length - 1])));
            }
        } catch (Exception e) {
            System.err.println("App.inc() - " + e);
        }
    }

    //Накопление результата
    public static void inc(Map hm, Double val, Object... keys) {
        try {
            hm = map(hm, Arrays.copyOf(keys, keys.length - 1));

            if (hm.get(keys[keys.length - 1]) == null) {
                hm.put(keys[keys.length - 1], val);
            } else {
                hm.put(keys[keys.length - 1], (val + (Double) hm.get(keys[keys.length - 1])));
            }
        } catch (Exception e) {
            System.err.println("App.inc() - " + e);
        }
    }

    //Накопление массива
    public static <E> void add(Map hm, E val, Object... keys) {
        try {
            hm = map(hm, Arrays.copyOf(keys, keys.length - 1));

            if (hm.get(keys[keys.length - 1]) == null) {
                ArrayList arr = new ArrayList();
                arr.add((E) val);
                hm.put(keys[keys.length - 1], arr);
            } else {
                ArrayList arr = (ArrayList) hm.get(keys[keys.length - 1]);
                arr.add((E) val);
            }
        } catch (Exception e) {
            System.err.println("App.add() - " + e);
        }
    }

    //Присвоение значения
    public static <E> void put(Map hm, E val, Object... keys) {
        try {
            hm = map(hm, Arrays.copyOf(keys, keys.length - 1));
            hm.put(keys[keys.length - 1], (E) val);

        } catch (Exception e) {
            System.err.println("App.put() - " + e);
        }
    }

    //Получить значение HashMap
    public static <E> E val(Map hm, E def, Object... keys) {
        try {
            hm = map(hm, Arrays.copyOf(keys, keys.length - 1));
            return (hm.get(keys[keys.length - 1]) == null) ? def : (E) hm.get(keys[keys.length - 1]);

        } catch (Exception e) {
            System.err.println("App.val() - " + e);
            return null;
        }
    }

    //Получить вложенный HashMap
    public static <E> E map(Map hm, Object... keys) {
        try {
            for (int level = 0; level < keys.length; ++level) {
                Object key = keys[level];

                if (hm.get(key) instanceof Map) {
                    hm = (Map) hm.get(key);

                } else {
                    hm.put(key, new HashMap());
                    hm = (Map) hm.get(key);
                }
            }
            return (E) hm;

        } catch (Exception e) {
            System.err.println("App.getMap() - " + e);
            return null;
        }
    }

    //Получить ArrayList из HashMap
    public static <E> ArrayList<E> getArr(HashMap<Object, E> hm) {
        try {
            ArrayList<E> arr = new ArrayList();
            for (Map.Entry<Object, E> entry : hm.entrySet()) {
                E value = entry.getValue();
                arr.add(value);
            }
            return arr;

        } catch (Exception e) {
            System.err.println("App.getArr(HashMap<Object, E> hm) - " + e);
            return null;
        }
    }

    //Получить вложенный ArrayList
    public static <E> ArrayList<E> getArr(HashMap hm, Object... keys) {
        try {
            for (int level = 0; level < keys.length - 1; ++level) {
                Object key = keys[level];

                if (hm.get(key) instanceof HashMap) {
                    hm = (HashMap) hm.get(key);

                } else {
                    hm.put(key, new HashMap());
                    hm = (HashMap) hm.get(key);
                }
            }
            if (hm.get(keys[keys.length - 1]) instanceof ArrayList) {
                return (ArrayList<E>) hm.get(keys[keys.length - 1]);
            }
            return new ArrayList();

        } catch (Exception e) {
            System.err.println("App.getArr(HashMap hm, Object... keys) - " + e);
            return null;
        }
    }

    public static <E> ArrayList<E> asArr(E... objs) {
        ArrayList<E> arr = new ArrayList();
        for (E obj : objs) {
            arr.add(obj);
        }
        return arr;
    }

    public static <E> E[] asMas(E... objs) {
        return objs;
    }

    public static TreeMap asTree(Object... arr) {
        try {
            TreeMap tm = new TreeMap();
            for (int i = 0; i < arr.length; i += 2) {
                tm.put(arr[i], arr[i + 1]);
            }
            return tm;
        } catch (Exception e) {
            System.err.println("App.asMap(1) - " + e);
            return null;
        }
    }

    public static HashMap asMap(Object... arr) {
        try {
            HashMap hm = new HashMap();
            for (int i = 0; i < arr.length; i += 2) {
                hm.put(arr[i], arr[i + 1]);
            }
            return hm;
        } catch (Exception e) {
            System.err.println("App.asMap(1) - " + e);
            return null;
        }
    }

    public static ArrayList<HashMap> asMap(Table... tables) {

//        if (tables[0] == null) {
//            return null;
//        }
//        ArrayList<HashMap> output = new ArrayList();
//        for (int indexRecord = 0; indexRecord < tables[0].size(); ++indexRecord) {
//
//            HashMap<String, Object> hm = new HashMap();
//            for (int indexTable = 0; indexTable < tables.length; ++indexTable) {
//
//                Field[] fld = tables[indexTable].fields();
//                Record rec = tables[indexTable].get(indexRecord);
//
//                for (Field field : tables[indexTable].fields()) {
//                    //определим индекс повторения полей типа Field
//                    int indexReplace = 0;
//                    for (int indexGroup = 1; indexGroup < indexTable; indexGroup++) {
//                        for (Field field2 : tables[indexGroup].fields()) {
//                            if (field.equals(field2)) {
//                                ++indexReplace;
//                            }
//                        }
//                    }
//                    Object value = tables[indexTable].get(indexRecord, field);
//                    if (value instanceof String) {
//                        //value = tables[indexTable].get(indexRecord, field).toString().trim();
//                        value = value.toString().trim();
//                    } else if (value instanceof Date) {
//                        value = dateFormat2.format(value);
//                    }
//                    //если есть повтор field.name()
//                    if (indexReplace > 0) {
//                        hm.put(field.name() + "_" + String.valueOf(indexReplace), value);
//                    } else {
//                        hm.put(field.name(), value);
//                    }
//                }
//            }
//            output.add(hm);
//        }
//        return output;
          return null;
    }

    public static HashMap<Object, Record> asMap(Table table, Field id) {

        HashMap output = new HashMap();
        for (Record it : table) {
            output.put(it.get(id), it);
        }
        return output;
    }

    public static HashMap asMap(Table table, Field id, Field val) {

        HashMap output = new HashMap();
        for (Record it : table) {
            output.put(it.get(id), it.get(val));
        }
        return output;
    }

    public static HashMap asMap(Record record, Field... field) {
        HashMap hm = new HashMap();
        for (int i = 0; i < field.length; ++i) {
            Object value = record.get(field[i]);
            if (value instanceof String) {
                value = value.toString().trim();
            } else if (value instanceof Date) {
                value = dateFormat2.format(value);
            }
            hm.put(field[i].name(), value);
        }
        return hm;
    }

    /**
     * Сравнение двух полей и запись результата
     */
    public static void compareResult(Table table, int index, HashMap recordPar, boolean opt) {

//        boolean ret = false;
//        Record recordTable = table.get(index);
//        int indexField = table.index(recordPar.get("field").toString());
//        if (recordPar.get("domain").equals(0)) {
//            if (opt == false) {
//                ret = compareType2(recordTable.get(indexField), recordPar.get("key"));
//            } else {
//                String str = recordPar.get("key").toString();
//                String str2 = recordTable.get(indexField).toString();
//                if (str2.indexOf(str) == 0) {
//                    ret = true;
//                }
//            }
//        } else if (recordPar.get("domain").equals(-1)) {
//            ret = compareType3(recordTable.get(indexField), recordPar.get("key"), recordPar.get("key2"));
//        } else {
//            ret = compareType1(recordTable.get(indexField), recordPar.get("key"));
//        }
//        int ret2 = (ret == false) ? 0 : 1;
//        recordPar.put("result", ret2);
    }

    public static void compareResult(HashMap recordTable, HashMap recordPar, boolean opt) {

        boolean ret = false;
        if (recordPar.get("domain").equals(0)) {
            if (opt == false) {
                ret = compareType2(recordTable.get(recordPar.get("field")), recordPar.get("key"));
            } else {
                String str = recordPar.get("key").toString();
                String str2 = recordTable.get(recordPar.get("field")).toString();
                if (str2.indexOf(str) == 0) {
                    ret = true;
                }
            }
        } else if (recordPar.get("domain").equals(-1)) {
            ret = compareType3(recordTable.get(recordPar.get("field")), recordPar.get("key"), recordPar.get("key2"));
        } else {
            ret = compareType1(recordTable.get(recordPar.get("field")), recordPar.get("key"));
        }
        int ret2 = (ret == false) ? 0 : 1;
        recordPar.put("result", ret2);
    }

    /**
     * Принятие решения по строке Каждая запись может имеет несколько критериев
     * поиска, в зависимости от выбранных режимов поиска принимается решение
     */
    public static boolean logicResult(ArrayList<HashMap> params, boolean opt1, boolean opt2) {
        //операция отношения И
        if (opt2 == true) {
            //цикл по параметрам поиска
            for (HashMap keyRecord : params) {

                if (keyRecord.get("result") != null) {
                    if (opt1 == true && keyRecord.get("result").equals(0)) {
                        return false;//операция РАВНО
                    } else if (opt1 == false && keyRecord.get("result").equals(1)) {
                        return false;//операция НЕ РАВНО
                    }
                }
            }
            return true;
        }
        //операция отношения ИЛИ
        if (opt2 == false) {
            //цикл по параметрам поиска
            for (HashMap keyRecord : params) {

                if (keyRecord.get("result") != null) {
                    if (opt1 == true && keyRecord.get("result").equals(1)) {
                        return true;//операция РАВНО
                    } else if (opt1 == false && keyRecord.get("result").equals(0)) {
                        return true;//операция НЕ РАВНО
                    }
                }
            }
        }
        return false;
    }

    //Сравнение2 чисел
    protected static boolean compareType1(Object val1, Object val2) {
        if (val1 != null && val2 != null && !val2.toString().isEmpty()) {
            int int1 = Integer.valueOf(String.valueOf(val1).toUpperCase(Locale.FRENCH));
            int int2 = Integer.valueOf(val2.toString().toUpperCase(Locale.FRENCH));
            return int1 == int2;
        }
        if (val1 == null && val2 == null) {
            return true;
        } else {
            return false;
        }
    }

    // Сравнение строк
    protected static boolean compareType2(Object val1, Object val2) {
        if (val1 != null && val2 != null && !val2.toString().isEmpty()) {
            String str1 = String.valueOf(val1).toUpperCase(Locale.FRENCH);
            String str2 = val2.toString().toUpperCase(Locale.FRENCH);
            return str1.startsWith(str2);
        }
        if (val1 == null && val2 == null) {
            return true;
        } else {
            return false;
        }
    }

    //Сравнение дат
    protected static boolean compareType3(Object val1, Object val2, Object val3) {
        if (val1 == null && val2 == null && val3 == null) {
            return true;
        } else if (val1 == null || val2 == null || val3 == null) {
            return false;
        } else {
            try {
                Date findBetween = dateFormat2.parse(val1.toString());
                Date findBegin = null, findEnd = null;
                findBegin = (val2 == null) ? new Date(0) : dateFormat2.parse(val2.toString());
                findEnd = (val3 == null) ? new Date() : dateFormat2.parse(val3.toString());
                return (findBetween.after(findBegin) && findBetween.before(findEnd));
            } catch (ParseException e) {
                System.out.println("Фильтр по интервалу дат.   " + e);
            }
            return false;
        }
    }
}
