// 🧩 Required Modules
const { getContentType, jidNormalizedUser } = require("@whiskeysockets/baileys");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
const { checkMonthYear } = require('./monthCheck');
const settings = require('./settings.json');
const PREFIX = settings.prefix || ".";
const SUDO_LIST = settings.sudo || [];

async function handleMessage(sock, m) {
    try {
        const msg = m.messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = isGroup
            ? (msg.key?.participant || msg.participant || from)
            : from;

        const senderNumber = sender?.split('@')[0] || "unknown";

        const type = getContentType(msg.message);
        const body = (type === 'conversation'
            ? msg.message.conversation
            : (type === 'extendedTextMessage'
                ? msg.message.extendedTextMessage.text
                : '')
        ).trim();

        const moment = require("moment-timezone");
        const time = moment().tz("Africa/Lagos").format("HH:mm:ss");
        const senderName = msg.pushName || "Unknown";
        const isStatus = from === 'status@broadcast';
        const groupTag = isGroup ? "GROUP" : isStatus ? "STATUS" : "PM";

        const commandNamePreview = body.startsWith(settings.prefix)
            ? body.slice(settings.prefix.length).trim().split(/\s+/)[0].toLowerCase()
            : "None";

        // COMMAND HANDLING
        if (body.startsWith(settings.prefix)) {
            const args = body.slice(settings.prefix.length).trim().split(/ +/);
            const commandName = args.shift()?.toLowerCase();
            const text = args.join(" ");
            const groupMetadata = isGroup ? await sock.groupMetadata(from) : null;
            const isAdmin = isGroup && groupMetadata?.participants?.find(p => p.id === sender)?.admin;
            const isSudo = (jid) => {
              const number = jid.split("@")[0];
              return SUDO_LIST.includes(number);
            };


            switch (commandName) {

                case 'ping': {
                    return sock.sendMessage(from, { text: `🏓 Pong!\nTime: ${time}` }, { quoted: msg });
                   }
                   break;
                default:
                    return;
            }
        }

        // CONVERSATIONAL AI REPLY
        const reply = async (text) => {
            return sock.sendMessage(from, {
                contextInfo: {
                    mentionedJid: [from],
                    externalAdReply: {
                        showAdAttribution: false,
                        renderLargerThumbnail: false,
                        title: `Gabimaru The Hollow`,
                        body: ``,
                        previewType: "VIDEO",
                        thumbnailUrl: "https://c.top4top.io/p_3493r01s90.jpg",
                        sourceUrl: "https://t.me/Gabimarutechchannel",
                        mediaUrl: "https://t.me/Gabimarutechchannel"
                    }
                },
                text: text
            }, {
                quoted: {
                    key: {
                        fromMe: false,
                        participant: "0@s.whatsapp.net",
                        remoteJid: from
                    },
                    message: {
                        conversation: "🤺 TMK TEAM"
                    }
                }
            });
        };

        // MONTH CHECK NOTIFICATION
        if (checkMonthYear()) {
            await sock.sendMessage(sock.user.id, {
                text: "📅 Happy New Month from Gabimaru!!\nWe hope you enjoy this month with us 💐"
            });
        }

    } catch (error) {
        console.error(chalk.red('Error in handleMessage:'), error);
    }
}