/*
author:star
跳跳乐瓜分京豆脚本
活动入口：来客有礼(微信小程序)=>跳跳乐或京东APP=》首页=》母婴馆=》底部中间
注：默认不做添加物品至购物车任务，守护京东APP最后一片净土。
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
================QuantumultX==================
[task_local]
#跳跳乐瓜分京豆
1 0-23/2 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jump.js, tag=跳跳乐瓜分京豆, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
===================Loon==============
[Script]
cron "1 0-23/2 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jump.js, tag=跳跳乐瓜分京豆
===============Surge===============
[Script]
跳跳乐瓜分京豆 = type=cron,cronexp="1 0-23/2 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jump.js
====================================小火箭=============================
跳跳乐瓜分京豆 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jump.js, cronexpr="1 0-23/2 * * *", timeout=3600, enable=true
*/
const $ = new Env('跳跳乐瓜分京豆');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
// $.helpCodeList = [];
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [
    $.getdata("CookieJD"),
    $.getdata("CookieJD2"),
    ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  console.log(`注：脚本默认不做添加物品至购物车任务，守护京东APP最后一片净土。\n`);
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = $.UserName;
      await TotalBean();
      console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await jump()
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function jump() {
  $.nowTime = new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000;
  $.jumpList = [];
  await getGameList();
  if ($.jumpList.length === 0) {
    console.log(`获取活动列表失败`);
    return;
  }
  await $.wait(1000);
  for (let i = 0; i < $.jumpList.length; i++) {
    $.jumpId = $.jumpList[i].id;
    $.oneJumpInfo = {};
    $.rewardList = [];
    let oldReward = 0;
    let newReward = 0;
    await getOneJumpInfo();
    if (JSON.stringify($.oneJumpInfo) === '{}') {
      console.log(`获取ID为${$.jumpId}的活动详情失败`);
      continue;
    }
    $.jumpName = $.oneJumpInfo.jumpActivityDetail.name;
    if ($.oneJumpInfo.userInfo.userState === 'received') {
      console.log(`${$.jumpName},活动已结束，已参与瓜分`);
      console.log(`\n`);
      continue;
    } else if ($.oneJumpInfo.userInfo.userState === 'unreceive') {
      $.shareBean = 0;
      //瓜分
      console.log(`${$.jumpName},瓜分京豆`);
      await receive();
      await $.wait(2000);
      await rewards();
      console.log(`瓜分获得${$.shareBean}京豆\n`);
      continue;
    } else if ($.nowTime > $.oneJumpInfo.jumpActivityDetail.endTime) {
      console.log(`${$.jumpName},活动已结束`);
      console.log(`\n`);
      continue;
    } else if ($.oneJumpInfo.userInfo.userState === 'complete') {
      console.log(`${$.jumpName},已到达终点，等待瓜分，瓜分时间：${new Date($.oneJumpInfo.jumpActivityDetail.endTime)} 之后`);
      console.log(`\n`);
    } else if ($.oneJumpInfo.userInfo.userState === 'playing') {
      console.log(`开始执行活动：${$.jumpName}，活动时间：${new Date($.oneJumpInfo.jumpActivityDetail.startTime).toLocaleString()}至${new Date($.oneJumpInfo.jumpActivityDetail.endTime).toLocaleString()}`);
    } else {//complete
      console.log(`异常`);
      continue;
    }
    await $.wait(1000);
    await getBeanRewards();
    oldReward = await getReward();
    console.log(`已获得京豆：${oldReward}`);
    await $.wait(1000);
    $.taskList = [];
    await getTaskList();
    await $.wait(1000);
    await doTask();
    if ($.oneJumpInfo.userInfo.gridTaskDone === false) {
      await domission();
    }
    await $.wait(1000);
    await getOneJumpInfo();
    let flag = true;
    if ($.oneJumpInfo.userInfo.diceLeft === 0) {
      console.log(`骰子数量为0`);
    }
    while ($.oneJumpInfo.userInfo.diceLeft > 0 && flag) {
      //丢骰子
      await throwDice();
      if ($.gridType && ($.gridType === 'boom' || $.gridType === 'road_block')) break;
      await $.wait(3000);
      switch ($.gridType) {
        case 'give_dice':
        case 'empty':
        case 'lose_dice':
        case 'cart_bean':
        case 'arrow':
          //不用处理
          break;
        case 'go_back':
        case 'go_ahead':
          await throwDice();
          await $.wait(2000);
          await getOneJumpInfo();
          if ($.oneJumpInfo.userInfo.gridTaskDone === false) {
            await domission();
          }
          break;
        case 'follow_channel':
        case 'scan_good':
        case 'add_cart':
          break;
        case 'join_member':
        case 'boom':
        case 'road_block':
        case 'follow_shop':
          await domission();
          break;
        case 'destination':
          flag = false;
          console.log('到达终点');
          break;
        default:
          flag = false;
          console.log('未判断情况');
      }
      await $.wait(2000);
      await getOneJumpInfo();
    }
    newReward = await getReward();
    console.log(`执行结束,本次执行获得${newReward - oldReward}京豆,共获得${newReward}京豆`);
    console.log(`\n`);
    await $.wait(2000);
  }
}

async function rewards() {
  const myRequest = getGetRequest('rewards', `activityId=${$.jumpId}`);
  return new Promise(async resolve => {
    $.get(myRequest, (err, resp, data) => {
      try {
        //console.log(data);
        if (data) {
          data = JSON.parse(data);
          if (data.success === true) {
            let rewardList = data.datas;
            for (let i = 0; i < rewardList.length; i++) {
              if (rewardList[i].activityId === $.jumpId) {
                $.shareBean = rewardList[i].shareBean;
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

async function getReward() {
  await getBeanRewards();
  let reward = 0;
  for (let j = 0; j < $.rewardList.length; j++) {
    reward += Number($.rewardList[j].value);
  }
  return reward;
}

//做任务
async function domission() {
  console.log('执行骰子任务');
  const myRequest = getGetRequest('doTask', `activityId=${$.jumpId}`);
  return new Promise(async resolve => {
    $.get(myRequest, (err, resp, data) => {
      try {

      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

async function throwDice() {
  console.log('丢骰子');
  const myRequest = getGetRequest('throwDice', `activityId=${$.jumpId}&fp=&eid=`);
  return new Promise(async resolve => {
    $.get(myRequest, (err, resp, data) => {
      try {
        //console.log(data);
        if (data) {
          data = JSON.parse(data);
          $.gridType = data.data.gridInfo && data.data.gridInfo.gridType;
          console.log(`丢骰子结果：${$.gridType}`);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve($.gridType);
      }
    })
  })
}

async function getBeanRewards() {
  const myRequest = getGetRequest('getBeanRewards', `activityId=${$.jumpId}`);
  return new Promise(async resolve => {
    $.get(myRequest, (err, resp, data) => {
      try {
        if (data) {
          data = JSON.parse(data);
          $.rewardList = data.datas;
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

//做任务
async function doTask() {
  let addFlag = true;
  for (let i = 0; i < $.taskList.length; i++) {
    let oneTask = $.taskList[i];
    if (oneTask.state === 'finished') {
      console.log(`${oneTask.content},已完成`);
      continue;
    }
    if (oneTask.gridTask === 'add_cart' && oneTask.state === 'unfinish' && addFlag) {
      if (oneTask.gridTask === 'add_cart') {
        console.log(`不做：【${oneTask.content}】 任务`)
        continue
      }
      console.log(`开始执行任务：${oneTask.content}`);
      let skuList = [];
      for (let j = 0; j < oneTask.goodsInfo.length; j++) {
        skuList.push(oneTask.goodsInfo[j].sku);
      }
      skuList.sort(sortNumber);
      await addCart(skuList);
      addFlag = false;
    }
  }
}

async function addCart(skuList) {
  let body = `{"activityId":"${$.jumpId}","skuList":${JSON.stringify(skuList)}}`;
  const myRequest = getPostRequest('addCart', body);
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        if (data) {
          data = JSON.parse(data);
          if (data.success === true) {
            console.log(`任务执行成功`);
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

//获取任务列表
async function getTaskList() {
  const myRequest = getGetRequest('getTools', `activityId=${$.jumpId}&reqSource=h5`);
  return new Promise(async resolve => {
    $.get(myRequest, (err, resp, data) => {
      try {
        if (data) {
          data = JSON.parse(data);
          if (data.success === true) {
            $.taskList = data.datas;
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

async function receive() {
  const myRequest = getGetRequest('receive', `activityId=${$.jumpId}`);
  return new Promise(async resolve => {
    $.get(myRequest, (err, resp, data) => {
      try {
        if (data) {
          data = JSON.parse(data);
          if (data.success === true) {
            console.log(`瓜分成功`)
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

//获取活动信息
async function getOneJumpInfo() {
  const myRequest = getGetRequest('getHomeInfo', `activityId=${$.jumpId}`);
  return new Promise(async resolve => {
    $.get(myRequest, (err, resp, data) => {
      try {
        if (data) {
          data = JSON.parse(data);
          if (data.success === true) {
            $.oneJumpInfo = data.data;
            //console.log(JSON.stringify($.oneJumpInfo))
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

//获取活动列表
async function getGameList() {
  const myRequest = getGetRequest('getGameList', 'pageSize=8&pageNum=1');
  return new Promise(async resolve => {
    $.get(myRequest, (err, resp, data) => {
      try {
        if (data) {
          data = JSON.parse(data);
          if (data.success === true) {
            $.jumpList = data.datas;
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


function getGetRequest(type, body) {
  const url = `https://jdjoy.jd.com/jump/${type}?${body}`;
  const method = `GET`;
  const headers = {
    'Cookie': cookie,
    'Accept': `*/*`,
    'Connection': `keep-alive`,
    'Referer': `https://jdjoy.jd.com/dist/taro/index.html/`,
    'Accept-Encoding': `gzip, deflate, br`,
    'Host': `jdjoy.jd.com`,
    "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    'Accept-Language': `zh-cn`
  };
  return {url: url, method: method, headers: headers};
}

function getPostRequest(type, body) {
  const url = `https://jdjoy.jd.com/jump/${type}`;
  const method = `POST`;
  const headers = {
    'Accept': `*/*`,
    'Origin': `https://jdjoy.jd.com`,
    'Accept-Encoding': `gzip, deflate, br`,
    'Cookie': cookie,
    'Content-Type': `application/json`,
    'Host': `jdjoy.jd.com`,
    'Connection': `keep-alive`,
    "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    'Referer': `https://jdjoy.jd.com/dist/taro/index.html/`,
    'Accept-Language': `zh-cn`
  };
  return myRequest = {url: url, method: method, headers: headers, body: body};
}

function sortNumber(a, b) {
  return a - b
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
      headers: {
        Host: "me-api.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-cn",
        "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.logErr(err)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === "1001") {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data['retcode'] === "0" && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            $.log('京东服务器返回空数据');
          }
        }
      } catch (e) {
        $.logErr(e)
      } finally {
        resolve();
      }
    })
  })
}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`?${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============?系统通知?=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`?${this.name}, 错误!`,t.stack):this.log("",`?${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`?${this.name}, 结束! ? ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
