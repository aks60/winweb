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
        colNames: ['id', 'Номер заказа', 'Номер счёта', 'Дата регистрации', 'Дата расчёта', 'Дата в производство', 'Заказчик', 'User', 'prjpart2_id'],
        colModel: [
            {name: 'ID', hidden: true},
            {name: 'num_ord', width: 80, sorttype: "text"},
            {name: 'num_acc', width: 80, sorttype: "text"},
            {name: 'date4', width: 80, sorttype: "date"},
            {name: 'date5', width: 80, sorttype: "date"},
            {name: 'date6', width: 80, sorttype: "date"},
            {name: 'partner', width: 220, sorttype: "text"},
            {name: 'login', width: 120, sorttype: "text"},
            {name: 'prjpart2_id', hidden: true}
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
//    $(project.table1).jqGrid('clearGridData', true);
//    let projectList = eProject.list.filter(rec => rec[eProject.login] === login.login);
//    projectList.sort((a, b) => b[eProject.id] - a[eProject.id]);
//    for (let i = 0; i < projectList.length; i++) {
//        let tr = projectList[i];
//        $(project.table1).jqGrid('addRowData', i + 1, {
//            ID: tr[eProject.id],
//            num_ord: tr[eProject.num_ord],
//            num_acc: tr[eProject.num_acc],
//            date4: tr[eProject.date4],
//            date5: tr[eProject.date5],
//            date6: tr[eProject.date6],
//            partner: findef(tr[eProject.prjpart2_id], ePrjpart.id, ePrjpart)[ePrjpart.partner],
//            login: tr[eProject.login],
//            prjpart2_id: tr[eProject.prjpart2_id]
//        });
//    }
//    $(project.table1).jqGrid("setSelection", project.table1rowID);
};


