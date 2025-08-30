/**
 * 获取getDeptTitle接口数据
 * @param {Number} isBusiness 是否业务部
 */
export function getDefaultDeptTitle (isBusiness) {
  let deptInfo = {}
  if (isBusiness == 1) {
    deptInfo = {
      deptName: '业务部',
      id: 2,
      type: 1,
      headTitleJson: `{\"companyName\":\"单位/公司名称\",\"customerName\":\"客户姓名\",\"phone\":\"联系方式\",\"customerTypeId\":\"客户类型\",\"followUpRecord\":\"跟进记录\",\"createTime\":\"录入时间\",\"adminName\":\"录入人\",\"updateTime\":\"更新时间\",\"departmentName\":\"所属部门\",\"state\":\"状态\",\"position\":\"客户职位\",\"grade\":\"等级\"}`,
      signTitleJson: "{\"companyName\":\"单位/公司名称\",\"customerName\":\"客户姓名\",\"phone\":\"联系方式\",\"wechatNumber\":\"微信\",\"qqNumber\":\"QQ\",\"customerTypeId\":\"客户类型\",\"followUpRecord\":\"跟进记录\",\"position\":\"客户职位\",\"grade\":\"等级\",\"competition\":\"大赛名称\",\"signUpTime\":\"报名时间\",\"adminName\":\"录入人\",\"verifyTime\":\"审核时间\",\"projectType\":\"项目类型\",\"times\":\"报名次数\",\"departmentName\":\"所属部门\",\"signState\":\"审核状态\"}",
      titleJson: "{\"companyName\":\"单位/公司名称\",\"customerName\":\"客户姓名\",\"phone\":\"联系方式\",\"wechatNumber\":\"微信\",\"qqNumber\":\"QQ\",\"customerTypeId\":\"客户类型\",\"followUpRecord\":\"跟进记录\",\"createTime\":\"录入时间\",\"adminName\":\"录入人\",\"updateTime\":\"更新时间\",\"departmentName\":\"所属部门\",\"state\":\"状态\",\"city\":\"城市\",\"provinces\":\"省份\",\"region\":\"地区\",\"address\":\"详细地址\",\"eduBackground\":\"学历\",\"position\":\"客户职位\",\"content\":\"抄送\",\"grade\":\"等级\"}",
    }
  } else {
    deptInfo = {
      deptName: '项目部',
      id: 3,
      type: 2,
      // \"state\":\"状态\",\"eduBackground\":\"学历\",\"stageId\":\"融资情况\",\"bornTime\":\"成立时间\",\"job\":\"职务\",\"phase\":\"项目阶段\",\"referrer\":\"推荐人\",
      headTitleJson: "{\"projectName\":\"项目名称\",\"companyName\":\"公司/团队名称\",\"projectFieldId\":\"项目领域\",\"head\":\"负责人姓名\",\"appeal\":\"诉求\",\"phone\":\"联系方式\",\"followUpRecord\":\"跟进记录\",\"followName\":\"跟进人\",\"createTime\":\"录入时间\",\"adminName\":\"录入人\",\"updateTime\":\"更新时间\",\"departmentName\":\"所属部门\",\"oneDescription\":\"一句话描述\",\"source\":\"来源\",\"dataSource\":\"新增/认领\",\"isSettle\":\"异地发展计划\"}",
      signTitleJson: "{\"projectName\":\"项目名称\",\"companyName\":\"公司/团队名称\",\"projectFieldId\":\"项目领域\",\"phase\":\"项目阶段\",\"stageId\":\"融资情况\",\"bornTime\":\"成立时间\",\"eduBackground\":\"学历\",\"head\":\"负责人姓名\",\"appeal\":\"诉求\",\"job\":\"职务\",\"phone\":\"联系方式\",\"followUpRecord\":\"跟进记录\",\"followName\":\"跟进人\",\"referrer\":\"推荐人\",\"oneDescription\":\"一句话描述\",\"source\":\"来源\",\"dataSource\":\"新增/认领\",\"isSettle\":\"异地发展计划\",\"competition\":\"大赛名称\",\"signUpTime\":\"报名时间\",\"adminName\":\"录入人\",\"verifyTime\":\"审核时间\",\"projectType\":\"项目类型\",\"times\":\"报名次数\",\"departmentName\":\"所属部门\",\"signState\":\"审核状态\"}",
      titleJson: "{\"projectName\":\"项目名称\",\"companyName\":\"公司/团队名称\",\"projectFieldId\":\"项目领域\",\"phase\":\"项目阶段\",\"stageId\":\"融资情况\",\"bornTime\":\"成立时间\",\"address\":\"地区\",\"eduBackground\":\"学历\",\"head\":\"负责人姓名\",\"job\":\"职务\",\"phone\":\"联系方式\",\"email\":\"邮箱\",\"appeal\":\"诉求\",\"followUpRecord\":\"跟进记录\",\"followName\":\"跟进人\",\"referrer\":\"推荐人\",\"createTime\":\"录入时间\",\"adminName\":\"录入人\",\"updateTime\":\"更新时间\",\"departmentName\":\"所属部门\",\"state\":\"状态\",\"content\":\"抄送内容\",\"provinces\":\"省份\",\"city\":\"城市\",\"region\":\"地区\",\"address\":\"详细地址\",\"oneDescription\":\"一句话描述\",\"source\":\"来源\",\"dataSource\":\"新增/认领\",\"isSettle\":\"异地发展计划\",\"settleAppeal\":\"落户诉求\",\"settleType\":\"落户方式\",\"wechatNumber\":\"微信\",\"qqNumber\":\"QQ\"}",
    }
  }

  return deptInfo;
}

export function debounce (func, wait = 1000, immediate = true) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
}

// 位数不足两位补全0
export function supplement (nn) {
  return (nn = nn < 10 ? "0" + nn : nn);
}

//获取时间
export const format = function (Date, str, type = 'S') {
  var obj = {
    Y: Date.getFullYear(),
    M: Date.getMonth() + 1,
    D: Date.getDate(),
    H: Date.getHours(),
    Mi: Date.getMinutes(),
    S: Date.getSeconds(),
  };
  // 拼接时间 hh:mm:ss
  var time;
  if (type == 'D') {
    time = ''
  } else if (type == 'M') {
    time = " " +
      supplement(obj.H) +
      ":" +
      supplement(obj.Mi)
  } else {
    time = " " +
      supplement(obj.H) +
      ":" +
      supplement(obj.Mi) +
      ":" +
      supplement(obj.S);
  }
  ;
  // yyyy-mm-dd
  if (str.indexOf("-") > -1) {
    return obj.Y + "-" + supplement(obj.M) + "-" + supplement(obj.D) + time;
  }
  // yyyy/mm/dd
  if (str.indexOf("/") > -1) {
    return obj.Y + "/" + supplement(obj.M) + "/" + supplement(obj.D) + time;
  }
}