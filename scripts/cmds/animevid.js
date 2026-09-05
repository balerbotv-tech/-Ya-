const axios = require("axios");
module.exports = {
    config: {
        name: "animevid",
        version: "1.0",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "FUN",
        guide: "{pn}"
    },
    onStart: async function ({ api, event }) {
        try {
            const types = ["waifu", "neko", "smile", "dance"];
            const type = types[Math.floor(Math.random() * types.length)];
            
            const res = await axios.get(`https://api.waifu.pics/sfw/${type}`);
            const url = res.data.url;
            
            const img = await axios.get(url, { responseType: "stream" });
            return api.sendMessage({ body: `✨ Random ${type} clip`, attachment: img.data }, event.threadID, event.messageID);
        } catch {
            return api.sendMessage("❌ Video load hoi nai!", event.threadID, event.messageID);
        }
    }
};
