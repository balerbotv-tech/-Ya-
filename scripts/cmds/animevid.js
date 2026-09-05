const axios = require("axios");
const fs = require("fs");
const path = require("path");

const cacheFile = path.join(__dirname, "anime_cache.json");
function getUsed() { return fs.existsSync(cacheFile)? JSON.parse(fs.readFileSync(cacheFile)) : []; }
function saveUsed(url) { let used = getUsed(); used.push(url); if(used.length>100) used=used.slice(-100); fs.writeFileSync(cacheFile, JSON.stringify(used)); }

module.exports = {
    config: {
        name: "animevid",
        version: "1.0",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "ANIME",
        guide: "{pn} - Random SFW Anime Pic"
    },

    onStart: async function ({ api, event }) {
        const apis = [
            "https://nekos.best/api/v2/neko",
            "https://api.waifu.pics/sfw/waifu",
            "https://api.waifu.pics/sfw/kiss"
        ];

        try {
            let used = getUsed();
            for(let url of apis) {
                let res = await axios.get(url, {timeout: 5000});
                let img = res.data.results?.[0]?.url || res.data.url;
                if(img &&!used.includes(img)) {
                    saveUsed(img);
                    const stream = await axios.get(img, {responseType: "stream"});
                    return api.sendMessage({body: "✨ SFW Anime Pic", attachment: stream.data}, event.threadID, event.messageID);
                }
            }
            return api.sendMessage("❌ Pic load hoi nai", event.threadID, event.messageID);
        } catch(e) {
            return api.sendMessage("❌ Error hoise", event.threadID, event.messageID);
        }
    }
};
