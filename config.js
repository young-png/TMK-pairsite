const fs = require('fs')

global.owner = "2348168000939" //owner number
global.footer = "Gødfather" //footer section
global.status = false //"self/public" section of the bot
global.prefa = ['','!','.',',','🐤','🗿']
global.owner = ['62']
global.xprefix = '.'
global.gambar = "https://files.catbox.moe/zhbsht.jpg"
global.OWNER_NAME = "@hmmletts" //
global.DEVELOPER = ["7151373704"] //
global.BOT_NAME = "TMK Team WA Bot"
global.bankowner = "Ayodele"
global.creatorName = "Gabimaru"
global.ownernumber = '2348168000939'  //creator number
global.location = "Nigeria, Abuja, kubwa"
global.prefa = ['','!','.','#','&']
//================DO NOT CHANGE OR YOU'LL GET AN ERROR=============\
global.footer = "𝕽𝖎𝖈𝖍𝖎𝖊" //footer section
global.link = "https://whatsapp.com/channel/0029Vav3pek65yD9mqSgd21B"
global.autobio = true//auto update bio
global.botName = "AKANE ⚡"
global.version = "𝙑𝟭"
global.botname = "AKANE MD"
global.author = "𝗥𝗜𝗖𝗛𝗜𝗘"
global.themeemoji = '🀄'
global.wagc = 'https://chat.whatsapp.com/BW2DeGMj0tVGbdgHFtHvj8'
global.thumbnail = 'https://files.catbox.moe/l9gpzm.jpg'
global.richpp = ' '
global.packname = "Sticker By TMK bot"
global.author = "\n\n\n\n\nCreate by TMK team\team owner ttelegram : @hmmletts"
global.creator = "2349151874246@s.whatsapp.net"
global.ownername = '𝗥𝗜𝗖𝗛𝗜𝗘' 
global.onlyowner = `𝘴𝘰𝘳𝘳𝘺 𝘰𝘯𝘭𝘺 𝘧𝘰𝘳  𝘰𝘸𝘯𝘦𝘳𝘴
𝘤𝘰𝘯𝘵𝘢𝘤𝘵 𝘙𝘪𝘤𝘩𝘪𝘦 𝘵𝘰 𝘣𝘦 𝘢𝘯 𝘰𝘸𝘯𝘦𝘳`
  // reply 
global.database = `𝘛𝘰 𝘣𝘦 𝘪𝘯  𝘥𝘢𝘵𝘢𝘣𝘢𝘴𝘦 𝘣𝘢𝘴𝘦 𝘤𝘰𝘯𝘵𝘢𝘤𝘵 𝘙𝘪𝘤𝘩𝘪𝘦*`
  global.mess = {
wait: "```Working on it....```",
   success: "Sucess",
   on: "akane active bro", 
   prem: "FOR PREMIUM USERS ONLY ADD YOUR NUMBER TO DATABASE TO ACCESS PREMIUM", 
   off: "Akane off",
   query: {
       text: "Where's the text, man?",
       link: "Where's the link, bro?",
   },
   error: {
       fitur: "Sorry, bro, the feature has error. Please chat with the Bot Developer so it can be fixed immediately.",
   },
   only: {
       group: "Sorry bro, This Feature Can Only Be Used In Groups only",
private: "Sorry bro, This Feature Can Only Be Used In Private Chats",
       owner: "Sorry bro, This Feature Can Only Be Used by Richie",
       admin: " Sorry, this feature can only be used by Bot Admins",
       badmin: "Sorry, bro, It Looks Like You Can't Use This Feature Because the Bot is Not yet Group Admin",
       premium: "This feature is specifically for Richie beloved Premium users",
   }
}

global.hituet = 0
//false=disable and true=enable
global.autoRecording = true //auto recording
global.autoTyping = true //auto typing
global.autorecordtype = true //auto typing + recording
global.autoread = false //auto read messages
global.autobio = true //auto update bio
global.anti92 = true //auto block +92 
global.autoswview = true //auto view status/story

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
