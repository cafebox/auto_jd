
// cookie用JD签到的


// ****************************************************************************
// 活动ID配置项目
const $ = new Env('店铺签到');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;

const vas = [
          "75455,10317497",//每天10豆3天20豆 4.3
          "10052505,10304213",//每天2豆7天16豆 4.3
          "1000364221,10315084",//50豆4.4 100豆4.6
          "1000001396,10317481",//每天20豆7天50豆 4.7
          "10004695,10313740",//每天10豆7天30豆 4.7
          "1000091403,10316016",//每天5豆5天50豆 4.5
          "1000002423,10298643",//20天66豆 4.5
          "1000100287,10298393",//30天100豆4.14
          "554849,10303601",//15天100豆 4.4
          "1000221903,10314689",//7天50豆4.6
          "10251204,10314897",//5天100豆50分4.4
          "10306412,10313584",//7天50豆100份4.6
          "1000301162,10314423",//30天5元4.30

];
// ****************************************************************************

const $ = hammer("店铺签到", 3);

let results = ["左滑 / 下拉 查看详细结果..."];

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
      await dpqd()
      await showMsg()
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

// ****************************************************************************
function buildOptions(va){
    return new Promise(resolve => {
        const nowTs = Date.now();
        const [v, a] = va.split(",", 2);
        options.url = `https://api.m.jd.com/api?appid=interCenter_shopSign&t=${nowTs}&loginType=2&functionId=interact_center_shopSign_signCollectGift&body=%7B%22token%22%3A%2293F80D2F93AD3591911610FE675280E%22%2C%22venderId%22%3A${v}%2C%22activityId%22%3A${a}%2C%22type%22%3A56%2C%22actionType%22%3A7%7D`;
        $.request("GET", options, (err, resp, data) => {
            if(err){
                $.log(`<${va}>签到异常`, err);
                results.push(`${va} ×`);
                return resolve();
            }
            resp = JSON.parse(resp);
            if(!resp.success){
                $.log(resp);
                results.push(`${va} ×\n（${resp.msg}）`);
                return resolve();
            }
            results.push(`${va} √`);
            setTimeout(()=>{
                return resolve();
            }, 1234)
        })
    })
}

async function dailySign(){
    if (!await checkCookie()) {
        return $.done();
    }
    $.log("JDCookie校验完成，开始签到");
    for (const va of vas) {
        await buildOptions(va);
    }
    $.alert(results.join("\n"), "签到结束");
    $.done();
}


$.isRequest ? $.done() : dailySign();

function hammer(t="untitled",l=3){return new class{constructor(t,l){this.name=t,this.logLevel=l,this.isRequest=("object"==typeof $request)&&$request.method!="OPTIONS",this.isSurge="undefined"!=typeof $httpClient,this.isQuanX="undefined"!=typeof $task,this.isNode="function"==typeof require,this.node=(()=>{if(!this.isNode){return null}const file="localstorage.yml";let f,y,r;try{f=require('fs');y=require('js-yaml');r=require('request');f.appendFile(file,"",function(err){if(err)throw err;})}catch(e){console.log("install unrequired module by: yarn add module_name");console.log(e.message);return{}}return{file:file,fs:f,yaml:y,request:r,}})()}log(...n){if(l<2){return null}console.log(`\n***********${this.name}***********`);for(let i in n)console.log(n[i])}alert(body="",subtitle="",options={}){if(l==2||l==0){return null}if(typeof options=="string"){options={"open-url":options}}let link=null;if(Object.keys(options).length){link=this.isQuanX?options:{openUrl:options["open-url"],mediaUrl:options["media-url"]}}if(this.isSurge)return $notification.post(this.name,subtitle,body,link);if(this.isQuanX)return $notify(this.name,subtitle,body,link);console.log(`系统通知📣\ntitle:${this.name}\nsubtitle:${subtitle}\nbody:${body}\nlink:${link}`)}request(method,params,callback){let options={};if(typeof params=="string"){options.url=params}else{options.url=params.url;if(typeof params=="object"){params.headers&&(options.headers=params.headers);params.body&&(options.body=params.body)}}method=method.toUpperCase();const writeRequestErrorLog=function(n,m,u){return err=>console.log(`${n}request error:\n${m} ${u}\n${err}`)}(this.name,method,options.url);if(this.isSurge){const _runner=method=="GET"?$httpClient.get:$httpClient.post;return _runner(options,(error,response,body)=>{if(error==null||error==""){response.body=body;callback("",body,response)}else{writeRequestErrorLog(error);callback(error,"",response)}})}options.method=method;if(this.isQuanX){$task.fetch(options).then(response=>{response.status=response.statusCode;delete response.statusCode;callback("",response.body,response)},reason=>{writeRequestErrorLog(reason.error);response.status=response.statusCode;delete response.statusCode;callback(reason.error,"",response)})}if(this.isNode){if(options.method=="POST"&&options.body){try{options.body=JSON.parse(options.body);options.json=true}catch(e){console.log(e.message)}}this.node.request(options,(error,response,body)=>{if(typeof body=="object"){body=JSON.stringify(body)}if(typeof response=='object'&&response){response.status=response.statusCode;delete response.statusCode}callback(error,body,response)})}}read(key){if(this.isSurge)return $persistentStore.read(key);if(this.isQuanX)return $prefs.valueForKey(key);if(this.isNode){let val="";try{const fileContents=this.node.fs.readFileSync(this.node.file,"utf8");const data=this.node.yaml.safeLoad(fileContents);val=(typeof(data)=="object"&&data[key])?data[key]:""}catch(e){console.log(`读取文件时错误:\n${e.message}`);return""}return val}}write(val,key){if(this.isSurge)return $persistentStore.write(val,key);if(this.isQuanX)return $prefs.setValueForKey(val,key);if(this.isNode){try{const fileContents=this.node.fs.readFileSync(this.node.file,"utf8");let data=this.node.yaml.safeLoad(fileContents);data=typeof data=="object"?data:{};data[key]=val;val=this.node.yaml.safeDump(data);this.node.fs.writeFileSync(this.node.file,val,'utf8')}catch(e){console.log(e.message);return false}return true}}delete(key){if(this.isNode){try{const fileContents=this.node.fs.readFileSync(this.node.file,"utf8");let data=this.node.yaml.safeLoad(fileContents);data=typeof data=="object"?data:{};if(!data.hasOwnProperty(key)){return true}delete data[key];const val=this.node.yaml.safeDump(data);this.node.fs.writeFileSync(this.node.file,val,'utf8')}catch(e){console.log(e.message);return false}return true}}done(value={}){if(this.isQuanX)return this.isRequest?$done(value):null;if(this.isSurge)return this.isRequest?$done(value):$done()}pad(s=false,c="*",l=15){return s?this.log(c.padEnd(l,c)):`\n${c.padEnd(l,c)}\n`}}(t,l)}
