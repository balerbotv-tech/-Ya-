const axios = require("axios");

module.exports = {
    config: {
        name: "intro",
        version: "4.0",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "OWNER"
    },

    onStart: async function ({ api, event }) {
        try {
            // Tmr pathano Gojo video - direct stream
            const videoUrl = "https://i.imgur.com/GojoEdit.mp4"; // ami pore real link dibo
            
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
╰────────────────╯
\n🔥 "Throughout heaven and earth, I alone am the honored one" 🔥`;

            const res = await axios.get(videoUrl, { responseType: 'stream', timeout: 20000 });
            
            return api.sendMessage({ 
                body: introText, 
                attachment: res.data
            }, event.threadID, event.messageID);

        } catch (e) {
            return api.sendMessage("❌ Video load hoi nai: "+e.message, event.threadID, event.messageID);
        }
    }
};
