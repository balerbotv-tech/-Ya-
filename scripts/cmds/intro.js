const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "intro",
        version: "12.0",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "OWNER",
        description: "Owner er intro video + info",
        usage: "/intro",
        prefix: "/" 
    },

    onStart: async function ({ api, event }) {
        try {
            const videoPath = path.join(__dirname, "../../videos/intro.mp4");
            
            if (!fs.existsSync(videoPath)) {
                return api.sendMessage(
                    "❌ videos/intro.mp4 file pai nai!\n\n`bot/videos/intro.mp4` e file ta rakho", 
                    event.threadID, 
                    event.messageID
                );
            }

            const introText = `╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ : 亗^⁠_^𝗔_𝗥_𝗜_𝗬_𝗔_⁠𝗡^_^ 𝐁𝐁'𝐙
│ 🧸 Nɪᴄᴋ : AruuuH 
│ 🎂 Aɢᴇ : 19+ 
│ 💘 Rᴇʟᴀᴛɪᴏɴ : Married 
│ 🎓 Pʀᴏғᴇssɪᴏɴ : Business 
│ 📚 Eᴅᴜᴄᴀᴛɪᴏɴ : chudling pong 
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ : Dhaka keraniganj 
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📘 Facebook : https://facebook.com/61582149885357 
│ 💬 Messenger : m.me/aruuhbbz 
│ 📞 WhatsApp : wa.me/01704471566 
╰────────────────╯
\n🔥 "Throughout heaven and earth, I alone am the honored one" 🔥`;

            return api.sendMessage({ 
                body: introText, 
                attachment: fs.createReadStream(videoPath)
            }, event.threadID, event.messageID);

        } catch (e) {
            return api.sendMessage("❌ Error: " + e.message, event.threadID, event.messageID);
        }
    }
};
