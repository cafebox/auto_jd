/**
 * 这是一个智能执行的页面,理论上你可以通过此页面实现全部的js签到
 */
const Secrets = {
    syncUrl: process.env.SYNCURL, //签到地址,方便随时变动
    importUrls: process.env.IMPORTURLS, //需要额外导入的文件,内容格式为[{"fileName":"sendNotify.js",url:"https://github.com/lxk0301/scripts/raw/master/sendNotify.js"},{"fileName":"jdFruitShareCodes.js",url:"https://github.com/lxk0301/scripts/raw/master/jdFruitShareCodes.js"}]
    replacements: process.env.REPLACEMENTS, //替换内容,支持文本,支持正则,例如[{key:/var Key = ''/, value="test"},{key:"require('./sendNotify')",value:"{sendNotify:function(){},serverNotify:function(){},BarkNotify:function(){},tgBotNotify:function(){}}"}]
    secrets: process.env.SECRETS, //原JS中需要填入的SECRETS,可通过REPLACEMENTS直接进行替换,也可以在此配置,例如{"JD_COOKIE":"pt_key=dqwdqw;pt_pin=34123414&pt_key=dqwdqw;pt_pin=34123414","PUSH_KEY":"djdlk1jl12e081t"}
    debug: process.env.DEBUG, //是否记录转换好的文件,用于查看转换后的文件是否正常
};
async function downFile() {
    await download(Secrets.SyncUrl, "./", { filename: "temp.js" });
    console.log("下载代码完毕");
}

async function changeFiele() {
    let content = await fs.readFileSync("./temp.js", "utf8");
    content = await smartReplace.replaceWithSecrets(content, Secrets);
    await fs.writeFileSync("./execute.js", content, "utf8");
    console.log("替换变量完毕");
}
