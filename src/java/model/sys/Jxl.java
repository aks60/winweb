package model.sys;

import jxl.*;
import jxl.write.*;
import jxl.read.biff.BiffException;
import jxl.write.WritableSheet;

public class Jxl {

    private static WritableFont writableFont;
    private static WritableCellFormat style_title;
    private static WritableCellFormat style_column;
    private static WritableCellFormat style_record;

    public static void init() {
        try {
            writableFont = new WritableFont(WritableFont.TAHOMA, 10, WritableFont.BOLD);
            style_title = new WritableCellFormat(writableFont);
            style_column = new WritableCellFormat(writableFont);
            style_column.setBorder(jxl.format.Border.ALL, jxl.format.BorderLineStyle.DOUBLE);
            style_column.setBackground(jxl.format.Colour.GRAY_25);
            style_record = new WritableCellFormat();
            style_record.setBorder(jxl.format.Border.ALL, jxl.format.BorderLineStyle.THIN);
        } catch (WriteException e) {
        }
    }

    public static void Title(int col, int row, WritableSheet sheet, String str) {
        try {
            sheet.addCell(new jxl.write.Label(col, row, str, style_title));
        } catch (WriteException e) {
        }
    }

    public static void Column(int col, int row, WritableSheet sheet, Object value) {
        Column(col, row, sheet, value.toString(), value.toString().length() + 2);
    }

    public static void Column(int col, int row, WritableSheet sheet, String value, int size) {
        try {
            size = (size < value.length() + 3) ? value.length() + 3 : size;
            sheet.setColumnView(col, size);
            sheet.addCell(new jxl.write.Label(col, row, value, style_column));
        } catch (WriteException e) {
            System.out.println(e);
        }
    }

    public static void CellStr(int col, int row, WritableSheet sheet, Object value) {
        try {
            if (value == null || value.equals("null") || value.equals(0)) {
                sheet.addCell(new jxl.write.Label(col, row, "", style_record));
            } else {
                sheet.addCell(new jxl.write.Label(col, row, value.toString(), style_record));
            }
        } catch (WriteException e) {
            System.out.println(e);
        }
    }

    public static void CellNum(int col, int row, WritableSheet sheet, Object value) {
        try {
            if (value == null) {
                sheet.addCell(new jxl.write.Number(col, row, 0, style_record));
            } else {
                Double val = Double.valueOf(value.toString());
                sheet.addCell(new jxl.write.Number(col, row, val, style_record));
            }
        } catch (WriteException e) {
        }
    }

    public static void expandColumn(WritableSheet sheet, int amountOfColumns) {
        int c = amountOfColumns;
        for (int x = 0; x < c; x++) {
            CellView cell = sheet.getColumnView(x);
            cell.setAutosize(true);
            sheet.setColumnView(x, cell);
        }
    }
}
