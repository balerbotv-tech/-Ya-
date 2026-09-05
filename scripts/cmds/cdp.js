const axios = require("axios");
const fs = require("fs");
const path = require("path");

const cacheFile = path.join(__dirname, "cdp_cache.json");
function getUsed() { return fs.existsSync(cacheFile)? JSON.parse(fs.readFileSync(cacheFile)) : []; }
function saveUsed(url) { let used = getUsed(); used.push(url); if(used.length>100) used=used.slice(-100); fs.writeFileSync(cacheFile, JSON.stringify(used)); }

module.exports = {
    config: {
        name: "cdp",
        version: "1.0",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "ANIME",
        guide: "{pn} - Random Romantic Couple Pic"
    },

    onStart: async function ({ api, event }) {
        const apis = [
            "https://api.waifu.pics/sfw/couple",
            "https://api.waifu.pics/sfw/kiss",
            "https://api.waifu.pics/sfw/hug",
            "https://nekos.best/api/v2/couple"
        ];

        try {
            let used = getUsed();
            let img = null;

            for(let url of apis) {
                let res = await axios.get(url, {timeout: 5000});
                img = res.data.url || res.data.results?.[0]?.url;
                if(img &&!used.includes(img)) break;
            }

            if(!img) return api.sendMessage("❌ Pic load hoi nai", event.threadID, event.messageID);

            saveUsed(img);
            const stream = await axios.get(img, {responseType: "stream"});

            const captions = [
                "💘 Cute Couple Vibes",
                "❤️‍🔥 Romantic Mood ON",
                "👑 Power Couple",
                "✨ Love is in the air",
                "💞 Tag your partner"
            ];
            const cap = captions[Math.floor(Math.random() * captions.length)];

            return api.sendMessage({body: cap, attachment: stream.data}, event.threadID, event.messageID);

        } catch(e) {
            return api.sendMessage("❌ Error hoise", event.threadID, event.messageID);
        }
    }
};
