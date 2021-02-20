
## 特别声明: 

* 本仓库发布的项目中涉及的任何解锁和解密分析脚本，仅用于测试和学习研究，禁止用于商业用途，不能保证其合法性，准确性，完整性和有效性，请根据情况自行判断.

* 本项目内所有资源文件，禁止任何公众号、自媒体进行任何形式的转载、发布。

* 本人对任何脚本问题概不负责，包括但不限于由任何脚本错误导致的任何损失或损害.

* 间接使用脚本的任何用户，包括但不限于建立VPS或在某些行为违反国家/地区法律或相关法规的情况下进行传播, 本人对于由此引起的任何隐私泄漏或其他后果概不负责.

* 请勿将项目的任何内容用于商业或非法目的，否则后果自负.

* 如果任何单位或个人认为该项目的脚本可能涉嫌侵犯其权利，则应及时通知并提供身份证明，所有权证明，我们将在收到认证文件后删除相关脚本.

* 任何以任何方式查看此项目的人或直接或间接使用该项目的任何脚本的使用者都应仔细阅读此声明。保留随时更改或补充此免责声明的权利。一旦使用并复制了任何相关脚本或项目的规则，则视为您已接受此免责声明.

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

> 具体如何取 cookie 如何配置,可参考 [lxk0301 的获取京东Cookies教程](https://gitee.com/lxk0301/jd_scripts/blob/master/backUp/GetJdCookie.md)
> 
## 京东薅羊毛工具（活动入口：京东app->我的->游戏与互动->查看更多）
1.  京东水果([jd_fruit.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_fruit.js))
2.  东东萌宠([jd_pet.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_pet.js))
3.  宠汪汪([jd_joy.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy.js))
4.  种豆得豆([jd_plantBean.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_plantBean.js))
5.  天天加速([jd_speed.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_speed.js))
6.  摇钱树([jd_moneyTree.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_moneyTree.js))
7.  宠汪汪兑换奖品([jd_joy_reward.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_reward.js))
8.  取关京东店铺和商品([jd_unsubscribe.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_unsubscribe.js))
9.  京小超([jd_superMarket.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_superMarket.js))
10. 京小超兑换奖品([jd_blueCoin.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_blueCoin.js))
11. 宠汪汪偷好友狗粮与积分([jd_joy_steal.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_steal.js))
12. 进店领豆([jd_shop.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_shop.js))
13. 摇京豆([jd_club_lottery.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_club_lottery.js))
14. 全名开红包([jd_redPacket.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_redPacket.js))
15. 京东多合一签到([jd_bean_sign.js](https://raw.githubusercontent.com/lxk0301/scripts/master/jd_bean_sign.js)) 【自用，Node.js专用，核心脚本是JD_DailyBonus.js， IOS软件用户请使用NobyDa的 [JD_DailyBonus.js](https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js) 】
