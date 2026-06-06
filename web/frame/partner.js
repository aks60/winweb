import {Wincalc} from '../build/Wincalc.js';
import {login} from './login.js';

export let partner = {};

//Масштабирование
partner.resize = function () {
    $("#context").css("height", window.innerHeight - 48);
    $(partner.table1).jqGrid('setGridWidth', $("#centr").width());
    $(partner.table1).jqGrid('setGridHeight', $("#centr").height() - 28);
};

//Инициализация таблиц
partner.init_table = function () {
    $(partner.table1).jqGrid({
        datatype: "local",
        gridview: true,
        rownumbers: true,
        rownumWidth: 20,
        autowidth: true,
        height: "auto",
        colNames: ['id', 'Заказчик', 'Организация'],
        colModel: [
            {name: 'ID', hidden: true},
            {name: 'partner', width: 200, sorttype: "text"},
            {name: 'flag2', width: 60, sorttype: "int"}
        ],
        onSelectRow: function (rowid, status, e) {
//            let projectRow = $(project.table1).jqGrid('getRowData', rowid);
//            project.projectRec = eProject.list.find(rec => Number(projectRow.ID) === rec[eProject.id]);
//            project.table1rowID = rowid;
//            project.load_table2();
//            project.load_table3();   //загрузка таблицы 3         
        },
        gridComplete: function () {
//            project.resize();
        }
    });
};

//Загрузка лроектов в таблицу
partner.load_table1 = function () {
    $(partner.table1).jqGrid('clearGridData', true);
    let partnerList = ePrjpart.list.filter(rec => rec[ePrjpart.login] === login.login && rec[ePrjpart.login] === 'заказчик');
    partnerList.sort((a, b) => b[ePrjpart.id] - a[ePrjpart.id]);
    for (let i = 0; i < partnerList.length; i++) {
        let tr = partnerList[i];
        $(partner.table1).jqGrid('addRowData', i + 1, {
            ID: tr[ePrjpart.id],
            partner: tr[ePrjpart.partner],
            flag2: tr[ePrjpart.flag2]
        });
    }
    $(partner.table1).jqGrid("setSelection", partner.table1rowID);
};


