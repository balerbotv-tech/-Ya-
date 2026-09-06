const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
    config: {
        name: "intro",
        version: "1.4.0",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        role: 0,
        shortDescription: "Owner information with video",
        category: "intro",
        guide: { en: "owner" }
    },

    onStart: async function ({ api, event }) {
        const ownerText = `╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ : 亗^⁠_^𝗔_𝗥_𝗜_𝗬_𝗔_⁠𝗡^_^ 𝐁𝐁'𝐙 ✿᭄
│ 🧸 Nɪᴄᴋ : AruuuH
│ 🎂 Aɢᴇ : 19+
│ 💘 Rᴇʟᴀᴛɪᴏɴ : Married
│ 🎓 Pʀᴏғᴇssɪᴏɴ : Business
│ 📚 Eᴅᴜᴄᴀᴛɪᴏɴ : chudling pong
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ : Dhaka keraniganj
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📘 Facebook : https://facebook.com/61582149885357
│ 💬 messenger : m.me/aruuhbbz
│ 📞 WhatsApp : wa.me/01704471566
╰────────────────╯
\n🔥 "Throughout heaven and earth, I alone am the honored one" 🔥`;

        const cacheDir = path.join(__dirname, "cache");
        const videoPath = path.join(cacheDir, "owner.mp4"); // .jpg er jaygay .mp4
        
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

        // Tor video link ekhane boshaise
        const videoLink = "https://files.catbox.moe/722foy.mp4";

        const send = () => {
            api.sendMessage(
                { 
                    body: ownerText, 
                    attachment: fs.createReadStream(videoPath) 
                },
                event.threadID,
                () => fs.unlinkSync(videoPath), // send er por file delete kore dibe
                event.messageID
            );
        };

        request(encodeURI(videoLink))
            .pipe(fs.createWriteStream(videoPath))
            .on("close", send)
            .on("error", (err) => {
                api.sendMessage("❌ Video download korte problem: " + err.message, event.threadID, event.messageID);
            });
    }
};
