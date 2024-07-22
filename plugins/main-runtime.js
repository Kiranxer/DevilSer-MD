const { pnix, runtime, mode} = require("../lib");

pnix({
    pattern: "runtime",
    type: "main",
    desc: "Check Bot Runtime",
    fromMe: mode
}, async(msg) => {
        const time = await runtime()
        await msg.reply(`_*𝐑ᴜɴᴛɪᴍᴇ = ${time} 🏃🏻‍♀️*_`);
    }
)
