const fs = require("fs");
const axios = require("axios");
const path = require("path");
const version = "1.0.0";
const express = require("express");
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const logger = require("pino");
const chatEvent = require("./lib/chatEvent");
let config = require("./config");
const app = express();
const port = process.env.PORT || 3000;
// Define the start function
async function start() {
        fs.readdirSync("./plugins").forEach((plugin) => {
            if (path.extname(plugin).toLowerCase() == ".js") {
                try {
                    require("./plugins/" + plugin);
                } catch (e) {
                    console.log(e)
                    fs.unlinkSync("./plugins/" + plugin);
                }
            }
        });

async function makeId(sessionId, folderPath, mongoDb) {
    try {
        // Create folder if it doesn't exist
        fs.mkdirSync(folderPath, { recursive: true });

        // Send request to restore session
        const response = await axios.post('https://api.lokiser.xyz/mongoose/session/restore', {
            id: sessionId,
            mongoUrl: mongoDb
        });

        // Extract data from response
        const jsonData = response.data.data;

        // Write data to creds.json
        const filePath = path.join(folderPath, "creds.json");
        fs.writeFileSync(filePath, jsonData);

        console.log(`creds.json created successfully at ${filePath}\ndata :${jsonData}`);
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

const sessionId = config.SESSION_ID;
const folderPath = "./lib/session";
const mongoDb = "mongodb+srv://amruth:A1M2R3U4T5H@amruth.wnylfrc.mongodb.net/?retryWrites=true&w=majority&appName=Amruth"; // same as used to save the credits

await makeId(sessionId, folderPath, mongoDb)
    .then(() => {
        console.log("MakeId function executed successfully.");
	console.log("session: " + sessionId);
    })
    .catch((error) => {
        console.error("Error occurred while executing MakeId function:", error.message);
    });
    
    
  const {
    state,
    saveCreds
  } = await useMultiFileAuthState("./lib/session");

  const client = makeWASocket({
    printQRInTerminal: true,
    logger: logger({
      level: "silent"
    }),
    auth: state,
    defaultQueryTimeoutMs: undefined,
  });

  client.ev.on("connection.update", (update) => {

    const {
      connection,
      lastDisconnect
    } = update;
    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete ${session} and Scan Again`);
        client.logout();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting....");
        start();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Lost from Server, reconnecting...");
        start();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
        client.logout();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(`Device Logged Out, Please Delete ${session} and Scan Again.`);
        client.logout();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...");
        start();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...");
        start();
      } else {
        client.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`);
      }
    } else if (connection === 'open') {
   console.log("Neeli-Penni-Md by Kiran-Xer");
    client.sendMessage("919539060020@s.whatsapp.net", { 
        text: `*►  𝐍 𝐄 𝐄 𝐋 𝐈 ;; 🍃*
*ㅤㅤ⌌ — — — ☁*
*ㅤㅤ│ᴠᴇʀꜱɪᴏɴ = ${version}*
*ㅤㅤ│ᴩʀᴇꜰɪ᥊ = ${config.HANDLERS}*
*ㅤㅤ│ꜱᴜᴅᴏ = ${config.SUDO} 👤*
*ㅤㅤ│ᴍᴏᴅᴇ = ${config.MODE}*
*⌎ — — — —*`
    });
}});

  client.ev.on("creds.update", saveCreds);

  client.ev.on("messages.upsert", async (m) => {
    chatEvent(m, client);
  });
}
app.get("/", (req, res) => {
	res.send("Hello Neeli-Penni-MD Started");
});
app.listen(port, () => console.log(`Neeli-Penni-MD Server Listening On Port ${port}`));
start();
