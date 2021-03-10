/**
*
    Name: 京喜财富岛
       
    

      ################################## 定义京喜农场TOKEN（选填） ##################################
      ## 如果某个Cookie的账号种植的是app种子，则必须填入有效的TOKEN；而种植非app种子则不需要TOKEN
      ## TOKEN的形式：{"farm_jstoken":"749a90f871adsfads8ffda7bf3b1576760","timestamp":"1610165423873","phoneid":"42c7e3dadfadsfdsaac-18f0e4f4a0cf"}
      ## 因TOKEN中带有双引号，因此，变量值两侧必须由一对单引号引起来
      ## TOKEN获取方式：用抓包软件----惊喜农场做个浇水任务----然后转包软件搜索farm_jstoken（URL：https://wq.jd.com/cubeactive/farm/dotask）

      TokenJxnc1='{"farm_jstoken":"xxx","phoneid":"xxx","timestamp":"xxx"}'
      TokenJxnc2=''
      TokenJxnc3=''
      TokenJxnc4=''
      TokenJxnc5=''
      TokenJxnc6=''

      Docker通知推送：
      ################################## 京喜财富岛是否静默运行 ##################################
      ## 默认为 "false"，静默，不发送推送通知消息，如想收到通知，请修改为 "true"
      ## 如果你不想完全关闭或者完全开启通知，只想在特定的时间发送通知，可以参考上面面的“定义东东萌宠是否静默运行”部分，设定几个if判断条件
      export CFD_NOTIFY_CONTROL=""
*
**/

const $ = new Env("京喜财富岛");
const JD_API_HOST = "https://m.jingxi.com/";
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
const jdTokenNode = $.isNode() ? require('./jdJxncTokens.js') : '';
$.showLog = $.getdata("cfd_showLog") ? $.getdata("cfd_showLog") === "true" : false;
$.notifyTime = $.getdata("cfd_notifyTime");
$.result = [];
$.cookieArr = [];
$.currentCookie = '';
$.tokenArr = [];
$.currentToken = {};
$.allTask = [];
$.info = {};
let superInvites = ["D01370846B627306207E97CEB6D82378A3A381AD6E95C0368BE81D676A9B326B","CA4FBDC98A13E0058546377ABB2358FC01C254A2A940EFA56B34A834F8DEA7E5","D2B2BDD4CC704C9FF73849C46E630F0134235F410FDB1E718A819F1A885E843E","ED617C1E01B263F6A156720C16462D5247CA88603814B5250143508E4F31FD1D","6E72BA807EDB873131F38DCBB8F233F4749855FCA56BE5FD488BB39392616C75","1B50293E6D692A384607EF19B6BA40DEE8E7D68A00FE677640E07EA9EC9F2BCA","752380E1912BAA6F70E871A6BF1357B00A84B7942B09129E9DC510F5D765BCB3","A7E82FA259076C41B8995EF867D3C533A11B181B8FBBF38D8B18C0EF9985E283"];
let groupInvites = {};

!(async () => {
  if (!getCookies()) return;
  if (!getTokens()) return;
  for (let i = 0; i < $.cookieArr.length; i++) {
    $.currentCookie = $.cookieArr[i];
    $.currentToken = $.tokenArr[i] || {};
    if ($.currentCookie) {
      $.userName = decodeURIComponent($.currentCookie.match(/pt_pin=(.+?);/) && $.currentCookie.match(/pt_pin=(.+?);/)[1]);
      $.index = i + 1;
      $.nickName = '';      
      $.log(`\n开始【京东账号${i + 1}】${$.userName}`);


      const beginInfo = await getUserInfo();
         
      await $.wait(500);
      await querySignList();

      //领取岛主升级奖励
      promotionAward();

      //领取年终福利
      await $.wait(500);
      getAdvEmployee(1001);

      await $.wait(500);
      await getMoney();
      
      //日常任务
      await $.wait(500);
      await getTaskList(0);      
      await $.wait(500);
      await browserTask(0);
      
      //寻宝
      await $.wait(500);
      await treasureHunt();

      //偷财富
      await $.wait(500);
      await friendCircle();

      //成就任务
      await $.wait(500);
      await getTaskList(1);
      await $.wait(500);
      await browserTask(1);

      //抽奖
      await $.wait(500);
      await funCenterState();

      //领取寻宝宝箱
      await $.wait(500);
      await openPeriodBox();

      const endInfo = await getUserInfo();
      $.result.push(
        `【💵财富值】任务前: ${beginInfo.ddwMoney}\n【💵财富值】任务后: ${endInfo.ddwMoney}`,
        `【💵财富值】净增值: ${endInfo.ddwMoney - beginInfo.ddwMoney}`
      );

      //提交邀请码
      await $.wait(500);
      await submitInviteId($.userName);

      //出海寻宝 
      await $.wait(500);
      await submitGroupId();     
    }
  }
  //助力类  
  await console.log(`\n\n开始助力`);

  for(let j = 0; j < $.cookieArr.length; j++) {
    $.currentCookie = $.cookieArr[j];
    $.currentToken = $.tokenArr[j];
    if($.currentCookie){
      $.userName = decodeURIComponent($.currentCookie.match(/pt_pin=(.+?);/)) && $.currentCookie.match(/pt_pin=(.+?);/[1]);
      $.index = j +1;
      $.nickName = '';      
      // 出海寻宝 喊好友帮忙加里程
      await $.wait(500);
      await await joinGroup(); 

       //超级助力
       await  $.wait(500);
       await createSuperAssistUser();
	   await  $.wait(500);
       await createSuperAssistUserw();

       //普通助力
       await $.wait(500);
       await createAssistUser();    
       await $.wait(500);
       await createAssistUserw(); 	   
    }
  }
  // //通知
  // await $.wait(500);
  // await showMsg();

})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done());


function getUserInfo() {
  return new Promise(async (resolve) => {
    $.get(taskUrl(`user/QueryUserInfo`), (err, resp, data) => {
      try {
        const {
          iret,
          SceneList = {},
          XbStatus: { XBDetail = [], dwXBRemainCnt } = {},
          ddwMoney,
          dwIsNewUser,
          sErrMsg,
          strMyShareId,
          strPin,
        } = JSON.parse(data);
        $.log(`\n获取用户信息：${sErrMsg}\n${$.showLog ? data : ""}`);
        $.info = {
          ...$.info,
          SceneList,
          XBDetail,
          dwXBRemainCnt,
          ddwMoney,
          dwIsNewUser,
          strMyShareId,
          strPin,
        };
        resolve({
          SceneList,
          XBDetail,
          dwXBRemainCnt,
          ddwMoney,
          dwIsNewUser,
          strMyShareId,
          strPin,
        });
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

//签到列表
function querySignList() {
  return new Promise(async (resolve) => {
    $.get(taskUrl(`task/QuerySignListV2`), async (err, resp, data) => {
      try {
        const { iRet, sData: { Sign = [{}], dwUserFlag }, sErrMsg } = JSON.parse(data);
        $.log(`\n签到列表：${sErrMsg}\n${$.showLog ? data : ""}`);
        const [{ dwStatus, ddwMoney }] = Sign.filter(x => x.dwShowFlag === 1);
        if (dwStatus === 0) {
          await userSignReward(dwUserFlag, ddwMoney);
        } else {
          $.log(`\n📌签到：你今日已签到过啦，请明天再来`);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

//签到
async function userSignReward(dwUserFlag,ddwMoney) {
  return new Promise(async (resolve) => {
    $.get(
      taskUrl(
        `task/UserSignRewardV2`,
        `dwReqUserFlag=${dwUserFlag}&ddwMoney=${ddwMoney}`
      ),
      async (err, resp, data) => {
        try {
          //$.log(data)
          const { iRet, sData: { ddwMoney }, sErrMsg } = JSON.parse(data);
          $.log(`\n📌签到：${sErrMsg}，获得财富 ¥ ${ddwMoney || 0}\n${$.showLog ? data : ""}`);
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      }
    );
  });
}

//领取财富值
//dwSource=[1,2,3]  1:岛主自产财富 2:普通助力财富 3:超级助力财富
function getMoney() {
  return new Promise(async (resolve) => {
    const sceneList = $.info.SceneList;
    for (var _key of Object.keys($.info.SceneList)) {
      try {
        //领取自产财富
        await $.wait(500);
        await getMoney_dwSource_1( _key, sceneList );
        //领取普通助力的财富
        const employeeList = eval('('+ JSON.stringify(sceneList[_key].EmployeeList) +')');
        if(employeeList !== ""){
          for( var key of Object.keys(employeeList) ) {
            await $.wait(500);
            await getMoney_dwSource_2( _key, sceneList, key );
          }
        }
        //领取超级助力财富
        await $.wait(500);
        await getMoney_dwSource_3( _key, sceneList );
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    }
  });
}

//领取自产财富
function getMoney_dwSource_1( _key, sceneList ) {
  return new Promise(async (resolve) => {
    $.get(
      taskUrl(`user/GetMoney`,`dwSceneId=${_key}&strEmployeeId=undefined&dwSource=1`),
      async (err, resp, data) => {
        try {
          const { iRet, dwMoney, sErrMsg } = JSON.parse(data);
          $.log(`\n【${sceneList[_key].strSceneName}】🏝岛主 : ${ sErrMsg == 'success' ? `获取财富值：¥ ${dwMoney || 0}` : sErrMsg } \n${$.showLog ? data : ""}`);
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      }
    );
  });
}

//领取普通助力的财富
function getMoney_dwSource_2( _key, sceneList, key ) {
  return new Promise(async (resolve) => {
    $.get(
      taskUrl(`user/GetMoney`, `dwSceneId=${_key}&strEmployeeId=${key}&dwSource=2`), 
      async (err, resp, data) => {
        try {
          const { dwMoney, iRet, sErrMsg, strPin } = JSON.parse(data);
          $.log(`\n【${sceneList[_key].strSceneName}】👬好友: ${ sErrMsg == 'success' ? `获取普通助力财富值：¥ ${dwMoney || 0}` : sErrMsg } \n${$.showLog ? data : ""}`);
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      }
    );
  });
}

//领取超级助力财富
function getMoney_dwSource_3( _key, sceneList ) {
  return new Promise(async (resolve) => {
    $.get(
      taskUrl(`user/GetMoney`,`dwSceneId=${_key}&strEmployeeId=&dwSource=3&strPgtimestamp=${$.currentToken['timestamp']}&strPhoneID=${$.currentToken['phoneid']}&strPgUUNum=${$.currentToken['farm_jstoken']}`), 
      async (err, resp, data) => {
        try {
          const { iRet, dwMoney, sErrMsg, strPin } = JSON.parse(data);
          $.log(`\n【${sceneList[_key].strSceneName}】👬好友: ${ sErrMsg == 'success' ? `获取超级助力财富值：¥ ${dwMoney || 0}` : sErrMsg } \n${$.showLog ? data : ""}`);
          await $.wait(500);
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      }
    );
  });
}

//判断年终福利是否领取
//user/GetAdvEmployee
//strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=1614127340116&ptag=138631.26.55&
//dwSenceId=1001&dwIsSlave=0&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwIsSlave%2CdwSenceId%2Cptag%2Csource%2CstrZone
//&_=1614127340121&sceneval=2&g_login_type=1&callback=jsonpCBKH&g_ty=ls
function getAdvEmployee(_key) { 
  $.get(taskUrl(`user/GetAdvEmployee`, `dwSenceId=${_key}&dwIsSlave=0&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwIsSlave%2CdwSenceId%2Cptag%2Csource%2CstrZone`), async(err, resp, data) => {
    try {
      const { SceneEmployeeInfo:{ SceneId, SceneName, dwCurStage } , dwNextSceneId, sErrMsg } = JSON.parse(data);
      if( sErrMsg === `success` && dwCurStage === 1) {
        await advEmployeeAward( SceneId, SceneName );
        await $.wait(500);
        if(dwNextSceneId > 0 ) {
          _key = dwNextSceneId;
          getAdvEmployee (_key);
        }
      }
    } catch (e) {
      $.logErr(e, resp);
    }
  });
}

//领取年终福利
//user/AdvEmployeeAward
//strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=1614127342671&ptag=138631.26.55
//&dwSenceId=1001&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwSenceId%2Cptag%2Csource%2CstrZone&_ste=1
//&_=1614127342672&sceneval=2&g_login_type=1&callback=jsonpCBKQ&g_ty=ls
function advEmployeeAward(_key, strSceneName) {
  return new Promise(async (resolve) =>{
    $.get(taskUrl(`user/AdvEmployeeAward`,`dwSenceId=${_key}&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwSenceId%2Cptag%2Csource%2CstrZone`), async(err, resp, data) => {
      try {
        const  { sErrMsg, strAwardDetail: { strName } } = JSON.parse(data);
        $.log(`\n【${strSceneName}】💰雇主奖励：${ sErrMsg == 'success' ? `获取雇主奖励：¥ ${strName || 0}` : sErrMsg } \n${$.showLog ? data : ""}`);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

//领取岛主升级奖励
//user/PromotionAward
//strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=1614127340122&ptag=138631.26.55
//&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1
//&_=1614127340124&sceneval=2&g_login_type=1&callback=jsonpCBKI&g_ty=ls
function promotionAward() {
  $.get(taskUrl(`user/PromotionAward`, `_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone`), async (err, resp, data) => {
    try {
      const { sErrMsg, strPrizeName } = JSON.parse(data);
      $.log(`\n💰岛主升级奖励：${ sErrMsg == 'success' ? `获取升级奖励：¥ ${strPrizeName || 0}` : sErrMsg } \n${$.showLog ? data : ""}`);
    } catch (e) {
      $.logErr(e, resp);
    }
  });
}

//好友圈偷财富
function friendCircle() {
  return new Promise(async (resolve) => {
    $.get(taskUrl(`user/FriendCircle`, `dwPageIndex=1&dwPageSize=20`), async(err, resp, data) => {
      try {
        //$.log(`\n好友圈列表\n${data}`);
        const {MomentList = [],iRet,sErrMsg,strShareId} = JSON.parse(data);
        for (moment of MomentList) {
          if (moment.strShareId !== strShareId && moment.dwAccessMoney > 0) {
            await queryFriendIsland(moment.strShareId);
            await $.wait(500);
          }
        }  
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

//获取好友信息
function queryFriendIsland(strShareId,){
  return new Promise(async (resolve) => {
    $.get(taskUrl(`user/QueryFriendIsland`, `strShareId=${strShareId}&sceneval=2`), 
      async(err, resp, data) => {
        try {
          //$.log(`\n获取好友信息\n${data}`);
          const {SceneList = {},dwStealMoney,sErrMsg,strFriendNick} = JSON.parse(data);
          if (sErrMsg === "success") {
            const sceneList = eval('(' + JSON.stringify(SceneList) + ')');
            const sceneIds = Object.keys(SceneList);
            for (sceneId of sceneIds) {
              await stealMoney(strShareId,sceneId,strFriendNick,sceneList[sceneId].strSceneName);
              await $.wait(500);
            }
          } 
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
    });
  });
}

//偷财富
function stealMoney(strShareId, sceneId, strFriendNick, strSceneName){
  return new Promise(async (resolve) =>{
    $.get(taskUrl(`user/StealMoney`, `strFriendId=${strShareId}&dwSceneId=${sceneId}&sceneval=2`), async(err, resp, data) => {
      try {
        //$.log(data);
        const {dwGetMoney,iRet,sErrMsg} = JSON.parse(data);
        $.log(`\n🤏偷取好友【${strFriendNick}】【${strSceneName}】财富值：¥ ${dwGetMoney ? dwGetMoney : sErrMsg}\n${$.showLog ? data: ""}`);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

//寻宝  
async function treasureHunt() {
  if($.info.dwXBRemainCnt > 0) {
    const xbDetail = $.info.XBDetail;
    for (let i = 0; i < xbDetail.length; i++) {
      const { ddwColdEndTm, strIndex }= xbDetail[i];
      const currentTm = Math.round(new Date() / 1000);
      if( currentTm > ddwColdEndTm ) {
        await doTreasureHunt(strIndex);
        await $.wait(3000);
      } else {
        $.log(`\n🎁寻宝：宝藏冷却中，请等待冷却完毕`);
      }
    }
  } else {
    $.log(`\n🎁寻宝：寻宝次数不足`);
  }
}

function doTreasureHunt(place) {
  return new Promise(async (resolve) => {
    $.get(
      taskUrl(`consume/TreasureHunt`, `strIndex=${place}&dwIsShare=0`),
      async (err, resp, data) => {
        try {
          //$.log(data);
          const { iRet, dwExpericnce, sErrMsg } = JSON.parse(data);
          $.log(`\n【${place}】🎁寻宝：${sErrMsg} ，获取随机奖励：¥ ${dwExpericnce || 0} \n${$.showLog ? data : ""}`);
          resolve(iRet)
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      }
    );
  });
}

//任务赚财富
function getTaskList(taskType) {
  return new Promise(async (resolve) => {
    switch (taskType){
      case 0: //日常任务
        $.get(taskListUrl("GetUserTaskStatusList"), async (err, resp, data) => {
          try {
            const { ret, data: { userTaskStatusList = [] } = {}, msg } = JSON.parse(data);
            $.allTask = userTaskStatusList.filter((x) => x.awardStatus !== 1);
            $.log(`\n获取【📆日常任务】列表 ${msg}，总共${$.allTask.length}个任务！\n${$.showLog ? data : ""}`);
          } catch (e) {
            $.logErr(e, resp);  
          } finally {
            resolve();
          }
        });
        break;
      case 1: //成就任务
        $.get(taskUrl("consume/AchieveInfo"), async (err, resp, data) => {
          try{
            const { iRet, sErrMsg, taskinfo = [] } = JSON.parse(data);
            $.allTask = taskinfo.filter((x) => x.dwAwardStatus === 1);
            $.log(`\n获取【🎖成就任务】列表 ${sErrMsg}，总共${$.allTask.length}个任务！\n${$.showLog ? data : ""}`);
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve();
          }
        });
        break;
      default:
        break;
    }
  });
}

//浏览任务 + 做任务 + 领取奖励
function browserTask(taskType) {
  return new Promise(async (resolve) => {
    switch (taskType) {
      case 0://日常任务
        const times = Math.max(...[...$.allTask].map((x) => x.configTargetTimes));
        for (let i = 0; i < $.allTask.length; i++) {          
          const taskinfo = $.allTask[i];
          $.log(`\n开始第${i + 1}个【📆日常任务】：${taskinfo.taskName}`);
          const status = [true, true];
          for (let i = 0; i < times; i++) {
            await $.wait(500);
            if (status[0]) {
              //做任务
              status[0] = await doTask(taskinfo);
            }
            await $.wait(500);
            if (status[1]) {
              //领取奖励
              status[1] = await awardTask(0, taskinfo);
            }
            if (!status[0] && !status[1]) {
              break;
            }
          }
          $.log(`\n结束第${i + 1}个【📆日常任务】：${taskinfo.taskName}\n`);
        }
        break;
      case 1://成就任务
        for (let i = 0; i < $.allTask.length; i++) {
          const taskinfo = $.allTask[i];
          $.log(`\n开始第${i + 1}个【🎖成就任务】：${taskinfo.strTaskDescr}`);
          if(taskinfo.dwAwardStatus === "0"){
            $.log(`\n${taskinfo.strTaskDescr}【领成就奖励】：该成就任务未达到门槛}`);
          } else {
            await $.wait(500);
            //领奖励
            await awardTask(1, taskinfo);
          }
          $.log(`\n结束第${i + 1}个【🎖成就任务】：${taskinfo.strTaskDescr}\n`);
        }        
        break;
      default:
        break;
    }
    resolve();
  });
}

//做任务
function doTask(taskinfo) {
  return new Promise(async (resolve) => {
    const { taskId, completedTimes, configTargetTimes, taskName } = taskinfo;
    if (parseInt(completedTimes) >= parseInt(configTargetTimes)) {
      resolve(false);
      $.log(`\n${taskName}【做日常任务】： mission success`);
      return;
    }
    $.get(taskListUrl(`DoTask`, `taskId=${taskId}`), (err, resp, data) => {
      try {
        //$.log(`taskId:${taskId},data:${data}`);
        const { msg, ret } = JSON.parse(data);
        $.log(`\n${taskName}【做日常任务】：${msg.indexOf("活动太火爆了") !== -1 ? "任务进行中或者未到任务时间" : msg }\n${$.showLog ? data : ""}`);
        resolve(ret === 0);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

//领取奖励
function awardTask( taskType, taskinfo) {
  return new Promise((resolve) => {
    switch (taskType) {
      case 0://日常任务
        const { taskId, taskName } = taskinfo;
        $.get(taskListUrl(`Award`, `taskId=${taskId}`), (err, resp, data) => {
          try {
            const { msg, ret, data: { prizeInfo = '' } = {} } = JSON.parse(data);
            let str = '';
            if (msg.indexOf('活动太火爆了') !== -1) {
              str = '任务为成就任务或者未到任务时间';
            } else {
              str = msg + prizeInfo ? ` 获得财富值 ¥ ${JSON.parse(prizeInfo).ddwMoney}` : '';
            }
            $.log(`\n${taskName}【领日常奖励】：${str}\n${$.showLog ? data : ''}`);
            resolve(ret === 0);
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve();
          }
        });
        break
      case 1://成就奖励
        const { strTaskIndex, strTaskDescr } = taskinfo;
        $.get(taskUrl(`consume/AchieveAward`, `strTaskIndex=${strTaskIndex}`), (err, resp, data) => {
          try {
            const { iRet, sErrMsg, dwExpericnce } = JSON.parse(data);
            $.log(`\n${strTaskDescr}【领成就奖励】： success 获得财富值：¥ ${dwExpericnce}\n${ $.showLog ? data : '' }`);
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve();
          }
        });
        break
      default:
        break
    }
  });
}

//娱乐中心
function funCenterState() {
  return new Promise(resolve => {
    $.get(taskUrl(`consume/FunCenterState`, `strType=1`), async(err, resp, data) => {
      try {
        const {  SlotMachine: { ddwConfVersion, dwFreeCount, strCouponPool, strGoodsPool } = {}, iRet, sErrMsg } = JSON.parse(data);
        if(dwFreeCount == 1) {
          await $.wait(500);
          await soltMachine(strCouponPool,strGoodsPool,ddwConfVersion);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

//抽奖机
function soltMachine(strCouponPool,strGoodsPool,ddwConfVersion) {
  return new Promise(resolve => {
    $.get(taskUrl(`consume/SlotMachine`,`strCouponPool=${strCouponPool}&strGoodsPool=${strGoodsPool}&ddwConfVersion=${ddwConfVersion}`), async(err, resp, data) => {
      try {
        const { iRet, sErrMsg, strAwardPoolName } = JSON.parse(data);
        $.log(`\n【抽奖结果】🎰 ${strAwardPoolName != "" ? "未中奖" : strAwardPoolName} \n${ $.showLog ? data : '' }`);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

//超级助力与普通助力提交互助码
function submitInviteId(userName) {
  return new Promise(resolve => {
    if (!$.info || !$.info.strMyShareId) {
      resolve();
      return;
    }
    $.log('\n【🏖岛主】你的互助码: ' + $.info.strMyShareId);
    $.post(
      {
        url: `https://api.ninesix.cc/api/jx-cfd/${$.info.strMyShareId}/${encodeURIComponent(userName)}`,
      },
      async (err, resp, _data) => {
        try {
          const  data = JSON.parse(_data);//const { data = {}, code } = JSON.parse(_data);
          $.log(`\n【🏖出海寻宝】邀请码提交：${code}\n${$.showLog ? _data : ''}`);
          if (data.value) {
            $.result.push(`${$.userName}:【🏖超级助力】邀请码提交成功！`);
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      },
    );
  });
}


//循环超级助力好友
async function createSuperAssistUser() {  
  for (let superInvite of superInvites) {
    if (!superInvite) continue
    await createSuperAssistUsers(superInvite)
    await $.wait(Math.random() * 1000 + 2000)
  }
}

// 超级助力好友
function createSuperAssistUsers(superInvite) {
  return new Promise(resolve => {
    const sceneIds = Object.keys($.info.SceneList);
    const sceneId = Math.min(...sceneIds);            
        $.get(taskUrl('user/JoinScene', `strPgtimestamp=${$.currentToken['timestamp']}&strPhoneID=${$.currentToken['phoneid']}&strPgUUNum=${$.currentToken['farm_jstoken']}&strShareId=${escape(superInvite)}&dwSceneId=${sceneId}&dwType=2&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwSceneId%2CdwType%2Cptag%2Csource%2CstrPgUUNum%2CstrPgtimestamp%2CstrPhoneID%2CstrShareId%2CstrZone`), async (err, resp, data) => {
          try {
            const { sErrMsg, data: { rewardMoney = 0 } = {},strPin } = JSON.parse(data);                     
            $.log(`\n${strPin}开始【👫🏻超级助力】：${sErrMsg}\n${$.showLog ? data : ''}`);            
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve();
          }
        });      
});
}
//9999添加其它脚本 
function createSuperAssistUserw() {
  return new Promise(resolve => {
    const sceneIds = Object.keys($.info.SceneList);
    const sceneId = Math.min(...sceneIds);
    $.get({ url: 'https://raw.githubusercontent.com/hajiuhajiu/jdsign1112/master/shareCodes/cfd.json' }, async (err, resp, _data) => {
      try {
        const { data = {} } = JSON.parse(_data);
        $.log(`\n【👫🏻超级助力】超级助力码：${data.shareId}\n${$.showLog ? _data : ''}`);
        $.get(taskUrl('user/JoinScene', `strPgtimestamp=${$.currentToken['timestamp']}&strPhoneID=${$.currentToken['phoneid']}&strPgUUNum=${$.currentToken['farm_jstoken']}&strShareId=${escape(data.shareId)}&dwSceneId=${sceneId}&dwType=2&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwSceneId%2CdwType%2Cptag%2Csource%2CstrPgUUNum%2CstrPgtimestamp%2CstrPhoneID%2CstrShareId%2CstrZone`), async (err, resp, data) => {
          try {
            const { sErrMsg, data: { rewardMoney = 0 } = {}  } = JSON.parse(data);
            $.log(`\n${strPin}开始【👫🏻超级助力】：${sErrMsg}\n${$.showLog ? data : ''}`);    
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve();
          }
        });
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}


//循环助力好友
async function createAssistUser() {  
  for (let superInvite of superInvites) {
    if (!superInvite) continue
    await createAssistUsers(superInvite)
    await $.wait(Math.random() * 1000 + 2000)
  }
}

//随机助力好友
function createAssistUsers(superInvite) {
  return new Promise(resolve => {
    const sceneIds = Object.keys($.info.SceneList);
    const sceneId = Math.min(...sceneIds);    
        $.get(taskUrl('user/JoinScene', `strShareId=${escape(superInvite)}&dwSceneId=${sceneId}`), async (err, resp, data) => {
          try {
            const { sErrMsg, data: { rewardMoney = 0 } = {},strPin } = JSON.parse(data);
            $.log(`\n${strPin}开始【👬普通助力】：${sErrMsg}\n${$.showLog ? data : ''}`);
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve();
          }
        });      
});
}
//999 其它
function createAssistUserw() {
  return new Promise(resolve => {
    const sceneIds = Object.keys($.info.SceneList);
    const sceneId = Math.min(...sceneIds);
    $.get({ url: 'https://raw.githubusercontent.com/hajiuhajiu/jdsign1112/master/shareCodes/cfd.json' }, async (err, resp, _data) => {
      try {
        const { data = {} } = JSON.parse(_data);
        $.log(`\n【👬普通助力】普通助力码：${data.shareId}\n${$.showLog ? _data : ''}`);
        $.get(taskUrl('user/JoinScene', `strShareId=${escape(data.shareId)}&dwSceneId=${sceneId}`), async (err, resp, data) => {
          try {
            const { sErrMsg, data: { rewardMoney = 0 } = {}  } = JSON.parse(data);
            $.log(`\n${strPin}开始【👬普通助力】：${sErrMsg}\n${$.showLog ? data : ''}`);
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve();
          }
        });
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
//出海寻宝提交互助码
function submitGroupId() {
  return new Promise(resolve => {
    $.get(taskUrl(`user/GatherForture`), async (err, resp, g_data) => {
      try {
        const { GroupInfo:{ strGroupId }, strPin } = JSON.parse(g_data);
        if(!strGroupId) {
          const status = await openGroup();
          if(status === 0) {
            await submitGroupId();
          } else {
            resolve();
            return;
          }
        } else {
          $.log('你的【🏝出海寻宝】互助码: ' + strGroupId);          
          $.post(
            {url: `https://api.ninesix.cc/api/jx-cfd-group/${strGroupId}/${encodeURIComponent(strPin)}`},
            async (err, resp, _data) => {
              try {
                const { data = {}, code } = JSON.parse(_data);
                $.log(`\n【🏝出海寻宝】邀请码提交：${code}\n${$.showLog ? _data : ''}`);
                if (data.value) {
                  $.result.push(`${strPin}:【🏝出海寻宝】邀请码提交成功！`);
                  groupInvites[strPin] = strGroupId;                          
                }
              } catch (e) {
                $.logErr(e, resp);
              } finally {
                resolve();
              }
            }
          );
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

//开启出海寻宝
function openGroup() {
  return new Promise( async (resolve) => {
    $.get(taskUrl(`user/OpenGroup`, `dwIsNewUser=${$.info.dwIsNewUser}`), async (err, resp, data) => {
      try {
        const { sErrMsg } = JSON.parse(data);
        $.log(`\n【🏝出海寻宝】${sErrMsg}\n${$.showLog ? data : ''}`);
        resolve(0);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

//出海寻宝 喊好友帮忙加里程
function joinGroup() {
  return new Promise( async (resolve ) => {
    if(!groupInvites[`220_1099553776998`]) return resolve();              
        $.get(taskUrl(`user/JoinGroup`, `strGroupId=${groupInvites[`220_1099553776998`]}&dwIsNewUser=${$.info.dwIsNewUser}&pgtimestamp=${$.currentToken['timestamp']}&phoneID=${$.currentToken['phoneid']}&pgUUNum=${$.currentToken['farm_jstoken']}`), (err, resp, data) => {
          try {
            const { sErrMsg } = JSON.parse(data);
            $.log(`\n【🏝出海寻宝】助力：${sErrMsg}\n${$.showLog ? data : ''}`);            
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve();
          }
        });
      }) 
}

//出海寻宝开宝箱
function openPeriodBox() {
  return new Promise( async (resolve) => { 
    $.get(taskUrl(`user/GatherForture`), async (err, resp, data) => {
      try {
        const { PeriodBox = [{}] } = JSON.parse(data);
        for (var i = 0; i < PeriodBox.length ; i++) {
          const { dwStatus, dwSeq, strBrandName } = PeriodBox[i];
          //1:未达条件 2:可开启 3:已开启
          if (dwStatus == 2) {
            await $.wait(1000);
            await $.get(taskUrl(`user/OpenPeriodBox`, `dwSeq=${dwSeq}`), async (err, resp, data) => {
              try {
                const { dwMoney, iRet, sErrMsg } = JSON.parse(data)
                $.log(`\n【🏝出海寻宝】【${strBrandName}】开宝箱：${sErrMsg == 'success' ? ` 获得财富值 ¥ ${dwMoney}` : sErrMsg }\n${$.showLog ? data : ''}`);
              } catch (e) {
                $.logErr(e, resp);
              } finally {
                resolve();
              }
            });
          } else if (dwStatus == 3) {
            $.log(`\n【🏝出海寻宝】【${strBrandName}】开宝箱：宝箱已开启过！`);
          } else {
            $.log(`\n【🏝出海寻宝】【${strBrandName}】开宝箱：未达到宝箱开启条件，快去邀请好友助力吧！`);
            resolve();
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(); 
      }
    });
  });
}

function getCookies() {
  if ($.isNode()) {
    $.cookieArr = Object.values(jdCookieNode);
  } else {
    const CookiesJd = JSON.parse($.getdata("CookiesJD") || "[]").filter(x => !!x).map(x => x.cookie);
    $.cookieArr = [$.getdata("CookieJD") || "", $.getdata("CookieJD2") || "", ...CookiesJd];
  }
  if (!$.cookieArr[0]) {
    $.msg(
      $.name,
      "【⏰提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
      "https://bean.m.jd.com/",
      { "open-url": "https://bean.m.jd.com/", }
    );
    return false;
  }
  return true;
}

function getTokens() {
  if ($.isNode()) {
    Object.keys(jdTokenNode).forEach((item) => {
      $.tokenArr.push(jdTokenNode[item] ? JSON.parse(jdTokenNode[item]) : '{}');
    })
  } else {
    $.tokenArr = JSON.parse($.getdata('jx_tokens') || '[]');
  }
  if (!$.tokenArr[0]) {
    $.msg(
      $.name,
      "【⏰提示】请先获取京喜Token\n获取方式见脚本说明"
    );
    return false;
  }
  return true;
}

function taskUrl(function_path, body) {
  return {
    url: `${JD_API_HOST}jxcfd/${function_path}?strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=138631.26.55&${body}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&g_ty=ls`,
    headers: {
      Cookie: $.currentCookie,
      Accept: "*/*",
      Connection: "keep-alive",
      Referer:"https://st.jingxi.com/fortune_island/index.html?ptag=138631.26.55",
      "Accept-Encoding": "gzip, deflate, br",
      Host: "m.jingxi.com",
      "User-Agent":`jdpingou;iPhone;3.15.2;14.2.1;ea00763447803eb0f32045dcba629c248ea53bb3;network/wifi;model/iPhone13,2;appBuild/100365;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/${Math.random * 98 + 1};pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
      "Accept-Language": "zh-cn",
    },
  };
}

function taskListUrl(function_path, body) {
  return {
    url: `${JD_API_HOST}newtasksys/newtasksys_front/${function_path}?strZone=jxcfd&bizCode=jxcfd&source=jxcfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=138631.26.55&${body}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&g_ty=ls`,
    headers: {
      Cookie: $.currentCookie,
      Accept: "*/*",
      Connection: "keep-alive",
      Referer:"https://st.jingxi.com/fortune_island/index.html?ptag=138631.26.55",
      "Accept-Encoding": "gzip, deflate, br",
      Host: "m.jingxi.com",
      "User-Agent":`jdpingou;iPhone;3.15.2;14.2.1;ea00763447803eb0f32045dcba629c248ea53bb3;network/wifi;model/iPhone13,2;appBuild/100365;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/${Math.random * 98 + 1};pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
      "Accept-Language": "zh-cn",
    },
  };
}

function showMsg() {
  return new Promise(async (resolve) => {
    if ($.notifyTime) {
      const notifyTimes = $.notifyTime.split(",").map((x) => x.split(":"));
      const now = $.time("HH:mm").split(":");
      $.log(`\n${JSON.stringify(notifyTimes)}`);
      $.log(`\n${JSON.stringify(now)}`);
      if ( notifyTimes.some((x) => x[0] === now[0] && (!x[1] || x[1] === now[1])) ) {
        $.msg($.name, "", `\n${$.result.join("\n")}`);
      }
    } else {
      $.msg($.name, "", `\n${$.result.join("\n")}`);
    }
    
    if ($.isNode() && process.env.CFD_NOTIFY_CONTROL === 'true')
      await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `账号${$.index}：${$.nickName || $.userName}\n${$.result.join("\n")}`);
      
    resolve();
  });
}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
