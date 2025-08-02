
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  Browsers,
  fetchLatestBaileysVersion,
  makeInMemoryStore
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const path = require("path");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const { handleMessage } = require('./gabi.js');

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      fs.lstatSync(curPath).isDirectory()
        ? deleteFolderRecursive(curPath)
        : fs.unlinkSync(curPath);
    });
    fs.rmdirSync(folderPath);
  }
}

async function startpairing(number) {
  const { version } = await fetchLatestBaileysVersion();
  const sessionPath = `../richstore/pairing/${number}`;
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const store = makeInMemoryStore({
    logger: pino().child({ level: "silent" }),
  });

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: Browsers.ubuntu("Edge"),
    auth: state,
    version: [2, 3000, 1023223821],
    getMessage: async () => ({})
  });

  store.bind(sock.ev);

  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      switch (reason) {
        case DisconnectReason.loggedOut:
          deleteFolderRecursive(sessionPath);
          break;
        case DisconnectReason.connectionClosed:
        case DisconnectReason.connectionLost:
        case DisconnectReason.timedOut:
          startpairing(number);
          break;
      }
    } else if (connection === "open") {
      console.log(`✅ Connected: ${number}`);
    }
  });
  
  if (!state.creds.registered) {
      const code = await sock.requestPairingCode(number, "TMKSITEE");
      const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;

      fs.writeFileSync(
        `./richstore/pairing/pairing.json`,
        JSON.stringify({ code: formattedCode }, null, 2)
      );

      console.log(`🔐 Pairing code for ${number}: ${formattedCode}`);
  }
  
  sock.ev.on("creds.update", saveCreds);
  
  sock.ev.on('messages.upsert', (m) => {
    handleMessage(sock, m);
  });
  
}

module.exports = startpairing;