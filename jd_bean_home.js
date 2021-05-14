/*
领京豆额外奖励&抢京豆
脚本自带助力码，介意者可将 29行 helpAuthor 变量设置为 false
活动入口：京东APP首页-领京豆
更新地址：https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_home.js
已支持IOS双京东账号, Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, 小火箭，JSBox, Node.js
============Quantumultx===============
[task_local]
#领京豆额外奖励
10 7 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_home.js, tag=领京豆额外奖励, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jd_bean_home.png, enabled=true

================Loon==============
[Script]
cron "10 7 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_home.js, tag=领京豆额外奖励

===============Surge=================
领京豆额外奖励 = type=cron,cronexp="10 7 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_home.js

============小火箭=========
领京豆额外奖励 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_home.js, cronexpr="10 7 * * *", timeout=3600, enable=true
 */
const $ = new Env('领京豆额外奖励');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
//IOS等用户直接用NobyDa的jd cookie
let helpAuthor = false
let helpAuthor1 = true
let cookiesArr = [], cookie = '', message;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/';
!(async () => {
  $.newShareCodes = []
  await getAuthorShareCode();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
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
      await jdBeanHome();
    }
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      console.log(`${$.UserName}去帮助下一个人`)
      cookie = cookiesArr[i];
      if ($.newShareCodes.length > 1) {
        let code = $.newShareCodes[(i + 1) % $.newShareCodes.length]
        await help(code[0], code[1])
      }
      if (helpAuthor1 && $.authorCode) {
        console.log(`去帮助收集人1`)
        const helpRes = await help(code.shareCode, code.groupCode)
        if (helpRes && helpRes.data.respCode === 'SG209') {
          console.log(`助力次数已耗尽，跳出助力22`)
          break;
        }
      }
      if (helpAuthor1 && $.authorCode2) {
        for (let code of $.authorCode2) {
          const helpRes = await help(code.shareCode, code.groupCode);
          if (helpRes && helpRes.data.respCode === 'SG209') {
            console.log(`助力次数已耗尽，跳出助力`)
            break;
          }
        }
      }
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdBeanHome() {
  
  $.doneState = false
  // for (let i = 0; i < 3; ++i) {
  //   await doTask2()
  //   await $.wait(1000)
  //   if ($.doneState) break
  // }
  do {
    await doTask2()
    await $.wait(3000)
  } while (!$.doneState)
  await $.wait(1000)
  await award("feeds")
  await $.wait(1000)
  await getUserInfo()
  await $.wait(1000)
  await getTaskList();
  await receiveJd2();
  await showMsg();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function doTask2() {
    return new Promise(resolve => {
      const body = {"awardFlag": false, "skuId": `${getRandomInt(10000000,20000000)}`, "source": "feeds", "type": '1'};
      $.post(taskUrl('beanHomeTask', body), (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data.code === '0' && data.data){
                console.log(`任务完成进度：${data.data.taskProgress} / ${data.data.taskThreshold}`)
                if(data.data.taskProgress === data.data.taskThreshold)
                  $.doneState = true
              } else if (data.code === '0' && data.errorCode === 'HT201') {
                $.doneState = true
              } else {
                //HT304风控用户
                $.doneState = true
                console.log(`做任务异常：${JSON.stringify(data)}`)
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

function getAuthorShareCode() {
  return new Promise(resolve => {
    $.get({url: "https://raw.githubusercontent.com/1277002811/JDbot/master/shareCodes/jd_updateBeanHome.json",headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }}, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          $.authorCode = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function getUserInfo() {
  return new Promise(resolve => {
    $.post(taskUrl('signBeanGroupStageIndex', 'body'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if(data.data.jklInfo) {
              $.actId = data.data.jklInfo.keyId
              let {shareCode, groupCode} = data.data
              if (!shareCode) {
                console.log(`未获取到助力码，去开团`)
                await hitGroup()
              } else {
                console.log(shareCode, groupCode)
                // 去做逛会场任务
                if (data.data.beanActivityVisitVenue && data.data.beanActivityVisitVenue.taskStatus === '0') {
                  await help(shareCode, groupCode, 1)
                }
                $.newShareCodes.push([shareCode, groupCode])
              }
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

function hitGroup() {
  return new Promise(resolve => {
    const body = {"activeType": 2,};
    $.get(taskGetUrl('signGroupHit', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.respCode === "SG150") {
              let {shareCode, groupCode} = data.data.signGroupMain
              if (shareCode) {
                $.newShareCodes.push([shareCode, groupCode])
                console.log('开团成功')
                await help(shareCode, groupCode, 1)
              } else {
                console.log(`为获取到助力码，错误信息${JSON.stringify(data.data)}`)
              }
            } else {
              console.log(`开团失败，错误信息${JSON.stringify(data.data)}`)
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

function help(shareCode, groupCode, isTask = 0) {
  return new Promise(resolve => {
    const body = {
      "activeType": 2,
      "groupCode": groupCode,
      "shareCode": shareCode,
      "activeId": $.actId,
    };
    if (isTask) {
      console.log(`【抢京豆】做任务获取助力`)
      body['isTask'] = "1"
    } else {
      console.log(`【抢京豆】去助力好友${shareCode}`)
      body['source'] = "guest"
    }
    $.get(taskGetUrl('signGroupHelp', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`【抢京豆】${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            console.log(`【抢京豆】${data.data.helpToast}`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function showMsg() {
  return new Promise(resolve => {
    if (message) $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
    resolve()
  })
}

function getTaskList() {
  return new Promise(resolve => {
    const body = {"rnVersion": "4.7", "rnClient": "2", "source": "AppHome"};
    $.post(taskUrl('findBeanHome', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            let beanTask = data.data.floorList.filter(vo => vo.floorName === "种豆得豆定制化场景")[0]
            if (!beanTask.viewed) {
              await receiveTask()
              await $.wait(3000)
            }

            let tasks = data.data.floorList.filter(vo => vo.floorName === "赚京豆")[0]['stageList']
            for (let i = 0; i < tasks.length; ++i) {
              const vo = tasks[i]
              if (vo.viewed) continue
              await receiveTask(vo.stageId, `4_${vo.stageId}`)
              await $.wait(3000)
            }
            await award()
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

function receiveTask(itemId = "zddd", type = "3") {
  return new Promise(resolve => {
    const body = {"awardFlag": false, "itemId": itemId, "source": "home", "type": type};
    $.post(taskUrl('beanHomeTask', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data) {
              console.log(`完成任务成功，进度${data.data.taskProgress}/${data.data.taskThreshold}`)
            } else {
              console.log(`完成任务失败，${data.errorMessage}`)
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


function award(source="home") {
  return new Promise(resolve => {
    const body = {"awardFlag": true, "source": source};
    $.post(taskUrl('beanHomeTask', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data) {
              console.log(`领奖成功，获得 ${data.data.beanNum} 个京豆`)
              message += `领奖成功，获得 ${data.data.beanNum} 个京豆\n`
            } else {
              console.log(`领奖失败，${data.errorMessage}`)
              // message += `领奖失败，${data.errorMessage}\n`
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
function receiveJd2() {
  var headers = {
    'Host': 'api.m.jd.com',
    'content-type': 'application/x-www-form-urlencoded',
    'accept': '*/*',
    'user-agent': 'JD4iPhone/167515 (iPhone; iOS 14.2; Scale/3.00)',
    'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
    'Cookie': cookie
  };
  var dataString = 'body=%7B%7D&build=167576&client=apple&clientVersion=9.4.3&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&osVersion=14.2&partner=TF&rfs=0000&scope=10&screen=1242%2A2208&sign=19c33b5b9ad4f02c53b6040fc8527119&st=1614701322170&sv=122'
  var options = {
    url: 'https://api.m.jd.com/client.action?functionId=sceneInitialize',
    headers: headers,
    body: dataString
  };
  return new Promise(resolve => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['code'] === '0' && data['data']) {
              console.log(`强制开启新版领京豆成功,获得${data['data']['sceneLevelConfig']['beanNum']}京豆\n`);
              $.msg($.name, '', `强制开启新版领京豆成功\n获得${data['data']['sceneLevelConfig']['beanNum']}京豆`);
            } else {
              console.log(`强制开启新版领京豆结果:${JSON.stringify(data)}\n`)
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
function taskGetUrl(function_id, body) {
  return {
    url: `${JD_API_HOST}client.action?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&clientVersion=9.2.0`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': "application/x-www-form-urlencoded"
    }
  }
}


function taskUrl(function_id, body) {
  body["version"] = "9.0.0.1";
  body["monitor_source"] = "plant_app_plant_index";
  body["monitor_refer"] = "";
  return {
    url: JD_API_HOST,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&area=5_274_49707_49973&build=167283&clientVersion=9.1.0`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': "application/x-www-form-urlencoded"
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
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
var _0xod4='jsjiami.com.v6',_0x32e2=[_0xod4,'BcKgwp1fwqY=','A8KtwpRewoI=','QMOcw4XDu8Oj','w79vVFzCusO+','w7NybA==','GMKtwpTDtDLCoA3CkxBPZDJ7','N8O8Cw==','UT7Dm8KpMMOEesOvw7QKwqwOeg==','w4jDrF1IPw==','OcK+acOiBw==','w57DvsKsw5UCZwNjw67CoQ==','O8OeOyN8ZsOM','w6/DgltyPQ==','LmvDiWbDjiLCnQ==','w5vDqcKnw4rDmw==','JTpFw61w','wrvDgsKXWsKXw4rDsHwGwoNvwrIEw6F2w4FYT8OvYxUFw5/CoV/DvcOZAyPCgMKWw7HCucOKPCbCvg==','OsKQXsK5ZsKuGA7CtS7CrRrDi8KpTz/CsR4xHB/DrsKuZELCsivClsOMJ8OxwrlADArCiMK0eMKVHMKow6g0w4jCjsOabMKqdUDDlAPDmipFTMOPw73CoFrCrsKEVMKCZsO5Gl0DJcO2wqTDosKYI2M5LyTCsgpSw7J3NMK/w5HDuFspwpnDgsKZCkIBw4QbLVnDoMKdw6VUw4hva8OewoHDn8OSJ8OiUw==','Y8KIwqR/Ew==','LH7CsMKKwpfDusKpRMKELcKrw6jCr8OHYMOXelbDo8KESsOHwoPDlsOydsKDwqjCqWTClcKJIMOTclUtwqZkHi/Cm1U=','woE8wrjCmg==','w4kcw6sUXg==','w5ckw7keRQ==','w7TDsnxoJw==','w6fDgsKOw4IvVA==','OwEk','aRI1wqU=','cMKrwq5V6KyU5rCc5aWr6LeR772v6KyW5qOo5p6357yI6Lek6Ye/6K63','IMKLwoxvwoY=','w5I+AxwTw5A=','wqbDjsKsbMKL','VCUywo/ClA==','TMK5fE9K','X8Kyw57CmGw=','TsKeCA==','VHEFfQ==','GsKVw5/CgOivnuazseWmr+i0s++9q+ivneagiuafp+e/hei0jOmFo+iuuA==','w7ATw6g0bA==','dxIqwrM1','I8Orw4TDvsO4','woACWXBC','w4ZpYcKlwqc=','fH47X28=','wr3DuypAAQ==','Pxo3fMKcw5XDvcO2cHd0wqDDoDnCuWF8dDnDu8KMw51oSCd5B0rDncKbAcKzw6tqAG7DiA7DhMK6DcOaV8KnBQcSRsOjw5nDmzrCm8OEHMKnai4MUQ==','GgE5ZcKDwoPCs8O2IjAww6XCrX7CimZ+NS/Cr8OZw7Bcbm9lLkfCncKGDMOyw5ZcYzDCnzTDmcKXX8KNFMKjDxFGbsOwwpXCqAXCrcKBIMKgIBwTTzTCvSPDi8O7d8KlccOXw4jClsKXw6PDq8OkEk0+wpfDrhgpwqLDrgDCr14EP0ITwpQkwofDtMOnKMOiRMOsfcObGMOUZkcpwp/CisOJw57CnWLDt8OtAcK9woE1wpNrw7LCuMKswpDDqsKuwoZgRMKUw7zCjX3CqBM8IHoVdnkgVcOHw6txw53CusO9wqbDpsKuw7I/wro=','wrNOw44wYg==','w65adUrCkg==','w4BvXMKcwpw=','c8Olw6rDmMO9','w4cew5csRQ==','w4I4w50MWA==','Z8OKw6XDl8OL','wobCpG5Nwpc=','wrYZaV9Z','wrMZwozCpcK6','IXBKwo7Dkg==','J8OmPMKEZQ==','wr9Dw4LDjMKg','w6cXw64=','w7PDoHdABg==','TwjDi8KlKA==','w5bDk31HLA==','b8K0a0Jp','AmXDkkHDiw==','wp/CkMK1wqtvwr0=','w4/Di3g=','c3jCvsKt','wrZdSnrorKnms5nlpZDot7Tvv5ror7zmorbmnabnvI3otZHphaPorZQ=','LcODw6vDhMKxXMOB','w6B5woTDmMKw','wrdaw7AeYw==','wrfDl8KXS8KjwpXCqw==','wprCl8OqEQYZ','w7PDiMKIw5M8','w5owEDgmw4fCug==','aWANfW0=','ZMKlwohhM8OT','YxIswqEXOUM=','TmnCtsKtRw==','anjCusK8','wrXCpcKrwp5E','T8KaQ2dO','w7BeXFfCtw==','w7nDg8KSw6rDhA==','wpjCvsO1FTs=','UCwt','VMK1w6LCrA==','fMO6Hw7or6rmsZDlppzotr3vvbforb7mooHmn7/nvabotb7ph7ror4M=','Yj3DtcK7wpzDuA==','SsOnR3wl','wpfCkMKGwrRI','woHChEpuwpM=','d8O9UkoNdg==','wqLCpcKzwoZf','MMOUKAJvYA==','wpsCwpvCnsKB','VWzCn8KyZA==','w7nDs8Kew4jDpw==','PcK0w50Cw7E=','Aj7CjsODLg==','XyrDj8KXLA==','wpvCi8Kmwp5uw7VYwpDDqMO0VlUEw5bClcOeX8KEPsOrOcOxw7pWw4zCrx7Cu8KRKsORwpbCt3ApZcKtw4bDulLDtcOIwpdVECDCjsO3wprCl8K5K8KKRMKvfUjCtiLCkgY=','wo8gZ3pXw6DDgkNWD3HCu8Oww6rDi8OXwo/Dm1pNHi3CvcKTZcK4wqzDjcKeL8OHTERpwozDrMO9H05MNT41XwTDjz7CkD9Qw5kLA8K9wqlRXMKrwpPDrsKXQcOIE8Khwp9FwqfChQbDtg5kw4TDkkF7ADvCmA7Cr8OTRsKoUHtOB2bCvcKXMGYlw6dsGsOAw6VVw70twqNNSsOgwoFqw6XDplVvYWNtMcOUwp/CrMKrwrXCk8OkJ1nCvMO/wobDmxRmwoEvw78ew5XCq8OJwphmF24OIMOQaEzDgsOVegxOw4jDi1E=','w7DDqsKX','CsKiwq5uwpE=','bgwewqnCmg==','WMK1wohIMw==','KzRV','csOTLcKI6K+x5rC65aSk6Lep77+h6K6k5qOZ5pys576g6LWN6YW06K2C','w4zDucKCw4kv','fCXDscKpwoE=','YcOdw6jDmcOU','w4ZYUMK3wrPCk8O9','w6zDqAYHwoE=','exchwo/CoQ==','w40hw6wvw4TCpsO/','L3LDi8OfbBY=','DsK9w7oaw44=','ajPDpsKfwqnDr8K4','wpE/eHZf','wq4qc3RPw6Q=','woUbdl1J','GsKAwoRVwoI=','w5XDu8Kpw77Dgw==','w6/DjMKdw6YaQzA=','SB3DocKZBw==','w4F3F8O2','wozCpXZxwqw=','RjcVwrcc','w4zDm8Ko','PMOzEMKk','OyzDlMK16K6U5rOD5aSZ6LaV77656K665qCp5p6l572/6La46YaA6K+0','wq4gelZJw74=','XMOGXkEN','FMKDXcKUdg==','w78Tw5UIw6g=','QMO5w5LDsMOP','wonChHk=','LXbDiMOd','PVjCg8KB6K+U5rOb5aa46Lel776B6K+Y5qKI5p2357yd6LW+6YWw6K6N','E8OeOzdq','wpzCj3lAwr4=','A8Osw5/DqcOl','w7Fowp/ChcK4QADCnsKUM1l1','KH7DjW7DhjXCncOawoEbwrQewrFxw4VVQMOPMWbDt8O/wpDDnUVNwq7DijLDpsOXAMOv','ZgMowqw5P1bDrMOfw64mGlY5FsOLCcKNw4LDl8KRwp8qZBjDqMOmwo7DpsKqwoDDpMOK','OMKewopswpBkdcObCsKPXjstbh8QXHLCoMOPNm5awoTDtizCrRM=','M8OKwrLDhsKY','wodvw5Idw5zClsOYwrrDlsOiw4HDscKDR8Odw7M=','cMKHw5rCiA==','SMO1wpYkK0vDi8Ozw6jCv8OTUMKRZDjCuMOmDBpyQjXDhMOFwpBzVMOAIyYaP8OLQ8OiWcOMw6/DjsK3wqE0IsOvWBbDiMKzw4Zrwr3CscKvPcKNwrjCmz/CsyFeUsOZaRDCp0DCo0Ikw58LbsKdw5rCpsOfw4zDjknDpkFww4nCksKtwpthNcOvwpdEw7Y0wqrCukPDqMK7NB8bw4zCtx4KwqVZw7TCrsO6O8K5X8OlwocVwpfDpCXDgQFwGMK6w7DCn8KiRHAyB8OPZcONZcKSQGHCvDDCksKpdBDCksK4wqvCmUkOaMKRFQ==','w7TDvQAEwpfCqVPCtC9jXMK6w4rDicOuw7rClBPCj8Ovw7c5UMK4eAbDocKvDw==','BMKVVcK+UA==','wrHDj8KAacKz','wr7DuMKoXsKL','MMKTcsO6PQ==','wr/DkMKbb8KL','EA3Cu8OAOg==','BGPDqnbDpw==','w4V6bHLCnQ==','GsOEw6nDpMK1','w5shw6AHw40=','w7XDpwIdwpDDtg7DkiI=','HMKEccO9IynDgnRDwqYtW8Ofw6rDvMOrLCYyZUfCjcOvwpA=','wroywqTCjMKg','JUBiwqHDvA==','w4F8wozDjMKv','wrzCncOTGis=','U8KIKMOoAw==','wpggwoXCgcKPPg==','w7V2woA=','w6rDp8KQw7vDnMKoTG3Ckg/ChsOKw5c=','azzDpA==','wpFKw6TDgcK9MzkbCsKLw5/Drlw=','CcKneMK4Vw==','w6bDqsKDw5Mn','KcKlw6oZw5sERcKww6fClA==','JHLDkcOceQpB','RwjDi8KxwpQ=','fAjDsMKYAsO1SQ==','JsOFwqsHJQ==','w7JUGcOJw6Q=','XX4Qb0Q=','QsKqamJ5HMOgDxvDt8Oaw61Jwp7Ct8OIS8K9wrjDtSNGwo0FMSBbRcKFI8Ksw6fDmMOse8K9MsO2w54dVsK0w4PDmcOJcyNnN8KPOMKTwr7CjsKfw61fEMKlFMObwosSEMKLwrU0Y8O2KgMxw7wmfhYww7TDj8Oic8O1wqXDhW0rw7IWw689w4pMwp/CtA==','wqJewrgkYUgwBXZEw4oyLFVtZzLDncO8w63Dp2kKw7YBNVlJVMOwe8ORw71gWhBJemXDrsOvwqzCqMKETDzCghrDsMKEOsOZN2E/wqfCu8K+w7DCvcOHwqPDusKRMBAKM03DmzZkwqpBBlozWALDvcOQw5ZEw4g2wpjCrsKYPWh4AcOeS8OxY0QvwpE3DUrDuk3CosOOwoUiYiAEw7zDn8OxwpBtw47DnWtDw7vCvcKCwqrCtMKRwpJfw59oO8Kgw4ckwp/DjSVwwpYnKMKnwo/DsMKPwobCvl7Dn8Kew4/Dq8O0eRfCk0wVwq7CucOAMGEYw5rCvBBcT0EyZsOawp0Rw6nDiMKWw45Lwp8Wwow2w6jDicOZXGTDvU1KDgTCrH7DpznCmBQWw50Kw4sow7J7w7gXH1TCt2HCjiwzwrdSBMO5AXZPw590wpwUwoFPwqhCF0zChcKcw4IZw4Y3wrccwqLDu8OQSsKdwprDp2DCj8Kawosew5gLT25DWcK5w4oMwoPCpwXDl8OH','w7vDgsKaw7M=','wqrDihdINw==','VCoewo0+','J13DtUXDuQ==','w4cTw5AJw5U=','fMOjw5s=','wpjCk8OpEw==','w5bCs8OUP+iuheaws+Wnpei3hu+8o+ivpeajleacnOe8uui2g+mEjeitlw==','OS7Ch8OPMQ==','IsOzD8KyYw==','w5p5GcOHw6TChg==','w7bDv8Ksw4fDiQ==','JhctYsKs','w6dldF3CnQ==','wql4w4PDncKg','d8KnH8OyFA==','UcK5c1Zd','wpvDoDlLCQ==','w7xKwrXDv8Kh','w4HDhMK/w4LDpsKOf0bCuifCrcKrw6lawqPCtCbClAPCn8KKw48Nwpkiw6nDqMOWIzTCvsKLw7o=','wpAjwrvCgsKCOMKKw4vDlhY6woIxCnDDgU9zOjDCtnlnYDLCvSopaX9cS8Kq','SsKFG8OVCmzCjAlnOcOMV8OdwoxVw7XCu07DnjwnwqrDvUDCpQ==','QMK8wqLCqkc=','JsOvwqxVGMOuWsO6w4zDrcKKPU3CpMOpwoQ=','w6MTw40P','PMO4UWMLZcKzKMKCwo7Ch8OTwrtxwoEPwqbCusO4w50aw5JQwq3CnxQUwp9QH8K7w6fDpl0nw7rDpMOjYsOAwqlMw4XDtwTDp8KPfjrDg8Otwq7CjMOKw7fClcKEwoETMMKBVzgBNcKLQcKdw45yAcOuw6zCrXXCqcO7A8O5Cnomw5QAwp1jwp/CisOZw6HClXvDuMKHwpjDusK+DcK5wqkbWAnCjMOvwq7CkcOHbsK6XsK8w41ZIXbDocOWwpN8cMO8wpcTGGTCp2V8w63DpU3CmMKiWGIuw68qwpLCk0UCw5cDwqEjSDA0TELCgMOF','w5PDi3pWLg==','wqHChcOKLxM=','w5lFHcOkw5A=','AkbDn8OeQg==','w4xlOsOrw7c=','w6BKSsKZwps=','w4RuwqbDssKW','BsOkLcKYRQ==','IGDDi2vDmzPCjsOnwow=','IXrDiXLDnGzDk8KBwokEwrMfwrYsw4BfQsKMKm7CoMK0w4vCkA==','eMKLAsOLEQ==','w4TDhgEuwrU=','jsetOjeAbiqamiRpr.AKcOBom.FYvC6=='];(function(_0x4b4e2b,_0x813266,_0x44f953){var _0x4de6c8=function(_0x3a04fd,_0x45550e,_0x30e9b6,_0x28882a,_0x5a96a0){_0x45550e=_0x45550e>>0x8,_0x5a96a0='po';var _0x1bed72='shift',_0x319c35='push';if(_0x45550e<_0x3a04fd){while(--_0x3a04fd){_0x28882a=_0x4b4e2b[_0x1bed72]();if(_0x45550e===_0x3a04fd){_0x45550e=_0x28882a;_0x30e9b6=_0x4b4e2b[_0x5a96a0+'p']();}else if(_0x45550e&&_0x30e9b6['replace'](/[etOeAbqRprAKOBFYC=]/g,'')===_0x45550e){_0x4b4e2b[_0x319c35](_0x28882a);}}_0x4b4e2b[_0x319c35](_0x4b4e2b[_0x1bed72]());}return 0x839d0;};var _0x4f5176=function(){var _0x459e95={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x35293c,_0x53f93a,_0x8c3855,_0x28e34c){_0x28e34c=_0x28e34c||{};var _0x314a1a=_0x53f93a+'='+_0x8c3855;var _0x2f71f3=0x0;for(var _0x2f71f3=0x0,_0xd8e73a=_0x35293c['length'];_0x2f71f3<_0xd8e73a;_0x2f71f3++){var _0x13c734=_0x35293c[_0x2f71f3];_0x314a1a+=';\x20'+_0x13c734;var _0x574fca=_0x35293c[_0x13c734];_0x35293c['push'](_0x574fca);_0xd8e73a=_0x35293c['length'];if(_0x574fca!==!![]){_0x314a1a+='='+_0x574fca;}}_0x28e34c['cookie']=_0x314a1a;},'removeCookie':function(){return'dev';},'getCookie':function(_0x4978fa,_0x65fa5d){_0x4978fa=_0x4978fa||function(_0x4aec58){return _0x4aec58;};var _0x49b3c1=_0x4978fa(new RegExp('(?:^|;\x20)'+_0x65fa5d['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x868183=typeof _0xod4=='undefined'?'undefined':_0xod4,_0x62b109=_0x868183['split'](''),_0x1aab41=_0x62b109['length'],_0x248cca=_0x1aab41-0xe,_0x5d996b;while(_0x5d996b=_0x62b109['pop']()){_0x1aab41&&(_0x248cca+=_0x5d996b['charCodeAt']());}var _0x29da4c=function(_0xe93771,_0x231ca4,_0x322a1a){_0xe93771(++_0x231ca4,_0x322a1a);};_0x248cca^-_0x1aab41===-0x524&&(_0x5d996b=_0x248cca)&&_0x29da4c(_0x4de6c8,_0x813266,_0x44f953);return _0x5d996b>>0x2===0x14b&&_0x49b3c1?decodeURIComponent(_0x49b3c1[0x1]):undefined;}};var _0x4e1873=function(){var _0x31088d=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x31088d['test'](_0x459e95['removeCookie']['toString']());};_0x459e95['updateCookie']=_0x4e1873;var _0x423616='';var _0x36634c=_0x459e95['updateCookie']();if(!_0x36634c){_0x459e95['setCookie'](['*'],'counter',0x1);}else if(_0x36634c){_0x423616=_0x459e95['getCookie'](null,'counter');}else{_0x459e95['removeCookie']();}};_0x4f5176();}(_0x32e2,0x8d,0x8d00));var _0x2305=function(_0x3d4200,_0x33470b){_0x3d4200=~~'0x'['concat'](_0x3d4200);var _0x1259fd=_0x32e2[_0x3d4200];if(_0x2305['osJnrf']===undefined){(function(){var _0x281b6d;try{var _0x3f72ee=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x281b6d=_0x3f72ee();}catch(_0x1aa191){_0x281b6d=window;}var _0x1bc257='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x281b6d['atob']||(_0x281b6d['atob']=function(_0x5cc18e){var _0x1d2a6a=String(_0x5cc18e)['replace'](/=+$/,'');for(var _0x59290b=0x0,_0x31a045,_0x9533b8,_0xbca008=0x0,_0x868559='';_0x9533b8=_0x1d2a6a['charAt'](_0xbca008++);~_0x9533b8&&(_0x31a045=_0x59290b%0x4?_0x31a045*0x40+_0x9533b8:_0x9533b8,_0x59290b++%0x4)?_0x868559+=String['fromCharCode'](0xff&_0x31a045>>(-0x2*_0x59290b&0x6)):0x0){_0x9533b8=_0x1bc257['indexOf'](_0x9533b8);}return _0x868559;});}());var _0x1545fe=function(_0x3a36c3,_0x33470b){var _0x9fc78f=[],_0x16c16a=0x0,_0xd81758,_0x17c959='',_0x423cad='';_0x3a36c3=atob(_0x3a36c3);for(var _0x384001=0x0,_0x3c0fd8=_0x3a36c3['length'];_0x384001<_0x3c0fd8;_0x384001++){_0x423cad+='%'+('00'+_0x3a36c3['charCodeAt'](_0x384001)['toString'](0x10))['slice'](-0x2);}_0x3a36c3=decodeURIComponent(_0x423cad);for(var _0x284f11=0x0;_0x284f11<0x100;_0x284f11++){_0x9fc78f[_0x284f11]=_0x284f11;}for(_0x284f11=0x0;_0x284f11<0x100;_0x284f11++){_0x16c16a=(_0x16c16a+_0x9fc78f[_0x284f11]+_0x33470b['charCodeAt'](_0x284f11%_0x33470b['length']))%0x100;_0xd81758=_0x9fc78f[_0x284f11];_0x9fc78f[_0x284f11]=_0x9fc78f[_0x16c16a];_0x9fc78f[_0x16c16a]=_0xd81758;}_0x284f11=0x0;_0x16c16a=0x0;for(var _0x187756=0x0;_0x187756<_0x3a36c3['length'];_0x187756++){_0x284f11=(_0x284f11+0x1)%0x100;_0x16c16a=(_0x16c16a+_0x9fc78f[_0x284f11])%0x100;_0xd81758=_0x9fc78f[_0x284f11];_0x9fc78f[_0x284f11]=_0x9fc78f[_0x16c16a];_0x9fc78f[_0x16c16a]=_0xd81758;_0x17c959+=String['fromCharCode'](_0x3a36c3['charCodeAt'](_0x187756)^_0x9fc78f[(_0x9fc78f[_0x284f11]+_0x9fc78f[_0x16c16a])%0x100]);}return _0x17c959;};_0x2305['ZAQfot']=_0x1545fe;_0x2305['OOnouq']={};_0x2305['osJnrf']=!![];}var _0x4b89dc=_0x2305['OOnouq'][_0x3d4200];if(_0x4b89dc===undefined){if(_0x2305['hRPqpp']===undefined){var _0x471a33=function(_0x48230e){this['RAJimU']=_0x48230e;this['KhsgPt']=[0x1,0x0,0x0];this['jrdgjA']=function(){return'newState';};this['gnKIYR']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['ypLZPm']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x471a33['prototype']['WLBVcW']=function(){var _0x14c20f=new RegExp(this['gnKIYR']+this['ypLZPm']);var _0x558c8e=_0x14c20f['test'](this['jrdgjA']['toString']())?--this['KhsgPt'][0x1]:--this['KhsgPt'][0x0];return this['qcbDdJ'](_0x558c8e);};_0x471a33['prototype']['qcbDdJ']=function(_0x4065c9){if(!Boolean(~_0x4065c9)){return _0x4065c9;}return this['nSuJXk'](this['RAJimU']);};_0x471a33['prototype']['nSuJXk']=function(_0x44a6eb){for(var _0x1d9935=0x0,_0x102577=this['KhsgPt']['length'];_0x1d9935<_0x102577;_0x1d9935++){this['KhsgPt']['push'](Math['round'](Math['random']()));_0x102577=this['KhsgPt']['length'];}return _0x44a6eb(this['KhsgPt'][0x0]);};new _0x471a33(_0x2305)['WLBVcW']();_0x2305['hRPqpp']=!![];}_0x1259fd=_0x2305['ZAQfot'](_0x1259fd,_0x33470b);_0x2305['OOnouq'][_0x3d4200]=_0x1259fd;}else{_0x1259fd=_0x4b89dc;}return _0x1259fd;};var _0x5a7aed=function(){var _0x13e45e=!![];return function(_0x1b5801,_0x27ea98){var _0x3ccc74=_0x13e45e?function(){if(_0x27ea98){var _0x5c73d8=_0x27ea98['apply'](_0x1b5801,arguments);_0x27ea98=null;return _0x5c73d8;}}:function(){};_0x13e45e=![];return _0x3ccc74;};}();var _0x224ee8=_0x5a7aed(this,function(){var _0x575646=function(){return'\x64\x65\x76';},_0x20665e=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x4bb4c5=function(){var _0x3057ba=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x3057ba['\x74\x65\x73\x74'](_0x575646['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x5207e3=function(){var _0xb35053=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0xb35053['\x74\x65\x73\x74'](_0x20665e['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x5e2393=function(_0x5246c3){var _0x53904f=~-0x1>>0x1+0xff%0x0;if(_0x5246c3['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x53904f)){_0x17077e(_0x5246c3);}};var _0x17077e=function(_0x469f13){var _0x28ab9f=~-0x4>>0x1+0xff%0x0;if(_0x469f13['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x28ab9f){_0x5e2393(_0x469f13);}};if(!_0x4bb4c5()){if(!_0x5207e3()){_0x5e2393('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x5e2393('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x5e2393('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x224ee8();function wuzhi01(_0x2e0b0d){var _0x385fea={'XpedB':function(_0x295e1e){return _0x295e1e();},'bycCW':function(_0x296b37,_0x3f808b){return _0x296b37===_0x3f808b;},'mNKto':_0x2305('0','o4Up'),'Dcwwm':function(_0x376d64,_0x563c28){return _0x376d64!==_0x563c28;},'lfxEo':_0x2305('1',')0lh'),'MmWtH':function(_0x334073,_0x35c6d7){return _0x334073!==_0x35c6d7;},'SfvAC':_0x2305('2','cK3D'),'KaobK':_0x2305('3','%mUP'),'AXxBl':_0x2305('4','DK[v'),'Qdzgz':_0x2305('5','g)GP'),'JoWlY':_0x2305('6','EMU)'),'qyGMz':_0x2305('7','wj)K'),'UBHbE':function(_0x3c4345,_0x198620){return _0x3c4345(_0x198620);},'mGjTz':_0x2305('8','lUx&'),'IZYOz':_0x2305('9','C4ln'),'DBgKr':_0x2305('a','yJVO'),'gnxwM':_0x2305('b','Wv)a')};return new Promise(_0x3c15ed=>{var _0x130659={'raxIN':function(_0x149b8d){return _0x385fea[_0x2305('c','XYY!')](_0x149b8d);},'SYFMn':function(_0x5d2551,_0x349ea0){return _0x385fea[_0x2305('d','Y7Du')](_0x5d2551,_0x349ea0);},'nSHGV':_0x385fea[_0x2305('e','Y7Du')],'apOND':function(_0x5cd06b,_0x4180cc){return _0x385fea[_0x2305('f',')zz@')](_0x5cd06b,_0x4180cc);},'qynnC':_0x385fea[_0x2305('10','Y7Du')],'UVpWm':function(_0x55e99a){return _0x385fea[_0x2305('11','@gV$')](_0x55e99a);}};if(_0x385fea[_0x2305('12','DK[v')](_0x385fea[_0x2305('13','(]H[')],_0x385fea[_0x2305('14','wj)K')])){_0x130659[_0x2305('15','lUx&')](_0x3c15ed);}else{let _0x4f4ffa=+new Date();let _0x3848d0=_0x2e0b0d[_0x2305('16','Wv)a')];let _0x125663={'url':_0x2305('17',')zz@')+ +new Date(),'headers':{'Host':_0x385fea[_0x2305('18','rT[j')],'accept':_0x385fea[_0x2305('19','TB7T')],'content-type':_0x385fea[_0x2305('1a','%mUP')],'origin':_0x385fea[_0x2305('1b','YZf@')],'accept-language':_0x385fea[_0x2305('1c','GrxZ')],'user-agent':$[_0x2305('1d','rT[j')]()?process[_0x2305('1e','%mUP')][_0x2305('1f','XZTc')]?process[_0x2305('20','yFO2')][_0x2305('21','cxah')]:_0x385fea[_0x2305('22','XYY!')](require,_0x385fea[_0x2305('23','P]pZ')])[_0x2305('24','Azxk')]:$[_0x2305('25','ae7P')](_0x385fea[_0x2305('26','yFO2')])?$[_0x2305('27','pmwH')](_0x385fea[_0x2305('28','yJVO')]):_0x385fea[_0x2305('29','Zo*g')],'referer':_0x385fea[_0x2305('2a','SDGh')],'Cookie':cookie},'body':_0x2305('2b','dzWt')+_0x3848d0+_0x2305('2c','G1pC')+_0x4f4ffa};$[_0x2305('2d','P]pZ')](_0x125663,(_0x57a39c,_0xff5084,_0x33d7c5)=>{var _0x43be73={'qSYkI':function(_0x317657){return _0x130659[_0x2305('2e','!$1x')](_0x317657);}};try{if(_0x57a39c){if(_0x130659[_0x2305('2f','g)GP')](_0x130659[_0x2305('30','DK[v')],_0x130659[_0x2305('31','lUx&')])){console[_0x2305('32','x%^1')]($[_0x2305('33','YZf@')]+_0x2305('34','YZf@'));}else{_0x43be73[_0x2305('35','@gV$')](_0x3c15ed);}}else{_0x33d7c5=JSON[_0x2305('36','E@%u')](_0x33d7c5);}}catch(_0x35b6b9){$[_0x2305('37','Zo*g')](_0x35b6b9,resp);}finally{if(_0x130659[_0x2305('38','CyRu')](_0x130659[_0x2305('39','bLAb')],_0x130659[_0x2305('3a','(]H[')])){_0x130659[_0x2305('3b','cxah')](_0x3c15ed);}else{_0x130659[_0x2305('3c','GrxZ')](_0x3c15ed);}}});}});}function wuzhi02(_0x33ffca){var _0x3b3125={'poegE':function(_0x3c7f02,_0x259066){return _0x3c7f02!==_0x259066;},'WwNYa':_0x2305('3d','dzWt'),'oScfF':function(_0x199912,_0x22e948){return _0x199912===_0x22e948;},'AQzfZ':_0x2305('3e','!$1x'),'zsDia':function(_0x985b58){return _0x985b58();},'BsnOo':function(_0x179d70,_0x3d00ff){return _0x179d70===_0x3d00ff;},'TvPYC':_0x2305('3f','%mUP'),'Zzmnh':_0x2305('3','%mUP'),'XOuZQ':_0x2305('40','XZTc'),'UJcCE':_0x2305('41','rT[j'),'SGjBa':_0x2305('42','GrxZ'),'PPyEX':_0x2305('43','C4ln'),'kHByT':function(_0x534552,_0x841785){return _0x534552(_0x841785);},'MNloW':_0x2305('44','bPWD'),'LfDCV':_0x2305('45','lUx&'),'bawBd':_0x2305('46','dfgY')};return new Promise(_0x233465=>{var _0x34976e={'InqSW':function(_0x5881f8,_0x34f7d5){return _0x3b3125[_0x2305('47','p1La')](_0x5881f8,_0x34f7d5);},'WVcYL':_0x3b3125[_0x2305('48','YZf@')],'uxOFo':function(_0x2f8784,_0x1d4f8f){return _0x3b3125[_0x2305('49','Zo*g')](_0x2f8784,_0x1d4f8f);},'hfxNG':_0x3b3125[_0x2305('4a','ae7P')],'efQQE':function(_0x18b641){return _0x3b3125[_0x2305('4b','Zo*g')](_0x18b641);}};if(_0x3b3125[_0x2305('4c','73^d')](_0x3b3125[_0x2305('4d','%mUP')],_0x3b3125[_0x2305('4e','E@%u')])){let _0x15f55a=+new Date();let _0x133d0f=_0x33ffca[_0x2305('4f','DK[v')];let _0x2ab7e9={'url':_0x2305('50','DK[v')+ +new Date(),'headers':{'Host':_0x3b3125[_0x2305('51','GrxZ')],'accept':_0x3b3125[_0x2305('52','Wv)a')],'content-type':_0x3b3125[_0x2305('53','EMU)')],'origin':_0x3b3125[_0x2305('54','EMU)')],'accept-language':_0x3b3125[_0x2305('55','x%^1')],'user-agent':$[_0x2305('56','(]H[')]()?process[_0x2305('57','(]H[')][_0x2305('58','6@YQ')]?process[_0x2305('59','E@%u')][_0x2305('5a','pmwH')]:_0x3b3125[_0x2305('5b','p1La')](require,_0x3b3125[_0x2305('5c',')zz@')])[_0x2305('5d','P]pZ')]:$[_0x2305('5e','o4Up')](_0x3b3125[_0x2305('5f','p1La')])?$[_0x2305('60','DK[v')](_0x3b3125[_0x2305('61','CyRu')]):_0x3b3125[_0x2305('62','VqMl')],'referer':_0x2305('63','Y7Du')+_0x133d0f,'Cookie':cookie},'body':_0x2305('64','XYY!')+_0x3b3125[_0x2305('65','bPWD')](escape,_0x133d0f)+_0x2305('66','yFO2')+_0x15f55a};$[_0x2305('67','rT[j')](_0x2ab7e9,(_0x2e8ab3,_0xfcde36,_0x6b4b55)=>{try{if(_0x2e8ab3){if(_0x34976e[_0x2305('68','G1pC')](_0x34976e[_0x2305('69','G1pC')],_0x34976e[_0x2305('6a','p1La')])){$[_0x2305('6b','P]pZ')](e,resp);}else{console[_0x2305('6c','bLAb')]($[_0x2305('6d','g)GP')]+_0x2305('6e','EMU)'));}}else{_0x6b4b55=JSON[_0x2305('6f','EMU)')](_0x6b4b55);}}catch(_0x3ad2f9){$[_0x2305('70','QrDi')](_0x3ad2f9,resp);}finally{if(_0x34976e[_0x2305('71','Y7Du')](_0x34976e[_0x2305('72','ZfpU')],_0x34976e[_0x2305('73','dzWt')])){_0x34976e[_0x2305('74','C4ln')](_0x233465);}else{if(_0x2e8ab3){console[_0x2305('75','GrxZ')]($[_0x2305('76','SDGh')]+_0x2305('77','C4ln'));}else{_0x6b4b55=JSON[_0x2305('78','G1pC')](_0x6b4b55);}}}});}else{data=JSON[_0x2305('79','g)GP')](data);}});}function shuye72(){var _0x32e0c3={'bVxJh':function(_0x401fae,_0x5a55ea){return _0x401fae!==_0x5a55ea;},'xFoyL':_0x2305('7a','cK3D'),'ciVfF':function(_0x258de2,_0x329c1c){return _0x258de2<_0x329c1c;},'GlMkL':function(_0x1a6eb8,_0x4c78aa){return _0x1a6eb8(_0x4c78aa);},'BJGKQ':function(_0x48ba3e){return _0x48ba3e();},'wFYip':_0x2305('7b','h(fK'),'cOpyQ':function(_0x23b3fe,_0x5842e8){return _0x23b3fe!==_0x5842e8;},'tVtLb':_0x2305('7c','73^d'),'EhPmB':function(_0x256bc8,_0x2ec755){return _0x256bc8!==_0x2ec755;},'utAEc':_0x2305('7d','SDGh'),'dZyXN':_0x2305('7e','!$1x'),'PDhqm':_0x2305('7f','bLAb'),'TeOYK':_0x2305('80','bLAb')};return new Promise(_0x7b1ecc=>{var _0x1cee19={'uwbvG':function(_0x84b522,_0x3ae033){return _0x32e0c3[_0x2305('81','W0sH')](_0x84b522,_0x3ae033);},'KkoCd':_0x32e0c3[_0x2305('82','(]H[')],'fBFdi':function(_0xcbcafb,_0x330d9a){return _0x32e0c3[_0x2305('83','73^d')](_0xcbcafb,_0x330d9a);},'xeaTa':function(_0x1be23b,_0x5db986){return _0x32e0c3[_0x2305('84','x%^1')](_0x1be23b,_0x5db986);},'FZypY':function(_0xa27c91,_0x20867f){return _0x32e0c3[_0x2305('85','G1pC')](_0xa27c91,_0x20867f);},'kEGfC':function(_0x30d65d){return _0x32e0c3[_0x2305('86','G1pC')](_0x30d65d);},'nLqcI':_0x32e0c3[_0x2305('87','x%^1')],'QursZ':function(_0x41f7d5,_0x208b8b){return _0x32e0c3[_0x2305('88',')0lh')](_0x41f7d5,_0x208b8b);},'doTZU':_0x32e0c3[_0x2305('89','h(fK')],'QZahB':function(_0x4e9aad){return _0x32e0c3[_0x2305('8a','rT[j')](_0x4e9aad);}};if(_0x32e0c3[_0x2305('8b','TB7T')](_0x32e0c3[_0x2305('8c','E@%u')],_0x32e0c3[_0x2305('8d','cxah')])){$[_0x2305('8e','G1pC')]({'url':_0x32e0c3[_0x2305('8f','p1La')],'headers':{'User-Agent':_0x32e0c3[_0x2305('90','pmwH')]}},async(_0x261c73,_0x4fa184,_0x3d7e23)=>{if(_0x1cee19[_0x2305('91','p1La')](_0x1cee19[_0x2305('92','dzWt')],_0x1cee19[_0x2305('93','DK[v')])){$[_0x2305('94','TR5F')](e,_0x4fa184);}else{try{if(_0x261c73){console[_0x2305('95','p1La')]($[_0x2305('96','[vBC')]+_0x2305('97','(]H['));}else{$[_0x2305('98','wj)K')]=JSON[_0x2305('99','%mUP')](_0x3d7e23);if(_0x1cee19[_0x2305('9a','W0sH')]($[_0x2305('9b','Y7Du')][_0x2305('9c','YZf@')],0x0)){for(let _0xfe0b1f=0x0;_0x1cee19[_0x2305('9d','P]pZ')](_0xfe0b1f,$[_0x2305('9e','QrDi')][_0x2305('9f','SDGh')][_0x2305('a0','bPWD')]);_0xfe0b1f++){let _0x15d846=$[_0x2305('a1','g)GP')][_0x2305('a2','[vBC')][_0xfe0b1f];await $[_0x2305('a3','[vBC')](0x1f4);await _0x1cee19[_0x2305('a4','TR5F')](wuzhi01,_0x15d846);}await $[_0x2305('a3','[vBC')](0x1f4);await _0x1cee19[_0x2305('a5','dzWt')](shuye73);}}}catch(_0xf5a7df){if(_0x1cee19[_0x2305('a6','(]H[')](_0x1cee19[_0x2305('a7','CyRu')],_0x1cee19[_0x2305('a8','YZf@')])){console[_0x2305('a9','ZfpU')]($[_0x2305('aa','C4ln')]+_0x2305('ab','o4Up'));}else{$[_0x2305('ac','yFO2')](_0xf5a7df,_0x4fa184);}}finally{if(_0x1cee19[_0x2305('ad','dfgY')](_0x1cee19[_0x2305('ae','TR5F')],_0x1cee19[_0x2305('af',')0lh')])){$[_0x2305('b0','dfgY')](e,_0x4fa184);}else{_0x1cee19[_0x2305('b1','TR5F')](_0x7b1ecc);}}}});}else{$[_0x2305('b2','o4Up')](e,resp);}});}function shuye73(){var _0x337ea1={'PunNt':function(_0x3289dc){return _0x3289dc();},'GTkNr':function(_0x35ab77,_0x58726a){return _0x35ab77!==_0x58726a;},'rwcWo':_0x2305('b3','rT[j'),'qQTgo':_0x2305('b4','[vBC'),'rKUQJ':function(_0x22f7b3,_0x3db4ed){return _0x22f7b3<_0x3db4ed;},'JjzIa':_0x2305('b5','XZTc'),'uOfPL':_0x2305('b6','Azxk'),'iNhEj':function(_0x4fdd08,_0x5a1037){return _0x4fdd08(_0x5a1037);},'HfmNd':_0x2305('b7','@gV$'),'VSMFk':_0x2305('b8','pmwH'),'ZHPrr':_0x2305('b9','TR5F'),'ROThI':_0x2305('ba','h(fK')};return new Promise(_0x4b9530=>{$[_0x2305('bb','CyRu')]({'url':_0x337ea1[_0x2305('bc','EMU)')],'headers':{'User-Agent':_0x337ea1[_0x2305('bd','ZfpU')]}},async(_0x5a99c2,_0x2cd1fc,_0x5e6a90)=>{var _0x266dd9={'ADMwL':function(_0x3684f1){return _0x337ea1[_0x2305('be','bPWD')](_0x3684f1);}};try{if(_0x5a99c2){console[_0x2305('bf','VqMl')]($[_0x2305('33','YZf@')]+_0x2305('c0','E@%u'));}else{if(_0x337ea1[_0x2305('c1','P]pZ')](_0x337ea1[_0x2305('c2','yFO2')],_0x337ea1[_0x2305('c3','x%^1')])){$[_0x2305('c4','73^d')]=JSON[_0x2305('c5','Wv)a')](_0x5e6a90);if(_0x337ea1[_0x2305('c6','ZfpU')]($[_0x2305('c7','lUx&')][_0x2305('c8','ae7P')],0x0)){for(let _0x22a865=0x0;_0x337ea1[_0x2305('c9','Azxk')](_0x22a865,$[_0x2305('ca','yFO2')][_0x2305('cb','h(fK')][_0x2305('cc','h(fK')]);_0x22a865++){if(_0x337ea1[_0x2305('cd','h(fK')](_0x337ea1[_0x2305('ce','EMU)')],_0x337ea1[_0x2305('cf','XZTc')])){let _0x4ebf25=$[_0x2305('d0','P]pZ')][_0x2305('d1','pmwH')][_0x22a865];await $[_0x2305('d2','Zo*g')](0x1f4);await _0x337ea1[_0x2305('d3',')0lh')](wuzhi02,_0x4ebf25);}else{_0x266dd9[_0x2305('d4','g)GP')](_0x4b9530);}}}}else{console[_0x2305('d5','XZTc')]($[_0x2305('d6','E@%u')]+_0x2305('d7','pmwH'));}}}catch(_0x2264ce){$[_0x2305('d8','h(fK')](_0x2264ce,_0x2cd1fc);}finally{if(_0x337ea1[_0x2305('d9','dfgY')](_0x337ea1[_0x2305('da','XYY!')],_0x337ea1[_0x2305('db','lUx&')])){_0x337ea1[_0x2305('dc','x%^1')](_0x4b9530);}else{console[_0x2305('dd',')0lh')]($[_0x2305('de','ae7P')]+_0x2305('df','[vBC'));}}});});};_0xod4='jsjiami.com.v6';
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
