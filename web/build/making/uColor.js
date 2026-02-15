
export let UColor = {};

//Текстура профиля или текстура заполнения изделия (неокрашенные)
UColor.colorFromArtikl = (artiklID) => {
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
};


