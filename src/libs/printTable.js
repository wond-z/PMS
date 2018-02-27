var idTmr;
function getExplorer () {
    var explorer = window.navigator.userAgent;
    if (explorer.indexOf('Trident') >= 0) {
        // ie
        return 'ie';
    } else if (explorer.indexOf('Firefox') >= 0) {
        // firefox
        return 'Firefox';
    } else if (explorer.indexOf('Chrome') >= 0) {
        // Chrome
        return 'Chrome';
    } else if (explorer.indexOf('Opera') >= 0) {
        // Opera
        return 'Opera';
    } else if (explorer.indexOf('Safari') >= 0) {
        // Safari
        return 'Safari';
    };
};

function textForm (el) {
    let child, type, s;
    s = '';
    for (child = el.firstChild; child !== null; child = child.nextSibling) {
        type = child.nodeType;
        if (type === 3 || type === 4) {
            s += child.nodeValue.trim();
        } else if (type === 1) {
            if (child.tagName === 'INPUT') {
                s += child.value.trim();
            } else if (child.tagName === 'SELECT') {
                s += child.options[child.selectedIndex].text;
            } else {
                s += textForm(child);
            }
        }
    }
    return s;
}
/**
 * @author:hdw
 * @param {Object} table 包含表格的元素
 * @param {String} aId a链接的id
 * @param {String} name 文件名
 */
function tranform (table, aId, name) {
    table = table.$el == undefined ? table : table.$el;
    let tableBodys = table.getElementsByTagName('table');
    let tableLen = tableBodys.length;
    let tableInnerHTML = '<tbody>';
    for (let j = 0; j < tableLen; j++) {
        let len = tableBodys[j].rows.length;
        let i = 0;
        while (i < len) {
            tableInnerHTML += '<tr align="center">';
            Array.from(tableBodys[j].rows[i].cells).forEach((td) => {
                if (td.getAttribute('rowspan') && td.getAttribute('colspan')) tableInnerHTML = tableInnerHTML + '<td rowspan=' + td.getAttribute('rowspan') + ' colspan=' + td.getAttribute('colspan') + '>' + td.innerHTML + '</td>';
                else if (td.getAttribute('colspan')) tableInnerHTML = tableInnerHTML + '<td colspan=' + td.getAttribute('colspan') + '>' + textForm(td) + '</td>';
                else if (td.getAttribute('rowspan')) tableInnerHTML = tableInnerHTML + '<td rowspan=' + td.getAttribute('rowspan') + '>' + textForm(td) + '</td>';
                else tableInnerHTML = tableInnerHTML + '<td>' + textForm(td) + '</td>';
            });
            tableInnerHTML += '</tr>';
            i++;
        }
    }
    tableInnerHTML += '</tbody>';
    if (getExplorer() !== 'Safari' && name.substr(-1, 4) !== '.xls') {
        name += '.xls';
    }

    if (getExplorer() === 'ie') {
        alert('IE浏览器目前不支持导出，请使用其它浏览器！');
        var curTbl = table;
        var oXL = new ActiveXObject('Excel.Application');
        var oWB = oXL.Workbooks.Add();
        var xlsheet = oWB.Worksheets(1);
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        sel.select();
        sel.execCommand('Copy');
        xlsheet.Paste();
        oXL.Visible = true;

        try {
            var fname = oXL.Application.GetSaveAsFilename('Excel.xls', 'Excel Spreadsheets (*.xls), *.xls');
        } catch (e) {
            print('Nested catch caught ' + e);
        } finally {
            oWB.SaveAs(fname);
            oWB.Close(savechanges = false);
            oXL.Quit();
            oXL = null;
            idTmr = setInterval(Cleanup(), 1);
        }
    } else {
        tableToExcel(tableInnerHTML, aId, name);
    }
}
function Cleanup () {
    window.clearInterval(idTmr);
    CollectGarbage();
}
let tableToExcel = (function () {
    let uri = 'data:application/vnd.ms-excel;base64,';
    let template = '<html><head><meta charset="UTF-8"></head><body><table border="5pt solid #000;">{table}</table></body></html>';
    let base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); };
    let format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; });
    };
    return function (table, aId, name) {
        let ctx = { worksheet: name || 'Worksheet', table: table };
        let aLink = document.createElement('a');
        aLink.href = uri + base64(format(template, ctx));
        aLink.download = name;
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
    };
})();

const printTable = {};

printTable.transform = tranform;

export default printTable;
