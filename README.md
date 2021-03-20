
## 特别声明: 
本脚本取下列大佬 @NobyDa @lxk0301 @i-chenzhe @wuzhi01 
不保证完全可用， 部分脚本带助力部分可以自行修改， 加密脚本无法更改，请自行斟酌使用。
尽量保留非加密版本

1.目前宠汪汪无法助力
2.后续增加脚本大部分为加密脚本,内置主力码,自行斟酌使用
3.保护好cookie 使用github action的一定要存在secrets里
4.不要fork 复制过去自己设置就好 

 **您必须在下载后的24小时内从计算机或手机中完全删除以上内容.**  </br>
 ***您使用或者复制了本仓库或本人制作的任何脚本，则视为`已接受`此声明，请仔细阅读*** 
## 使用教程

### 一丶Github Action 使用教程
手动复制方法：
### 创建新仓库

[点击创建自己的仓库](https://github.com/new)

填入`Repository name`后点击最下方的`Create repository` 点下面Import a repository.
然后在于Your old repository’s clone URL 填入 https://github.com/hajiuhajiu/jdsign1112 按提示完成复制后
填写secrets 的cookie及其它参数即可。cookie可自行百度教程
该方法需要自行定期替换或更新脚本，不会同步，但方法简单

自动同步教程：
1. [按照这个教程进行 reposync](backup/reposync.md)
2. 再在`Settings`-`Secrets`里面添加`JD_COOKIE`
3. 多条 cookie 用`&`隔开，支持无数条 cookie
4. 前三步之后，点击一下右上角的 star（fork 左边那个），让 workflow 运行一次。

喜马拉雅极速版专属环境变量[点击查看](backup/xmly/xmly.md)
lxk0301-环境变量合集（Secrets）配置[点击查看](https://gitee.com/lxk0301/jd_scripts/blob/master/githubAction.md)

> 具体如何取 cookie可以运行getcookie脚本，按build里面运行提示扫码登陆，脚本会获得cookie，然后将脚本获得的cookie 放在secrets即可,运行后一定要删除运行记录,防盗!!!!!!
>  如何配置,可参考 > [获取京东Cookies教程](https://github.com/hajiuhajiu/jdsign1112/blob/master/backUp/GetJdCookie2.md)
>
> 
>   清单：  
> ##############短期活动############## 

环球挑战赛 活动时：2021-02-02 至 2021-02-22  10 9,12,20,21 2-22 2 * node /scripts/jd_global.js >> /scripts/logs/jd_global  
百变大咖秀第3期  22 23,0,9 * * * node /scripts/jd_entertainment.js >> /scripts/logs/jd_entertainment   
 京东女装盲盒 9 0,12,18 * * * node /scripts/jd_nzmh.js >> /scripts/logs/jd_nzmh   
 美丽研究院 9 0,12,18 * * * node /scripts/jd_beauty.js >> /scripts/logs/jd_beauty   
##############长期活动##############
 签到  0 0,18 * * * cd /scripts && node jd_bean_sign.js >> /scripts/logs/jd_bean_sign   
 东东超市兑换奖品 0,16 * * * node /scripts/jd_blueCoin.js 默认换500豆，然后运行换20豆(jd_blueCoin20) 
 摇京豆0 0 * * * node /scripts/jd_club_lottery.js >> /scripts/logs/jd_club_lottery   
 东东农场5 6-18/6 * * * node /scripts/jd_fruit.js >> /scripts/logs/jd_fruit   
 宠汪汪15 */2 * * * node /scripts/jd_joy.js >> /scripts/logs/jd_joy
 宠汪汪换豆 57 15,23,3,11 * * * node /scripts/jd_joy_reward.js 默认0点8点先换500豆，8点延迟一分钟后换20豆 
 宠汪汪喂食15 */1 * * * node /scripts/jd_joy_feedPets.js >> /scripts/logs/jd_joy_feedPets   
 宠汪汪偷好友积分与狗粮0 0-10/2 * * * node /scripts/jd_joy_steal.js >> /scripts/logs/jd_joy_steal      
 摇钱树0 */2 * * * node /scripts/jd_moneyTree.js >> /scripts/logs/jd_moneyTree      
 东东萌宠5 6-18/6 * * * node /scripts/jd_pet.js >> /scripts/logs/jd_pet      
 京东种豆得豆0 7-22/1 * * * node /scripts/jd_plantBean.js >> /scripts/logs/jd_plantBean      
 京东全民开红包1 1 * * * node /scripts/jd_redPacket.js >> /scripts/logs/jd_redPacket      
 进店领豆10 0 * * * node /scripts/jd_shop.js >> /scripts/logs/jd_shop      
 京东天天加速8 */3 * * * node /scripts/jd_speed.js >> /scripts/logs/jd_speed      
 东东超市11 */6 * * * node /scripts/jd_superMarket.js >> /scripts/logs/jd_superMarket      
 取关京东店铺商品55 23 * * * node /scripts/jd_unsubscribe.js >> /scripts/logs/jd_unsubscribe      
 京豆变动通知0 10 * * * node /scripts/jd_bean_change.js >> /scripts/logs/jd_bean_change      
 京东抽奖机11 1 * * * node /scripts/jd_lotteryMachine.js >> /scripts/logs/jd_lotteryMachine      
 京东排行榜11 9 * * * node /scripts/jd_rankingList.js >> /scripts/logs/jd_rankingList      
 天天提鹅18 * * * * node /scripts/jd_daily_egg.js >> /scripts/logs/jd_daily_egg      
 金融养猪12 * * * * node /scripts/jd_pigPet.js >> /scripts/logs/jd_pigPet      
 点点券20 0,20 * * * node /scripts/jd_necklace.js >> /scripts/logs/jd_necklace      
 京喜工厂20 * * * * node /scripts/jd_dreamFactory.js >> /scripts/logs/jd_dreamFactory       
 东东小窝16 6,23 * * * node /scripts/jd_small_home.js    /scripts/logs/jd_small_home       
 东东工厂36 * * * * node /scripts/jd_jdfactory.js    /scripts/logs/jd_jdfactory       
 十元街36 8,18 * * * node /scripts/jd_syj.js    /scripts/logs/jd_syj       
 京东快递签到23 1 * * * node /scripts/jd_kd.js    /scripts/logs/jd_kd       
 京东汽车(签到满500赛点可兑换500京豆)0 0 * * * node /scripts/jd_car.js    /scripts/logs/jd_car       
 领京豆额外奖励(每日可获得3京豆)33 4 * * * node /scripts/jd_bean_home.js    /scripts/logs/jd_bean_home       
 京东直播(每日18豆)10-20/5 11 * * * node /scripts/jd_live.js    /scripts/logs/jd_live       
 微信小程序京东赚赚10 11 * * * node /scripts/jd_jdzz.js    /scripts/logs/jd_jdzz       
 宠汪汪邀请助力10 9-20/2 * * * node /scripts/jd_joy_run.js    /scripts/logs/jd_joy_run       
 crazyJoy自动每日任务10 7 * * * node /scripts/jd_crazy_joy.js    /scripts/logs/jd_crazy_joy       
 京东汽车旅程赛点兑换金豆0 0 * * * node /scripts/jd_car_exchange.js    /scripts/logs/jd_car_exchange       
 导到所有互助码47 7 * * * node /scripts/jd_get_share_code.js    /scripts/logs/jd_get_share_code       
 口袋书店7 8,12,18 * * * node /scripts/jd_bookshop.js    /scripts/logs/jd_bookshop       
 京喜农场0 9,12,18 * * * node /scripts/jd_jxnc.js    /scripts/logs/jd_jxnc       
 签到领现金27 7,15 * * * node /scripts/jd_cash.js    /scripts/logs/jd_cash       
 京喜app签到39 7 * * * node /scripts/jx_sign.js    /scripts/logs/jx_sign       
 京东家庭号(暂不知最佳cron) */20 * * * * node /scripts/jd_family.js    /scripts/logs/jd_family       
 闪购盲盒27 8 * * * node /scripts/jd_sgmh.js    /scripts/logs/jd_sgmh       
 京东秒秒币10 7 * * * node /scripts/jd_ms.js    /scripts/logs/jd_ms       
 删除优惠券(默认注释，如需要自己开启，如有误删，已删除的券可以在回收站中还原，慎用)#20 9 * * 6 node /scripts/jd_delCoupon.js    /scripts/logs/jd_delCoupon       
 京喜财富岛10 * * * *  node /scripts/jx_cfd.js    /scripts/logs/jx_cfd       
 京东试用（默认注释，请配合取关脚本使用）#10 0 * * *  node /scripts/jd_try.js    /scripts/logs/jd_try       
 京东价格保护10 0 */3 * *  node /scripts/jd_priceProtect.js    /scripts/logs/jd_priceProtect       
 京东极速版红包40 0,12,18 * * *  node /scripts/jd_speed_redpocke.js    /scripts/logs/jd_speed_redpocke       
 京东极速版48 0,12,18 * * *  node /scripts/jd_speed_sign.js    /scripts/logs/jd_speed_sign     

