import Cookies from 'js-cookie';
import $ from 'jquery';
if (typeof module === 'object') {
    window.jQuery = window.$ = module.exports;
};

const base = {};

// base.baseURL = 'http://61.185.0.135:6988/';
base.baseURL = 'http://172.20.0.192:9000/';

/**
 * 获取
 * @param {String} url 地址
 * @param {Function} callback 成功回调函数
 */
base.getAjaxData = function (url, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-ss-id', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-pid', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-opts', 'perm');
            xhr.setRequestHeader('X-UAId', Cookies.get('pms-X-UAId'));
        },
        success: function (e) {
            callback(e);
        },
        error: function (er) {
            console.log('操作失败!');
        }
    });
};

/**
 * 提交
 * @param {String} url 地址
 * @param {Object} url 参数
 * @param {Function} callback 成功回调函数
 */
base.postAjaxData = function (url, para, callback) {
    $.ajax({
        url: url,
        data: para,
        type: 'POST',
        contentType: 'application/json; charset=UTF-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-ss-id', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-pid', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-opts', 'perm');
            xhr.setRequestHeader('X-UAId', Cookies.get('pms-X-UAId'));
        },
        success: function (e) {
            if (callback) {
                callback(e);
            }
        },
        error: function (er) {
            console.log('操作失败!');
        }
    });
};

/**
 * 更新
 * @param {String} url 地址
 * @param {Object} url 参数
 * @param {Function} callback 成功回调函数
 */
base.putAjaxData = function (url, para, callback) {
    $.ajax({
        url: url,
        data: para,
        type: 'PUT',
        contentType: 'application/json; charset=UTF-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-ss-id', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-pid', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-opts', 'perm');
            xhr.setRequestHeader('X-UAId', Cookies.get('pms-X-UAId'));
        },
        success: function (e) {
            if (callback) {
                callback(e);
            }
        },
        error: function (er) {
            console.log('操作失败!');
        }
    });
};

/**
 * 删除
 * @param {String} url 地址
 * @param {Function} callback 成功回调函数
 */
base.deleteAjaxData = function (url, callback) {
    $.ajax({
        url: url,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-ss-id', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-pid', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-opts', 'perm');
            xhr.setRequestHeader('X-UAId', Cookies.get('pms-X-UAId'));
        },
        success: function (e) {
            if (callback) {
                callback(e);
            }
        },
        error: function (er) {
            console.log('操作失败!');
        }
    });
};

/**
 * @param {String} url 地址
 * @param {Object} para 参数
 * @param {String} type 类型
 * @param {Function} callback 回调函数
 */
base.ajaxData = function (url, para, type, callback) {
    $.ajax({
        url: base.baseURL + url,
        data: para,
        type: type,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-ss-id', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-pid', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-opts', 'perm');
            xhr.setRequestHeader('X-UAId', Cookies.get('pms-X-UAId'));
        },
        success: function (e) {
            if (callback) {
                callback(e);
            }
        },
        error: function (er) {
            console.log('操作失败!');
        }
    });
};

/**
 * 获取全部数据
 * @param {String} url 地址
 * @param {Function} callback 回调函数
 */
base.getAllData = function (url, callback) {
    let data = [];
    function ajaxData (skip) {
        $.ajax({
            url: base.baseURL + url + '?Skip=' + skip + '&Take=100',
            type: 'GET',
            success: function (e) {
                let results = e.results;
                data.push.apply(data, results);

                if (e.offset + 100 > e.total) {
                    callback(data);
                    return 1;
                } else {
                    ajaxData(e.offset + 100);
                }
            },
            error: function (er) {
                console.log('操作失败!');
            }
        });
    }
    ajaxData(0);
};

/**
 * 生成指定区间中的随机数
 * @param {Number} min 最小
 * @param {Number} max 最大
 */
base.randomNum = function (min, max) {
    let range = max - min;
    let rand = Math.random();
    return (min + rand * range).toFixed(2);
};

/**
 * 时间格式化
 * @param {Date} date
 */
base.dateFormat = function (date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    let newDate = year + '-' + month + '-' + day;
    return newDate;
};

/**
 * 监听表格总条数用以分页
 * @param {Number} val 监听结果数值
 * @param {Object} vm this
 */
base.watchTotal = function (val, vm) {
    if (vm.pageCurrent > 1) {
        let num = vm.pageSize * vm.pageCurrent - (vm.pageSize - 1);
        if (num > val) {
            vm.pageCurrent = vm.pageCurrent - 1;
            vm.skip = vm.skip - vm.pageSize;
            vm.check(vm.skip, vm.pageSize);
        }
    }
};

/**
 * 显示品名详细信息
 * @author hdw
 * @param {Object} vm vue实例
 * @param {String} wpId 物品号
 * @param {String} subClass_Value 种类
 * @param {String} steelGrade 钢级
 * @param {String} jsSpecifications 技术规格
 * @param {String} pinM 种类 & 技术规格
 * @param {String} specifications 规格 & 螺纹
 * @param {String} luoWenType 螺纹类型
 */
base.showGoodsInfo = function ({
    vm,
    wpId,
    subClass_Value,
    pinM,
    steelGrade,
    jsSpecifications,
    specifications,
    luoWenType
}) {
    wpId && base.ajaxData('PublicApi/Bs_goodsinfo_view', 'Wp_ID=' + wpId, 'get', (res) => {
        const data = res.results[0];
        for (var key in arguments[0]) {
            if (key !== 'vm') {
                if (/\./.test(arguments[0][key])) {
                    const arr = arguments[0][key].split('.');
                    vm[arr[0]][arr[1]] = data[key];
                } else {
                    vm[arguments[0][key]] = data[key];
                }
            }
        }
    });
};

/**
 * 填充原料或产品列表，并调用初始化函数
 * @author hdw
 * @param {Object} vm vue 实例
 * @param {Srting,Number} start 编号前三位
 */
base.getGoodsList = function (vm, start) {
    vm.goodsList = [];
    base.getAjaxData(base.baseURL + 'PublicApi/bs_goodsinfo_view?Wp_IDStartsWith=' + start + '&isEnable=1', (bsGoods) => {
        bsGoods.results.forEach((item) => {
            if (item.pinMing && item.wp_ID) {
                vm.goodsList.push({ id: item.wp_ID, value: item.pinMing });
            }
        });
        if (vm.goodsList[0].id) vm.material = vm.goodsList[0].id;
        vm.init();
    });
};

/**
 * 管理人员列表获取
 * @author hdw
 * @param {Object} vm vue 实例
 * @param {Srting} adminList 对应vue实例中的字段
 */
base.getAdminList = function (vm) {
    let para = {};
    para.depId = 20;
    base.ajaxData('PublicApi/Bs_Employee', para, 'GET', (e) => {
        vm.adminList = e.results;
    });
};

/**
 * json数据转树结构
 * @param {Array} arr 要转换的json数组
 */
base.formatDataToTree = function (arr) {
    var tree = [];
    var mappedArr = {};
    var arrElem;
    var mappedElem;
    // First map the nodes of the array to an object -> create a hash table.
    for (var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.id] = arrElem;
        mappedArr[arrElem.id]['children'] = [];
    }
    for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id];
            // If the element is not at the root level, add it to its parent array of children.
            if (mappedElem.parentID) {
                mappedArr[mappedElem['parentID']]['children'].push(mappedElem);
            } else { // If the element is at the root level, add it to first level elements array.
                tree.push(mappedElem);
            }
        }
    }
    return tree;
};

/**
 * 正整数验证
 */
base.intCheck = (rule, value, callback) => {
    if (!/^[1-9]*[1-9][0-9]*$/.test(value + '')) {
        callback(new Error());
    } else {
        callback();
    }
};

/**
 *不可以为空的正浮点数验证
 */
base.floatCheck = (rule, value, callback) => {
    if (!/^[1-9]\d*\.?\d*$|0\.\d*[1-9]\d*$/.test(value + '')) {
        callback(new Error());
    } else {
        callback();
    }
};

/**
 *不可以为空的浮点数验证(可以为负数)
 */
base.minFloatCheck = (rule, value, callback) => {
    if (!/^-?[1-9]\d*\.?\d*$|0\.\d*[1-9]\d*$/.test(value + '')) {
        callback(new Error());
    } else {
        callback();
    }
};

/**
 * 可以为空的正浮点数验证
 */
base.nFloatCheck = (rule, value, callback) => {
    value = value !== undefined ? value : '';
    if (!/^[1-9]?\d*\.?\d*$|0\.\d*[1-9]\d*$/.test(value + '')) {
        callback(new Error());
    } else {
        callback();
    }
};

/**
 * 递归调用
 * @author hdw
 * @param {String} type 调用类型
 * @param {Array} data 数据数组
 * @param {Function} callback 执行完毕后的回掉函数
 * @param {String} adr 请求地址
*/
base.recursion = function (type, data, adr, callback) {
    let post = data.splice(0, 1)[0];
    if (type === 'put' || type === 'post') {
        base[type + 'AjaxData'](base.baseURL + adr, JSON.stringify(post), (res) => {
            if (data.length) {
                base.recursion(type, data, adr, callback);
            } else {
                callback();
            };
        });
    } else if (type === 'delete') {
        post = typeof post === 'number' ? post : post.id; // id
        base.deleteAjaxData(base.baseURL + adr + '?id=' + post, (res) => {
            if (data.length) {
                base.recursion(type, data, adr, callback);
            } else {
                callback();
            };
        });
    } else {
        console.error('不存在该类型！');
    }
};

base.moveWindow = function () {
    var move = false;   // 移动标记
    var _x, _y, off;    // 鼠标离控件左上角的相对位置
    $('.ivu-modal-header').mousedown(function (e) {
        move = true;
        off = $(this).offset();
        // _x = e.pageX - parseInt($('.ivu-modal').css('left'));
        // _y = e.pageY - parseInt($('.ivu-modal').css('top'));
        _x = e.pageX - off.left;
        _y = e.pageY - off.top;
    });
    $(document).mousemove(function (e) {
        if (move) {
            var x = e.pageX - _x - off.left;  // 控件左上角到屏幕左上角的相对位置
            var y = e.pageY - _y;
            $('.ivu-modal').css({
                'top': y,
                'left': x
            });
            $('.ivu-modal-header').css('cursor', 'move');
        }
    }).mouseup(function () {
        move = false;
        $('.ivu-modal-header').css('cursor', 'default');
    });
};

export default base;
