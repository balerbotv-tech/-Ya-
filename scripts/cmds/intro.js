const axios = require("axios");
const fs = require("fs");

module.exports = {
    config: {
        name: "intro",
        version: "2.0",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "OWNER",
        guide: "{pn} - Gojo Intro"
    },

    onStart: async function ({ api, event }) {
        try {
            // Gojo Sigma 10s er video link - direct download hobe
            const videoUrl = "https://files.catbox.moe/9x8k2l.mp4"; // Gojo "Domain Expansion" edit
            
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

            // video download kore pathano
            const response = await axios.get(videoUrl, { responseType: 'stream' });
            
            return api.sendMessage({ 
                body: introText, 
                attachment: response.data
            }, event.threadID, event.messageID);

        } catch (e) {
            return api.sendMessage("❌ Video load hoi nai. Link check koro", event.threadID, event.messageID);
        }
    }
};
