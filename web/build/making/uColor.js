
export class UColor {

    COLOR_US = 2;
    COLOR_FK = 3;
    ARTIKL_ID = 4;

    constructor(winc) {
    }

    static colorFromElemOrSeri(spcAdd) {  //см. http://help.profsegment.ru/?id=1107 

        //TRecord spcClon = new TRecord(spcAdd);
        typesUS = spcClon.detailRec.getInt(COLOR_US);
        if (UseColor.isSeries(typesUS)) { //если серия

            let artseriList = eArtikl.list.filter(rec => rec[''] == spcClon.artiklRec[eArtikl.groups4_id]);
            for (let artseriRec of artseriList) {
                spcClon.artiklRec(artseriRec);
                if (UColor.colorFromProduct(spcClon, 1, true)
                        && UColor.colorFromProduct(spcClon, 2, true)
                        && UColor.colorFromProduct(spcClon, 3, true)) {
                    //spcAdd.copy(spcClon);
                    return true;
                }
            }
            spcClon.colorID1 = getID_colorUS(spcClon, typesUS & 0x0000000f);
            spcClon.colorID2 = getID_colorUS(spcClon, (typesUS & 0x000000f0) >> 4);
            spcClon.colorID3 = getID_colorUS(spcClon, (typesUS & 0x00000f00) >> 8);

        } else {
            if (UColor.colorFromProduct(spcAdd, 1, false)
                    && UColor.colorFromProduct(spcAdd, 2, false)
                    && UColor.colorFromProduct(spcAdd, 3, false)) {
                return true;
            }
        }
        return false;
    }

    /**
     * ВРУЧНУЮ, АВТОПОДБОР, ПАРАМЕТР
     *
     * @param spcAdd
     * @param side
     * @param seri
     * @return
     */
    static colorFromProduct(spcAdd, side, seri) {  //см. http://help.profsegment.ru/?id=1107        

        /*    int srcNumberUS = spcAdd.detailRec.getInt(COLOR_US);
         int srcColorFk = spcAdd.detailRec.getInt(COLOR_FK);
         
         if (srcColorFk == -1) {
         colorFromMes(spcAdd);
         return false; //нет данных для поиска
         }
         int resultColorID = -1;
         try {
         int srcColorUS = (side == 1) ? srcNumberUS & 0x0000000f : (side == 2)
         ? (srcNumberUS & 0x000000f0) >> 4 : (srcNumberUS & 0x00000f00) >> 8; //тип подбора                
         int elemArtID = spcAdd.artiklRec.getInt(eArtikl.id);
         
         //Цвет элемента по которому подбираю из варианта подбора
         int originColorID = getID_colorUS(spcAdd, srcColorUS);
         
         
         ////= ВРУЧНУЮ =////
         if (srcColorFk > 0 && srcColorFk != 100000) {
         
         //Явное указание текстуры
         if (srcColorUS == UseColor.MANUAL.id) {
         if (seri == true) {
         resultColorID = -1; //нельзя назначать на серию
         } else {
         resultColorID = scanFromProfSide(elemArtID, srcColorFk, side); //теоритически это должно железно работать!!!
         if (resultColorID == -1) {
         if (spcAdd.artiklRec.getInt(eArtikl.level1) == 2 && (spcAdd.artiklRec.getInt(eArtikl.level2) == 11 || spcAdd.artiklRec.getInt(eArtikl.level2) == 13)) {
         return false;
         }
         resultColorID = scanFromColorFirst(spcAdd); //первая в списке и это неправильно
         }
         }
         
         //Подбор по текстуре профиля и текстуре сторон профиля
         } else if (List.of(UseColor.PROF.id, UseColor.GLAS.id, UseColor.COL1.id, UseColor.COL2.id,
         UseColor.COL3.id, UseColor.C1SER.id, UseColor.C2SER.id, UseColor.C3SER.id).contains(srcColorUS)) {
         
         resultColorID = scanFromProfSide(elemArtID, originColorID, side);
         if (resultColorID == -1 && seri == false) {
         resultColorID = srcColorFk;
         }
         }
         
         
         ////= АВТОПОДБОР =////
         } else if (srcColorFk == 0 || srcColorFk == 100000) {
         //Для точн.подбора в спецификпцию не попадёт. См. HELP "Конструктив=>Подбор текстур"
         
         //Подбор по текстуре профиля и заполн.
         if (List.of(UseColor.PROF.id, UseColor.GLAS.id).contains(srcColorUS)) {
         resultColorID = scanFromProfile(elemArtID, originColorID, side);
         if (resultColorID == -1 && srcColorFk == 0) {
         resultColorID = scanFromColorFirst(spcAdd); //если неудача подбора то первая в списке запись цвета
         }
         //Подбор по текстуре сторон профиля
         } else if (List.of(UseColor.COL1.id, UseColor.COL2.id, UseColor.COL3.id,
         UseColor.C1SER.id, UseColor.C2SER.id, UseColor.C3SER.id).contains(srcColorUS)) {
         resultColorID = scanFromProfSide(elemArtID, originColorID, side);
         if (resultColorID == -1 && srcColorFk == 0) {
         resultColorID = scanFromColorFirst(spcAdd); //первая в списке запись цвета
         }
         }
         
         
         ////= ПАРАМЕТР =////
         } else if (srcColorFk < 0) {  //если artdetColorFK == -1 в спецификпцию не попадёт. См. HELP "Конструктив=>Подбор текстур" 
         Record syspar1Rec = spcAdd.elem5e.winc.mapPardef.get(srcColorFk);
         
         //Подбор по текстуре профиля и заполн.
         if (srcColorUS == UseColor.PROF.id || srcColorUS == UseColor.GLAS.id) {
         resultColorID = scanFromParams(elemArtID, syspar1Rec, originColorID, side);
         
         //Подбор по текстуре сторон профиля
         } else if (List.of(UseColor.COL1.id, UseColor.COL2.id, UseColor.COL3.id,
         UseColor.C1SER.id, UseColor.C2SER.id, UseColor.C3SER.id).contains(srcColorUS)) {
         resultColorID = scanFromParamSide(elemArtID, syspar1Rec, originColorID, side);
         
         //Подбор по текстурному параметру
         } else if (List.of(UseColor.PARAM.id, UseColor.PARSER.id).contains(srcColorUS)) {
         Record parmapRec = eParmap.find3(syspar1Rec.getStr(eSyspar1.text), syspar1Rec.getInt(eSyspar1.groups_id));
         originColorID = parmapRec.getInt(eParmap.color_id1);
         resultColorID = scanFromProfSide(elemArtID, originColorID, side);
         }
         }
         if (resultColorID != -1) {
         if (side == 1) {
         spcAdd.colorID1 = resultColorID;
         } else if (side == 2) {
         spcAdd.colorID2 = resultColorID;
         } else if (side == 3) {
         spcAdd.colorID3 = resultColorID;
         }
         
         } else { //в спецификпцию не попадёт. См. HELP "Конструктив=>Подбор текстур" 
         return false;
         }
         } catch (Exception e) {
         System.err.println("Ошибка:UColor.colorFromProduct(3) " + e);
         }
         return true; */
    }

    //Текстура профиля или текстура заполнения изделия (неокрашенные)
    static colorFromArtikl(artiklID) {
        try {
            let artdetList = eArtdet.list.filter(rec => rec[eArtdet.artikl_id] == artiklID);
            //Цикл по ARTDET определённого артикула
            for (let artdetRec of artdetList) {
                if (artdetRec[eArtdet.color_fk] >= 0) {
                    if ("1" === artdetRec[eArtdet.mark_c1]
                            && ("1" === artdetRec[eArtdet.mark_c2] || "1" === artdetRec[eArtdet.mark_c1])
                            && ("1" === artdetRec.getStr[eArtdet.mark_c3] || "1" === artdetRec[eArtdet.mark_c1])) {

                        return artdetRec[eArtdet.color_fk];
                    }
                }
            }
            return -3;

        } catch (e) {
            errorLog('Error: UColor.colorFromArtikl() ' + e.message);
        }
    }

    //Выдает цвет в соответствии с заданным вариантом подбора текстуры   
    getID_colorUS(spcAdd, srcColorUS) {
        /*    try {
         switch (srcColorUS) {
         case 0:
         return spcAdd.detailRec.getInt(COLOR_FK);  //указана вручную
         case 11: //По текстуре профиля
         ElemSimple firstElem = spcAdd.elem5e.root.frames.get(0);
         int artiklID = firstElem.artiklRec.getInt(eArtikl.id);
         //int artiklID = spcAdd.elem5e.artiklRecAn.getInt(eArtikl.id);
         return eArtdet.data().stream().filter(rec
         -> rec.getInt(eArtdet.mark_c1) == 1
         && rec.getInt(eArtdet.mark_c2) == 1
         && rec.getInt(eArtdet.mark_c3) == 1
         && rec.getInt(eArtdet.artikl_id) == artiklID
         && rec.getInt(eArtdet.color_fk) > 0)
         .findFirst().orElse(eArtdet.record()).getInt(eArtdet.color_fk);
         case 15: //По текстуре заполнения
         if (spcAdd.elem5e.artiklRecAn.getInt(eArtikl.level1) == 5) {
         return spcAdd.elem5e.colorID1;
         }
         case 1: //По основе профиля
         return spcAdd.elem5e.root.colorID1;
         //                    return spcAdd.elem5e.colorID1;
         case 2: //По внутр.профиля
         return spcAdd.elem5e.root.colorID2;
         //                    return spcAdd.elem5e.colorID2;
         case 3: //По внешн.профиля
         return spcAdd.elem5e.root.colorID3;
         //                    return spcAdd.elem5e.colorID3;
         case 6: //По основе профиля в серии
         return spcAdd.elem5e.root.colorID1;
         //                    return spcAdd.elem5e.colorID1;
         case 7: //По внутр.профиля в серии
         return spcAdd.elem5e.root.colorID2;
         //                    return spcAdd.elem5e.colorID2;
         case 8: //По внешн.профиля в серии
         return spcAdd.elem5e.root.colorID3;
         //                    return spcAdd.elem5e.colorID3;
         default:
         return -1;
         }
         } catch (e) {
         errorLog("Error: UColor.getID_colorUS() " + e);
         return -1;
         } */
    }  

}
