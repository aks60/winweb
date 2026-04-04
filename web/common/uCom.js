
export let UCom = {};

//TODO Test
//"180",  "30-179",  "0-89,99;90, 01-150;180, 01-269, 99;270, 01-359, 99"
//Если не диапазон, то точный поиск
UCom.containsColor = (txt, value) => {
    try {
        if (txt == null || txt.isEmpty() || txt === "*") {
            return true;
        }
        let code = eColor.find(rec => rec[eColor.id] === value)[eColor.code];
        let arrList = new Array();
        txt = txt.replaceAll(",", ".");
        let arr = txt.split(";");
        if (arr.length === 1) {
            arr = arr[0].split("-");
            if (arr.length === 1) { //если не диапазон, то точный поиск
                arrList.add(Number(arr[0]));
                arrList.add(Number(arr[0]));
            } else {
                arrList.add(Number(arr[0]));
                arrList.add(Number(arr[1]));
            }
        } else {
            for (let index = 0; index < arr.length; index++) {
                let arr2 = arr[index].split("-");
                if (arr2.length === 1) {
                    arrList.add(Number(arr2[0]));
                    arrList.add(Number(arr2[0]));
                } else {
                    arrList.add(Number(arr2[0]));
                    arrList.add(Number(arr2[1]));
                }
            }
        }
        for (let index = 0; index < arrList.length; ++index) {
            let v1 = arrList.get(index);
            let v2 = arrList.get(++index);
            if (v1 <= code && code <= v2) {
                return true;
            }
        }
    } catch (e) {
        console.error(e.message);
    }
    return false;
};
