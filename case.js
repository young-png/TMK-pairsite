const { 
  default: baileys, proto, jidNormalizedUser, generateWAMessage, 
  generateWAMessageFromContent, getContentType, prepareWAMessageMedia 
} = require("@whiskeysockets/baileys");

const {
  downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, jidDecode, generateWAMessageContent, makeInMemoryStore, MediaType, areJidsSameUser, 
  WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, 
  GroupMetadata, initInMemoryKeyStore, MiscMessageGenerationOptions, 
  useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, 
  WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, 
  WALocationMessage, WAContextInfo, WAGroupMetadata, ProxyAgent, 
  waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, 
  WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, 
  WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, 
  MediariyuInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, 
  WAMediaUpload, mentionedJid, processTime, Browser, MessageType, 
  Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, 
  GroupSettingChange, DisriyuectReason, WASocket, getStream, WAProto, 
  isBaileys, AnyMessageContent, fetchLatestBaileysVersion, 
  templateMessage, InteractiveMessage, Header 
} = require("@whiskeysockets/baileys");
const { checkMonthYear } = require('./monthCheck');
const util = require("util");
const moment = require("moment-timezone");

module.exports = async (tmk, m, chatUpdate, store) => {
  try {
    if (!m || !m.sender || !m.key) return;

    let senderJid = m.sender;
    let decoded;

    try {
      decoded = jidDecode(senderJid);
    } catch (e) {
      console.log("⚠️ jidDecode failed:", e);
    }

    const username = decoded && decoded.user ? decoded.user : jidNormalizedUser(senderJid);

    const { from, sender, text, isGroup, isBotAdmin, isAdmin, args, command } = m;
    const body = m.body || "";
    const prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#%^&.©^]/.test(body[0]) ? body[0] : ".";
    const commandName = body.startsWith(prefix) ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : "";

    switch (commandName) {
      case "ping": {
        await tmk.sendMessage(from, { text: `*Pong!* 🏓\n_Response Time:_ ${new Date() - chatUpdate.messages[0].messageTimestamp * 1000}ms` }, { quoted: m });
        break;
      }

      case "menu": {
        await tmk.sendMessage(from, {
          text: `
┌──「 *TMK X Menu* 」
│ 🔹 /ping
│ 🔹 /botdev1
│ 🔹 /groupinfo
└───────`,
        }, { quoted: m });
        break;
      }

      case "botdev1": {
        await tmk.sendContact(from, [{
          displayName: "Kunle / Gabimaru",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Gabimaru\nTEL;waid=2349012834275:+234 901 283 4275\nEND:VCARD`
        }], { quoted: m });
        break;
      }

      case "groupinfo": {
        if (!isGroup) return m.reply("This command only works in groups.");
        const groupMetadata = await tmk.groupMetadata(from);
        const groupName = groupMetadata.subject;
        const groupDesc = groupMetadata.desc || "No description.";
        m.reply(`
 *Group Info*
- Name: ${groupName}
- Description: ${groupDesc}
- Members: ${groupMetadata.participants.length}`);
        break;
      }

      default:
        if (commandName && !["ping", "menu", "botdev1", "groupinfo"].includes(commandName)) {
          console.log(`Unrecognized command: ${commandName}`);
        }
        break;
    }

  } catch (err) {
    console.log("Error in case.js:", err);
  }
};