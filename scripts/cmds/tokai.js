const axios = require("axios");
module.exports = {
    config: {
        name: "tokai",
        version: "1.0",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "FUN",
        guide: "{pn} (reply someone)"
    },
    onStart: async function ({ api, event }) {
        try {
            if (!event.messageReply) return api.sendMessage("⚠ Reply de tokai banabo!", event.threadID, event.messageID);
            const senderID = event.senderID;
            const targetID = event.messageReply.senderID;
            const url = `https://sayem-meme-apixs.onrender.com/tokai?senderID=${senderID}&targetID=${targetID}`;
            const res = await axios.get(url, { responseType: "stream" });
            return api.sendMessage({ body: "🗑️ TOKAI DHORA PORSE 😂", attachment: res.data }, event.threadID, event.messageID);
        } catch (err) { return api.sendMessage("❌ API te tokai nai!", event.threadID, event.messageID); }
    }
};
