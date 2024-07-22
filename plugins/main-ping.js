const { calculatePing, pnix, mode} = require("../lib");

pnix({
    pattern: "ping",
    type: "main",
    desc: "Bot response.",
    fromMe: mode
}, async(msg, match) => {
        await msg.reply(`*📡 𝐏ᴏɴɢ! ${calculatePing(msg.messageTimestamp, Date.now())} Ms*`);
})
