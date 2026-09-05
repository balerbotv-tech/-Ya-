const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "intro",
        version: "1.1",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "OWNER",
        guide: "{pn} - Owner intro video pathabe"
    },

    onStart: async function ({ api, event }) {
        try {
            // Ekhane tomar video er direct link boshao
            const videoUrl = "https://i.imgur.com/VIDEO_LINK.mp4"; // <-- Eita change koro
            
            const cachePath = path.join(__dirname, "intro_cache.mp4");

            // Jodi age download na thake tahole download korbe
            if (!fs.existsSync(cachePath)) {
                const res = await axios.get(videoUrl, { responseType: "stream" });
                const writer = fs.createWriteStream(cachePath);
                res.data.pipe(writer);
                await new Promise((resolve, reject) => {
                    writer.on("finish", resolve);
                    writer.on("error", reject);
                });
            }

            const introText = `╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ : 亗^⁠_^𝗔_𝗥_𝗜_𝗬_𝗔_⁠𝗡^_^ 𝐁𝐁'𝐙
│🧸 Nɪᴄᴋ : AruuuH 
│ 🎂 Aɢᴇ : 19+ 
│ 💘 Rᴇʟᴀᴛɪᴏɴ : Married 
│ 🎓 Pʀᴏғᴇssɪᴏɴ : Business 
│ 📚 Eᴅᴜᴄᴀᴛɪᴏɴ : chudling pong 
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ : Dhaka keraniganj 
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📘 Facebook : https://facebook.com/61582149885357 
│ 💬 messenger : m.me/aruuhbbz 
│ 📞 WhatsApp : wa.me/01704471566 
╰────────────────╯`;

            const attachment = fs.createReadStream(cachePath);
            
            return api.sendMessage({ 
                body: introText, 
                attachment: attachment 
            }, event.threadID, event.messageID);

        } catch (e) {
            return api.sendMessage("❌ Video load hoi nai. Link thik ase kina check koro", event.threadID, event.messageID);
        }
    }
};
